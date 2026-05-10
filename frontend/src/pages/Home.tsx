import { Link } from 'react-router-dom';
import { marketCategories } from '../constants/categories';

const highlights = [
  {
    title: 'South African focus',
    description: 'Track questions grounded in local politics, infrastructure, sport, and the economy.',
  },
  {
    title: 'Play-money trading',
    description: 'Test conviction, build a view, and follow price shifts without risking real capital.',
  },
  {
    title: 'Community-driven signal',
    description: 'Each market turns many opinions into a live probability that is easy to scan.',
  },
];

const featuredTopics = [
  'Election outcomes',
  'Load-shedding milestones',
  'Rand strength',
  'Springbok tournament runs',
];

export default function Home() {
  return (
    <div className="mx-auto max-w-6xl px-6 py-10 sm:px-8">
      <section className="grid gap-10 border-b border-zinc-900 pb-10 lg:grid-cols-[minmax(0,1.25fr)_320px] lg:items-end">
        <div>
          <p className="text-sm font-semibold uppercase tracking-[0.2em] text-emerald-400">SA Predict</p>
          <h1 className="mt-4 max-w-4xl text-5xl font-bold leading-tight text-white sm:text-6xl">
            South Africa&apos;s public pulse, expressed as markets.
          </h1>
          <p className="mt-6 max-w-3xl text-lg leading-8 text-zinc-300">
            Follow high-interest questions across politics, infrastructure, sport, and the economy. Browse live odds,
            open a market, and see where conviction is building.
          </p>
          <div className="mt-8 flex flex-wrap gap-4">
            <Link
              to="/trending"
              className="rounded-lg bg-emerald-500 px-6 py-3 text-base font-semibold text-black transition hover:bg-emerald-400"
            >
              View trending
            </Link>
            <Link
              to="/markets"
              className="rounded-lg border border-zinc-700 px-6 py-3 text-base font-semibold text-white transition hover:border-emerald-500 hover:text-emerald-300"
            >
              Browse categories
            </Link>
          </div>
        </div>

        <div className="rounded-lg border border-zinc-800 bg-zinc-900/70 p-6">
          <div className="text-sm font-medium uppercase tracking-[0.18em] text-zinc-400">What people are watching</div>
          <div className="mt-5 space-y-4">
            {featuredTopics.map((topic) => (
              <div key={topic} className="rounded-lg border border-zinc-800 bg-black/30 px-4 py-3 text-sm text-zinc-200">
                {topic}
              </div>
            ))}
          </div>
        </div>
      </section>

      <section className="grid gap-6 py-10 md:grid-cols-3">
        {highlights.map((item) => (
          <div key={item.title} className="rounded-lg border border-zinc-800 bg-zinc-900/50 p-6">
            <h2 className="text-xl font-semibold text-white">{item.title}</h2>
            <p className="mt-3 text-sm leading-7 text-zinc-400">{item.description}</p>
          </div>
        ))}
      </section>

      <section className="border-t border-zinc-900 py-10">
        <div className="mb-5 flex flex-col gap-2 sm:flex-row sm:items-end sm:justify-between">
          <div>
            <p className="text-sm font-semibold uppercase tracking-[0.2em] text-emerald-400">Categories</p>
            <h2 className="mt-2 text-3xl font-semibold text-white">Built around local topic lanes</h2>
          </div>
          <Link to="/markets" className="text-sm font-semibold text-emerald-300 hover:text-emerald-200">
            Browse all markets
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
          <h2 className="text-3xl font-semibold text-white">How the platform feels in practice</h2>
          <p className="mt-4 max-w-3xl text-base leading-8 text-zinc-300">
            Open a market, check the current YES and NO probabilities, and see recent trading activity. As more users
            take positions, the price becomes a lightweight signal of collective expectation.
          </p>
        </div>
        <div className="rounded-lg border border-emerald-900/60 bg-emerald-950/20 p-6">
          <div className="text-sm font-medium uppercase tracking-[0.18em] text-emerald-300">Current focus</div>
          <p className="mt-3 text-2xl font-semibold text-white">Public-interest forecasting for South Africa</p>
          <p className="mt-3 text-sm leading-7 text-zinc-300">
            Built for local questions that deserve a sharper, more transparent read than hot takes alone can offer.
          </p>
        </div>
      </section>
    </div>
  );
}
