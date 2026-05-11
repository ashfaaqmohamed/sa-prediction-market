import { Link } from 'react-router-dom';
import { Market } from '../types/market';

export default function MarketCard({ market }: { market: Market }) {
  const total = market.yesShares + market.noShares || 1;
  const yesProb = Math.round((market.yesShares / total) * 100) || 50;
  const volume = market.yesShares + market.noShares;
  const closeDate = new Date(market.endDate).toLocaleDateString('en-ZA', { month: 'short', year: 'numeric' });

  return (
    <Link
      to={`/sectors/${market.id}`}
      className="group relative block min-h-[300px] overflow-hidden rounded-lg border border-emerald-900/40 bg-[#092016] p-6 shadow-[0_18px_50px_rgba(0,0,0,0.2)] transition hover:-translate-y-1 hover:border-emerald-400/80"
    >
      <div className="flex h-full flex-col transition duration-200 group-hover:opacity-0 group-focus-visible:opacity-0">
        <div className="mb-2 flex justify-between gap-3 text-sm">
          <span className="text-xs font-semibold uppercase tracking-[0.16em] text-emerald-300">{market.ticker || market.company || 'JSE'}</span>
          <span className="shrink-0 text-xs text-emerald-100/45">{market.category || 'General'}</span>
        </div>
        <div className="mb-4 text-sm leading-6 text-emerald-100/45">
          <div>{market.company || 'JSE listed'}</div>
          <div>Closes {closeDate}</div>
        </div>
        <h3 className="text-lg font-semibold leading-snug text-white">{market.title}</h3>
        <div className="mt-auto flex justify-between items-end gap-4 pt-6">
          <div className="min-w-0 flex-1">
            <div className="h-1 rounded-full bg-emerald-950">
              <div className="h-full rounded-full bg-emerald-400" style={{ width: `${yesProb}%` }} />
            </div>
            <div className="mt-3 text-xs text-emerald-100/45">{volume} assessments</div>
          </div>
          <div className="text-right">
            <div className="text-2xl font-bold text-emerald-400">{yesProb}%</div>
            <span className="text-xs font-semibold uppercase tracking-[0.16em] text-emerald-100/45">{market.resolved ? market.outcome || 'Closed' : 'YES'}</span>
          </div>
        </div>
      </div>
      <div className="absolute inset-0 overflow-y-auto bg-[#06120d]/98 p-6 opacity-0 transition duration-200 group-hover:opacity-100 group-focus-visible:opacity-100">
        <div className="text-sm font-semibold uppercase tracking-[0.18em] text-emerald-300">Resolution notes</div>
        <div className="mt-4 space-y-3 text-sm leading-6 text-zinc-300">
          <p><span className="font-semibold text-white">Resolves using:</span> {market.resolvesUsing || 'Company announcements and audited public filings.'}</p>
          <p><span className="font-semibold text-emerald-300">YES:</span> {market.yesIf || 'Management delivers the stated commitment by the deadline.'}</p>
          <p><span className="font-semibold text-rose-300">NO:</span> {market.noIf || 'The commitment is missed, withdrawn, or cannot be verified.'}</p>
        </div>
      </div>
    </Link>
  );
}
