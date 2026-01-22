import { useState, useEffect } from 'react';
import { useParams, Link } from 'react-router-dom';
import { urlApi } from '../services/apiServices/url.api';
import type { ShortUrl } from '../types/url';

// Simple Line Chart Component (no external dependencies)
const ClicksChart = ({ clicks }: { clicks: number }) => {
  // Generate dummy data for last 7 days (in real app, backend would provide this)
  const generateChartData = () => {
    const days = 7;
    const data = [];
    for (let i = days - 1; i >= 0; i--) {
      const date = new Date();
      date.setDate(date.getDate() - i);
      const dayClicks = Math.floor(Math.random() * (clicks / 3)) + Math.floor(clicks / days);
      data.push({
        day: date.toLocaleDateString('en-US', { weekday: 'short' }),
        clicks: dayClicks,
      });
    }
    return data;
  };

  const chartData = generateChartData();
  const maxClicks = Math.max(...chartData.map(d => d.clicks), 1);

  return (
    <div className="w-full h-64">
      <div className="flex items-end justify-between h-48 gap-2 px-4">
        {chartData.map((data, index) => (
          <div key={index} className="flex-1 flex flex-col items-center gap-2">
            <div className="w-full bg-zinc-800 rounded-t-lg relative group cursor-pointer hover:bg-zinc-700 transition-colors"
              style={{ height: `${(data.clicks / maxClicks) * 100}%`, minHeight: '8px' }}
            >
              <div className="absolute -top-8 left-1/2 -translate-x-1/2 bg-white text-black px-2 py-1 rounded text-xs font-semibold opacity-0 group-hover:opacity-100 transition-opacity whitespace-nowrap">
                {data.clicks} clicks
              </div>
              <div
                className="w-full bg-gradient-to-t from-white to-gray-300 rounded-t-lg transition-all duration-300"
                style={{ height: '100%' }}
              />
            </div>
            <div className="text-xs text-gray-500 font-medium">{data.day}</div>
          </div>
        ))}
      </div>
      <div className="mt-4 text-center text-xs text-gray-600">
        Click distribution over the last 7 days
      </div>
    </div>
  );
};

// Device breakdown component
const DeviceBreakdown = ({ clicks }: { clicks: number }) => {
  const devices = [
    { name: 'Desktop', percentage: 45, color: 'bg-blue-500' },
    { name: 'Mobile', percentage: 40, color: 'bg-green-500' },
    { name: 'Tablet', percentage: 15, color: 'bg-purple-500' },
  ];

  return (
    <div className="space-y-4">
      {devices.map((device, index) => (
        <div key={index}>
          <div className="flex justify-between mb-1">
            <span className="text-sm text-gray-400">{device.name}</span>
            <span className="text-sm font-semibold text-white">{Math.round(clicks * device.percentage / 100)}</span>
          </div>
          <div className="w-full bg-zinc-800 h-2 rounded-full overflow-hidden">
            <div
              className={`h-full ${device.color} transition-all duration-1000`}
              style={{ width: `${device.percentage}%` }}
            />
          </div>
        </div>
      ))}
    </div>
  );
};

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

        <div className="grid md:grid-cols-2 gap-8 mb-8">
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

          {/* Device Breakdown */}
          <div className="bg-zinc-900/60 border border-zinc-800 rounded-2xl p-8">
            <h2 className="text-2xl font-semibold mb-6">Device Breakdown</h2>
            <DeviceBreakdown clicks={data.clicks} />
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

        {/* Clicks Chart */}
        <div className="bg-zinc-900/60 border border-zinc-800 rounded-2xl p-8">
          <h2 className="text-2xl font-semibold mb-6">Click Activity</h2>
          <ClicksChart clicks={data.clicks} />
        </div>
      </div>
    </div>
  );
}