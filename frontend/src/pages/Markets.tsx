import { useQuery } from '@tanstack/react-query';
import api from '../utils/api';
import MarketCard from '../components/MarketCard';

export default function Markets() {
  const { data: markets } = useQuery({
    queryKey: ['markets'],
    queryFn: () => api.get('/markets').then((res) => res.data),
  });

  return (
    <div className="max-w-6xl mx-auto p-8">
      <h1 className="text-4xl font-bold mb-8">Active Markets</h1>
      {markets?.length ? (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {markets.map((market: any) => <MarketCard key={market.id} market={market} />)}
        </div>
      ) : (
        <div className="rounded-lg border border-zinc-800 bg-zinc-900/70 p-8 text-zinc-300">
          <p className="text-xl font-semibold text-white">Markets are being prepared.</p>
          <p className="mt-2 text-sm text-zinc-400">
            Starter markets should appear automatically on a fresh deployment, and new ones can also be added from Bulk Upload.
          </p>
        </div>
      )}
    </div>
  );
}
