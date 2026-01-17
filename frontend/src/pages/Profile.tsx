import { useState, useEffect } from 'react';
import { useAuth } from '../context/AuthContext';

export default function Profile() {
  const { user } = useAuth();
  const [form, setForm] = useState({
    name: '',
    email: '',
    currentPassword: '',
    newPassword: '',
  });

  useEffect(() => {
    if (user) {
      setForm(prev => ({
        ...prev,
        name: user.name || '',
        email: user.email || '',
      }));
    }
  }, [user]);

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setForm({ ...form, [e.target.name]: e.target.value });
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    alert('Settings update is not yet implemented in the backend.');
  };

  return (
    <div className="min-h-screen bg-black text-gray-100 pt-20 pb-16 px-4 sm:px-6 lg:px-8">
      <div className="max-w-2xl mx-auto">
        <h1 className="text-4xl md:text-5xl font-black tracking-tight bg-gradient-to-r from-white via-gray-300 to-gray-500 bg-clip-text text-transparent mb-2">
          Settings
        </h1>
        <p className="text-gray-400 mb-12">Manage your account preferences</p>

        <div className="space-y-12">
          {/* Profile */}
          <section className="bg-zinc-900/60 border border-zinc-800 rounded-2xl p-8">
            <h2 className="text-2xl font-semibold mb-6 text-white">Profile Information</h2>
            <form onSubmit={handleSubmit} className="space-y-6">
              <div>
                <label className="block text-gray-400 text-sm mb-2 font-medium">Full Name</label>
                <input
                  name="name"
                  value={form.name}
                  onChange={handleChange}
                  className="w-full px-5 py-4 bg-zinc-950 border border-zinc-800 rounded-xl text-white focus:outline-none focus:border-gray-600 transition-colors"
                />
              </div>
              <div>
                <label className="block text-gray-400 text-sm mb-2 font-medium">Email Address</label>
                <input
                  type="email"
                  name="email"
                  readOnly
                  value={form.email}
                  className="w-full px-5 py-4 bg-zinc-950/50 border border-zinc-900 rounded-xl text-gray-500 cursor-not-allowed"
                />
                <p className="mt-2 text-xs text-gray-600 font-mono uppercase tracking-widest">Email verification required for changes</p>
              </div>
              <button
                type="submit"
                className="bg-zinc-800 text-gray-400 px-8 py-3 rounded-xl font-medium cursor-not-allowed opacity-50"
              >
                Save Profile
              </button>
            </form>
          </section>

          {/* Password */}
          <section className="bg-zinc-900/60 border border-zinc-800 rounded-2xl p-8">
            <h2 className="text-2xl font-semibold mb-6 text-white">Security</h2>
            <form onSubmit={handleSubmit} className="space-y-6">
              <div>
                <label className="block text-gray-400 text-sm mb-2 font-medium">Current Password</label>
                <input
                  type="password"
                  name="currentPassword"
                  placeholder="••••••••"
                  value={form.currentPassword}
                  onChange={handleChange}
                  className="w-full px-5 py-4 bg-zinc-950 border border-zinc-800 rounded-xl text-white focus:outline-none focus:border-gray-600 transition-colors"
                />
              </div>
              <div>
                <label className="block text-gray-400 text-sm mb-2 font-medium">New Password</label>
                <input
                  type="password"
                  name="newPassword"
                  placeholder="••••••••"
                  value={form.newPassword}
                  onChange={handleChange}
                  className="w-full px-5 py-4 bg-zinc-950 border border-zinc-800 rounded-xl text-white focus:outline-none focus:border-gray-600 transition-colors"
                />
              </div>
              <button
                type="submit"
                className="bg-zinc-800 text-gray-400 px-8 py-3 rounded-xl font-medium cursor-not-allowed opacity-50"
              >
                Update Password
              </button>
            </form>
          </section>

          {/* Danger Zone */}
          <section className="bg-red-950/10 border border-red-900/30 rounded-2xl p-8">
            <h2 className="text-2xl font-semibold text-red-500 mb-4">Danger Zone</h2>
            <p className="text-gray-400 mb-6 text-sm">
              Permanently delete your account and all your shortened links. This action is irreversible.
            </p>
            <button className="bg-red-900/20 hover:bg-red-900/40 text-red-500 border border-red-900/50 px-6 py-3 rounded-xl transition-all font-medium">
              Request Account Deletion
            </button>
          </section>
        </div>
      </div>
    </div>
  );
}