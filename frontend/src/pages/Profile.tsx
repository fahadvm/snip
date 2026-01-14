// pages/Settings.jsx
import { useState } from 'react';

export default function Settings() {
  const [form, setForm] = useState({
    username: 'dev',
    email: 'dev@example.com',
    currentPassword: '',
    newPassword: '',
  });

  const handleChange = (e:any) => {
    setForm({ ...form, [e.target.name]: e.target.value });
  };

  const handleSubmit = (e:any) => {
    e.preventDefault();
    // handle update
    alert('Settings saved! (mock)');
  };

  return (
    <div className="min-h-screen bg-black text-gray-100 pt-20 pb-16 px-4 sm:px-6 lg:px-8">
      <div className="max-w-2xl mx-auto">
        <h1 className="text-4xl md:text-5xl font-black tracking-tight gradient-text mb-2">
          Settings
        </h1>
        <p className="text-gray-400 mb-12">Manage your account preferences</p>

        <div className="space-y-12">
          {/* Profile */}
          <section className="bg-zinc-900/60 border border-zinc-800 rounded-2xl p-8">
            <h2 className="text-2xl font-semibold mb-6">Profile</h2>
            <form onSubmit={handleSubmit} className="space-y-6">
              <div>
                <label className="block text-gray-300 mb-2">Username</label>
                <input
                  name="username"
                  value={form.username}
                  onChange={handleChange}
                  className="w-full px-5 py-4 bg-zinc-950 border border-zinc-800 rounded-xl"
                />
              </div>
              <div>
                <label className="block text-gray-300 mb-2">Email</label>
                <input
                  type="email"
                  name="email"
                  value={form.email}
                  onChange={handleChange}
                  className="w-full px-5 py-4 bg-zinc-950 border border-zinc-800 rounded-xl"
                />
              </div>
              <button
                type="submit"
                className="bg-white text-black px-8 py-3 rounded-xl font-medium hover:bg-gray-200 transition-all"
              >
                Save Profile
              </button>
            </form>
          </section>

          {/* Password */}
          <section className="bg-zinc-900/60 border border-zinc-800 rounded-2xl p-8">
            <h2 className="text-2xl font-semibold mb-6">Change Password</h2>
            <form onSubmit={handleSubmit} className="space-y-6">
              <div>
                <label className="block text-gray-300 mb-2">Current Password</label>
                <input
                  type="password"
                  name="currentPassword"
                  value={form.currentPassword}
                  onChange={handleChange}
                  className="w-full px-5 py-4 bg-zinc-950 border border-zinc-800 rounded-xl"
                />
              </div>
              <div>
                <label className="block text-gray-300 mb-2">New Password</label>
                <input
                  type="password"
                  name="newPassword"
                  value={form.newPassword}
                  onChange={handleChange}
                  className="w-full px-5 py-4 bg-zinc-950 border border-zinc-800 rounded-xl"
                />
              </div>
              <button
                type="submit"
                className="bg-white text-black px-8 py-3 rounded-xl font-medium hover:bg-gray-200 transition-all"
              >
                Update Password
              </button>
            </form>
          </section>

          {/* Danger Zone */}
          <section className="bg-red-950/30 border border-red-900/50 rounded-2xl p-8">
            <h2 className="text-2xl font-semibold text-red-400 mb-4">Danger Zone</h2>
            <p className="text-gray-400 mb-6">
              Permanently delete your account and all your shortened links.
            </p>
            <button className="bg-red-900/70 hover:bg-red-800 text-white px-6 py-3 rounded-xl transition-colors">
              Delete Account
            </button>
          </section>
        </div>
      </div>
    </div>
  );
}