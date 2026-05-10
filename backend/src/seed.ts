import { PrismaClient, Prisma } from '@prisma/client';

const starterMarkets: Prisma.MarketCreateManyInput[] = [
  {
    title: 'Will the ANC form the next government?',
    description: 'Predict the outcome of the next national election.',
    category: 'Politics',
    endDate: new Date('2026-12-31T00:00:00.000Z'),
    yesShares: 294,
    noShares: 106,
  },
  {
    title: 'Will load-shedding end completely by December 2026?',
    description: 'A full 30-day period without scheduled load-shedding.',
    category: 'Energy',
    endDate: new Date('2026-12-31T00:00:00.000Z'),
    yesShares: 138,
    noShares: 212,
  },
  {
    title: 'Will the Rand strengthen below R17 to the USD by end of 2026?',
    description: 'Based on the USD/ZAR exchange rate.',
    category: 'Economy',
    endDate: new Date('2026-12-31T00:00:00.000Z'),
    yesShares: 176,
    noShares: 224,
  },
  {
    title: 'Will South Africa win the 2027 Rugby World Cup?',
    description: 'Springboks performance at the 2027 tournament.',
    category: 'Sports',
    endDate: new Date('2027-11-30T00:00:00.000Z'),
    yesShares: 325,
    noShares: 175,
  },
  {
    title: 'Will the DA lead Gauteng after the next provincial election?',
    description: 'A market on whether the DA becomes the largest governing party in Gauteng.',
    category: 'Elections',
    endDate: new Date('2029-06-30T00:00:00.000Z'),
    yesShares: 168,
    noShares: 182,
  },
  {
    title: 'Will Cape Town record a new tourism arrival high in 2026?',
    description: 'Based on official tourism arrival figures for the city and province.',
    category: 'Culture',
    endDate: new Date('2026-12-31T00:00:00.000Z'),
    yesShares: 245,
    noShares: 95,
  },
  {
    title: 'Will a South African AI startup raise over R500m by end of 2026?',
    description: 'Tracks a publicly announced funding round by a South African AI company.',
    category: 'Tech & AI',
    endDate: new Date('2026-12-31T00:00:00.000Z'),
    yesShares: 94,
    noShares: 156,
  },
  {
    title: 'Will Eskom keep the grid below Stage 4 all winter 2026?',
    description: 'No Stage 4 or higher load-shedding events during June, July, or August 2026.',
    category: 'Energy',
    endDate: new Date('2026-08-31T00:00:00.000Z'),
    yesShares: 205,
    noShares: 295,
  },
  {
    title: 'Will Durban beachfront upgrades finish before December 2026?',
    description: 'Completion of announced public-realm upgrades before the festive season.',
    category: 'Infrastructure',
    endDate: new Date('2026-12-01T00:00:00.000Z'),
    yesShares: 126,
    noShares: 174,
  },
  {
    title: 'Will Johannesburg have fewer than 20 water outage days in 2026?',
    description: 'Measures major municipal water outage days reported across Johannesburg.',
    category: 'Infrastructure',
    endDate: new Date('2026-12-31T00:00:00.000Z'),
    yesShares: 88,
    noShares: 262,
  },
  {
    title: 'Will Bafana Bafana reach the AFCON 2027 semi-finals?',
    description: 'South Africa reaches the final four of the 2027 Africa Cup of Nations.',
    category: 'Sports',
    endDate: new Date('2027-02-28T00:00:00.000Z'),
    yesShares: 188,
    noShares: 162,
  },
  {
    title: 'Will South Africa record a national heatwave warning before March 2027?',
    description: 'A SAWS national heatwave warning is issued before the end of summer.',
    category: 'Weather',
    endDate: new Date('2027-03-31T00:00:00.000Z'),
    yesShares: 271,
    noShares: 79,
  },
];

export async function seedMarketsIfEmpty(prisma: PrismaClient) {
  let created = 0;
  let updated = 0;

  for (const market of starterMarkets) {
    const existing = await prisma.market.findFirst({ where: { title: market.title } });

    if (!existing) {
      await prisma.market.create({ data: market });
      created += 1;
      continue;
    }

    const shouldRefreshShares = existing.yesShares === 0 && existing.noShares === 0;
    await prisma.market.update({
      where: { id: existing.id },
      data: {
        description: market.description,
        category: market.category,
        endDate: market.endDate,
        ...(shouldRefreshShares
          ? { yesShares: market.yesShares, noShares: market.noShares }
          : {}),
      },
    });
    updated += 1;
  }

  console.log(`Starter markets ready: ${created} created, ${updated} refreshed`);
}
