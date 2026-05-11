import { ChangeEvent, FormEvent, useMemo, useState } from 'react';
import { Link, useParams } from 'react-router-dom';
import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query';
import api from '../utils/api';
import { getDemoMarketById } from '../data/demoMarkets';
import { clearAuth, getStoredUser, getToken, saveAuth, StoredUser } from '../utils/auth';

type Market = {
  id: string;
  title: string;
  description: string;
  category?: string;
  company?: string;
  ticker?: string;
  resolvesUsing?: string;
  yesIf?: string;
  noIf?: string;
  resolutionNotes?: string;
  endDate: string;
  resolved: boolean;
  outcome?: string;
  yesShares: number;
  noShares: number;
  predictions: Array<{ id: string; outcome: 'YES' | 'NO'; amount: number; shares: number }>;
  comments: Array<{ id: string; text: string; user: { username: string } }>;
};

type AuthResponse = {
  token: string;
  user: StoredUser;
};

export default function MarketDetail() {
  const { id } = useParams();
  const queryClient = useQueryClient();
  const [selectedOutcome, setSelectedOutcome] = useState<'YES' | 'NO'>('YES');
  const [amount, setAmount] = useState(100);
  const [authMode, setAuthMode] = useState<'login' | 'register'>('login');
  const [authForm, setAuthForm] = useState({ email: '', username: '', password: '' });
  const [sessionUser, setSessionUser] = useState<StoredUser | null>(() => getStoredUser());
  const token = getToken();

  const { data: market, isLoading, error } = useQuery<Market>({
    queryKey: ['market', id],
    queryFn: async () => {
      try {
        const response = await api.get(`/markets/${id}`);
        return response.data;
      } catch (requestError) {
        const demoMarket = getDemoMarketById(id);
        if (demoMarket) {
          return { ...demoMarket, predictions: [], comments: [] };
        }
        throw requestError;
      }
    },
    enabled: Boolean(id),
  });

  const totalShares = useMemo(() => {
    if (!market) {
      return 1;
    }
    return market.yesShares + market.noShares || 1;
  }, [market]);

  const yesProbability = market ? Math.round((market.yesShares / totalShares) * 100) || 50 : 50;
  const noProbability = 100 - yesProbability;

  const authMutation = useMutation({
    mutationFn: async () => {
      const path = authMode === 'login' ? '/auth/login' : '/auth/register';
      const payload =
        authMode === 'login'
          ? { email: authForm.email, password: authForm.password }
          : authForm;
      const response = await api.post<AuthResponse>(path, payload);
      return response.data;
    },
    onSuccess: (data) => {
      saveAuth(data.token, data.user);
      setSessionUser(data.user);
      setAuthForm({ email: '', username: '', password: '' });
    },
  });

  const tradeMutation = useMutation({
    mutationFn: async () => {
      const response = await api.post(
        `/markets/${id}/bet`,
        { outcome: selectedOutcome, amount: Number(amount) },
        {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        }
      );
      return response.data;
    },
    onSuccess: (data) => {
      if (data.user) {
        setSessionUser(data.user);
        saveAuth(token!, data.user);
      }
      queryClient.invalidateQueries({ queryKey: ['market', id] });
      queryClient.invalidateQueries({ queryKey: ['markets'] });
      queryClient.invalidateQueries({ queryKey: ['trending-markets'] });
    },
  });

  const handleAuthSubmit = (event: FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    authMutation.mutate();
  };

  const handleTradeSubmit = (event: FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    tradeMutation.mutate();
  };

  const logout = () => {
    clearAuth();
    setSessionUser(null);
  };

  const handleAmountChange = (event: ChangeEvent<HTMLInputElement>) => {
    setAmount(Number(event.target.value));
  };

  const handleEmailChange = (event: ChangeEvent<HTMLInputElement>) => {
    setAuthForm((current) => ({ ...current, email: event.target.value }));
  };

  const handleUsernameChange = (event: ChangeEvent<HTMLInputElement>) => {
    setAuthForm((current) => ({ ...current, username: event.target.value }));
  };

  const handlePasswordChange = (event: ChangeEvent<HTMLInputElement>) => {
    setAuthForm((current) => ({ ...current, password: event.target.value }));
  };

  if (isLoading) {
    return <div className="max-w-6xl mx-auto p-8 text-lg text-zinc-300">Loading market...</div>;
  }

  if (error || !market) {
    return (
      <div className="max-w-6xl mx-auto p-8">
        <p className="text-red-400 text-lg">Could not load this market.</p>
        <Link to="/sectors" className="inline-block mt-4 text-emerald-400 hover:text-emerald-300">
          Back to sectors
        </Link>
      </div>
    );
  }

  return (
    <div className="max-w-6xl mx-auto p-8 space-y-8">
      <Link to="/sectors" className="inline-block text-sm text-zinc-400 hover:text-emerald-400">
        Back to sectors
      </Link>

      <div className="grid gap-8 lg:grid-cols-[minmax(0,1.5fr)_minmax(320px,1fr)]">
        <section className="space-y-6">
          <div className="rounded-lg border border-zinc-800 bg-zinc-950 p-6">
            <div className="flex flex-wrap items-center gap-3 text-sm">
              <span className="rounded-md bg-emerald-950 px-3 py-1 text-emerald-300">{market.category || 'General'}</span>
              <span className="text-zinc-400">Closes {new Date(market.endDate).toLocaleDateString('en-ZA')}</span>
              {market.ticker && <span className="text-zinc-500">{market.ticker}</span>}
            </div>
            <h1 className="mt-4 text-4xl font-bold leading-tight">{market.title}</h1>
            {market.company && <p className="mt-3 text-sm font-semibold uppercase tracking-[0.16em] text-zinc-500">{market.company}</p>}
            <p className="mt-4 max-w-3xl text-lg text-zinc-300">{market.description}</p>

            <div className="mt-8 grid gap-4 sm:grid-cols-2">
              <div className="rounded-lg border border-emerald-900 bg-emerald-950/40 p-5">
                <div className="text-sm text-emerald-300">YES probability</div>
                <div className="mt-2 text-4xl font-bold text-emerald-400">{yesProbability}%</div>
                <div className="mt-2 text-sm text-zinc-400">{market.yesShares} YES shares</div>
              </div>
              <div className="rounded-lg border border-rose-900 bg-rose-950/30 p-5">
                <div className="text-sm text-rose-300">NO probability</div>
                <div className="mt-2 text-4xl font-bold text-rose-400">{noProbability}%</div>
                <div className="mt-2 text-sm text-zinc-400">{market.noShares} NO shares</div>
              </div>
            </div>
          </div>

          <div className="rounded-lg border border-zinc-800 bg-zinc-950 p-6">
            <h2 className="text-2xl font-semibold">Resolution criteria</h2>
            <div className="mt-5 grid gap-4">
              <div className="rounded-lg border border-zinc-800 bg-black/30 p-4">
                <div className="text-sm font-semibold text-zinc-300">Resolves using</div>
                <p className="mt-2 text-sm leading-6 text-zinc-400">{market.resolvesUsing || 'Company announcements and audited public filings.'}</p>
              </div>
              <div className="rounded-lg border border-emerald-900/60 bg-emerald-950/20 p-4">
                <div className="text-sm font-semibold text-emerald-300">YES</div>
                <p className="mt-2 text-sm leading-6 text-zinc-300">{market.yesIf || 'Management delivers the stated commitment by the deadline.'}</p>
              </div>
              <div className="rounded-lg border border-rose-900/60 bg-rose-950/20 p-4">
                <div className="text-sm font-semibold text-rose-300">NO</div>
                <p className="mt-2 text-sm leading-6 text-zinc-300">{market.noIf || 'The commitment is missed, withdrawn, or cannot be verified.'}</p>
              </div>
              {market.resolutionNotes && (
                <div className="rounded-lg border border-zinc-800 bg-black/30 p-4">
                  <div className="text-sm font-semibold text-zinc-300">Result note</div>
                  <p className="mt-2 text-sm leading-6 text-zinc-400">{market.resolutionNotes}</p>
                </div>
              )}
            </div>
          </div>

          <div className="rounded-lg border border-zinc-800 bg-zinc-950 p-6">
            <div className="flex items-center justify-between">
              <h2 className="text-2xl font-semibold">Activity</h2>
              <span className="text-sm text-zinc-400">{market.predictions.length} assessments</span>
            </div>
            <div className="mt-5 space-y-3">
              {market.predictions.length === 0 ? (
                <p className="text-zinc-400">No assessments yet. Be the first to take a view.</p>
              ) : (
                market.predictions.slice().reverse().map((prediction) => (
                  <div
                    key={prediction.id}
                    className="flex items-center justify-between rounded-lg border border-zinc-800 bg-black/40 px-4 py-3"
                  >
                    <div>
                      <div className="font-medium">{prediction.outcome}</div>
                      <div className="text-sm text-zinc-400">{prediction.shares} conviction shares</div>
                    </div>
                    <div className="text-sm text-zinc-300">{prediction.amount} SA credits</div>
                  </div>
                ))
              )}
            </div>
          </div>
        </section>

        <aside className="space-y-6">
          <div className="rounded-lg border border-zinc-800 bg-zinc-950 p-6">
            <h2 className="text-2xl font-semibold">Assess this commitment</h2>
            {sessionUser ? (
              <div className="mt-4 rounded-lg border border-zinc-800 bg-black/40 p-4">
                <div className="text-sm text-zinc-400">Signed in as</div>
                <div className="mt-1 text-lg font-semibold">{sessionUser.username}</div>
                <div className="mt-1 text-sm text-emerald-300">
                  {sessionUser.saCredits ?? 1000} SA credits available
                </div>
                <button onClick={logout} className="mt-3 text-sm text-zinc-400 hover:text-white">
                  Log out
                </button>
              </div>
            ) : (
              <div className="mt-4 rounded-lg border border-amber-900 bg-amber-950/30 p-4 text-sm text-amber-200">
                Log in or create an account to record an assessment.
              </div>
            )}

            <form className="mt-6 space-y-4" onSubmit={handleTradeSubmit}>
              <div className="grid grid-cols-2 gap-3">
                <button
                  type="button"
                  onClick={() => setSelectedOutcome('YES')}
                  className={`rounded-lg px-4 py-3 text-base font-semibold ${
                    selectedOutcome === 'YES' ? 'bg-emerald-500 text-black' : 'bg-zinc-900 text-zinc-200'
                  }`}
                >
                  YES: delivers
                </button>
                <button
                  type="button"
                  onClick={() => setSelectedOutcome('NO')}
                  className={`rounded-lg px-4 py-3 text-base font-semibold ${
                    selectedOutcome === 'NO' ? 'bg-rose-500 text-black' : 'bg-zinc-900 text-zinc-200'
                  }`}
                >
                  NO: misses
                </button>
              </div>

              <label className="block">
                <span className="mb-2 block text-sm text-zinc-400">Amount in SA credits</span>
                <input
                  type="number"
                  min={1}
                  step={1}
                  value={amount}
                  onChange={handleAmountChange}
                  className="w-full rounded-lg border border-zinc-700 bg-black px-4 py-3 text-white outline-none focus:border-emerald-500"
                />
              </label>

              <button
                type="submit"
                disabled={!sessionUser || market.resolved || tradeMutation.isPending}
                className="w-full rounded-lg bg-white px-4 py-3 text-lg font-semibold text-black disabled:cursor-not-allowed disabled:bg-zinc-700 disabled:text-zinc-400"
              >
                {market.resolved
                  ? `Resolved ${market.outcome || ''}`
                  : tradeMutation.isPending
                    ? 'Recording assessment...'
                    : `Record ${selectedOutcome} assessment`}
              </button>
            </form>

            {tradeMutation.isSuccess && (
              <p className="mt-4 text-sm text-emerald-300">{tradeMutation.data.message}</p>
            )}
            {tradeMutation.isError && (
              <p className="mt-4 text-sm text-red-400">
                {(tradeMutation.error as any)?.response?.data?.error || 'Assessment failed'}
              </p>
            )}
          </div>

          <div className="rounded-lg border border-zinc-800 bg-zinc-950 p-6">
            <div className="mb-4 flex gap-2 text-sm">
              <button
                type="button"
                onClick={() => setAuthMode('login')}
                className={`rounded-lg px-3 py-2 ${authMode === 'login' ? 'bg-white text-black' : 'bg-zinc-900 text-zinc-300'}`}
              >
                Login
              </button>
              <button
                type="button"
                onClick={() => setAuthMode('register')}
                className={`rounded-lg px-3 py-2 ${authMode === 'register' ? 'bg-white text-black' : 'bg-zinc-900 text-zinc-300'}`}
              >
                Register
              </button>
            </div>

            <form className="space-y-4" onSubmit={handleAuthSubmit}>
              <label className="block">
                <span className="mb-2 block text-sm text-zinc-400">Email</span>
                <input
                  type="email"
                  required
                  value={authForm.email}
                  onChange={handleEmailChange}
                  className="w-full rounded-lg border border-zinc-700 bg-black px-4 py-3 text-white outline-none focus:border-emerald-500"
                />
              </label>

              {authMode === 'register' && (
                <label className="block">
                  <span className="mb-2 block text-sm text-zinc-400">Username</span>
                  <input
                    type="text"
                    required
                    minLength={3}
                    value={authForm.username}
                    onChange={handleUsernameChange}
                    className="w-full rounded-lg border border-zinc-700 bg-black px-4 py-3 text-white outline-none focus:border-emerald-500"
                  />
                </label>
              )}

              <label className="block">
                <span className="mb-2 block text-sm text-zinc-400">Password</span>
                <input
                  type="password"
                  required
                  minLength={6}
                  value={authForm.password}
                  onChange={handlePasswordChange}
                  className="w-full rounded-lg border border-zinc-700 bg-black px-4 py-3 text-white outline-none focus:border-emerald-500"
                />
              </label>

              <button
                type="submit"
                disabled={authMutation.isPending}
                className="w-full rounded-lg bg-emerald-500 px-4 py-3 font-semibold text-black disabled:cursor-not-allowed disabled:bg-emerald-800"
              >
                {authMutation.isPending ? 'Please wait...' : authMode === 'login' ? 'Log in' : 'Create account'}
              </button>
            </form>

            {authMutation.isSuccess && (
              <p className="mt-4 text-sm text-emerald-300">You are ready to assess.</p>
            )}
            {authMutation.isError && (
              <p className="mt-4 text-sm text-red-400">
                {(authMutation.error as any)?.response?.data?.error || 'Authentication failed'}
              </p>
            )}
          </div>
        </aside>
      </div>
    </div>
  );
}
