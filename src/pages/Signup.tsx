import React, { useState, useEffect } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { supabase } from '../lib/supabase';
import { motion } from 'motion/react';
import { ArrowLeft } from 'lucide-react';

export default function Signup() {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);
  const [componentError, setComponentError] = useState<string | null>(null);
  const navigate = useNavigate();

  // Catch any rendering errors
  useEffect(() => {
    const errorHandler = (error: ErrorEvent) => {
      console.error('Component Error:', error);
      setComponentError(error.message);
    };
    window.addEventListener('error', errorHandler);
    return () => window.removeEventListener('error', errorHandler);
  }, []);

  const handleSignup = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setError('');

    try {
      console.log('Starting signup process...');
      console.log('Supabase client:', supabase);
      
      const { data, error } = await supabase.auth.signUp({
        email,
        password,
      });

      console.log('Signup response:', { data, error });

      if (error) {
        setError(error.message);
      } else if (data?.user && !data.session) {
        setError('Account created! Please check your email to verify your account before logging in.');
      } else if (data?.user && data?.session) {
        navigate('/');
      } else {
        setError('An unexpected error occurred. Please try again.');
      }
    } catch (err: any) {
      console.error('Signup error:', err);
      setError(err?.message || 'A network error occurred. Check your Supabase configuration.');
    } finally {
      setLoading(false);
    }
  };

  // Show error boundary UI if component crashes
  if (componentError) {
    return (
      <div className="min-h-screen bg-black flex items-center justify-center p-8">
        <div className="bg-red-500/10 border border-red-500/30 p-8 rounded-xl max-w-md">
          <h2 className="text-red-400 text-xl font-bold mb-4">Component Failed to Load</h2>
          <p className="text-gray-300 mb-4">Error: {componentError}</p>
          <button 
            onClick={() => window.location.reload()} 
            className="bg-indigo-600 text-white px-4 py-2 rounded-lg hover:bg-indigo-500"
          >
            Reload Page
          </button>
        </div>
      </div>
    );
  }

  return (
    <div className="relative min-h-screen font-sans selection:bg-indigo-500/30 selection:text-white overflow-hidden flex items-center justify-center py-12 px-4 sm:px-6 lg:px-8">
      
      {/* Refined, Elegant Tech Background */}
      <div className="fixed inset-0 z-0 pointer-events-none overflow-hidden bg-[#030305]">
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

        <div className="absolute inset-0 bg-gradient-to-t from-black via-black/40 to-black/90"></div>
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
              <img src="/logo.png" alt="NEXORA Logo" className="h-12 w-auto object-contain drop-shadow-md" 
                onError={(e) => console.error('Logo failed to load:', e)}
              />
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
                <p className="text-sm font-sans font-light text-red-400 whitespace-pre-line">{error}</p>
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
                <label className="block text-sm font-sans font-medium text-gray-300 mb-2 tracking-wide">Password (min 6 characters)</label>
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
                {loading ? 'Creating Account...' : 'Complete Registration'}
              </button>
            </div>
          </form>
        </div>
      </div>
    </div>
  );
}
