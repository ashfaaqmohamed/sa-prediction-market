import { BrowserRouter as Router, Routes, Route, Link } from 'react-router-dom';
import { QueryClient, QueryClientProvider } from '@tanstack/react-query';
import Home from './pages/Home';
import Markets from './pages/Markets';
import Communities from './pages/Communities';
import MarketDetail from './pages/MarketDetail';
import Trending from './pages/Trending';

const queryClient = new QueryClient();

function App() {
  return (
    <QueryClientProvider client={queryClient}>
      <Router>
        <div className="min-h-screen bg-gray-950">
          <nav className="bg-black p-4 flex justify-between items-center">
            <Link to="/" className="text-3xl font-bold text-emerald-400">🇿🇦 SA Predict</Link>
            <div className="flex gap-6 text-lg">
              <Link to="/" className="hover:text-emerald-400">Home</Link>
              <Link to="/trending" className="hover:text-emerald-400">Trending</Link>
              <Link to="/markets" className="hover:text-emerald-400">Markets</Link>
              <Link to="/communities" className="hover:text-emerald-400">Communities</Link>
            </div>
          </nav>
          <Routes>
            <Route path="/" element={<Home />} />
            <Route path="/trending" element={<Trending />} />
            <Route path="/markets" element={<Markets />} />
            <Route path="/markets/:id" element={<MarketDetail />} />
            <Route path="/communities" element={<Communities />} />
          </Routes>
        </div>
      </Router>
    </QueryClientProvider>
  );
}

export default App;
