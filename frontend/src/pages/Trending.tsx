import { useQuery } from '@tanstack/react-query';
import MarketCard from '../components/MarketCard';
import api from '../utils/api';
import { Market } from '../types/market';

export default function Trending() {
  const { data: markets, isLoading } = useQuery<Market[]>({
    queryKey: ['trending-markets'],
    queryFn: () => api.get('/markets/trending').then((res) => res.data),
  });

  const leader = markets?.[0];

  return (
    <div className="mx-auto max-w-6xl p-8">
      <section className="mb-8 border-b border-zinc-900 pb-8">
        <p className="text-sm font-semibold uppercase tracking-[0.2em] text-emerald-400">Trending</p>
        <h1 className="mt-2 text-4xl font-bold text-white">Markets with the most activity</h1>
        <p className="mt-3 max-w-2xl text-zinc-400">
          A quick read on where attention is clustering, ranked by total YES and NO shares.
        </p>
      </section>

      {leader && (
        <section className="mb-8 rounded-lg border border-emerald-900/70 bg-emerald-950/20 p-6">
          <div className="flex flex-col gap-6 md:flex-row md:items-center md:justify-between">
            <div>
              <div className="text-sm font-semibold uppercase tracking-[0.18em] text-emerald-300">Top mover</div>
              <h2 className="mt-3 max-w-3xl text-2xl font-semibold text-white">{leader.title}</h2>
              <p className="mt-2 text-sm text-zinc-400">{leader.category || 'General'}</p>
            </div>
            <div className="rounded-lg bg-black/30 px-5 py-4 text-right">
              <div className="text-3xl font-bold text-emerald-300">{leader.yesShares + leader.noShares}</div>
              <div className="text-xs uppercase tracking-[0.18em] text-zinc-500">shares</div>
            </div>
          </div>
        </section>
      )}

      {isLoading ? (
        <div className="rounded-lg border border-zinc-800 bg-zinc-900/70 p-8 text-zinc-300">Loading trending markets...</div>
      ) : markets?.length ? (
        <div className="grid grid-cols-1 gap-6 md:grid-cols-2 lg:grid-cols-3">
          {markets.map((market) => <MarketCard key={market.id} market={market} />)}
        </div>
      ) : (
        <div className="rounded-lg border border-zinc-800 bg-zinc-900/70 p-8 text-zinc-300">
          <p className="text-xl font-semibold text-white">Trending markets are warming up.</p>
          <p className="mt-2 text-sm text-zinc-400">Once seeded markets are available, the most active questions will appear here.</p>
        </div>
      )}
    </div>
  );
}
