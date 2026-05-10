import { PrismaClient } from '@prisma/client';

const starterMarkets = [
  {
    title: 'Will the ANC form the next government?',
    description: 'Predict the outcome of the next national election.',
    category: 'Politics-SA',
    endDate: new Date('2026-12-31T00:00:00.000Z'),
  },
  {
    title: 'Will load-shedding end completely by December 2026?',
    description: 'A full 30-day period without scheduled load-shedding.',
    category: 'Infrastructure',
    endDate: new Date('2026-12-31T00:00:00.000Z'),
  },
  {
    title: 'Will the Rand strengthen below R17 to the USD by end of 2026?',
    description: 'Based on the USD/ZAR exchange rate.',
    category: 'Economy-SA',
    endDate: new Date('2026-12-31T00:00:00.000Z'),
  },
  {
    title: 'Will South Africa win the 2027 Rugby World Cup?',
    description: 'Springboks performance at the 2027 tournament.',
    category: 'Sports-SA',
    endDate: new Date('2027-11-30T00:00:00.000Z'),
  },
];

export async function seedMarketsIfEmpty(prisma: PrismaClient) {
  const count = await prisma.market.count();
  if (count > 0) {
    return;
  }

  await prisma.market.createMany({ data: starterMarkets });
  console.log(`Seeded ${starterMarkets.length} starter markets`);
}
