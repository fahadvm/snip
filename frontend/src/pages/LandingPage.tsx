// pages/Landing.jsx
import { useState } from 'react';

export default function Landing() {
  const [url, setUrl] = useState('');
  const [shortened, setShortened] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [copied, setCopied] = useState(false);

  const handleSubmit = async (e:any) => {
    e.preventDefault();
    if (!url.trim()) return;

    setIsLoading(true);

    // Fake delay + simulation
    setTimeout(() => {
      const fakeShortCode = Math.random().toString(36).substring(2, 8);
      setShortened(`snip.sh/${fakeShortCode}`);
      setIsLoading(false);
    }, 800);
  };

  const copyToClipboard = () => {
    navigator.clipboard.writeText(shortened);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  return (
    <div className="min-h-screen bg-black text-gray-100 flex flex-col">
      {/* Header already in layout - assuming you have <Header /> in layout */}

      <main className="flex-1 flex items-center justify-center px-4 sm:px-6 lg:px-8 py-16">
        <div className="w-full max-w-3xl text-center space-y-10 md:space-y-14">
          {/* Hero */}
          <div className="space-y-6">
            <h1 className="text-5xl sm:text-6xl md:text-7xl lg:text-8xl font-black tracking-tighter">
              <span className="bg-linear-to-r from-white via-gray-200 to-gray-500 bg-clip-text text-transparent">
                Shorten.
              </span>
              <br />
              <span className="bg-linear-to-r from-gray-300 via-white to-gray-400 bg-clip-text text-transparent">
                Share.
              </span>
              <br />
              Forget.
            </h1>

            <p className="text-xl md:text-2xl text-gray-400 font-light max-w-2xl mx-auto">
              The cleanest URL shortener. No tracking. No ads. Just works.
            </p>
          </div>

          {/* URL Input + Result */}
          <div className="max-w-2xl mx-auto pt-4">
            <form onSubmit={handleSubmit} className="flex flex-col sm:flex-row gap-4">
              <input
                type="url"
                value={url}
                onChange={(e) => setUrl(e.target.value)}
                placeholder="Paste long ugly URL here..."
                required
                className="
                  flex-1 px-6 py-5 bg-zinc-900 border border-zinc-800 rounded-2xl
                  text-white placeholder-gray-500 text-lg
                  focus:outline-none focus:border-gray-600 focus:ring-2 focus:ring-gray-700 focus:ring-offset-2 focus:ring-offset-black
                  transition-all duration-200
                "
              />

              <button
                type="submit"
                disabled={isLoading || !url.trim()}
                className={`
                  px-10 py-5 bg-white text-black font-semibold text-lg rounded-2xl
                  hover:bg-gray-200 transform hover:-translate-y-1
                  focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-gray-400 focus:ring-offset-black
                  transition-all duration-200
                  disabled:opacity-60 disabled:cursor-not-allowed
                  shadow-xl shadow-white/10
                  whitespace-nowrap
                `}
              >
                {isLoading ? 'Shortening...' : 'Shorten'}
              </button>
            </form>

            {/* Shortened result */}
            {shortened && (
              <div className="mt-8 p-6 bg-zinc-900/70 border border-zinc-800 rounded-2xl backdrop-blur-sm">
                <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
                  <div className="text-2xl font-mono text-gray-200 break-all">
                    {shortened}
                  </div>

                  <button
                    onClick={copyToClipboard}
                    className={`
                      px-6 py-3 bg-zinc-800 hover:bg-zinc-700
                      text-white rounded-xl font-medium
                      transition-colors duration-200 flex items-center gap-2
                      ${copied ? 'bg-green-900/40 hover:bg-green-900/50' : ''}
                    `}
                  >
                    {copied ? (
                      <>
                        <span>✓ Copied!</span>
                      </>
                    ) : (
                      <>
                        <span>Copy</span>
                      </>
                    )}
                  </button>
                </div>
              </div>
            )}
          </div>

          {/* Quick stats / trust signals */}
          <div className="pt-12 grid grid-cols-2 sm:grid-cols-3 gap-8 text-gray-500 text-sm md:text-base">
            <div>
              <div className="text-3xl font-bold text-white">0</div>
              <div>tracking pixels</div>
            </div>
            <div>
              <div className="text-3xl font-bold text-white">∞</div>
              <div>links forever</div>
            </div>
            <div className="col-span-2 sm:col-span-1">
              <div className="text-3xl font-bold text-white">0ms</div>
              <div>bullshit loading</div>
            </div>
          </div>
        </div>
      </main>

      <footer className="py-12 text-center text-gray-600 text-sm border-t border-zinc-900">
        <p>snip • 2026 • Made with zero nonsense</p>
      </footer>
    </div>
  );
}