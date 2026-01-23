import { Link, useLocation, useNavigate } from 'react-router-dom';
import { useEffect, useState } from 'react';
import { useAuth } from '../context/AuthContext';
import ConfirmationModal from './ConfirmationModal';

const Header = () => {
  const { user, logout } = useAuth();
  const navigate = useNavigate();
  const location = useLocation();
  const [isScrolled, setIsScrolled] = useState(false);
  const [isLogoutModalOpen, setIsLogoutModalOpen] = useState(false);

  const handleLogout = async () => {
    setIsLogoutModalOpen(true);
  };

  const confirmLogout = async () => {
    await logout();
    setIsLogoutModalOpen(false);
    navigate('/login');
  };

  // Optional: subtle shadow on scroll
  useEffect(() => {
    const handleScroll = () => {
      setIsScrolled(window.scrollY > 10);
    };
    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  const isLanding = location.pathname === '/' || location.pathname === '';
  const isLogin = location.pathname === '/login';
  const isSignup = location.pathname === '/register';

  return (
    <header
      className={`fixed top-0 left-0 right-0 z-50 transition-all duration-300 ${isScrolled ? 'bg-black/80 backdrop-blur-md shadow-lg shadow-black/30' : 'bg-transparent'
        }`}
    >
      <div className="max-w-7xl mx-auto px-6 lg:px-8">
        <div className="flex items-center justify-between h-16 md:h-20">

          {/* Logo */}
          <Link to="/" className="flex items-center gap-2 group">
            <span className="text-3xl md:text-4xl font-black tracking-tighter bg-gradient-to-r from-white via-gray-300 to-gray-500 bg-clip-text text-transparent group-hover:from-gray-100 group-hover:to-white transition-all duration-300">
              snip
            </span>
          </Link>

          {/* Navigation / Auth buttons */}
          <nav className="flex items-center gap-3 md:gap-6">
            {user ? (
              <>
                <Link
                  to="/dashboard"
                  className="text-gray-300 hover:text-white transition-colors px-4 py-2 rounded-lg text-sm md:text-base font-medium"
                >
                  Dashboard
                </Link>
                <button
                  onClick={handleLogout}
                  className="bg-white text-black hover:bg-gray-200 transition-all px-5 md:px-6 py-2.5 rounded-lg font-semibold text-sm md:text-base shadow-lg shadow-white/10 hover:shadow-white/20"
                >
                  Logout
                </button>
              </>
            ) : isLanding ? (
              <>
                <Link
                  to="/login"
                  className="text-gray-300 hover:text-white transition-colors px-4 py-2 rounded-lg text-sm md:text-base font-medium"
                >
                  Sign in
                </Link>
                <Link
                  to="/register"
                  className="bg-white text-black hover:bg-gray-200 transition-all px-5 md:px-6 py-2.5 rounded-lg font-semibold text-sm md:text-base shadow-lg shadow-white/10 hover:shadow-white/20"
                >
                  Get Started
                </Link>
              </>
            ) : isLogin ? (
              <Link
                to="/register"
                className="text-gray-300 hover:text-white transition-colors px-4 py-2 rounded-lg text-sm md:text-base font-medium"
              >
                Create account
              </Link>
            ) : isSignup ? (
              <Link
                to="/login"
                className="text-gray-300 hover:text-white transition-colors px-4 py-2 rounded-lg text-sm md:text-base font-medium"
              >
                Sign in
              </Link>
            ) : (
              // fallback for other pages
              <>
                <Link
                  to="/login"
                  className="text-gray-300 hover:text-white transition-colors"
                >
                  Sign in
                </Link>
                <Link
                  to="/register"
                  className="bg-white text-black hover:bg-gray-200 px-5 py-2.5 rounded-lg font-semibold shadow-sm"
                >
                  Sign up
                </Link>
              </>
            )}
          </nav>
        </div>
      </div>

      <ConfirmationModal
        isOpen={isLogoutModalOpen}
        title="Logout Account"
        message="Are you sure you want to logout? You will need to sign in again to access your shortened links."
        confirmText="Logout"
        onConfirm={confirmLogout}
        onCancel={() => setIsLogoutModalOpen(false)}
      />
    </header>
  );
};

export default Header;