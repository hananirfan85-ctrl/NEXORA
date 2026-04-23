import React, { useState } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { supabase } from '../lib/supabase';
import { ShoppingCart } from 'lucide-react';

export default function Login() {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);
  const navigate = useNavigate();

  const handleLogin = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setError('');

    const rawUrl = import.meta.env.VITE_SUPABASE_URL || '';
    if (!rawUrl || rawUrl.includes('YOUR_SUPABASE_URL')) {
      setError('Missing Supabase Config: Please add VITE_SUPABASE_URL and VITE_SUPABASE_ANON_KEY to your Vercel Environment Variables.');
      setLoading(false);
      return;
    }
    if (!rawUrl.startsWith('https://')) {
      setError('Invalid Config: Your VITE_SUPABASE_URL must start exactly with "https://". Please update it in Vercel and redeploy.');
      setLoading(false);
      return;
    }

    try {
      const { error } = await supabase.auth.signInWithPassword({
        email,
        password,
      });

      if (error) {
        setError(error.message);
      } else {
        navigate('/');
      }
    } catch (err: any) {
      if (err?.message === 'Failed to fetch') {
        setError('Network Error (Failed to fetch). This usually means 1 of 3 things:\n1. Your Supabase project URL has a typo.\n2. Your Supabase project was PAUSED due to inactivity (log into Supabase to unpause it).\n3. Your Vercel environment variables are misconfigured. Double-check them and Redeploy.');
      } else if (err?.message?.toLowerCase().includes('api key')) {
        setError('Invalid API Key: The VITE_SUPABASE_ANON_KEY in Vercel is incorrect. Go to Supabase -> Project Settings -> API, copy the "anon public" key, update it in Vercel, and click Redeploy.');
      } else {
        setError(err?.message || 'A network error occurred. Check your Supabase configuration.');
      }
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-gray-50 py-12 px-4 sm:px-6 lg:px-8 font-sans">
      <div className="max-w-md w-full space-y-8 bg-white p-8 rounded-2xl shadow-sm border border-gray-100">
        <div>
          <div className="flex justify-center text-indigo-600">
            <img src="/logo.png" alt="NEXORA Logo" className="h-16 w-auto object-contain" onError={(e) => {
              (e.target as HTMLImageElement).src = 'data:image/svg+xml;base64,PHN2ZyB4bWxucz0iaHR0cDovL3d3dy53My5vcmcvMjAwMC9zdmciIHZpZXdCb3g9IjAgMCAyNCAyNCIgZmlsbD0ibm9uZSIgc3Ryb2tlPSIjNGY0NmU1IiBzdHJva2Utd2lkdGg9IjIiIHN0cm9rZS1saW5lY2FwPSJyb3VuZCIgc3Ryb2tlLWxpbmVqb2luPSJyb3VuZCI+PGNpcmNsZSBjeD0iOCIgY3k9IjIxIiByPSIxIi8+PGNpcmNsZSBjeD0iMTkiIGN5PSIyMSIgcj0iMSIvPjxwYXRoIGQ9Ik0yLjA1IDIuMDVoMmwzLjQzIDYuNThMMTAgMTRoOWwtLjI0LS43Ii8+PHBhdGggZD0iTTkgMTRoLjUiLz48cGF0aCBkPSJNOSAxNGwtLjI0LS43bC0zLjQzLTYuNTgiLz48L3N2Zz4='; // Fallback to cart SVG if logo.png not uploaded
            }} />
          </div>
          <h2 className="mt-6 text-center text-3xl font-extrabold text-gray-900">
            Sign in to NEXORA
          </h2>
          <p className="mt-2 text-center text-sm text-gray-600">
            Or{' '}
            <Link to="/signup" className="font-medium text-indigo-600 hover:text-indigo-500">
              create a new account
            </Link>
          </p>
        </div>
        <form className="mt-8 space-y-6" onSubmit={handleLogin}>
          {error && (
            <div className="bg-red-50 p-4 rounded-md">
              <p className="text-sm text-red-700">{error}</p>
            </div>
          )}
          <div className="space-y-4">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">Email address</label>
              <input
                type="email"
                required
                className="appearance-none block w-full px-3 py-2 border border-gray-300 rounded-lg placeholder-gray-400 focus:outline-none focus:ring-indigo-500 focus:border-indigo-500 sm:text-sm"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">Password</label>
              <input
                type="password"
                required
                className="appearance-none block w-full px-3 py-2 border border-gray-300 rounded-lg placeholder-gray-400 focus:outline-none focus:ring-indigo-500 focus:border-indigo-500 sm:text-sm"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
              />
            </div>
          </div>

          <div>
            <button
              type="submit"
              disabled={loading}
              className="w-full flex justify-center py-2.5 px-4 border border-transparent rounded-lg shadow-sm text-sm font-medium text-white bg-indigo-600 hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500 disabled:opacity-50 transition-colors"
            >
              {loading ? 'Signing in...' : 'Sign in'}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}
