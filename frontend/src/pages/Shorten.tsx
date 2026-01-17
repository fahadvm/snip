import { useState } from 'react';
import { Link } from 'react-router-dom';
import { urlApi } from '../services/apiServices/url.api';
import { showSuccessToast } from '../utils/Toast';
import { urlSchema } from '../schemas/url.schema';
import { z } from 'zod';

interface ShortenResult {
  short: string;
  original: string;
  id: string;
}

export default function Shorten() {
  const [url, setUrl] = useState<string>('');
  const [result, setResult] = useState<ShortenResult | null>(null);
  const [isLoading, setIsLoading] = useState<boolean>(false);
  const [error, setError] = useState<string | null>(null);

  const handleSubmit = async (e: React.FormEvent): Promise<void> => {
    e.preventDefault();
    setIsLoading(true);
    setError(null);

    try {
      // Zod Validation
      urlSchema.parse({ originalUrl: url });

      const response = await urlApi.create({ originalUrl: url });
      if (response && response.ok) {
        setResult({
          short: response.data.shortUrl,
          original: response.data.originalUrl,
          id: response.data.id,
        });
        showSuccessToast('Short URL generated successfully!');
      } else {
        setError(response?.message || 'Failed to shorten URL');
      }
    } catch (err) {
      if (err instanceof z.ZodError) {
        setError(err.issues[0].message);
      } else {
        setError('An error occurred. Please try again.');
        console.error(err);
      }
    } finally {
      setIsLoading(false);
    }
  };

  const copyToClipboard = () => {
    if (result) {
      navigator.clipboard.writeText(result.short);
      showSuccessToast('Link copied to clipboard!');
    }
  };

  return (
    <div className="min-h-screen bg-black text-gray-100 pt-20 pb-16 px-4 sm:px-6 lg:px-8">
      <div className="max-w-2xl mx-auto">
        <h1 className="text-4xl md:text-5xl font-black tracking-tight bg-gradient-to-r from-white via-gray-300 to-gray-500 bg-clip-text text-transparent text-center mb-4">
          Shorten New URL
        </h1>
        <p className="text-center text-gray-400 mb-12">
          Create clean, trackable short links instantly
        </p>

        <form onSubmit={handleSubmit} className="space-y-8" noValidate>
          <div>
            <label className="block text-gray-300 mb-2 font-medium">
              Long URL
            </label>
            <input
              type="url"
              value={url}
              onChange={(e) => setUrl(e.target.value)}
              placeholder="https://very-long-url.com/..."
              className="w-full px-6 py-5 bg-zinc-900 border border-zinc-800 rounded-2xl text-white placeholder-gray-500 focus:outline-none focus:border-gray-600"
            />
          </div>

          {error && (
            <div className="p-4 bg-red-500/10 border border-red-500/20 rounded-xl text-red-500 text-sm">
              {error}
            </div>
          )}

          <button
            type="submit"
            disabled={isLoading || !url.trim()}
            className="w-full py-5 bg-white text-black font-semibold rounded-2xl hover:bg-gray-200 transform hover:-translate-y-1 transition-all disabled:opacity-60 shadow-xl shadow-white/10 text-lg"
          >
            {isLoading ? 'Creating...' : 'Create Short Link'}
          </button>
        </form>

        {result && (
          <div className="mt-12 p-8 bg-zinc-900/70 border border-zinc-800 rounded-2xl animate-in fade-in slide-in-from-bottom-4 duration-500">
            <div className="text-center mb-6">
              <div className="text-3xl font-mono text-gray-100 break-all mb-2">
                {result.short}
              </div>
              <div className="text-gray-500 text-sm">→ redirects to:</div>
              <div className="text-gray-300 mt-1 break-all">
                {result.original}
              </div>
            </div>

            <div className="flex flex-col sm:flex-row justify-center gap-4">
              <button
                onClick={copyToClipboard}
                className="px-8 py-3 bg-zinc-800 hover:bg-zinc-700 rounded-xl transition-colors"
              >
                Copy Link
              </button>
              <Link
                to={`/analytics/${result.id}`}
                className="px-8 py-3 border border-zinc-700 hover:bg-zinc-800 rounded-xl transition-colors text-center"
              >
                View Stats
              </Link>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
