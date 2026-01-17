import { useState, useEffect } from 'react';
import { useParams, Link } from 'react-router-dom';
import { urlApi } from '../services/apiServices/url.api';
import type { ShortUrl } from '../types/url';

export default function Analytics() {
  const { id } = useParams<{ id: string }>();
  const [data, setData] = useState<ShortUrl | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const fetchDetails = async () => {
      if (!id) return;
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
    fetchDetails();
  }, [id]);

  if (isLoading) {
    return (
      <div className="min-h-screen bg-black text-gray-100 flex items-center justify-center">
        <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-white"></div>
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
        <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-6 mb-10">
          <div>
            <h1 className="text-4xl font-black tracking-tight bg-gradient-to-r from-white via-gray-300 to-gray-500 bg-clip-text text-transparent">
              Link Analytics
            </h1>
            <div className="mt-2 text-2xl font-mono text-gray-200">{data.shortUrl}</div>
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
                <div className="break-all text-gray-200">{data.originalUrl}</div>
              </div>
              <div>
                <div className="text-gray-500 text-sm mb-1">Total Clicks</div>
                <div className="text-4xl font-bold text-white tracking-tight">{data.clicks.toLocaleString()}</div>
              </div>
              <div className="grid grid-cols-2 gap-6">
                <div>
                  <div className="text-gray-500 text-sm mb-1">Created</div>
                  <div className="text-gray-300">
                    {new Date(data.createdAt).toLocaleDateString(undefined, {
                      year: 'numeric',
                      month: 'long',
                      day: 'numeric'
                    })}
                  </div>
                </div>
                <div>
                  <div className="text-gray-500 text-sm mb-1">Status</div>
                  <div className="text-green-400 flex items-center gap-2">
                    <span className="w-2 h-2 bg-green-400 rounded-full animate-pulse"></span>
                    Active
                  </div>
                </div>
              </div>
            </div>
          </div>

          {/* Traffic Placeholder */}
          <div className="bg-zinc-900/60 border border-zinc-800 rounded-2xl p-8">
            <h2 className="text-2xl font-semibold mb-6">Traffic Distribution</h2>
            <div className="h-64 bg-zinc-950/70 rounded-xl flex flex-col items-center justify-center text-gray-500 gap-4 border border-zinc-900">
              <div className="w-16 h-16 border-4 border-zinc-800 border-t-zinc-600 rounded-full"></div>
              <p className="font-mono text-xs uppercase tracking-widest">Collecting more data points...</p>
            </div>
            <div className="mt-6">
              <h3 className="font-medium mb-3 text-gray-400">Activity Level</h3>
              <div className="w-full bg-zinc-800 h-2 rounded-full overflow-hidden">
                <div
                  className="bg-white h-full transition-all duration-1000"
                  style={{ width: `${Math.min((data.clicks / 100) * 100, 100)}%` }}
                ></div>
              </div>
              <p className="mt-2 text-xs text-gray-500">Based on recent interaction patterns</p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}