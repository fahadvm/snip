// pages/Dashboard.jsx
import { useState } from 'react';
import { Link } from 'react-router-dom';

// Mock data (replace with real API later)
const mockLinks = Array.from({ length: 48 }, (_, i) => ({
  id: `link-${i + 1}`,
  original: `https://example.com/very-long-url-${i + 1}/blog/post/update-2026`,
  short: `snip.sh/${Math.random().toString(36).slice(2, 8)}`,
  clicks: Math.floor(Math.random() * 5000) + 10,
  created: new Date(Date.now() - Math.random() * 30 * 24 * 60 * 60 * 1000).toLocaleDateString(),
}));

const ITEMS_PER_PAGE = 10;

export default function Dashboard() {
  const [currentPage, setCurrentPage] = useState(1);
  const [search, setSearch] = useState('');

  // Filter first
  const filtered = mockLinks.filter(link =>
    link.original.toLowerCase().includes(search.toLowerCase()) ||
    link.short.toLowerCase().includes(search.toLowerCase())
  );

  // Then paginate
  const totalPages = Math.ceil(filtered.length / ITEMS_PER_PAGE);
  const startIndex = (currentPage - 1) * ITEMS_PER_PAGE;
  const paginatedLinks = filtered.slice(startIndex, startIndex + ITEMS_PER_PAGE);

  const goToPage = (page : any) => {
    if (page >= 1 && page <= totalPages) {
      setCurrentPage(page);
    }
  };

  return (
    <div className="min-h-screen bg-black text-gray-100 pt-20 pb-16 px-4 sm:px-6 lg:px-8">
      <div className="max-w-7xl mx-auto">
        {/* Header */}
        <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-6 mb-12">
          <div>
            <h1 className="text-4xl md:text-5xl font-black tracking-tighter bg-gradient-to-r from-white via-gray-300 to-gray-500 bg-clip-text text-transparent">
              My Links
            </h1>
            <p className="mt-2 text-gray-400">All your shortened URLs in one place</p>
          </div>
          <Link
            to="/shorten"
            className="bg-white text-black px-6 py-3 rounded-xl font-semibold hover:bg-gray-200 transform hover:-translate-y-0.5 transition-all shadow-lg shadow-white/10 whitespace-nowrap"
          >
            + Create New
          </Link>
        </div>

        {/* Search + Stats */}
        <div className="mb-10 flex flex-col sm:flex-row gap-6 items-stretch sm:items-center">
          <input
            type="text"
            placeholder="Search URLs or short codes..."
            value={search}
            onChange={(e) => {
              setSearch(e.target.value);
              setCurrentPage(1); // reset to first page on search
            }}
            className="flex-1 px-6 py-4 bg-zinc-900 border border-zinc-800 rounded-xl text-white placeholder-gray-500 focus:outline-none focus:border-gray-600 focus:ring-1 focus:ring-gray-700"
          />

          <div className="grid grid-cols-3 gap-4 text-center text-sm min-w-[280px]">
            <div className="bg-zinc-900/60 p-4 rounded-xl border border-zinc-800">
              <div className="text-2xl font-bold text-white">{filtered.length}</div>
              <div className="text-gray-500">Total</div>
            </div>
            <div className="bg-zinc-900/60 p-4 rounded-xl border border-zinc-800">
              <div className="text-2xl font-bold text-white">
                {filtered.reduce((sum, l) => sum + l.clicks, 0).toLocaleString()}
              </div>
              <div className="text-gray-500">Clicks</div>
            </div>
            <div className="bg-zinc-900/60 p-4 rounded-xl border border-zinc-800">
              <div className="text-2xl font-bold text-white">
                {Math.max(...filtered.map(l => l.clicks), 0).toLocaleString()}
              </div>
              <div className="text-gray-500">Top</div>
            </div>
          </div>
        </div>

        {/* Table */}
        <div className="bg-zinc-900/40 border border-zinc-800 rounded-2xl overflow-hidden backdrop-blur-sm">
          <div className="overflow-x-auto">
            <table className="min-w-full divide-y divide-zinc-800">
              <thead className="bg-zinc-950/70">
                <tr>
                  <th className="px-6 py-5 text-left text-sm font-medium text-gray-400 uppercase tracking-wider">
                    Original URL
                  </th>
                  <th className="px-6 py-5 text-left text-sm font-medium text-gray-400 uppercase tracking-wider">
                    Short Link
                  </th>
                  <th className="px-6 py-5 text-center text-sm font-medium text-gray-400 uppercase tracking-wider">
                    Clicks
                  </th>
                  <th className="px-6 py-5 text-left text-sm font-medium text-gray-400 uppercase tracking-wider">
                    Created
                  </th>
                  <th className="px-6 py-5"></th>
                </tr>
              </thead>
              <tbody className="divide-y divide-zinc-800">
                {paginatedLinks.map(link => (
                  <tr key={link.id} className="hover:bg-zinc-800/50 transition-colors">
                    <td className="px-6 py-5 max-w-md truncate text-gray-300">
                      {link.original}
                    </td>
                    <td className="px-6 py-5 font-mono text-gray-200">
                      {link.short}
                    </td>
                    <td className="px-6 py-5 text-center">
                      <span className="font-semibold text-white">
                        {link.clicks.toLocaleString()}
                      </span>
                    </td>
                    <td className="px-6 py-5 text-gray-500 text-sm">
                      {link.created}
                    </td>
                    <td className="px-6 py-5 text-right">
                      <Link
                        to={`/links/${link.id}`}
                        className="text-gray-400 hover:text-white font-medium transition-colors"
                      >
                        Details →
                      </Link>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>

          {/* Empty state */}
          {paginatedLinks.length === 0 && (
            <div className="py-16 text-center text-gray-500">
              {search 
                ? `No links found for "${search}"` 
                : "You haven't created any short links yet"}
            </div>
          )}
        </div>

        {/* Pagination */}
        {totalPages > 1 && (
          <div className="mt-10 flex flex-col sm:flex-row justify-between items-center gap-6 text-sm">
            <div className="text-gray-500">
              Showing {startIndex + 1}–{Math.min(startIndex + ITEMS_PER_PAGE, filtered.length)} of {filtered.length}
            </div>

            <div className="flex items-center gap-2">
              <button
                onClick={() => goToPage(currentPage - 1)}
                disabled={currentPage === 1}
                className="px-4 py-2 bg-zinc-900 border border-zinc-700 rounded-lg hover:bg-zinc-800 disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
              >
                Previous
              </button>

              {/* Page numbers - show limited range */}
              {Array.from({ length: totalPages }, (_, i) => i + 1)
                .filter(p => 
                  p === 1 || 
                  p === totalPages || 
                  Math.abs(p - currentPage) <= 2
                )
                .map((page, idx, arr) => (
                  <>
                    {idx > 0 && arr[idx - 1] !== page - 1 && (
                      <span key={`ellipsis-${page}`} className="px-2 text-gray-600">...</span>
                    )}
                    <button
                      key={page}
                      onClick={() => goToPage(page)}
                      className={`
                        px-4 py-2 rounded-lg transition-colors
                        ${page === currentPage 
                          ? 'bg-white text-black font-semibold' 
                          : 'bg-zinc-900 border border-zinc-700 hover:bg-zinc-800'}
                      `}
                    >
                      {page}
                    </button>
                  </>
                ))}

              <button
                onClick={() => goToPage(currentPage + 1)}
                disabled={currentPage === totalPages}
                className="px-4 py-2 bg-zinc-900 border border-zinc-700 rounded-lg hover:bg-zinc-800 disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
              >
                Next
              </button>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}