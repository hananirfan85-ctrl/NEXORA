import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { Link } from 'react-router-dom';
import { ArrowRight, BarChart3, Package, ShoppingCart, Zap, ShieldCheck, Twitter, Linkedin, Instagram, Mail, Phone, MapPin, Download, X } from 'lucide-react';

export default function Landing() {
  const [deferredPrompt, setDeferredPrompt] = useState<any>(null);
  const [showInstallModal, setShowInstallModal] = useState(false);

  useEffect(() => {
    const handleBeforeInstallPrompt = (e: any) => {
      e.preventDefault();
      setDeferredPrompt(e);
    };
    window.addEventListener('beforeinstallprompt', handleBeforeInstallPrompt);
    return () => window.removeEventListener('beforeinstallprompt', handleBeforeInstallPrompt);
  }, []);

  const handleDownloadClick = async () => {
    if (deferredPrompt) {
      deferredPrompt.prompt();
      const { outcome } = await deferredPrompt.userChoice;
      if (outcome === 'accepted') {
        setDeferredPrompt(null);
      }
    } else {
      setShowInstallModal(true);
    }
  };

  const containerVariants = {
    hidden: { opacity: 0 },
    visible: { 
      opacity: 1,
      transition: { staggerChildren: 0.1, delayChildren: 0.2 }
    }
  };

  const itemVariants = {
    hidden: { opacity: 0, y: 20 },
    visible: { opacity: 1, y: 0 }
  };

  return (
    <div className="relative min-h-screen font-sans selection:bg-indigo-500/30 selection:text-white overflow-hidden">
      
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
          transition={{ 
            duration: 30, 
            repeat: Infinity, 
            ease: "easeInOut" 
          }}
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

      {/* Main Content (Must be positioned above the video z-10) */}
      <div className="relative z-10">
        
        {/* Navigation - Glassmorphic */}
        <motion.nav 
          initial={{ y: -100, opacity: 0 }}
          animate={{ y: 0, opacity: 1 }}
          transition={{ duration: 0.8, ease: "easeOut", delay: 0.2 }}
          className="fixed top-0 w-full bg-black/20 backdrop-blur-md border-b border-white/10 z-50 transition-all"
        >
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
            <div className="flex justify-between h-20 items-center">
              <div className="flex items-center gap-3 text-white font-display font-bold text-2xl tracking-widest uppercase">
                <img src="/logo.png" alt="NEXORA" className="h-9 w-auto object-contain drop-shadow-md" onError={(e) => {
                  (e.target as HTMLImageElement).src = 'data:image/svg+xml;base64,PHN2ZyB4bWxucz0iaHR0cDovL3d3dy53My5vcmcvMjAwMC9zdmciIHZpZXdCb3g9IjAgMCAyNCAyNCIgZmlsbD0ibm9uZSIgc3Ryb2tlPSIjNGY0NmU1IiBzdHJva2Utd2lkdGg9IjIiIHN0cm9rZS1saW5lY2FwPSJyb3VuZCIgc3Ryb2tlLWxpbmVqb2luPSJyb3VuZCI+PGNpcmNsZSBjeD0iOCIgY3k9IjIxIiByPSIxIi8+PGNpcmNsZSBjeD0iMTkiIGN5PSIyMSIgcj0iMSIvPjxwYXRoIGQ9Ik0yLjA1IDIuMDVoMmwzLjQzIDYuNThMMTAgMTRoOWwtLjI0LS43Ii8+PHBhdGggZD0iTTkgMTRoLjUiLz48cGF0aCBkPSJNOSAxNGwtLjI0LS43bC0zLjQzLTYuNTgiLz48L3N2Zz4=';
                }} />
                <span className="drop-shadow-md">NEXORA</span>
              </div>
              <div className="flex items-center gap-6">
                <button 
                  onClick={handleDownloadClick}
                  className="hidden sm:flex items-center gap-2 px-4 py-2 bg-indigo-600 hover:bg-indigo-500 border border-indigo-500/50 rounded-lg text-sm font-sans font-medium text-white transition-all shadow-lg shadow-indigo-600/30"
                >
                  <Download size={16} />
                  Install App
                </button>
                <Link to="/about" className="text-sm font-sans font-medium text-gray-200 hover:text-white transition-colors drop-shadow-sm">About</Link>
                <Link to="/pricing" className="text-sm font-sans font-medium text-gray-200 hover:text-white transition-colors drop-shadow-sm">Pricing</Link>
                <Link to="/login" className="text-sm font-sans font-medium text-gray-200 hover:text-white transition-colors drop-shadow-sm">Sign in</Link>
              </div>
            </div>
          </div>
        </motion.nav>

        {/* Hero Section */}
        <section className="pt-40 pb-20 px-4 sm:px-6 lg:px-8 max-w-7xl mx-auto min-h-screen flex items-center justify-center">
          <div className="text-center max-w-4xl mx-auto">
            <motion.div 
              variants={containerVariants}
              initial="hidden"
              animate="visible"
            >
              <motion.span variants={itemVariants} className="inline-block py-2 px-5 rounded-full bg-white/10 backdrop-blur-md text-indigo-200 text-xs font-mono font-bold tracking-widest uppercase mb-8 border border-white/20 shadow-lg">
                The Immersive Management Experience
              </motion.span>
              <motion.h1 variants={itemVariants} className="text-5xl md:text-7xl font-display font-extrabold text-white tracking-tight leading-tight mb-8 drop-shadow-2xl">
                Manage. Track. <span className="text-transparent bg-clip-text bg-gradient-to-r from-indigo-400 to-cyan-300 drop-shadow-lg">Grow.</span>
              </motion.h1>
              <motion.p variants={itemVariants} className="text-xl md:text-2xl font-sans text-gray-200 mb-12 leading-relaxed font-light drop-shadow-md max-w-3xl mx-auto">
                Step into the future. Nexora is the ultimate intelligent POS and inventory management ecosystem designed for speed, clarity, and total control.
              </motion.p>
              <motion.div variants={itemVariants} className="flex flex-col sm:flex-row items-center justify-center gap-6">
                <Link to="/login" className="w-full sm:w-auto flex items-center justify-center gap-3 bg-indigo-600 text-white px-8 py-4 rounded-full font-mono font-bold hover:bg-indigo-500 hover:scale-[1.02] hover:shadow-[0_0_40px_-10px_rgba(99,102,241,0.8)] transition-all shadow-xl active:scale-95 text-sm tracking-widest uppercase">
                  Get Started
                  <ArrowRight size={20} />
                </Link>
              </motion.div>
            </motion.div>
          </div>
        </section>

        {/* Features Grid - Glassmorphic */}
        <section className="py-24 px-4 sm:px-6 lg:px-8 relative z-10 border-t border-white/10 bg-black/30 backdrop-blur-sm">
          <div className="max-w-7xl mx-auto">
            <motion.div 
              initial={{ opacity: 0, y: 30 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true, margin: "-100px" }}
              transition={{ duration: 0.8 }}
              className="text-center mb-20"
            >
              <h2 className="text-4xl md:text-5xl font-display font-bold text-white mb-6 drop-shadow-lg tracking-tight">Next-Generation Tools</h2>
              <p className="text-xl font-sans text-gray-300 max-w-2xl mx-auto font-light leading-relaxed">Built for the modern edge. Uncompromising performance paired with an unmatched aesthetic.</p>
            </motion.div>

            <motion.div 
              variants={containerVariants}
              initial="hidden"
              whileInView="visible"
              viewport={{ once: true, margin: "-100px" }}
              className="grid md:grid-cols-2 lg:grid-cols-3 gap-8"
            >
              {[
                { icon: ShoppingCart, title: 'Lightning Fast POS', desc: 'Process sales instantly with a beautifully optimized checkout interface.' },
                { icon: Package, title: 'Inventory Matrix', desc: 'Real-time stock levels and automated low-inventory alerts powered by data.' },
                { icon: BarChart3, title: 'Deep Analytics', desc: 'Interactive dashboards tracking daily profits and detailed financial breakdowns.' },
                { icon: Zap, title: 'Offline Resilience', desc: 'Keep selling even when your internet drops out. Data syncs automatically.' },
                { icon: ShieldCheck, title: 'High-Fidelity Security', desc: 'Your business data is safely stored on reliable cloud infrastructure.' }
              ].map((feature, i) => (
                <motion.div key={i} variants={itemVariants} className="p-8 rounded-3xl bg-white/5 backdrop-blur-xl border border-white/10 hover:bg-white/10 hover:border-white/20 transition-all duration-300 hover:-translate-y-2 group shadow-2xl">
                  <div className="w-14 h-14 bg-indigo-500/20 text-indigo-300 rounded-2xl flex items-center justify-center mb-6 group-hover:scale-110 group-hover:bg-indigo-500/30 transition-transform duration-300 border border-indigo-500/20">
                    <feature.icon size={28} />
                  </div>
                  <h3 className="text-2xl font-display font-bold text-white mb-3 tracking-wide">{feature.title}</h3>
                  <p className="text-gray-300 font-sans font-light leading-relaxed">{feature.desc}</p>
                </motion.div>
              ))}
            </motion.div>
          </div>
        </section>
        
        {/* Analytics / Metrics Section - Glassmorphic */}
        <section className="py-24 px-4 sm:px-6 lg:px-8 relative z-10 bg-black/40 backdrop-blur-md border-t border-white/5">
          <div className="max-w-7xl mx-auto">
            <div className="grid md:grid-cols-2 gap-16 items-center">
              <motion.div 
                initial={{ opacity: 0, x: -50 }}
                whileInView={{ opacity: 1, x: 0 }}
                viewport={{ once: true, margin: "-100px" }}
                transition={{ duration: 0.8 }}
              >
                <h2 className="text-4xl md:text-5xl font-display font-bold text-white mb-6 drop-shadow-lg tracking-tight">Data-Driven Intelligence</h2>
                <p className="text-xl font-sans text-gray-300 mb-8 font-light leading-relaxed">
                  Decisions shouldn't be guesswork. Nexora aggregates every interaction, sale, and restock across your enterprise directly into actionable insights.
                </p>
                <ul className="space-y-6">
                  {['Real-time sync across all terminals', 'Predictive inventory depletion alerts', 'Multi-location role-based access control'].map((item, idx) => (
                    <li key={idx} className="flex items-start gap-4 text-gray-200">
                      <div className="mt-1 bg-indigo-500/20 p-1.5 rounded-full border border-indigo-500/30">
                        <ArrowRight size={16} className="text-indigo-400" />
                      </div>
                      <span className="font-sans font-light text-lg">{item}</span>
                    </li>
                  ))}
                </ul>
              </motion.div>

              <motion.div 
                initial={{ opacity: 0, x: 50 }}
                whileInView={{ opacity: 1, x: 0 }}
                viewport={{ once: true, margin: "-100px" }}
                transition={{ duration: 0.8, delay: 0.2 }}
                className="grid grid-cols-2 gap-6"
              >
                <div className="bg-white/5 backdrop-blur-sm border border-white/10 p-8 rounded-3xl flex flex-col justify-center items-center text-center">
                  <div className="font-mono text-5xl font-bold text-white mb-2 tracking-tighter">99.9%</div>
                  <div className="text-sm font-sans text-indigo-300 font-semibold uppercase tracking-widest">Uptime</div>
                </div>
                <div className="bg-white/5 backdrop-blur-sm border border-white/10 p-8 rounded-3xl flex flex-col justify-center items-center text-center mt-12">
                  <div className="font-mono text-5xl font-bold text-white mb-2 tracking-tighter">&lt;50ms</div>
                  <div className="text-sm font-sans text-indigo-300 font-semibold uppercase tracking-widest">Latency</div>
                </div>
                <div className="bg-white/5 backdrop-blur-sm border border-white/10 p-8 rounded-3xl flex flex-col justify-center items-center text-center">
                  <div className="font-mono text-5xl font-bold text-white mb-2 tracking-tighter">256-bit</div>
                  <div className="text-sm font-sans text-indigo-300 font-semibold uppercase tracking-widest">Encryption</div>
                </div>
                <div className="bg-white/5 backdrop-blur-sm border border-white/10 p-8 rounded-3xl flex flex-col justify-center items-center text-center mt-12">
                  <div className="font-mono text-5xl font-bold text-white mb-2 tracking-tighter">24/7</div>
                  <div className="text-sm font-sans text-indigo-300 font-semibold uppercase tracking-widest">Support</div>
                </div>
              </motion.div>
            </div>
          </div>
        </section>

        {/* Footer */}
        <motion.footer 
          initial={{ opacity: 0, y: 50 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true, margin: "-50px" }}
          transition={{ duration: 0.8, ease: "easeOut" }}
          className="bg-black/80 text-gray-300 py-16 px-4 border-t border-white/10 backdrop-blur-xl relative z-10"
        >
          <div className="max-w-7xl mx-auto grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-12 lg:gap-8 mb-12">
            
            {/* Brand Column */}
            <div className="lg:col-span-2">
              <div className="flex items-center gap-3 font-display font-bold text-2xl mb-6 text-white tracking-widest uppercase">
                <img src="/logo.png" alt="NEXORA" className="h-8 w-auto object-contain drop-shadow-md" />
                <span className="drop-shadow-md">NEXORA</span>
              </div>
              <p className="text-gray-400 font-sans font-light leading-relaxed mb-8 max-w-sm">
                Nexora is the premier immersive management studio, crafting high-performance, real-time POS and inventory solutions that redefine retail architecture.
              </p>
              <div className="flex items-center gap-4">
                <a href="#" className="w-10 h-10 rounded-full bg-white/5 border border-white/10 flex items-center justify-center hover:bg-indigo-600 hover:border-indigo-500 hover:text-white transition-all">
                  <Twitter size={18} />
                </a>
                <a href="#" className="w-10 h-10 rounded-full bg-white/5 border border-white/10 flex items-center justify-center hover:bg-indigo-600 hover:border-indigo-500 hover:text-white transition-all">
                  <Linkedin size={18} />
                </a>
                <a href="#" className="w-10 h-10 rounded-full bg-white/5 border border-white/10 flex items-center justify-center hover:bg-indigo-600 hover:border-indigo-500 hover:text-white transition-all">
                  <Instagram size={18} />
                </a>
              </div>
            </div>

            <div>
              <h4 className="text-indigo-400 font-mono text-xs tracking-widest uppercase font-bold mb-6">Company</h4>
              <ul className="space-y-4 font-sans font-light text-sm">
                <li><Link to="/about" className="hover:text-indigo-400 transition-colors">About Nexora</Link></li>
                <li><Link to="/docs" className="hover:text-indigo-400 transition-colors">Documentation</Link></li>
              </ul>
            </div>
            
            {/* Platform Links */}
            <div>
              <h4 className="text-indigo-400 font-mono text-xs tracking-widest uppercase font-bold mb-6">Platform</h4>
              <ul className="space-y-4 font-sans font-light text-sm">
                <li><Link to="/docs" className="hover:text-indigo-400 transition-colors">Documentation</Link></li>
                <li><Link to="/features/point-of-sale" className="hover:text-indigo-400 transition-colors">Point of Sale</Link></li>
                <li><Link to="/features/inventory-matrix" className="hover:text-indigo-400 transition-colors">Inventory Matrix</Link></li>
                <li><Link to="/features/real-time-analytics" className="hover:text-indigo-400 transition-colors">Real-time Analytics</Link></li>
                <li><Link to="/features/offline-sync" className="hover:text-indigo-400 transition-colors">Offline Sync</Link></li>
                <li><Link to="/login" className="hover:text-indigo-400 transition-colors">Admin Portal</Link></li>
              </ul>
            </div>

            {/* Contact */}
            <div>
              <h4 className="text-indigo-400 font-mono text-xs tracking-widest uppercase font-bold mb-6">Contact</h4>
              <ul className="space-y-4 font-sans font-light text-sm">
                <li className="flex items-start gap-3">
                  <MapPin size={16} className="shrink-0 mt-0.5 text-indigo-400" />
                  <span>South Seas Centre, Tower 2, 75 Mody Road, Tsim Sha Tsui East, HK</span>
                </li>
                <li className="flex items-center gap-3">
                  <Mail size={16} className="shrink-0 text-indigo-400" />
                  <a href="mailto:hananirfan85@gmail.com" className="hover:text-indigo-400 transition-colors">hananirfan85@gmail.com</a>
                </li>
                <li className="flex items-center gap-3">
                  <Phone size={16} className="shrink-0 text-indigo-400" />
                  <a href="tel:+85212345678" className="hover:text-indigo-400 transition-colors">+852 1234 5678</a>
                </li>
              </ul>
            </div>
          </div>
          
          <div className="max-w-7xl mx-auto border-t border-white/10 pt-8 flex flex-col md:flex-row items-center justify-between gap-4 text-xs font-sans font-light text-gray-500">
            <p>© {new Date().getFullYear()} Nexora Global Design Studio. All rights reserved.</p>
            <div className="flex gap-6">
              <Link to="/privacy-policy" className="hover:text-white transition-colors">Privacy Policy</Link>
              <Link to="/terms" className="hover:text-white transition-colors">Terms of Service</Link>
              <a href="#" className="hover:text-white transition-colors">Cookie Settings</a>
            </div>
          </div>
        </motion.footer>
      </div>

      {/* Manual Install Modal */}
      <AnimatePresence>
        {showInstallModal && (
          <div className="fixed inset-0 z-[100] flex items-center justify-center p-4 bg-black/60 backdrop-blur-sm">
            <motion.div
              initial={{ opacity: 0, scale: 0.95, y: 20 }}
              animate={{ opacity: 1, scale: 1, y: 0 }}
              exit={{ opacity: 0, scale: 0.95, y: 20 }}
              className="bg-[#111111] border border-white/10 rounded-2xl shadow-2xl w-full max-w-lg overflow-hidden flex flex-col"
            >
              <div className="p-6 border-b border-white/10 flex items-center justify-between shrink-0">
                <h3 className="text-xl font-bold text-white">Install NEXORA App</h3>
                <button 
                  onClick={() => setShowInstallModal(false)}
                  className="p-2 text-gray-400 hover:text-white rounded-full transition-colors"
                >
                  <X size={20} />
                </button>
              </div>
              
              <div className="p-6 text-sm text-gray-400 space-y-4">
                <p>NEXORA is a Progressive Web App (PWA). You can install it directly to your device for offline use without going through an app store.</p>
                <div className="bg-white/5 p-4 rounded-lg">
                  <strong className="text-white block mb-2">On iOS (Safari):</strong>
                  <ol className="list-decimal pl-5 space-y-1">
                    <li>Tap the <strong>Share</strong> button at the bottom of the screen.</li>
                    <li>Scroll down and tap <strong>Add to Home Screen</strong>.</li>
                  </ol>
                </div>
                <div className="bg-white/5 p-4 rounded-lg">
                  <strong className="text-white block mb-2">On Desktop (Chrome/Edge):</strong>
                  <ol className="list-decimal pl-5 space-y-1">
                    <li>Click the <strong>Install</strong> icon on the right side of the URL/address bar.</li>
                    <li>Or click the 3-dots menu and select <strong>Install NEXORA</strong>.</li>
                  </ol>
                </div>
              </div>

              <div className="p-6 bg-black/40 border-t border-white/5 flex gap-3 shrink-0">
                <button
                  onClick={() => setShowInstallModal(false)}
                  className="w-full px-4 py-3 text-sm font-medium text-white bg-indigo-600 rounded-xl hover:bg-indigo-500 transition-colors shadow-lg shadow-indigo-500/20"
                >
                  Got it
                </button>
              </div>
            </motion.div>
          </div>
        )}
      </AnimatePresence>
    </div>
  );
}
