import { Link } from 'react-router-dom';
import { Market } from '../types/market';

export default function MarketCard({ market }: { market: Market }) {
  const total = market.yesShares + market.noShares || 1;
  const yesProb = Math.round((market.yesShares / total) * 100) || 50;
  const volume = market.yesShares + market.noShares;

  return (
    <Link
      to={`/sectors/${market.id}`}
      className="group relative block min-h-[260px] overflow-hidden rounded-lg border border-zinc-800 bg-zinc-900 p-6 transition hover:-translate-y-1 hover:border-emerald-700"
    >
      <div className="flex justify-between gap-3 text-sm mb-2">
        <span className="rounded-md bg-emerald-900 px-3 py-1 text-emerald-300">{market.category || 'General'}</span>
        <span className="shrink-0 text-zinc-400">{new Date(market.endDate).toLocaleDateString('en-ZA')}</span>
      </div>
      <div className="mb-3 text-sm text-zinc-400">
        {market.ticker ? `${market.company || 'JSE listed'} (${market.ticker})` : market.company || 'JSE listed'}
      </div>
      <h3 className="text-xl font-semibold leading-snug mb-4">{market.title}</h3>
      <div className="flex justify-between items-center gap-4">
        <div className="text-emerald-400 text-3xl font-bold">{yesProb}% YES</div>
        <div className="text-right">
          <span className="rounded-lg bg-white px-5 py-2 font-semibold text-black">{market.resolved ? market.outcome || 'Closed' : 'Assess'}</span>
          <div className="mt-3 text-xs text-zinc-500">{volume} shares</div>
        </div>
      </div>
      <div className="absolute inset-0 translate-y-full bg-black/95 p-6 opacity-0 transition duration-200 group-hover:translate-y-0 group-hover:opacity-100 group-focus-visible:translate-y-0 group-focus-visible:opacity-100">
        <div className="text-sm font-semibold uppercase tracking-[0.18em] text-emerald-300">Resolution notes</div>
        <div className="mt-4 space-y-3 text-sm leading-6 text-zinc-300">
          <p><span className="font-semibold text-white">Resolves using:</span> {market.resolvesUsing || 'Company announcements and audited public filings.'}</p>
          <p><span className="font-semibold text-emerald-300">YES if:</span> {market.yesIf || 'Management delivers the stated commitment by the deadline.'}</p>
          <p><span className="font-semibold text-rose-300">NO if:</span> {market.noIf || 'The commitment is missed, withdrawn, or cannot be verified.'}</p>
        </div>
      </div>
    </Link>
  );
}
