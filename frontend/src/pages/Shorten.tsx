import { useState } from 'react';
import { Link } from 'react-router-dom';
import { urlApi } from '../services/apiServices/url.api';
import { showSuccessToast, showErrorToast } from '../utils/Toast';
import { urlSchema } from '../schemas/url.schema';
import { z } from 'zod';
import { Copy, BarChart2, RefreshCw, ExternalLink } from 'lucide-react';

interface ShortenResult {
  short: string;
  original: string;
  id: string;
}

export default function Shorten() {
  const [url, setUrl] = useState<string>('');
  const [customCode, setCustomCode] = useState<string>('');
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

      // Validate custom code if provided
      if (customCode && !/^[a-zA-Z0-9_-]+$/.test(customCode)) {
        setError('Custom code can only contain letters, numbers, hyphens, and underscores');
        setIsLoading(false);
        return;
      }

      const response = await urlApi.create({
        originalUrl: url,
        ...(customCode && { customCode: customCode.trim() })
      });

      if (response && response.ok) {
        setResult({
          short: response.data.shortUrl,
          original: response.data.originalUrl,
          id: response.data.id,
        });
        showSuccessToast('Short URL generated successfully!');
        setUrl('');
        setCustomCode('');
      } else {
        const errorMsg = response?.message || 'Failed to shorten URL';
        setError(errorMsg);
        showErrorToast(errorMsg);
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

        <form onSubmit={handleSubmit} className="space-y-6" noValidate>
          <div>
            <label className="block text-gray-300 mb-2 font-medium">
              Long URL <span className="text-red-400">*</span>
            </label>
            <input
              type="url"
              value={url}
              onChange={(e) => setUrl(e.target.value)}
              placeholder="https://very-long-url.com/..."
              className="w-full px-6 py-5 bg-zinc-900 border border-zinc-800 rounded-2xl text-white placeholder-gray-500 focus:outline-none focus:border-gray-600 focus:ring-1 focus:ring-gray-700"
            />
          </div>

          <div>
            <label className="block text-gray-300 mb-2 font-medium">
              Custom Short Code <span className="text-gray-500 text-sm font-normal">(Optional)</span>
            </label>
            <div className="flex items-center gap-2 mb-2">
              <span className="text-gray-500 text-sm">yourdomain.com/r/</span>
              <input
                type="text"
                value={customCode}
                onChange={(e) => setCustomCode(e.target.value)}
                placeholder="my-custom-link"
                className="flex-1 px-6 py-5 bg-zinc-900 border border-zinc-800 rounded-2xl text-white placeholder-gray-500 focus:outline-none focus:border-gray-600 focus:ring-1 focus:ring-gray-700"
              />
            </div>
            <p className="text-xs text-gray-500">
              Leave empty for a random code. Only letters, numbers, hyphens, and underscores allowed.
            </p>
          </div>

          {error && (
            <div className="p-4 bg-red-500/10 border border-red-500/20 rounded-xl text-red-500 text-sm">
              {error}
            </div>
          )}

          <button
            type="submit"
            disabled={isLoading || !url.trim()}
            className="w-full py-5 bg-white text-black font-semibold rounded-2xl hover:bg-gray-200 transform hover:-translate-y-1 transition-all disabled:opacity-60 disabled:hover:translate-y-0 shadow-xl shadow-white/10 text-lg"
          >
            {isLoading ? 'Creating...' : 'Create Short Link'}
          </button>
        </form>

        {result && (
          <div className="mt-12 bg-zinc-900/60 border border-zinc-800 rounded-2xl overflow-hidden animate-in fade-in slide-in-from-bottom-4 duration-500">
            <div className="p-6 sm:p-8">
              <div className="text-center mb-10">
                <div className="inline-flex items-center gap-2 mb-4 bg-green-500/10 px-4 py-1.5 rounded-full border border-green-500/20">
                  <div className="relative flex h-2 w-2">
                    <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-green-400 opacity-75"></span>
                    <span className="relative inline-flex rounded-full h-2 w-2 bg-green-400"></span>
                  </div>
                  <span className="text-green-400 text-sm font-semibold uppercase tracking-wider">Successfully Created</span>
                </div>

                <div className="relative group">
                  <div className="text-2xl sm:text-3xl font-mono font-bold text-white break-all mb-4 bg-zinc-800/50 p-6 rounded-xl border border-zinc-700/30 group-hover:border-zinc-600/50 transition-colors">
                    {result.short}
                  </div>
                  <button
                    onClick={copyToClipboard}
                    className="absolute top-4 right-4 p-2.5 bg-zinc-700/50 hover:bg-zinc-600 rounded-lg text-gray-300 hover:text-white transition-all shadow-lg"
                    title="Copy to clipboard"
                  >
                    <Copy size={18} />
                  </button>
                </div>

                <div className="flex flex-col items-center gap-2">
                  <div className="flex items-center gap-2 text-gray-500 text-sm uppercase tracking-widest font-medium">
                    <ExternalLink size={14} />
                    <span>Redirects to</span>
                  </div>
                  <div className="text-gray-400 text-sm break-all font-mono bg-zinc-950/30 px-3 py-1 rounded inline-block max-w-full">
                    {result.original}
                  </div>
                </div>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
                <button
                  onClick={copyToClipboard}
                  className="flex items-center justify-center gap-2 px-6 py-4 bg-white text-black hover:bg-gray-200 rounded-xl font-bold transition-all transform hover:-translate-y-0.5"
                >
                  <Copy size={20} />
                  Copy Link
                </button>

                <Link
                  to={`/analytics/${result.id}`}
                  className="flex items-center justify-center gap-2 px-6 py-4 bg-zinc-800 hover:bg-zinc-700 text-white rounded-xl font-bold transition-all border border-zinc-700 transform hover:-translate-y-0.5"
                >
                  <BarChart2 size={20} />
                  View Stats
                </Link>

                <button
                  onClick={() => setResult(null)}
                  className="flex items-center justify-center gap-2 px-6 py-4 border border-zinc-800 hover:bg-zinc-900 text-gray-400 hover:text-white rounded-xl font-bold transition-all transform hover:-translate-y-0.5"
                >
                  <RefreshCw size={20} />
                  New Link
                </button>
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
