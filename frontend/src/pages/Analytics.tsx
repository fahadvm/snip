// pages/LinkDetail.jsx
import { useParams, Link } from 'react-router-dom';

export default function LinkDetail() {
  const { id } = useParams();

  // In real app → fetch data by id
  const mockData = {
    short: `snip.sh/${id}`,
    original: 'https://example.com/very-long-product-page-with-parameters',
    clicks: 1247,
    created: 'January 10, 2026',
    lastClick: '2 hours ago',
    countries: { IN: 68, US: 23, DE: 12, others: 7 },
  };

  return (
    <div className="min-h-screen bg-black text-gray-100 pt-20 pb-16 px-4 sm:px-6 lg:px-8">
      <div className="max-w-5xl mx-auto">
        <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-6 mb-10">
          <div>
            <h1 className="text-4xl font-black tracking-tight gradient-text">
              Link Analytics
            </h1>
            <div className="mt-2 text-2xl font-mono text-gray-200">{mockData.short}</div>
          </div>
          <Link
            to="/dashboard"
            className="text-gray-400 hover:text-white transition-colors"
          >
            ← Back to all links
          </Link>
        </div>

        <div className="grid md:grid-cols-2 gap-8">
          {/* Main Info */}
          <div className="bg-zinc-900/60 border border-zinc-800 rounded-2xl p-8">
            <h2 className="text-2xl font-semibold mb-6">Overview</h2>
            <div className="space-y-6">
              <div>
                <div className="text-gray-500 text-sm mb-1">Original URL</div>
                <div className="break-all text-gray-200">{mockData.original}</div>
              </div>
              <div>
                <div className="text-gray-500 text-sm mb-1">Total Clicks</div>
                <div className="text-4xl font-bold text-white">{mockData.clicks}</div>
              </div>
              <div className="grid grid-cols-2 gap-6">
                <div>
                  <div className="text-gray-500 text-sm mb-1">Created</div>
                  <div className="text-gray-300">{mockData.created}</div>
                </div>
                <div>
                  <div className="text-gray-500 text-sm mb-1">Last Click</div>
                  <div className="text-gray-300">{mockData.lastClick}</div>
                </div>
              </div>
            </div>
          </div>

          {/* Placeholder for chart / map */}
          <div className="bg-zinc-900/60 border border-zinc-800 rounded-2xl p-8">
            <h2 className="text-2xl font-semibold mb-6">Traffic</h2>
            <div className="h-64 bg-zinc-950/70 rounded-xl flex items-center justify-center text-gray-500">
              [Chart / Map Placeholder - Coming soon]
            </div>
            <div className="mt-6">
              <h3 className="font-medium mb-3">Top Countries</h3>
              <ul className="space-y-2">
                {Object.entries(mockData.countries).map(([country, count]) => (
                  <li key={country} className="flex justify-between">
                    <span>{country}</span>
                    <span className="font-medium">{count}%</span>
                  </li>
                ))}
              </ul>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}