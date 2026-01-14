import { useState } from 'react';
import { Link } from 'react-router-dom';

interface ShortenResult {
  short: string;
  original: string;
  clicks: number;
}

export default function Shorten() {
  const [url, setUrl] = useState<string>('');
  const [customCode, setCustomCode] = useState<string>('');
  const [result, setResult] = useState<ShortenResult | null>(null);
  const [isLoading, setIsLoading] = useState<boolean>(false);

  const handleSubmit = (e: any): void => {
    e.preventDefault();
    setIsLoading(true);

    setTimeout(() => {
      setResult({
        short: `snip.sh/${customCode || Math.random().toString(36).slice(2, 8)}`,
        original: url,
        clicks: 0,
      });
      setIsLoading(false);
    }, 700);
  };

  return (
    <div className="min-h-screen bg-black text-gray-100 pt-20 pb-16 px-4 sm:px-6 lg:px-8">
      <div className="max-w-2xl mx-auto">
        <h1 className="text-4xl md:text-5xl font-black tracking-tight gradient-text text-center mb-4">
          Shorten New URL
        </h1>
        <p className="text-center text-gray-400 mb-12">
          Create clean, trackable short links instantly
        </p>

        <form onSubmit={handleSubmit} className="space-y-8">
          <div>
            <label className="block text-gray-300 mb-2 font-medium">
              Long URL
            </label>
            <input
              type="url"
              value={url}
              onChange={(e: any) =>
                setUrl(e.target.value)
              }
              placeholder="https://very-long-url.com/..."
              required
              className="w-full px-6 py-5 bg-zinc-900 border border-zinc-800 rounded-2xl text-white placeholder-gray-500 focus:outline-none focus:border-gray-600"
            />
          </div>

          <div>
            <label className="block text-gray-300 mb-2 font-medium">
              Custom short code (optional)
            </label>
            <div className="flex">
              <div className="bg-zinc-800 px-5 py-5 rounded-l-2xl border border-r-0 border-zinc-700 text-gray-400 font-mono">
                snip.sh/
              </div>
              <input
                type="text"
                value={customCode}
                onChange={(e: any) =>
                  setCustomCode(
                    e.target.value.replace(/[^a-zA-Z0-9-]/g, '')
                  )
                }
                placeholder="your-code-here"
                className="flex-1 px-5 py-5 bg-zinc-900 border border-zinc-800 rounded-r-2xl text-white focus:outline-none focus:border-gray-600"
              />
            </div>
          </div>

          <button
            type="submit"
            disabled={isLoading || !url.trim()}
            className="w-full py-5 bg-white text-black font-semibold rounded-2xl hover:bg-gray-200 transform hover:-translate-y-1 transition-all disabled:opacity-60 shadow-xl shadow-white/10 text-lg"
          >
            {isLoading ? 'Creating...' : 'Create Short Link'}
          </button>
        </form>

        {result && (
          <div className="mt-12 p-8 bg-zinc-900/70 border border-zinc-800 rounded-2xl">
            <div className="text-center mb-6">
              <div className="text-3xl font-mono text-gray-100 break-all mb-2">
                {result.short}
              </div>
              <div className="text-gray-500 text-sm">→ redirects to:</div>
              <div className="text-gray-300 mt-1 break-all">
                {result.original}
              </div>
            </div>

            <div className="flex justify-center gap-4">
              <button className="px-8 py-3 bg-zinc-800 hover:bg-zinc-700 rounded-xl transition-colors">
                Copy Link
              </button>
              <Link
                to={`/links/${result.short.split('/').pop()}`}
                className="px-8 py-3 border border-zinc-700 hover:bg-zinc-800 rounded-xl transition-colors"
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
