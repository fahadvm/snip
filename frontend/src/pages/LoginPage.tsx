import { useState } from 'react';
import { Link } from 'react-router-dom';
import { showSuccessToast } from '../utils/Toast';
import { useAuth } from '../context/AuthContext';

export default function Login() {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const { login } = useAuth();

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsLoading(true);

    try {

      const success = await login({ email, password });
      if (success) {
        showSuccessToast('Successfully signed in!');
      }
    } catch (error) {
      // Errors are handled globally in api.ts/handleError
      console.error('Login error:', error);
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-black flex items-center justify-center px-4 sm:px-6 lg:px-8">
      <div className="w-full max-w-md space-y-8">
        {/* Logo / Brand */}
        <div className="text-center">
          <Link to="/" className="inline-block">
            <span className="text-5xl md:text-6xl font-black tracking-tighter bg-gradient-to-r from-white via-gray-300 to-gray-500 bg-clip-text text-transparent">
              snip
            </span>
          </Link>
          <h2 className="mt-3 text-2xl font-light text-gray-400">
            Sign in to your account
          </h2>
        </div>

        {/* Form */}
        <form className="mt-10 space-y-6" onSubmit={handleSubmit}>
          <div className="space-y-5">
            {/* Email */}
            <div>
              <label htmlFor="email" className="block text-sm font-medium text-gray-300 mb-1.5">
                Email address
              </label>
              <input
                id="email"
                name="email"
                type="email"
                autoComplete="email"
                required
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                className="
                  appearance-none relative block w-full px-4 py-3.5
                  bg-zinc-900 border border-zinc-700 rounded-xl
                  text-white placeholder-gray-500
                  focus:outline-none focus:border-gray-500 focus:ring-2 focus:ring-gray-600 focus:ring-offset-2 focus:ring-offset-black
                  transition-all duration-200
                "
                placeholder="name@example.com"
              />
            </div>

            {/* Password */}
            <div>
              <label htmlFor="password" className="block text-sm font-medium text-gray-300 mb-1.5">
                Password
              </label>
              <input
                id="password"
                name="password"
                type="password"
                autoComplete="current-password"
                required
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                className="
                  appearance-none relative block w-full px-4 py-3.5
                  bg-zinc-900 border border-zinc-700 rounded-xl
                  text-white placeholder-gray-500
                  focus:outline-none focus:border-gray-500 focus:ring-2 focus:ring-gray-600 focus:ring-offset-2 focus:ring-offset-black
                  transition-all duration-200
                "
                placeholder="••••••••"
              />
            </div>
          </div>

          <div className="flex items-center justify-between text-sm">
            <div className="flex items-center">
              <input
                id="remember"
                name="remember"
                type="checkbox"
                className="h-4 w-4 rounded border-gray-600 bg-zinc-800 text-white focus:ring-gray-600"
              />
              <label htmlFor="remember" className="ml-2 block text-gray-400">
                Remember me
              </label>
            </div>

            <div className="text-right">
              <a href="#" className="text-gray-400 hover:text-gray-200 transition-colors">
                Forgot password?
              </a>
            </div>
          </div>

          {/* Submit Button */}
          <div>
            <button
              type="submit"
              disabled={isLoading}
              className={`
                relative w-full py-3.5 px-4
                bg-white text-black font-medium rounded-xl
                hover:bg-gray-200 transform hover:-translate-y-0.5
                focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-gray-400 focus:ring-offset-black
                transition-all duration-200
                disabled:opacity-60 disabled:cursor-not-allowed
                shadow-lg shadow-white/10
              `}
            >
              {isLoading ? (
                <span className="flex items-center justify-center">
                  <svg className="animate-spin h-5 w-5 mr-2 text-black" viewBox="0 0 24 24">
                    <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" fill="none" />
                    <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4z" />
                  </svg>
                  Signing in...
                </span>
              ) : (
                'Sign in'
              )}
            </button>
          </div>
        </form>

        {/* Footer links */}
        <div className="text-center text-sm text-gray-500 mt-8">
          Don't have an account?{' '}
          <Link to="/register" className="text-gray-300 hover:text-white font-medium transition-colors">
            Create one now
          </Link>
        </div>
      </div>
    </div>
  );
}