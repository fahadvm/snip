import { useState } from 'react';
import { Link } from 'react-router-dom';
import { showSuccessToast } from '../utils/Toast';
import { useAuth } from '../context/AuthContext';

export default function RegisterPage() {
  const [formData, setFormData] = useState({
    username: '',
    email: '',
    password: '',
  });
  const [isLoading, setIsLoading] = useState(false);
  const { register } = useAuth();

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    setFormData(prev => ({ ...prev, [name]: value }));
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsLoading(true);

    try {
      const { username: name, email, password } = formData;
      const success = await register({ name, email, password });
      if (success) {
        showSuccessToast('Account created successfully!');
      }
    } catch (error) {
      console.error(error);
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
            Create your account
          </h2>
        </div>

        {/* Form */}
        <form className="mt-10 space-y-6" onSubmit={handleSubmit}>
          <div className="space-y-5">
            {/* Username */}
            <div>
              <label htmlFor="username" className="block text-sm font-medium text-gray-300 mb-1.5">
                Username
              </label>
              <input
                id="username"
                name="username"
                type="text"
                required
                value={formData.username}
                onChange={handleChange}
                className="
                  appearance-none relative block w-full px-4 py-3.5
                  bg-zinc-900 border border-zinc-700 rounded-xl
                  text-white placeholder-gray-500
                  focus:outline-none focus:border-gray-500 focus:ring-2 focus:ring-gray-600 focus:ring-offset-2 focus:ring-offset-black
                  transition-all duration-200
                "
                placeholder="coolusername"
              />
            </div>

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
                value={formData.email}
                onChange={handleChange}
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
                autoComplete="new-password"
                required
                value={formData.password}
                onChange={handleChange}
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

          {/* Terms */}
          <div className="text-sm text-gray-500">
            By signing up, you agree to our{' '}
            <a href="#" className="text-gray-400 hover:text-gray-300 underline">
              Terms of Service
            </a>{' '}
            and{' '}
            <a href="#" className="text-gray-400 hover:text-gray-300 underline">
              Privacy Policy
            </a>
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
                  Creating account...
                </span>
              ) : (
                'Create Account'
              )}
            </button>
          </div>
        </form>

        {/* Footer links */}
        <div className="text-center text-sm text-gray-500 mt-8">
          Already have an account?{' '}
          <Link to="/login" className="text-gray-300 hover:text-white font-medium transition-colors">
            Sign in
          </Link>
        </div>
      </div>
    </div>
  );
}