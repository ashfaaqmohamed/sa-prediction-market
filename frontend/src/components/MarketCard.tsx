import { Link } from 'react-router-dom';

export default function MarketCard({ market }: { market: any }) {
  const total = market.yesShares + market.noShares || 1;
  const yesProb = Math.round((market.yesShares / total) * 100) || 50;

  return (
    <Link to={`/markets/${market.id}`} className="block rounded-lg border border-zinc-800 bg-zinc-900 p-6 transition hover:-translate-y-1 hover:border-emerald-700">
      <div className="flex justify-between text-sm mb-2">
        <span className="rounded-md bg-emerald-900 px-3 py-1 text-emerald-300">{market.category}</span>
        <span>{new Date(market.endDate).toLocaleDateString('en-ZA')}</span>
      </div>
      <h3 className="text-xl font-semibold mb-4">{market.title}</h3>
      <div className="flex justify-between items-center">
        <div className="text-emerald-400 text-3xl font-bold">{yesProb}% YES</div>
        <span className="rounded-lg bg-white px-6 py-2 font-semibold text-black">Trade</span>
      </div>
    </Link>
  );
}
