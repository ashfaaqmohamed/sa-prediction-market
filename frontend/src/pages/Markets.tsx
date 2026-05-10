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
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {markets?.map((market: any) => <MarketCard key={market.id} market={market} />)}
      </div>
    </div>
  );
}
