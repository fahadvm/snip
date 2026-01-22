import { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { urlApi } from '../services/apiServices/url.api';
import type { ShortUrl } from '../types/url';

const ITEMS_PER_PAGE = 10;

export default function Dashboard() {
  const [currentPage, setCurrentPage] = useState(1);
  const [search, setSearch] = useState('');
  const [debouncedSearch, setDebouncedSearch] = useState('');
  const [links, setLinks] = useState<ShortUrl[]>([]);
  const [isLoading, setIsLoading] = useState(true);

  // Debounce search input
  useEffect(() => {
    const timer = setTimeout(() => {
      setDebouncedSearch(search);
    }, 500); // 500ms debounce

    return () => clearTimeout(timer);
  }, [search]);

  // Fetch URLs from backend with search parameter
  useEffect(() => {
    const fetchUrls = async () => {
      setIsLoading(true);
      try {
        const response = await urlApi.getMyUrls(debouncedSearch);
        if (response && response.ok) {
          setLinks(response.data);
        }
      } catch (error) {
        console.error('Failed to fetch URLs:', error);
      } finally {
        setIsLoading(false);
      }
    };
    fetchUrls();
  }, [debouncedSearch]);

  const totalPages = Math.ceil(links.length / ITEMS_PER_PAGE);
  const startIndex = (currentPage - 1) * ITEMS_PER_PAGE;
  const paginatedLinks = links.slice(startIndex, startIndex + ITEMS_PER_PAGE);

  const goToPage = (page: number) => {
    if (page >= 1 && page <= totalPages) {
      setCurrentPage(page);
    }
  };

  if (isLoading && links.length === 0) {
    return (
      <div className="min-h-screen bg-black text-gray-100 flex items-center justify-center">
        <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-white"></div>
      </div>
    );
  }

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
          <div className="flex-1 relative">
            <input
              type="text"
              placeholder="Search URLs or short codes..."
              value={search}
              onChange={(e) => {
                setSearch(e.target.value);
                setCurrentPage(1);
              }}
              className="w-full px-6 py-4 bg-zinc-900 border border-zinc-800 rounded-xl text-white placeholder-gray-500 focus:outline-none focus:border-gray-600 focus:ring-1 focus:ring-gray-700"
            />
            {isLoading && (
              <div className="absolute right-4 top-1/2 -translate-y-1/2">
                <div className="animate-spin rounded-full h-5 w-5 border-t-2 border-b-2 border-white"></div>
              </div>
            )}
          </div>

          <div className="grid grid-cols-3 gap-4 text-center text-sm min-w-[280px]">
            <div className="bg-zinc-900/60 p-4 rounded-xl border border-zinc-800">
              <div className="text-2xl font-bold text-white">{links.length}</div>
              <div className="text-gray-500">Total</div>
            </div>
            <div className="bg-zinc-900/60 p-4 rounded-xl border border-zinc-800">
              <div className="text-2xl font-bold text-white">
                {links.reduce((sum, l) => sum + l.clicks, 0).toLocaleString()}
              </div>
              <div className="text-gray-500">Clicks</div>
            </div>
            <div className="bg-zinc-900/60 p-4 rounded-xl border border-zinc-800">
              <div className="text-2xl font-bold text-white">
                {Math.max(...links.map(l => l.clicks), 0).toLocaleString()}
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
                      {link.originalUrl}
                    </td>
                    <td className="px-6 py-5 font-mono text-gray-200">
                      {link.shortUrl}
                    </td>
                    <td className="px-6 py-5 text-center">
                      <span className="font-semibold text-white">
                        {link.clicks.toLocaleString()}
                      </span>
                    </td>
                    <td className="px-6 py-5 text-gray-500 text-sm">
                      {new Date(link.createdAt).toLocaleDateString()}
                    </td>
                    <td className="px-6 py-5 text-right">
                      <Link
                        to={`/analytics/${link.id}`}
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
              Showing {startIndex + 1}–{Math.min(startIndex + ITEMS_PER_PAGE, links.length)} of {links.length}
            </div>

            <div className="flex items-center gap-2">
              <button
                onClick={() => goToPage(currentPage - 1)}
                disabled={currentPage === 1}
                className="px-4 py-2 bg-zinc-900 border border-zinc-700 rounded-lg hover:bg-zinc-800 disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
              >
                Previous
              </button>

              {Array.from({ length: totalPages }, (_, i) => i + 1)
                .filter(p =>
                  p === 1 ||
                  p === totalPages ||
                  Math.abs(p - currentPage) <= 2
                )
                .map((page, idx, arr) => (
                  <div key={page} className="flex items-center">
                    {idx > 0 && arr[idx - 1] !== page - 1 && (
                      <span className="px-2 text-gray-600">...</span>
                    )}
                    <button
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
                  </div>
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