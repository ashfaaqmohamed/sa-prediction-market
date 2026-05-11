import { PrismaClient, Prisma } from '@prisma/client';

const starterMarkets: Prisma.MarketCreateManyInput[] = [
  {
    title: 'Will Shoprite meet management guidance for double-digit sales growth in FY2026?',
    description: 'Tests whether Shoprite management converts store expansion, private-label momentum, and digital delivery into reported sales growth.',
    category: 'Consumer Staples',
    company: 'Shoprite Holdings',
    ticker: 'SHP',
    resolvesUsing: 'Shoprite FY2026 audited annual results and management commentary.',
    yesIf: 'Group sales growth is 10% or higher for FY2026.',
    noIf: 'Group sales growth is below 10%, guidance is withdrawn without delivery, or comparable disclosure is not provided.',
    endDate: new Date('2026-09-30T00:00:00.000Z'),
    yesShares: 318,
    noShares: 142,
  },
  {
    title: 'Will Capitec keep its credit-loss ratio inside management guidance in FY2026?',
    description: 'Tracks whether Capitec management maintains credit quality while continuing to grow its client base and loan book.',
    category: 'Financials',
    company: 'Capitec Bank Holdings',
    ticker: 'CPI',
    resolvesUsing: 'Capitec FY2026 annual results, credit impairment disclosures, and stated management guidance.',
    yesIf: 'The reported credit-loss ratio is within or better than the guidance range given by management.',
    noIf: 'The ratio exceeds guidance, guidance is removed without replacement, or the bank reports a material miss against credit-quality targets.',
    endDate: new Date('2026-04-30T00:00:00.000Z'),
    yesShares: 287,
    noShares: 173,
  },
  {
    title: 'Will MTN deliver service revenue growth above inflation in FY2026?',
    description: 'Measures whether MTN management can translate fintech, data, and enterprise priorities into real service revenue growth.',
    category: 'Telecoms & Technology',
    company: 'MTN Group',
    ticker: 'MTN',
    resolvesUsing: 'MTN FY2026 annual results and South African CPI for the reporting period.',
    yesIf: 'Reported group service revenue growth is higher than average South African CPI over the same year.',
    noIf: 'Service revenue growth is equal to or below inflation, or the company does not disclose a comparable service revenue metric.',
    endDate: new Date('2027-03-31T00:00:00.000Z'),
    yesShares: 211,
    noShares: 189,
  },
  {
    title: 'Will Naspers narrow the discount to Prosus by at least 5 percentage points by FY2026?',
    description: 'Tests whether capital allocation and buyback execution improve the market structure investors are watching.',
    category: 'Telecoms & Technology',
    company: 'Naspers',
    ticker: 'NPN',
    resolvesUsing: 'JSE closing prices for Naspers and Prosus on the final trading day before FY2026 results.',
    yesIf: 'The Naspers holding-company discount narrows by 5 percentage points or more from the baseline at market creation.',
    noIf: 'The discount narrows by less than 5 percentage points, widens, or the structure changes in a way that prevents comparison.',
    endDate: new Date('2026-06-30T00:00:00.000Z'),
    yesShares: 176,
    noShares: 224,
  },
  {
    title: 'Will Anglo American complete a material portfolio simplification before end-2026?',
    description: 'Tracks whether management follows through on announced portfolio actions and simplification plans.',
    category: 'Resources',
    company: 'Anglo American',
    ticker: 'AGL',
    resolvesUsing: 'Company SENS announcements, annual results, and completion announcements for disposals or demergers.',
    yesIf: 'At least one major announced portfolio simplification is legally completed by 31 December 2026.',
    noIf: 'No material simplification closes by the deadline, or announced transactions are cancelled or indefinitely delayed.',
    endDate: new Date('2026-12-31T00:00:00.000Z'),
    yesShares: 260,
    noShares: 190,
  },
  {
    title: 'Will Sasol reduce net debt within its stated target range by FY2026?',
    description: 'Follows whether Sasol management can convert asset actions, cash generation, and cost discipline into balance-sheet progress.',
    category: 'Energy',
    company: 'Sasol',
    ticker: 'SOL',
    resolvesUsing: 'Sasol FY2026 annual results and net debt or leverage target disclosure.',
    yesIf: 'Net debt or leverage is reported within the stated management target range for FY2026.',
    noIf: 'Net debt or leverage remains above the target range, the target is dropped without achievement, or disclosure is not comparable.',
    endDate: new Date('2026-09-30T00:00:00.000Z'),
    yesShares: 146,
    noShares: 274,
  },
  {
    title: 'Will Growthpoint improve South Africa office occupancy by FY2026?',
    description: 'Assesses whether management can stabilize the office portfolio rather than only relying on offshore assets.',
    category: 'Real Estate',
    company: 'Growthpoint Properties',
    ticker: 'GRT',
    resolvesUsing: 'Growthpoint FY2026 annual results and segment occupancy disclosures.',
    yesIf: 'Reported South Africa office occupancy is higher than the prior full-year comparable figure.',
    noIf: 'Office occupancy is flat or lower, or the company stops disclosing a comparable occupancy measure.',
    endDate: new Date('2026-09-30T00:00:00.000Z'),
    yesShares: 152,
    noShares: 198,
  },
  {
    title: 'Will Bidvest expand trading profit margin in FY2026?',
    description: 'Checks whether Bidvest management delivers operating leverage across its services and distribution portfolio.',
    category: 'Industrials',
    company: 'Bidvest Group',
    ticker: 'BVT',
    resolvesUsing: 'Bidvest FY2026 annual results and continuing operations margin disclosure.',
    yesIf: 'Trading profit margin from continuing operations is higher than the prior full-year comparable margin.',
    noIf: 'Margin is flat or lower, or comparable continuing operations margin is not disclosed.',
    endDate: new Date('2026-09-30T00:00:00.000Z'),
    yesShares: 233,
    noShares: 117,
  },
  {
    title: 'Did Woolworths improve group return on capital in FY2025?',
    description: 'A closed example of management delivery tracking, focused on capital efficiency rather than narrative.',
    category: 'Consumer Discretionary',
    company: 'Woolworths Holdings',
    ticker: 'WHL',
    resolvesUsing: 'Woolworths FY2025 annual results and return-on-capital disclosure.',
    yesIf: 'Group return on capital improved versus the FY2024 comparable number.',
    noIf: 'Group return on capital was flat, declined, or the comparable metric was unavailable.',
    resolutionNotes: 'Example resolved item for the Results Tracker. Replace with audited source notes once live coverage begins.',
    endDate: new Date('2025-09-30T00:00:00.000Z'),
    resolved: true,
    outcome: 'YES',
    yesShares: 244,
    noShares: 106,
  },
  {
    title: 'Did a major JSE-listed miner deliver its stated unit-cost target in FY2025?',
    description: 'A closed example showing how ForSA records whether management cost-control claims were delivered.',
    category: 'Resources',
    company: 'JSE Resources peer set',
    ticker: 'JSE:RES',
    resolvesUsing: 'FY2025 annual results and unit-cost target disclosure for the selected company.',
    yesIf: 'The company reports unit costs at or below the stated target or guidance range.',
    noIf: 'Reported unit costs exceed the target, the target is withdrawn without delivery, or disclosure is not comparable.',
    resolutionNotes: 'Example resolved item for the Results Tracker. Use this format for audited resolution write-ups.',
    endDate: new Date('2025-12-31T00:00:00.000Z'),
    resolved: true,
    outcome: 'NO',
    yesShares: 131,
    noShares: 269,
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
        company: market.company,
        ticker: market.ticker,
        resolvesUsing: market.resolvesUsing,
        yesIf: market.yesIf,
        noIf: market.noIf,
        resolutionNotes: market.resolutionNotes,
        endDate: market.endDate,
        resolved: market.resolved ?? existing.resolved,
        outcome: market.outcome ?? existing.outcome,
        ...(shouldRefreshShares
          ? { yesShares: market.yesShares, noShares: market.noShares }
          : {}),
      },
    });
    updated += 1;
  }

  console.log(`ForSA starter markets ready: ${created} created, ${updated} refreshed`);
}
