import { ChangeEvent, FormEvent, useMemo, useState } from 'react';
import { Link, useParams } from 'react-router-dom';
import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query';
import api from '../utils/api';
import { clearAuth, getStoredUser, getToken, saveAuth, StoredUser } from '../utils/auth';

type Market = {
  id: string;
  title: string;
  description: string;
  category?: string;
  endDate: string;
  resolved: boolean;
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
    queryFn: () => api.get(`/markets/${id}`).then((res) => res.data),
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
        <Link to="/markets" className="inline-block mt-4 text-emerald-400 hover:text-emerald-300">
          Back to markets
        </Link>
      </div>
    );
  }

  return (
    <div className="max-w-6xl mx-auto p-8 space-y-8">
      <Link to="/markets" className="inline-block text-sm text-zinc-400 hover:text-emerald-400">
        Back to markets
      </Link>

      <div className="grid gap-8 lg:grid-cols-[minmax(0,1.5fr)_minmax(320px,1fr)]">
        <section className="space-y-6">
          <div className="rounded-lg border border-zinc-800 bg-zinc-950 p-6">
            <div className="flex flex-wrap items-center gap-3 text-sm">
              <span className="rounded-md bg-emerald-950 px-3 py-1 text-emerald-300">{market.category || 'General'}</span>
              <span className="text-zinc-400">Closes {new Date(market.endDate).toLocaleDateString('en-ZA')}</span>
            </div>
            <h1 className="mt-4 text-4xl font-bold leading-tight">{market.title}</h1>
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
            <div className="flex items-center justify-between">
              <h2 className="text-2xl font-semibold">Market activity</h2>
              <span className="text-sm text-zinc-400">{market.predictions.length} trades</span>
            </div>
            <div className="mt-5 space-y-3">
              {market.predictions.length === 0 ? (
                <p className="text-zinc-400">No trades yet. Be the first to take a position.</p>
              ) : (
                market.predictions.slice().reverse().map((prediction) => (
                  <div
                    key={prediction.id}
                    className="flex items-center justify-between rounded-lg border border-zinc-800 bg-black/40 px-4 py-3"
                  >
                    <div>
                      <div className="font-medium">{prediction.outcome}</div>
                      <div className="text-sm text-zinc-400">{prediction.shares} shares bought</div>
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
            <h2 className="text-2xl font-semibold">Trade this market</h2>
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
                Log in or create an account to place a trade.
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
                  Buy YES
                </button>
                <button
                  type="button"
                  onClick={() => setSelectedOutcome('NO')}
                  className={`rounded-lg px-4 py-3 text-base font-semibold ${
                    selectedOutcome === 'NO' ? 'bg-rose-500 text-black' : 'bg-zinc-900 text-zinc-200'
                  }`}
                >
                  Buy NO
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
                disabled={!sessionUser || tradeMutation.isPending}
                className="w-full rounded-lg bg-white px-4 py-3 text-lg font-semibold text-black disabled:cursor-not-allowed disabled:bg-zinc-700 disabled:text-zinc-400"
              >
                {tradeMutation.isPending ? 'Placing trade...' : `Place ${selectedOutcome} trade`}
              </button>
            </form>

            {tradeMutation.isSuccess && (
              <p className="mt-4 text-sm text-emerald-300">{tradeMutation.data.message}</p>
            )}
            {tradeMutation.isError && (
              <p className="mt-4 text-sm text-red-400">
                {(tradeMutation.error as any)?.response?.data?.error || 'Trade failed'}
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
              <p className="mt-4 text-sm text-emerald-300">You are ready to trade.</p>
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
