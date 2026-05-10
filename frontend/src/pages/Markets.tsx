import { useMemo, useState } from 'react';
import { useQuery } from '@tanstack/react-query';
import api from '../utils/api';
import MarketCard from '../components/MarketCard';
import { marketCategories } from '../constants/categories';
import { Market } from '../types/market';

export default function Markets() {
  const [selectedCategory, setSelectedCategory] = useState('All');
  const { data: markets } = useQuery<Market[]>({
    queryKey: ['markets'],
    queryFn: () => api.get('/markets').then((res) => res.data),
  });

  const filteredMarkets = useMemo(() => {
    if (!markets) {
      return [];
    }

    if (selectedCategory === 'All') {
      return markets;
    }

    return markets.filter((market) => market.category === selectedCategory);
  }, [markets, selectedCategory]);

  return (
    <div className="max-w-6xl mx-auto p-8">
      <div className="mb-8 flex flex-col gap-5">
        <div>
          <p className="text-sm font-semibold uppercase tracking-[0.2em] text-emerald-400">Browse</p>
          <h1 className="mt-2 text-4xl font-bold">Active Markets</h1>
          <p className="mt-3 max-w-2xl text-zinc-400">
            Explore South African prediction markets by topic, inspired by the way major markets group questions into fast-scanning categories.
          </p>
        </div>
        <div className="flex flex-wrap gap-2">
          {['All', ...marketCategories].map((category) => (
            <button
              key={category}
              type="button"
              onClick={() => setSelectedCategory(category)}
              className={`rounded-lg border px-4 py-2 text-sm font-semibold transition ${
                selectedCategory === category
                  ? 'border-emerald-500 bg-emerald-500 text-black'
                  : 'border-zinc-800 bg-zinc-900 text-zinc-300 hover:border-emerald-700 hover:text-white'
              }`}
            >
              {category}
            </button>
          ))}
        </div>
      </div>

      {filteredMarkets.length ? (
        <>
          <div className="mb-4 text-sm text-zinc-500">
            Showing {filteredMarkets.length} {selectedCategory === 'All' ? 'markets' : selectedCategory.toLowerCase() + ' markets'}
          </div>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {filteredMarkets.map((market) => <MarketCard key={market.id} market={market} />)}
          </div>
        </>
      ) : (
        <div className="rounded-lg border border-zinc-800 bg-zinc-900/70 p-8 text-zinc-300">
          <p className="text-xl font-semibold text-white">No markets in this category yet.</p>
          <p className="mt-2 text-sm text-zinc-400">
            Starter markets should appear automatically on a fresh deployment as soon as the public database is initialized.
          </p>
        </div>
      )}
    </div>
  );
}
