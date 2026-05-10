import { Router } from 'express';
import { PrismaClient } from '@prisma/client';
import multer from 'multer';
import xlsx from 'xlsx';
import { z } from 'zod';
import { authMiddleware } from '../middleware/auth';

const router = Router();
const prisma = new PrismaClient();
const upload = multer({ dest: 'uploads/' });
const betSchema = z.object({
  outcome: z.enum(['YES', 'NO']),
  amount: z.number().int().positive().max(100000),
});

router.post('/bulk', upload.single('file'), async (req, res) => {
  if (!req.file) return res.status(400).json({ error: 'No file uploaded' });

  const workbook = xlsx.readFile(req.file.path);
  const sheet = workbook.Sheets[workbook.SheetNames[0]];
  const data = xlsx.utils.sheet_to_json(sheet) as any[];

  const markets = data.map((row: any) => ({
    title: row.Title,
    description: row.Description || '',
    category: row.Category || 'General',
    endDate: new Date(row.EndDate),
  }));

  await prisma.market.createMany({ data: markets });
  res.json({ message: `✅ ${markets.length} markets uploaded successfully!` });
});

router.get('/', async (req, res) => {
  const markets = await prisma.market.findMany({
    include: { community: true },
    orderBy: { createdAt: 'desc' },
  });
  res.json(markets);
});

router.get('/:id', async (req, res) => {
  const market = await prisma.market.findUnique({
    where: { id: req.params.id },
    include: { comments: { include: { user: true } }, predictions: true },
  });
  if (!market) return res.status(404).json({ error: 'Market not found' });
  res.json(market);
});

router.post('/:id/bet', authMiddleware, async (req, res) => {
  try {
    const { outcome, amount } = betSchema.parse(req.body);
    const userId = (req as any).userId;

    const market = await prisma.market.findUnique({ where: { id: req.params.id } });
    if (!market || market.resolved) {
      return res.status(400).json({ error: 'Invalid market' });
    }

    const totalShares = market.yesShares + market.noShares || 1;
    const marketSideShares = outcome === 'YES' ? market.yesShares : market.noShares;
    const price = marketSideShares > 0 ? marketSideShares / totalShares : 0.5;
    const shares = Math.max(1, Math.floor(amount / (price + 0.01)));

    const user = await prisma.user.findUnique({ where: { id: userId } });
    if (!user || user.saCredits < amount) {
      return res.status(400).json({ error: 'Not enough credits' });
    }

    const [updatedUser, , updatedMarket] = await prisma.$transaction([
      prisma.user.update({ where: { id: userId }, data: { saCredits: { decrement: amount } } }),
      prisma.prediction.create({
        data: { userId, marketId: market.id, outcome, amount, shares },
      }),
      prisma.market.update({
        where: { id: market.id },
        data: outcome === 'YES' ? { yesShares: { increment: shares } } : { noShares: { increment: shares } },
      }),
    ]);

    res.json({
      message: 'Bet placed!',
      shares,
      market: updatedMarket,
      user: {
        id: updatedUser.id,
        username: updatedUser.username,
        saCredits: updatedUser.saCredits,
      },
    });
  } catch (error: any) {
    res.status(400).json({ error: error.message || 'Unable to place bet' });
  }
});

export default router;
