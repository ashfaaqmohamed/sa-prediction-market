import { useMemo } from 'react';
import { useQuery } from '@tanstack/react-query';
import { Link } from 'react-router-dom';
import DailyDecode from '../components/DailyDecode';
import MarketCard from '../components/MarketCard';
import { marketCategories } from '../constants/categories';
import { Market } from '../types/market';
import api from '../utils/api';

const featureCards = [
  {
    title: 'Management delivery tracker',
    description: 'Every question resolves against a SENS announcement, annual result, or published company disclosure.',
  },
  {
    title: 'JSE sector focus',
    description: 'Browse by sector, from Financials and Resources to Healthcare, Media, and Consumer names.',
  },
  {
    title: 'Collective conviction',
    description: 'Play-money markets surface where the crowd agrees with consensus and where conviction disagrees.',
  },
];

export default function Home() {
  const { data: markets } = useQuery<Market[]>({
    queryKey: ['markets'],
    queryFn: () => api.get('/markets').then((res) => res.data),
  });

  const openMarkets = useMemo(() => (markets || []).filter((market) => !market.resolved), [markets]);
  const featuredMarkets = openMarkets.slice(0, 4);
  const liveMarkets = openMarkets.slice(0, 4);

  return (
    <div className="mx-auto max-w-6xl px-6 py-10 sm:px-8">
      <section className="grid gap-10 border-b border-emerald-950/70 pb-10 lg:grid-cols-[minmax(0,1.08fr)_minmax(360px,0.92fr)] lg:items-center">
        <div>
          <p className="text-sm font-semibold uppercase tracking-[0.2em] text-emerald-400">ForSA investment markets</p>
          <h1 className="mt-5 max-w-3xl text-5xl font-black leading-[0.98] text-white sm:text-6xl">
            Is the market <span className="text-emerald-400">wrong</span> about SA management?
          </h1>
          <p className="mt-7 max-w-2xl text-lg leading-8 text-emerald-100/65">
            Most platforms ask what will happen. ForSA asks whether management is actually delivering. Back your view on
            JSE-listed commitments, with every question resolved against public results and SENS.
          </p>
          <div className="mt-8 rounded-lg border border-emerald-800/40 bg-emerald-950/30 p-5 text-sm leading-7 text-emerald-100/70">
            <span className="font-semibold text-emerald-300">The edge:</span> track whether management teams deliver on
            results, acquisitions, debt targets, margin promises, and strategic milestones where investor conviction lives.
          </div>
          <div className="mt-8 flex flex-wrap gap-4">
            <Link
              to="/sectors"
              className="rounded-lg bg-emerald-400 px-6 py-3 text-base font-bold text-black transition hover:bg-emerald-300"
            >
              Browse sectors
            </Link>
            <Link
              to="/results"
              className="rounded-lg border border-emerald-700/70 px-6 py-3 text-base font-bold text-emerald-100 transition hover:border-emerald-400 hover:text-emerald-300"
            >
              Results tracker
            </Link>
          </div>
        </div>

        <div className="rounded-lg border border-emerald-900/50 bg-[#092016] p-6 shadow-[0_24px_80px_rgba(0,0,0,0.28)]">
          <div className="mb-5">
            <p className="text-sm font-semibold uppercase tracking-[0.2em] text-emerald-400">Live markets</p>
            <p className="mt-1 text-sm text-emerald-100/45">Resolves against SENS and published results</p>
          </div>
          <div className="space-y-3">
            {liveMarkets.length ? (
              liveMarkets.map((market) => {
                const total = market.yesShares + market.noShares || 1;
                const yesProb = Math.round((market.yesShares / total) * 100) || 50;
                return (
                  <Link
                    key={market.id}
                    to={`/sectors/${market.id}`}
                    className="block rounded-lg border border-emerald-950 bg-black/35 p-4 transition hover:border-emerald-600"
                  >
                    <div className="flex items-start justify-between gap-4">
                      <h2 className="text-sm font-semibold leading-6 text-white">{market.title}</h2>
                      <div className="shrink-0 text-lg font-bold text-emerald-400">{yesProb}%</div>
                    </div>
                    <div className="mt-3 h-1 rounded-full bg-emerald-950">
                      <div className="h-full rounded-full bg-emerald-400" style={{ width: `${yesProb}%` }} />
                    </div>
                    <div className="mt-3 text-xs text-emerald-100/35">
                      {market.company || market.ticker} · {market.category} · Closes {new Date(market.endDate).toLocaleDateString('en-ZA', { month: 'short', year: 'numeric' })}
                    </div>
                  </Link>
                );
              })
            ) : (
              <div className="rounded-lg border border-emerald-950 bg-black/35 p-4 text-sm text-emerald-100/60">
                Live questions will appear here once the database is seeded.
              </div>
            )}
          </div>
        </div>
      </section>

      <section className="border-b border-emerald-950/70 py-10">
        <div className="mb-6 flex flex-col gap-2 sm:flex-row sm:items-end sm:justify-between">
          <div>
            <p className="text-sm font-semibold uppercase tracking-[0.2em] text-emerald-400">Featured markets</p>
            <p className="mt-3 text-sm italic text-emerald-100/45">Hover a card to see how it resolves</p>
          </div>
          <Link to="/sectors" className="text-sm font-semibold text-emerald-300 hover:text-emerald-200">
            View all
          </Link>
        </div>
        <div className="grid gap-4 md:grid-cols-2">
          {featuredMarkets.map((market) => <MarketCard key={market.id} market={market} />)}
        </div>
      </section>

      <section className="grid gap-4 border-b border-emerald-950/70 py-10 md:grid-cols-3">
        {featureCards.map((item) => (
          <div key={item.title} className="rounded-lg border border-emerald-900/40 bg-[#092016] p-6">
            <h2 className="text-lg font-bold text-white">{item.title}</h2>
            <p className="mt-3 text-sm leading-7 text-emerald-100/50">{item.description}</p>
          </div>
        ))}
      </section>

      <section className="border-b border-emerald-950/70 py-10">
        <div className="mb-5 flex flex-col gap-2 sm:flex-row sm:items-end sm:justify-between">
          <div>
            <p className="text-sm font-semibold uppercase tracking-[0.2em] text-emerald-400">JSE sectors</p>
            <h2 className="mt-2 text-3xl font-semibold text-white">Browse by where the promise was made</h2>
          </div>
          <Link to="/sectors" className="text-sm font-semibold text-emerald-300 hover:text-emerald-200">
            Browse all sectors
          </Link>
        </div>
        <div className="grid gap-3 sm:grid-cols-2 lg:grid-cols-4">
          {marketCategories.map((category) => (
            <Link
              key={category}
              to={`/sectors?sector=${encodeURIComponent(category)}`}
              className="rounded-lg border border-emerald-900/40 bg-[#092016] px-4 py-4 text-sm font-semibold text-emerald-100/80 transition hover:border-emerald-500 hover:text-emerald-300"
            >
              {category}
            </Link>
          ))}
        </div>
      </section>

      <section className="py-10">
        <div className="mb-6 flex flex-col gap-2 sm:flex-row sm:items-end sm:justify-between">
          <div>
            <p className="text-sm font-semibold uppercase tracking-[0.2em] text-emerald-400">Daily brief</p>
            <h2 className="mt-2 text-3xl font-semibold text-white">A market pulse for the day</h2>
          </div>
          <div className="max-w-md text-sm leading-6 text-emerald-100/45">
            Built into the website as live layout, not a static image.
          </div>
        </div>
        <DailyDecode />
      </section>
    </div>
  );
}
