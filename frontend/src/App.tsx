import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import Navbar from './components/Navbar';
import LandingPage from './pages/LandingPage';
import LoginPage from './pages/LoginPage';
import RegisterPage from './pages/RegisterPage';
import Dashboard from './pages/Dashboard';
import Analytics from './pages/Analytics';
import Profile from './pages/Profile';
import Shorten from './pages/Shorten';

// Unique 404 Cyber Page
const NotFound = () => (
  <div className="min-h-screen bg-deep-space flex flex-center flex-col px-4 text-center">
    <div className="blob-neon w-96 h-96 bg-neon-pink opacity-20 -top-20"></div>
    <h1 className="text-9xl font-black text-stroke text-neon-pink mb-4 animate-wiggle">404</h1>
    <h2 className="text-4xl font-black text-white mb-8">CONNECTION SEVERED</h2>
    <p className="text-white/40 font-mono mb-12 uppercase tracking-widest text-sm">
      // The requested resource has been lost in the void
    </p>
    <a href="/" className="btn-neon px-12">RE-ESTABLISH LINK →</a>
  </div>
);

function App() {
  const isAuthPage = ['/login', '/register'].includes(window.location.pathname);
  // Simulating auth for the demo navbar state

  return (
    <Router>
      <div className="relative selection:bg-neon-pink/30 selection:text-white">
        <Navbar  />
        <main className="relative z-10 transition-all duration-500">
          <Routes>
            <Route path="/" element={<LandingPage />} />
            <Route path="/login" element={<LoginPage />} />
            <Route path="/register" element={<RegisterPage />} />
            <Route path="/dashboard" element={<Dashboard />} />
            <Route path="/analytics" element={<Analytics />} />
            <Route path="/profile" element={<Profile />} />
            <Route path="/shorten" element={<Shorten />} />
            <Route path="*" element={<NotFound />} />
          </Routes>
        </main>

        {/* Global Cinematic Elements */}
        {!isAuthPage && (
          <div className="fixed bottom-8 left-8 z-50 pointer-events-none hidden md:block">
            <div className="flex items-center gap-4 text-[10px] font-mono text-white/20 tracking-[0.4em] uppercase">
              <span className="animate-pulse">Live_Signal_Sync</span>
              <span className="w-8 h-[1px] bg-white/10"></span>
              <span>v2.0.4-Production</span>
            </div>
          </div>
        )}
      </div>
    </Router>
  );
}

export default App;
