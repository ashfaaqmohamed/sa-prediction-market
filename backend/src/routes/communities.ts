import { Router } from 'express';
import { PrismaClient } from '@prisma/client';
import { authMiddleware } from '../middleware/auth';

const router = Router();
const prisma = new PrismaClient();

router.post('/', authMiddleware, async (req, res) => {
  const { name, description } = req.body;
  const creatorId = (req as any).userId;
  const community = await prisma.community.create({
    data: { name, description, creatorId },
  });
  res.json(community);
});

router.get('/', async (req, res) => {
  const communities = await prisma.community.findMany({ include: { members: true } });
  res.json(communities);
});

export default router;
