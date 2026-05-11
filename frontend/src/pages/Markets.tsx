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

  const filteredMarkets = useMemo(() => {
    const displayMarkets = withDemoMarkets(markets);

    if (selectedCategory === 'All') {
      return displayMarkets;
    }

    return displayMarkets.filter((market) => market.category === selectedCategory);
  }, [markets, selectedCategory]);

  const chooseCategory = (category: string) => {
    setSelectedCategory(category);
    if (category === 'All') {
      setSearchParams({});
      return;
    }
    setSearchParams({ sector: category });
  };

  return (
    <div className="max-w-6xl mx-auto p-8">
      <div className="mb-8 flex flex-col gap-5">
        <div>
          <p className="text-sm font-semibold uppercase tracking-[0.2em] text-emerald-400">JSE sectors</p>
          <h1 className="mt-2 text-4xl font-bold">Management delivery by sector</h1>
          <p className="mt-3 max-w-2xl text-zinc-400">
            Browse open ForSA questions by JSE sector. Each card tracks a specific management commitment and the public evidence needed to resolve it.
          </p>
        </div>
        <div className="flex flex-wrap gap-2">
          {['All', ...marketCategories].map((category) => (
            <button
              key={category}
              type="button"
              onClick={() => chooseCategory(category)}
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
            Showing {filteredMarkets.length} {selectedCategory === 'All' ? 'questions' : selectedCategory.toLowerCase() + ' questions'}
          </div>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
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
