import { useEffect, useState } from 'react';

type MetricRow = {
  label: string;
  value: string;
  positive?: boolean;
};

type ShareMove = {
  label: string;
  ticker: string;
  value: number;
};

function createSeededRandom(seed: string) {
  let hash = 1779033703 ^ seed.length;

  for (let index = 0; index < seed.length; index += 1) {
    hash = Math.imul(hash ^ seed.charCodeAt(index), 3432918353);
    hash = (hash << 13) | (hash >>> 19);
  }

  return () => {
    hash = Math.imul(hash ^ (hash >>> 16), 2246822507);
    hash = Math.imul(hash ^ (hash >>> 13), 3266489909);
    hash ^= hash >>> 16;
    return (hash >>> 0) / 4294967296;
  };
}

function createSignedPercent(random: () => number, min: number, max: number) {
  const value = min + random() * (max - min);
  const rounded = Number(value.toFixed(1));
  return rounded === 0 ? 0.1 : rounded;
}

function createPositivePercent(random: () => number, min: number, max: number) {
  return Number((min + random() * (max - min)).toFixed(1));
}

function useDailyDate() {
  const [today, setToday] = useState(() => new Date());

  useEffect(() => {
    let timeoutId = 0;

    const scheduleRefresh = () => {
      const now = new Date();
      const nextMidnight = new Date(now);
      nextMidnight.setHours(24, 0, 0, 0);
      timeoutId = window.setTimeout(() => {
        setToday(new Date());
        scheduleRefresh();
      }, nextMidnight.getTime() - now.getTime());
    };

    scheduleRefresh();

    return () => window.clearTimeout(timeoutId);
  }, []);

  return today;
}

function formatPercent(value: number) {
  return `${value > 0 ? '+' : ''}${value.toFixed(1)}%`;
}

function formatDate(date: Date) {
  return new Intl.DateTimeFormat('en-ZA', {
    day: 'numeric',
    month: 'long',
    year: 'numeric',
  }).format(date);
}

function buildSnapshot(date: Date) {
  const seed = date.toISOString().slice(0, 10);
  const random = createSeededRandom(seed);

  const indices: MetricRow[] = [
    { label: 'All Share', value: formatPercent(createSignedPercent(random, -1.2, 1.6)) },
    { label: 'Resource 10', value: formatPercent(createSignedPercent(random, -2.8, 3.3)) },
    { label: 'Industrial 25', value: formatPercent(createSignedPercent(random, -2.1, 2.1)) },
    { label: 'Financial 15', value: formatPercent(createSignedPercent(random, -1.9, 1.9)) },
  ].map((row) => ({ ...row, positive: !row.value.startsWith('-') }));

  const usdZar = Number((17.2 + (random() - 0.5) * 1.4).toFixed(2));

  const assets: MetricRow[] = [
    { label: 'SA Property', value: formatPercent(createSignedPercent(random, -1.1, 1.3)) },
    { label: 'USD/ZAR', value: usdZar.toFixed(2), positive: usdZar < 17.5 },
    { label: 'Gold', value: formatPercent(createSignedPercent(random, -0.8, 1.1)) },
  ];

  const shareUniverse = [
    { label: 'Pick n Pay', ticker: 'PIK' },
    { label: 'Vodacom', ticker: 'VOD' },
    { label: 'BHP Group', ticker: 'BHG' },
    { label: 'Anglo', ticker: 'AGL' },
    { label: 'Woolies', ticker: 'WHL' },
    { label: 'Karooooo', ticker: 'KRO' },
    { label: 'Truworths', ticker: 'TRU' },
    { label: 'TFG', ticker: 'TFG' },
  ];

  const notableShares: ShareMove[] = shareUniverse.map((share) => ({
    ...share,
    value: createSignedPercent(random, -12.8, 9.6),
  }));

  const positives = notableShares
    .filter((share) => share.value > 0)
    .sort((left, right) => right.value - left.value)
    .slice(0, 4);
  const negatives = notableShares
    .filter((share) => share.value < 0)
    .sort((left, right) => left.value - right.value)
    .slice(0, 4);

  const horizons: MetricRow[] = [
    { label: 'Month to date', value: `${createPositivePercent(random, 1.1, 4.4).toFixed(1)}%` },
    { label: 'Year to date', value: `${createPositivePercent(random, 2.6, 8.2).toFixed(1)}%` },
    { label: 'One year', value: `${createPositivePercent(random, 12.0, 36.5).toFixed(1)}%` },
    { label: 'Three years', value: `${createPositivePercent(random, 10.0, 24.0).toFixed(1)}%` },
    { label: 'Five years', value: `${createPositivePercent(random, 8.0, 18.0).toFixed(1)}%` },
  ];

  return {
    indices,
    assets,
    positives,
    negatives,
    horizons,
  };
}

function TableBlock({ title, rows }: { title: string; rows: MetricRow[] }) {
  return (
    <div>
      <h3 className="text-2xl font-bold uppercase tracking-[0.08em] text-white">{title}</h3>
      <div className="mt-5 divide-y divide-emerald-950 border-y border-emerald-950">
        {rows.map((row) => (
          <div key={row.label} className="grid grid-cols-[minmax(0,1fr)_100px] gap-4 py-3 text-xl font-semibold text-emerald-50">
            <span>{row.label}</span>
            <span className={`text-right ${row.positive === false ? 'text-rose-400' : row.positive ? 'text-emerald-400' : 'text-emerald-50'}`}>
              {row.value}
            </span>
          </div>
        ))}
      </div>
    </div>
  );
}

function ShareBar({ share, maxValue }: { share: ShareMove; maxValue: number }) {
  const width = `${Math.max(18, Math.round((Math.abs(share.value) / maxValue) * 100))}%`;
  const positive = share.value > 0;

  return (
    <div className="rounded-lg border border-emerald-900/40 bg-black/25 p-4">
      <div className="flex items-baseline justify-between gap-4">
        <div className="min-w-0">
          <div className="text-xl font-bold text-white">{share.label}</div>
          <div className="mt-1 text-xs font-semibold uppercase tracking-[0.18em] text-emerald-100/45">{share.ticker}</div>
        </div>
        <span className={`shrink-0 text-xl font-bold ${positive ? 'text-emerald-400' : 'text-rose-400'}`}>{formatPercent(share.value)}</span>
      </div>
      <div className="mt-4 h-7 rounded-sm bg-emerald-950">
        <div className={`h-full rounded-sm ${positive ? 'bg-emerald-400' : 'bg-rose-400'}`} style={{ width }} />
      </div>
    </div>
  );
}

export default function DailyDecode() {
  const today = useDailyDate();
  const snapshot = buildSnapshot(today);
  const maxMove = Math.max(...snapshot.positives.map((share) => Math.abs(share.value)), ...snapshot.negatives.map((share) => Math.abs(share.value)), 1);

  return (
    <section className="rounded-lg border border-emerald-900/40 bg-[#092016] text-emerald-50 shadow-[0_24px_80px_rgba(0,0,0,0.28)]">
      <div className="border-b border-emerald-950 px-6 py-6 sm:px-8">
        <div className="flex flex-col gap-5 lg:flex-row lg:items-end lg:justify-between">
          <div>
            <div className="text-sm font-semibold uppercase tracking-[0.2em] text-emerald-400">ForSA daily brief</div>
            <h3 className="mt-2 text-3xl font-bold uppercase tracking-[0.05em] text-white sm:text-4xl">South African market pulse</h3>
            <p className="mt-3 max-w-2xl text-sm leading-6 text-emerald-100/65">
              A built-in daily snapshot of the JSE and related assets, refreshed from the current date and designed to sit naturally inside the homepage.
            </p>
          </div>
          <div className="inline-flex w-fit items-center gap-3 rounded-lg border border-emerald-900/40 bg-black/25 px-4 py-3">
            <div className="text-xs font-semibold uppercase tracking-[0.2em] text-emerald-100/45">Updated</div>
            <div className="text-lg font-bold text-white">{formatDate(today)}</div>
          </div>
        </div>
      </div>

      <div className="px-6 py-8 sm:px-8">
        <div className="grid gap-10 xl:grid-cols-[minmax(0,1.1fr)_minmax(0,0.9fr)]">
          <TableBlock title="FTSE/JSE" rows={snapshot.indices} />
          <TableBlock title="Assets" rows={snapshot.assets} />
        </div>

        <div className="mt-12 grid gap-10 xl:grid-cols-[minmax(0,1.15fr)_minmax(0,0.85fr)]">
          <div>
            <h3 className="text-3xl font-bold uppercase tracking-[0.08em] text-white">Notable shares</h3>
            <div className="mt-8 grid gap-4 lg:grid-cols-2 lg:gap-x-10">
              <div className="space-y-4">
                {snapshot.positives.map((share) => (
                  <ShareBar key={share.ticker} share={share} maxValue={maxMove} />
                ))}
              </div>
              <div className="space-y-4">
                {snapshot.negatives.map((share) => (
                  <ShareBar key={share.ticker} share={share} maxValue={maxMove} />
                ))}
              </div>
            </div>
          </div>

          <div className="rounded-lg border border-emerald-900/40 bg-black/25 p-6">
            <h3 className="text-3xl font-bold uppercase tracking-[0.08em] text-white">All Share horizons</h3>
            <div className="mt-8 grid gap-0 border-y border-emerald-950 sm:grid-cols-2 xl:grid-cols-1">
              {snapshot.horizons.map((item) => (
                <div key={item.label} className="grid grid-cols-[minmax(0,1fr)_120px] items-center gap-4 border-b border-emerald-950 px-1 py-4 last:border-b-0">
                  <div className="text-base font-semibold uppercase tracking-[0.06em] text-emerald-50">{item.label}</div>
                  <div className="text-right text-3xl font-bold text-emerald-400">{item.value}</div>
                </div>
              ))}
            </div>
            <div className="mt-6 text-sm leading-6 text-emerald-100/55">
              Demo daily snapshot. Values refresh from the current browser date until a live data feed is wired in.
            </div>
          </div>
        </div>

        <div className="mt-8 flex flex-col gap-4 border-t border-emerald-950 pt-5 text-sm text-emerald-100/55 sm:flex-row sm:items-center sm:justify-between">
          <div className="font-semibold text-emerald-300">
            Midnight refresh
          </div>
        </div>
      </div>
    </section>
  );
}
