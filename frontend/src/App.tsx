import { BrowserRouter as Router, Routes, Route, Link, Navigate } from 'react-router-dom';
import { QueryClient, QueryClientProvider } from '@tanstack/react-query';
import Home from './pages/Home';
import Markets from './pages/Markets';
import MarketDetail from './pages/MarketDetail';
import Trending from './pages/Trending';
import ResultsTracker from './pages/ResultsTracker';

const queryClient = new QueryClient();

function App() {
  return (
    <QueryClientProvider client={queryClient}>
      <Router>
        <div className="min-h-screen bg-gray-950">
          <nav className="bg-black p-4 flex justify-between items-center">
            <Link to="/" className="text-3xl font-bold text-emerald-400">ForSA</Link>
            <div className="flex flex-wrap justify-end gap-6 text-lg">
              <Link to="/" className="hover:text-emerald-400">Home</Link>
              <Link to="/trending" className="hover:text-emerald-400">Trending</Link>
              <Link to="/sectors" className="hover:text-emerald-400">Sectors</Link>
              <Link to="/results" className="hover:text-emerald-400">Results Tracker</Link>
            </div>
          </nav>
          <Routes>
            <Route path="/" element={<Home />} />
            <Route path="/trending" element={<Trending />} />
            <Route path="/sectors" element={<Markets />} />
            <Route path="/sectors/:id" element={<MarketDetail />} />
            <Route path="/results" element={<ResultsTracker />} />
            <Route path="/markets" element={<Navigate to="/sectors" replace />} />
            <Route path="/markets/:id" element={<MarketDetail />} />
            <Route path="/communities" element={<Navigate to="/sectors" replace />} />
          </Routes>
        </div>
      </Router>
    </QueryClientProvider>
  );
}

export default App;
