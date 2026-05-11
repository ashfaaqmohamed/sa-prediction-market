import { Link } from 'react-router-dom';
import { marketCategories } from '../constants/categories';

const focusPoints = [
  {
    title: 'Commitment-led questions',
    description: 'Each ForSA market starts with a promise, target, or guidance item from a JSE-listed management team.',
  },
  {
    title: 'Resolution before opinion',
    description: 'Every card states the source, YES condition, and NO condition before the question resolves.',
  },
  {
    title: 'Receipts over narratives',
    description: 'The Results Tracker closes the loop by recording whether management actually delivered.',
  },
];

const watchedCommitments = [
  'Margin expansion',
  'Credit-loss guidance',
  'Portfolio simplification',
  'Debt reduction',
  'Occupancy recovery',
];

export default function Home() {
  return (
    <div className="mx-auto max-w-6xl px-6 py-10 sm:px-8">
      <section className="grid gap-10 border-b border-zinc-900 pb-10 lg:grid-cols-[minmax(0,1.25fr)_340px] lg:items-end">
        <div>
          <p className="text-sm font-semibold uppercase tracking-[0.2em] text-emerald-400">ForSA</p>
          <h1 className="mt-4 max-w-4xl text-5xl font-bold leading-tight text-white sm:text-6xl">
            Is management actually delivering?
          </h1>
          <p className="mt-6 max-w-3xl text-lg leading-8 text-zinc-300">
            ForSA tracks JSE-listed management teams against the commitments investors care about: guidance,
            margins, capital allocation, debt targets, and operational milestones.
          </p>
          <div className="mt-8 flex flex-wrap gap-4">
            <Link
              to="/sectors"
              className="rounded-lg bg-emerald-500 px-6 py-3 text-base font-semibold text-black transition hover:bg-emerald-400"
            >
              Browse sectors
            </Link>
            <Link
              to="/results"
              className="rounded-lg border border-zinc-700 px-6 py-3 text-base font-semibold text-white transition hover:border-emerald-500 hover:text-emerald-300"
            >
              View results
            </Link>
          </div>
        </div>

        <div className="rounded-lg border border-zinc-800 bg-zinc-900/70 p-6">
          <div className="text-sm font-medium uppercase tracking-[0.18em] text-zinc-400">Tracked commitments</div>
          <div className="mt-5 space-y-4">
            {watchedCommitments.map((topic) => (
              <div key={topic} className="rounded-lg border border-zinc-800 bg-black/30 px-4 py-3 text-sm text-zinc-200">
                {topic}
              </div>
            ))}
          </div>
        </div>
      </section>

      <section className="grid gap-6 py-10 md:grid-cols-3">
        {focusPoints.map((item) => (
          <div key={item.title} className="rounded-lg border border-zinc-800 bg-zinc-900/50 p-6">
            <h2 className="text-xl font-semibold text-white">{item.title}</h2>
            <p className="mt-3 text-sm leading-7 text-zinc-400">{item.description}</p>
          </div>
        ))}
      </section>

      <section className="border-t border-zinc-900 py-10">
        <div className="mb-5 flex flex-col gap-2 sm:flex-row sm:items-end sm:justify-between">
          <div>
            <p className="text-sm font-semibold uppercase tracking-[0.2em] text-emerald-400">JSE sectors</p>
            <h2 className="mt-2 text-3xl font-semibold text-white">Start narrow, build credibility</h2>
          </div>
          <Link to="/sectors" className="text-sm font-semibold text-emerald-300 hover:text-emerald-200">
            Browse all sectors
          </Link>
        </div>
        <div className="flex flex-wrap gap-2">
          {marketCategories.map((category) => (
            <span key={category} className="rounded-lg border border-zinc-800 bg-zinc-900 px-4 py-2 text-sm text-zinc-300">
              {category}
            </span>
          ))}
        </div>
      </section>

      <section className="grid gap-8 border-t border-zinc-900 pt-10 lg:grid-cols-[minmax(0,1fr)_minmax(280px,360px)]">
        <div>
          <h2 className="text-3xl font-semibold text-white">How a ForSA question resolves</h2>
          <p className="mt-4 max-w-3xl text-base leading-8 text-zinc-300">
            A question is framed around a management commitment. The card shows the public source, the YES condition,
            and the NO condition. When results or SENS announcements arrive, the outcome moves into the Results Tracker.
          </p>
        </div>
        <div className="rounded-lg border border-emerald-900/60 bg-emerald-950/20 p-6">
          <div className="text-sm font-medium uppercase tracking-[0.18em] text-emerald-300">Positioning</div>
          <p className="mt-3 text-2xl font-semibold text-white">Investment accountability for South Africa</p>
          <p className="mt-3 text-sm leading-7 text-zinc-300">
            Focused first on JSE-listed companies, with expansion only after the resolution record is useful and trusted.
          </p>
        </div>
      </section>
    </div>
  );
}
