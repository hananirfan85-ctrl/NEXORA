import React, { useState } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { supabase } from '../lib/supabase';
import { motion } from 'motion/react';
import { ArrowLeft, Hexagon } from 'lucide-react';

export default function Login() {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);
  const [termsAccepted, setTermsAccepted] = useState(false);
  const navigate = useNavigate();

  const handleLogin = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!termsAccepted) {
      setError('You must accept the terms and conditions to login.');
      return;
    }
    setLoading(true);
    setError('');

    // --- DEBUGGING HELP ---
    if (email === 'debug@nexapos.com') {
       const url = import.meta.env.VITE_SUPABASE_URL || 'MISSING';
       const key = import.meta.env.VITE_SUPABASE_ANON_KEY || 'MISSING';
       setError(`DEBUG MODE:\nURL Length: ${url.length}\nURL Starts With: ${url.substring(0, 10)}...\nKey Length: ${key.length}\nKey Starts With: ${key.substring(0, 10)}...`);
       setLoading(false);
       return;
    }
    // -----------------------

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
    <div className="relative min-h-screen font-sans selection:bg-indigo-500/30 selection:text-white overflow-hidden flex items-center justify-center py-12 px-4 sm:px-6 lg:px-8">
      
      {/* Modern Refined Animated Background */}
      <div className="fixed inset-0 z-0 pointer-events-none overflow-hidden flex items-center justify-center">
        <motion.div 
          className="absolute inset-0 bg-gradient-to-br from-[#0a0a0c] via-[#0f111a] to-[#0a0a0c]"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ duration: 1 }}
        />
        <motion.div 
          className="absolute w-[60vw] h-[60vw] rounded-full blur-[120px] bg-indigo-600/10 mix-blend-screen"
          animate={{ x: [-100, 100, -100], y: [-50, 50, -50] }}
          transition={{ duration: 15, repeat: Infinity, ease: "linear" }}
        />
      </div>

      <div className="relative z-10 w-full max-w-md">
        <Link to="/home" className="inline-flex items-center gap-2 text-indigo-400 hover:text-indigo-300 font-medium mb-8 transition-colors group">
          <ArrowLeft size={16} className="group-hover:-translate-x-1 transition-transform" />
          Back to Home
        </Link>
        <div className="bg-black/40 backdrop-blur-xl p-8 rounded-3xl shadow-2xl border border-white/10 relative overflow-hidden">
          <div className="absolute top-0 left-0 w-full h-1 bg-gradient-to-r from-indigo-500 translate-y-0" />
          
          <div>
            <div className="flex justify-center text-indigo-600 mb-6">
              <Hexagon className="h-12 w-12 text-indigo-500 fill-indigo-500/20 drop-shadow-md" />
            </div>
            <h2 className="text-center text-3xl font-display font-bold text-white tracking-tight">
              Sign in to NEXA POS
            </h2>
            <p className="mt-3 text-center text-sm font-sans font-light text-gray-400">
              Or{' '}
              <Link to="/signup" className="font-medium text-indigo-400 hover:text-indigo-300">
                create a new account
              </Link>
            </p>
          </div>
          <form className="mt-8 space-y-6" onSubmit={handleLogin}>
            {error && (
              <div className="bg-red-500/10 border border-red-500/30 p-4 rounded-xl">
                <p className="text-sm font-sans font-light text-red-400">{error}</p>
              </div>
            )}
            <div className="space-y-4">
              <div>
                <label className="block text-sm font-sans font-medium text-gray-300 mb-2 tracking-wide">Email Address</label>
                <input
                  type="email"
                  required
                  className="appearance-none block w-full px-4 py-3 bg-white/5 border border-white/10 rounded-xl text-white placeholder-gray-500 focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:border-transparent transition-all sm:text-sm font-mono"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  placeholder="admin@nexapos.com"
                />
              </div>
              <div>
                <label className="block text-sm font-sans font-medium text-gray-300 mb-2 tracking-wide">Password</label>
                <input
                  type="password"
                  required
                  className="appearance-none block w-full px-4 py-3 bg-white/5 border border-white/10 rounded-xl text-white placeholder-gray-500 focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:border-transparent transition-all sm:text-sm font-mono"
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  placeholder="••••••••"
                />
              </div>
              <div className="flex items-start mt-4">
                <div className="flex items-center h-5">
                  <input
                    id="terms"
                    name="terms"
                    type="checkbox"
                    checked={termsAccepted}
                    onChange={(e) => setTermsAccepted(e.target.checked)}
                    className="h-4 w-4 rounded border-white/20 bg-white/5 text-indigo-600 focus:ring-indigo-600 mt-1 cursor-pointer"
                  />
                </div>
                <div className="ml-3 text-sm">
                  <label htmlFor="terms" className="font-light text-gray-400">
                    I agree to the <Link to="/terms" className="font-medium text-indigo-400 hover:text-indigo-300">Terms of Service</Link> and <Link to="/privacy-policy" className="font-medium text-indigo-400 hover:text-indigo-300">Privacy Policy</Link>
                  </label>
                </div>
              </div>
            </div>

            <div>
              <button
                type="submit"
                disabled={loading}
                className="w-full flex justify-center py-3.5 px-4 border border-transparent rounded-xl shadow-lg text-sm font-mono tracking-widest font-bold text-white bg-indigo-600 hover:bg-indigo-500 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500 focus:ring-offset-black disabled:opacity-50 transition-all uppercase hover:scale-[1.02]"
              >
                {loading ? 'Authenticating...' : 'Secure Login'}
              </button>
            </div>
          </form>
        </div>
      </div>
    </div>
  );
}
