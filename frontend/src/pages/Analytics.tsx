import { useState, useEffect } from 'react';
import { useParams, Link, useNavigate } from 'react-router-dom';
import { urlApi } from '../services/apiServices/url.api';
import type { ShortUrl } from '../types/url';
import { showSuccessToast } from '../utils/Toast';
import ConfirmationModal from '../components/ConfirmationModal';
import EditUrlModal from '../components/EditUrlModal';
import { Pencil, MousePointerClick, Calendar, CheckCircle2, ExternalLink, Trash2, Copy } from 'lucide-react';

// Component definitions
const ClicksChart = ({ urlId }: { urlId: string }) => {
  const [range, setRange] = useState<'weekly' | 'monthly' | 'yearly'>('weekly');
  const [chartData, setChartData] = useState<{ label: string; clicks: number }[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchData = async () => {
      setLoading(true);
      try {
        const res = await urlApi.getAnalytics(urlId, range);
        if (res && res.ok) {
          setChartData(res.data);
        }
      } catch (error) {
        console.error('Failed to fetch chart data', error);
      } finally {
        setLoading(false);
      }
    };
    fetchData();
  }, [urlId, range]);

  const maxClicks = Math.max(...chartData.map(d => d.clicks), 1);

  return (
    <div className="w-full">
      <div className="flex justify-center sm:justify-end mb-6">
        <div className="flex bg-zinc-800 rounded-lg p-1 text-xs sm:text-sm">
          {(['weekly', 'monthly', 'yearly'] as const).map((r) => (
            <button
              key={r}
              onClick={() => setRange(r)}
              className={`px-3 sm:px-4 py-1.5 sm:py-2 rounded-md transition-all ${range === r
                ? 'bg-zinc-600 text-white shadow-lg'
                : 'text-gray-400 hover:text-gray-200'
                }`}
            >
              {r.charAt(0).toUpperCase() + r.slice(1)}
            </button>
          ))}
        </div>
      </div>

      <div className="min-h-[280px] sm:min-h-[320px]">
        {loading ? (
          <div className="h-full flex items-center justify-center text-gray-500 py-20">
            <div className="flex flex-col items-center gap-3">
              <div className="animate-spin rounded-full h-8 w-8 border-t-2 border-b-2 border-white"></div>
              <span>Loading chart...</span>
            </div>
          </div>
        ) : chartData.length === 0 ? (
          <div className="h-full flex items-center justify-center text-gray-500 py-20">
            <div className="text-center">
              <div className="text-xl mb-2">📊</div>
              <div>No data available</div>
            </div>
          </div>
        ) : (
          <div className="flex flex-col gap-4">
            <div className="flex items-end justify-between h-48 sm:h-56 gap-1 sm:gap-2 px-2 sm:px-4">
              {chartData.map((data, index) => (
                <div key={index} className="flex-1 flex flex-col items-center gap-2 group max-w-[60px]">
                  <div
                    className="w-full bg-zinc-800 rounded-t-lg relative cursor-pointer hover:bg-zinc-700 transition-colors"
                    style={{
                      height: `${(data.clicks / maxClicks) * 100}%`,
                      minHeight: '4px',
                      maxWidth: '100%'
                    }}
                  >
                    <div className="absolute -top-8 left-1/2 -translate-x-1/2 bg-white text-black px-2 py-1 rounded text-xs font-semibold opacity-0 group-hover:opacity-100 transition-opacity whitespace-nowrap z-10 pointer-events-none shadow-lg">
                      {data.clicks} clicks
                    </div>
                    <div
                      className="w-full bg-gradient-to-t from-white to-gray-300 rounded-t-lg transition-all duration-300"
                      style={{ height: '100%' }}
                    />
                  </div>
                  <div className="text-[9px] sm:text-[10px] md:text-xs text-gray-500 font-medium truncate w-full text-center px-0.5">
                    {data.label}
                  </div>
                </div>
              ))}
            </div>
            <div className="text-center text-xs sm:text-sm text-gray-500 font-medium">
              {range === 'weekly' ? 'Last 7 Days' : range === 'monthly' ? `${new Date().getFullYear()} (Jan - Dec)` : 'Last 3 Years + Current Year'}
            </div>
          </div>
        )}
      </div>
    </div>
  );
};


export default function Analytics() {
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();
  const [data, setData] = useState<ShortUrl | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const [editingUrl, setEditingUrl] = useState<ShortUrl | null>(null);
  const [isDeleteModalOpen, setIsDeleteModalOpen] = useState(false);
  const [isDeleting, setIsDeleting] = useState(false);

  const fetchDetails = async () => {
    if (!id) return;
    setIsLoading(true);
    try {
      const response = await urlApi.getDetails(id);
      if (response && response.ok) {
        setData(response.data);
      } else {
        setError(response?.message || 'Failed to fetch analytics');
      }
    } catch (err) {
      console.error(err);
      setError('An error occurred while fetching data');
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    fetchDetails();
  }, [id]);

  const handleDeleteClick = () => {
    setIsDeleteModalOpen(true);
  };

  const confirmDelete = async () => {
    setIsDeleting(true);
    try {
      const response = await urlApi.delete(id!);
      if (response && response.ok) {
        showSuccessToast('Link deleted successfully');
        navigate('/dashboard');
      } else {
        alert(response?.message || 'Failed to delete link');
        setIsDeleteModalOpen(false);
      }
    } catch (err) {
      console.error(err);
      alert('An error occurred while deleting');
      setIsDeleteModalOpen(false);
    } finally {
      setIsDeleting(false);
    }
  };

  if (isLoading) {
    return (
      <div className="min-h-screen bg-black text-gray-100 flex items-center justify-center">
        <div className="flex flex-col items-center gap-4">
          <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-white"></div>
          <p className="text-gray-400">Loading analytics...</p>
        </div>
      </div>
    );
  }

  if (error || !data) {
    return (
      <div className="min-h-screen bg-black text-gray-100 flex flex-col items-center justify-center p-4">
        <div className="text-red-500 text-xl mb-4">{error || 'Link not found'}</div>
        <Link to="/dashboard" className="text-white hover:underline">← Back to Dashboard</Link>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-black text-gray-100 pt-20 pb-16 px-4 sm:px-6 lg:px-8">
      <div className="max-w-5xl mx-auto">
        {/* Header */}
        <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4 sm:gap-6 mb-10">
          <div className="flex-1">
            <h1 className="text-3xl sm:text-4xl font-black tracking-tight bg-gradient-to-r from-white via-gray-300 to-gray-500 bg-clip-text text-transparent">
              Link Analytics
            </h1>
            <div className="mt-2 text-lg sm:text-xl font-mono text-gray-200 break-all">{data.shortUrl}</div>
          </div>
          <Link
            to="/dashboard"
            className="text-gray-400 hover:text-white transition-colors self-start sm:self-auto whitespace-nowrap"
          >
            ← Back to all links
          </Link>
        </div>

        {/* Overview Card */}
        <div className="bg-zinc-900/60 border border-zinc-800 rounded-2xl p-6 sm:p-8 mb-6 sm:mb-8">
          <div className="flex items-center justify-between mb-8">
            <h2 className="text-2xl sm:text-3xl font-black tracking-tight bg-gradient-to-r from-white via-gray-300 to-gray-500 bg-clip-text text-transparent">
              Link Overview
            </h2>
            <button
              onClick={() => setEditingUrl(data)}
              className="text-gray-400 hover:text-white transition-colors p-2 hover:bg-zinc-800 rounded-lg"
              title="Edit URL"
            >
              <Pencil size={18} />
            </button>
          </div>

          {/* Stats Grid */}
          <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 mb-8">
            {/* Total Clicks */}
            <div className="bg-zinc-900/60 p-6 rounded-xl border border-zinc-800 hover:border-zinc-700 transition-colors">
              <div className="flex items-center gap-3 mb-2">
                <MousePointerClick size={20} className="text-gray-400" />
                <div className="text-sm text-gray-500 uppercase tracking-wider">Total Clicks</div>
              </div>
              <div className="text-4xl font-black text-white tracking-tight">
                {data.clicks.toLocaleString()}
              </div>
            </div>

            {/* Created Date */}
            <div className="bg-zinc-900/60 p-6 rounded-xl border border-zinc-800 hover:border-zinc-700 transition-colors">
              <div className="flex items-center gap-3 mb-2">
                <Calendar size={20} className="text-gray-400" />
                <div className="text-sm text-gray-500 uppercase tracking-wider">Created</div>
              </div>
              <div className="text-xl font-bold text-white">
                {new Date(data.createdAt).toLocaleDateString('en-US', {
                  month: 'short',
                  day: 'numeric',
                  year: 'numeric'
                })}
              </div>
            </div>

            {/* Status */}
            <div className="bg-zinc-900/60 p-6 rounded-xl border border-zinc-800 hover:border-zinc-700 transition-colors">
              <div className="flex items-center gap-3 mb-2">
                <CheckCircle2 size={20} className="text-gray-400" />
                <div className="text-sm text-gray-500 uppercase tracking-wider">Status</div>
              </div>
              <div className="flex items-center gap-2">
                <span className="w-2 h-2 bg-green-400 rounded-full animate-pulse"></span>
                <span className="text-xl font-bold text-green-400">Active</span>
              </div>
            </div>
          </div>

          {/* URL Details */}
          <div className="space-y-6">
            <div>
              <div className="flex items-center gap-2 mb-2">
                <ExternalLink size={16} className="text-gray-500" />
                <div className="text-sm text-gray-500 uppercase tracking-wider">Original URL</div>
              </div>
              <div className="bg-zinc-800/50 border border-zinc-800 rounded-xl p-4">
                <div className="break-all text-gray-200 text-sm sm:text-base font-mono">
                  {data.originalUrl}
                </div>
              </div>
            </div>

            <div>
              <div className="flex items-center gap-2 mb-2">
                <ExternalLink size={16} className="text-gray-500" />
                <div className="text-sm text-gray-500 uppercase tracking-wider">Short Link</div>
              </div>
              <div className="bg-zinc-800/50 border border-zinc-800 rounded-xl p-4 flex items-center justify-between gap-3">
                <div className="text-gray-200 text-sm sm:text-base font-mono font-semibold break-all flex-1">
                  {data.shortUrl}
                </div>
                <button
                  onClick={() => {
                    navigator.clipboard.writeText(data.shortUrl);
                    showSuccessToast('Short link copied to clipboard!');
                  }}
                  className="flex-shrink-0 p-2 text-gray-400 hover:text-white hover:bg-zinc-700 rounded-lg transition-all"
                  title="Copy to clipboard"
                >
                  <Copy size={18} />
                </button>
              </div>
            </div>
          </div>

          {/* Delete Action */}
          <div className="mt-8 pt-6 border-t border-zinc-800">
            <button
              onClick={handleDeleteClick}
              className="flex items-center gap-2 text-sm text-red-500 hover:text-red-400 font-medium transition-colors"
            >
              <Trash2 size={16} />
              <span>Delete this link</span>
            </button>
          </div>
        </div>

        {/* Clicks Chart */}
        <div className="bg-zinc-900/60 border border-zinc-800 rounded-2xl p-6 sm:p-8">
          <h2 className="text-xl sm:text-2xl font-semibold mb-6">Click Activity</h2>
          <ClicksChart urlId={id!} />
        </div>

        {/* Modals */}
        {editingUrl && (
          <EditUrlModal
            url={editingUrl}
            onClose={() => setEditingUrl(null)}
            onSuccess={fetchDetails}
          />
        )}

        <ConfirmationModal
          isOpen={isDeleteModalOpen}
          title="Delete Link"
          message="Are you sure you want to delete this link? This action cannot be undone."
          confirmText="Delete"
          onConfirm={confirmDelete}
          onCancel={() => setIsDeleteModalOpen(false)}
          isLoading={isDeleting}
        />
      </div>
    </div>
  );
}
