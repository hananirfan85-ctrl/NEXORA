import React, { useState } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { supabase } from '../lib/supabase';
import { motion } from 'motion/react';
import { ArrowLeft } from 'lucide-react';

export default function Signup() {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');
  const [success, setSuccess] = useState(false);
  const [loading, setLoading] = useState(false);
  const navigate = useNavigate();

  const handleSignup = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setError('');

    // --- DEBUGGING HELP ---
    if (email === 'debug@nexora.com') {
       const url = import.meta.env.VITE_SUPABASE_URL || 'MISSING';
       const key = import.meta.env.VITE_SUPABASE_ANON_KEY || 'MISSING';
       setError(`DEBUG MODE:\nURL Length: ${url.length}\nURL Starts With: ${url.substring(0, 10)}...\nKey Length: ${key.length}\Key Starts With: ${key.substring(0, 10)}...`);
       setLoading(false);
       return;
    }
    // -----------------------

    // Pre-flight check for missing Supabase credentials
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
      const { data, error } = await supabase.auth.signUp({
        email,
        password,
      });

      if (error) {
        setError(error.message);
      } else if (data?.user && !data.session) {
        // Supabase requires email verification by default
        setError('Account created! Please check your email to verify your account.');
      } else {
        setSuccess(true);
        setTimeout(() => navigate('/'), 1500); // Navigate to dashboard after short delay
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
      // Ensure loading state resets
      setLoading(false);
    }
  };

  return (
    <div className="relative min-h-screen font-sans selection:bg-indigo-500/30 selection:text-white overflow-hidden flex items-center justify-center py-12 px-4 sm:px-6 lg:px-8">
      
      {/* Refined, Elegant Tech Background */}
      <div className="fixed inset-0 z-0 pointer-events-none overflow-hidden bg-[#030305]">
        {/* Layer 1: Elegant Dark 3D Abstract Image */}
        <motion.img 
          src="https://images.unsplash.com/photo-1618005182384-a83a8bd57fbe?q=80&w=2564&auto=format&fit=crop" 
          alt="Immersive Studio Background" 
          className="absolute inset-0 w-[110%] h-[110%] object-cover opacity-40 mix-blend-lighten -left-[5%] -top-[5%]"
          animate={{ 
            scale: [1, 1.08, 1],
            x: ['-2%', '2%', '-2%'],
            y: ['-2%', '2%', '-2%'],
            rotate: [0, 1, 0]
          }}
          transition={{ duration: 30, repeat: Infinity, ease: "easeInOut" }}
        />

        {/* Layer 2: Architectural / Digital Twin Blueprint Grid Overlay */}
        <motion.div 
          className="absolute inset-0 opacity-20"
          style={{
            backgroundImage: `linear-gradient(rgba(255, 255, 255, 0.15) 1px, transparent 1px), linear-gradient(90deg, rgba(255, 255, 255, 0.15) 1px, transparent 1px)`,
            backgroundSize: '80px 80px',
            backgroundPosition: 'center center'
          }}
          animate={{ backgroundPosition: ['0px 0px', '80px 80px'] }}
          transition={{ duration: 10, repeat: Infinity, ease: "linear" }}
        />

        {/* Layer 4: Vignette for text readability across edges */}
        <div className="absolute inset-0 bg-gradient-to-t from-black via-black/40 to-black/90"></div>
      </div>

      <div className="relative z-10 w-full max-w-md">
        <Link to="/home" className="inline-flex items-center gap-2 text-indigo-400 hover:text-indigo-300 font-medium mb-8 transition-colors group">
          <ArrowLeft size={16} className="group-hover:-translate-x-1 transition-transform" />
          Back to Home
        </Link>
        <div className="bg-black/40 backdrop-blur-xl p-8 rounded-3xl shadow-2xl border border-white/10 relative overflow-hidden">
          <div className="absolute top-0 left-0 w-full h-1 bg-gradient-to-r from-indigo-500 translate-y-0" />
          
          {success ? (
            <div className="text-center py-4">
              <h2 className="text-2xl font-display font-bold text-white mb-4">Registration Successful</h2>
              <p className="text-gray-300 font-sans font-light mb-8">
                Your account is ready.
              </p>
              <Link
                to="/"
                className="inline-flex justify-center whitespace-nowrap rounded-xl bg-indigo-600 px-6 py-3 text-sm font-mono tracking-widest font-bold text-white shadow-lg hover:bg-indigo-500 hover:scale-[1.02] transition-all uppercase"
              >
                Go to Dashboard
              </Link>
            </div>
          ) : (
            <>
              <div>
                <div className="flex justify-center text-indigo-600 mb-6">
                  <img src="/logo.png" alt="NEXORA Logo" className="h-12 w-auto object-contain drop-shadow-md" />
                </div>
                <h2 className="text-center text-3xl font-display font-bold text-white tracking-tight">
                  Register for NEXORA
                </h2>
                <p className="mt-3 text-center text-sm font-sans font-light text-gray-400">
                  Or{' '}
                  <Link to="/login" className="font-medium text-indigo-400 hover:text-indigo-300">
                    sign in to existing account
                  </Link>
                </p>
              </div>
              <form className="mt-8 space-y-6" onSubmit={handleSignup}>
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
                      placeholder="admin@nexora.com"
                    />
                  </div>
                  <div>
                    <label className="block text-sm font-sans font-medium text-gray-300 mb-2 tracking-wide">Password (min 6 chars)</label>
                    <input
                      type="password"
                      required
                      minLength={6}
                      className="appearance-none block w-full px-4 py-3 bg-white/5 border border-white/10 rounded-xl text-white placeholder-gray-500 focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:border-transparent transition-all sm:text-sm font-mono"
                      value={password}
                      onChange={(e) => setPassword(e.target.value)}
                      placeholder="••••••••"
                    />
                  </div>
                </div>

                <div>
                  <button
                    type="submit"
                    disabled={loading}
                    className="w-full flex justify-center py-3.5 px-4 border border-transparent rounded-xl shadow-lg text-sm font-mono tracking-widest font-bold text-white bg-indigo-600 hover:bg-indigo-500 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500 focus:ring-offset-black disabled:opacity-50 transition-all uppercase hover:scale-[1.02]"
                  >
                    {loading ? 'Registering...' : 'Complete Registration'}
                  </button>
                </div>
              </form>
            </>
          )}
        </div>
      </div>
    </div>
  );
}
