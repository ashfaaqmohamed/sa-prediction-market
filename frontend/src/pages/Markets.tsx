import { useMemo, useState } from 'react';
import { useQuery } from '@tanstack/react-query';
import { useSearchParams } from 'react-router-dom';
import api from '../utils/api';
import MarketCard from '../components/MarketCard';
import { marketCategories } from '../constants/categories';
import { withDemoMarkets } from '../data/demoMarkets';
import { Market } from '../types/market';

export default function Markets() {
  const [searchParams, setSearchParams] = useSearchParams();
  const initialCategory = searchParams.get('sector') || 'All';
  const [selectedCategory, setSelectedCategory] = useState(initialCategory);
  const { data: markets } = useQuery<Market[]>({
    queryKey: ['markets'],
    queryFn: () => api.get('/markets').then((res) => res.data),
  });

  const openMarkets = useMemo(() => withDemoMarkets(markets).filter((market) => !market.resolved), [markets]);
  const categoryCounts = useMemo(
    () =>
      marketCategories.reduce<Record<string, number>>((counts, category) => {
        counts[category] = openMarkets.filter((market) => market.category === category).length;
        return counts;
      }, {}),
    [openMarkets]
  );

  const filteredMarkets = useMemo(() => {
    if (selectedCategory === 'All') {
      return openMarkets;
    }

    return openMarkets.filter((market) => market.category === selectedCategory);
  }, [openMarkets, selectedCategory]);

  const chooseCategory = (category: string) => {
    setSelectedCategory(category);
    if (category === 'All') {
      setSearchParams({});
      return;
    }
    setSearchParams({ sector: category });
  };

  return (
    <div className="mx-auto max-w-6xl px-6 py-10 sm:px-8">
      <div className="mb-8 rounded-2xl border border-emerald-950/70 bg-[#07150f] p-6 sm:p-8">
        <div className="flex flex-col gap-6 lg:flex-row lg:items-end lg:justify-between">
          <div>
          <p className="text-sm font-semibold uppercase tracking-[0.2em] text-emerald-400">JSE sectors</p>
            <h1 className="mt-2 text-4xl font-bold text-white">Management delivery by sector</h1>
            <p className="mt-3 max-w-2xl text-zinc-400">
              Browse open ForSA questions by JSE sector. Each card tracks a specific management commitment and the
              public evidence needed to resolve it.
            </p>
          </div>
          <div className="grid grid-cols-2 gap-3 text-sm sm:w-[320px]">
            <div className="rounded-xl border border-emerald-900/40 bg-black/25 p-4">
              <div className="text-zinc-500">Open commitments</div>
              <div className="mt-2 text-3xl font-bold text-white">{openMarkets.length}</div>
            </div>
            <div className="rounded-xl border border-emerald-900/40 bg-black/25 p-4">
              <div className="text-zinc-500">Sectors covered</div>
              <div className="mt-2 text-3xl font-bold text-white">
                {Object.values(categoryCounts).filter((count) => count > 0).length}
              </div>
            </div>
          </div>
        </div>
        <div className="mt-6 flex flex-wrap gap-2">
          <button
            type="button"
            onClick={() => chooseCategory('All')}
            className={`rounded-full border px-4 py-2 text-sm font-semibold transition ${
              selectedCategory === 'All'
                ? 'border-emerald-500 bg-emerald-500 text-black'
                : 'border-zinc-800 bg-zinc-900 text-zinc-300 hover:border-emerald-700 hover:text-white'
            }`}
          >
            All
            <span className="ml-2 text-xs opacity-70">{openMarkets.length}</span>
          </button>
          {marketCategories.map((category) => (
            <button
              key={category}
              type="button"
              onClick={() => chooseCategory(category)}
              className={`rounded-full border px-4 py-2 text-sm font-semibold transition ${
                selectedCategory === category
                  ? 'border-emerald-500 bg-emerald-500 text-black'
                  : 'border-zinc-800 bg-zinc-900 text-zinc-300 hover:border-emerald-700 hover:text-white'
              }`}
            >
              {category}
              <span className="ml-2 text-xs opacity-70">{categoryCounts[category] || 0}</span>
            </button>
          ))}
        </div>
      </div>

      {filteredMarkets.length ? (
        <>
          <div className="mb-5 flex flex-col gap-2 sm:flex-row sm:items-center sm:justify-between">
            <div className="text-sm text-zinc-500">
              Showing {filteredMarkets.length}{' '}
              {selectedCategory === 'All' ? 'open questions across all sectors' : `${selectedCategory} questions`}
            </div>
            <div className="text-sm text-zinc-500">
              Hover any card to review how it resolves.
            </div>
          </div>
          <div className="grid grid-cols-1 gap-6 md:grid-cols-2 lg:grid-cols-3">
            {filteredMarkets.map((market) => <MarketCard key={market.id} market={market} />)}
          </div>
        </>
      ) : (
        <div className="rounded-lg border border-zinc-800 bg-zinc-900/70 p-8 text-zinc-300">
          <p className="text-xl font-semibold text-white">No open questions in this sector yet.</p>
          <p className="mt-2 text-sm text-zinc-400">
            ForSA is starting with a focused coverage set and will add more JSE names over time.
          </p>
        </div>
      )}
    </div>
  );
}
