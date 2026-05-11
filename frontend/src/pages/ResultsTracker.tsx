import { useQuery } from '@tanstack/react-query';
import { Link } from 'react-router-dom';
import api from '../utils/api';
import { withDemoMarkets } from '../data/demoMarkets';
import { Market } from '../types/market';

export default function ResultsTracker() {
  const { data: markets, isLoading } = useQuery<Market[]>({
    queryKey: ['markets'],
    queryFn: () => api.get('/markets').then((res) => res.data),
  });

  const resolvedMarkets = withDemoMarkets(markets).filter((market) => market.resolved);

  return (
    <div className="mx-auto max-w-6xl p-8">
      <section className="mb-8 border-b border-zinc-900 pb-8">
        <p className="text-sm font-semibold uppercase tracking-[0.2em] text-emerald-400">Results tracker</p>
        <h1 className="mt-2 text-4xl font-bold text-white">Receipts for management delivery</h1>
        <p className="mt-3 max-w-3xl text-zinc-400">
          Closed ForSA questions record the source used, the resolution logic, and whether management delivered on the tracked commitment.
        </p>
      </section>

      {isLoading ? (
        <div className="rounded-lg border border-zinc-800 bg-zinc-900/70 p-8 text-zinc-300">Loading results...</div>
      ) : resolvedMarkets.length ? (
        <div className="space-y-4">
          {resolvedMarkets.map((market) => (
            <Link
              key={market.id}
              to={`/sectors/${market.id}`}
              className="block rounded-lg border border-zinc-800 bg-zinc-900 p-6 transition hover:border-emerald-700"
            >
              <div className="flex flex-col gap-4 md:flex-row md:items-start md:justify-between">
                <div>
                  <div className="flex flex-wrap items-center gap-2 text-sm">
                    <span className="rounded-md bg-zinc-800 px-3 py-1 text-zinc-300">{market.category || 'General'}</span>
                    {market.ticker && <span className="text-zinc-500">{market.ticker}</span>}
                  </div>
                  <h2 className="mt-3 text-xl font-semibold text-white">{market.title}</h2>
                  <p className="mt-2 max-w-3xl text-sm leading-6 text-zinc-400">
                    {market.resolutionNotes || market.resolvesUsing || 'Resolution write-up pending.'}
                  </p>
                </div>
                <div className={`rounded-lg px-5 py-3 text-center font-bold ${
                  market.outcome === 'YES' ? 'bg-emerald-500 text-black' : 'bg-rose-500 text-white'
                }`}>
                  {market.outcome || 'Resolved'}
                </div>
              </div>
            </Link>
          ))}
        </div>
      ) : (
        <div className="rounded-lg border border-zinc-800 bg-zinc-900/70 p-8 text-zinc-300">
          <p className="text-xl font-semibold text-white">No resolved questions yet.</p>
          <p className="mt-2 text-sm text-zinc-400">Resolved items will appear here once a company reports against a tracked commitment.</p>
        </div>
      )}
    </div>
  );
}
