import React from 'react';
import { motion } from 'motion/react';
import { ArrowLeft, User, GraduationCap, Code } from 'lucide-react';
import { Link } from 'react-router-dom';

export default function About() {
  return (
    <div className="min-h-screen bg-[#030305] text-white selection:bg-indigo-500/30">
      <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-24">
        <Link to="/home" className="inline-flex items-center gap-2 text-gray-400 hover:text-white transition-colors mb-12">
          <ArrowLeft size={20} />
          <span className="font-mono text-sm tracking-widest uppercase">Back to Platform</span>
        </Link>
        
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6 }}
        >
          <h1 className="text-5xl md:text-7xl font-display font-bold tracking-tight mb-6">
            About NEXORA
          </h1>
          <p className="text-xl md:text-2xl font-sans font-light text-gray-400 mb-12 leading-relaxed">
            NEXORA is a next-generation Point of Sale (POS), CRM, and Inventory Management system designed for speed, simplicity, and extreme scalability. Built with a focus on immersive aesthetics and offline-first capabilities.
          </p>
          
          <div className="w-full h-px border-t border-white/10 mb-12" />

          <div className="mb-16">
            <h2 className="text-3xl font-display font-bold mb-8">The Visionary Behind It</h2>
            
            <div className="bg-white/5 backdrop-blur-xl border border-white/10 rounded-3xl p-8 md:p-12 shadow-2xl">
              <div className="grid md:grid-cols-2 gap-12 items-center">
                <div>
                  <h3 className="text-4xl font-bold font-display text-transparent bg-clip-text bg-gradient-to-r from-indigo-400 to-cyan-300 mb-4">Hanan Irfan</h3>
                  <p className="text-gray-300 font-light text-lg mb-8">
                    Founder & Lead Architect at NEXORA. Passionate about bringing world-class, enterprise-grade tools to businesses of all sizes through elegant code and intuitive design.
                  </p>
                  
                  <ul className="space-y-4">
                    <li className="flex items-center gap-4 text-gray-200">
                      <div className="w-10 h-10 rounded-full bg-indigo-500/20 flex items-center justify-center border border-indigo-500/30">
                        <User size={18} className="text-indigo-400" />
                      </div>
                      <div className="font-mono text-sm uppercase tracking-widest">18 Years Old</div>
                    </li>
                    <li className="flex items-center gap-4 text-gray-200">
                      <div className="w-10 h-10 rounded-full bg-indigo-500/20 flex items-center justify-center border border-indigo-500/30">
                        <GraduationCap size={18} className="text-indigo-400" />
                      </div>
                      <div>
                        <div className="font-mono text-sm uppercase tracking-widest">KFUEIT University</div>
                        <div className="text-xs text-gray-400 mt-1">4th Semester, BSCS</div>
                      </div>
                    </li>
                    <li className="flex items-center gap-4 text-gray-200">
                      <div className="w-10 h-10 rounded-full bg-indigo-500/20 flex items-center justify-center border border-indigo-500/30">
                        <Code size={18} className="text-indigo-400" />
                      </div>
                      <div className="font-mono text-sm uppercase tracking-widest">Full-Stack Innovator</div>
                    </li>
                  </ul>
                </div>
                
                <div className="flex justify-center">
                   <div className="relative w-64 h-64 md:w-80 md:h-80 rounded-full overflow-hidden border-4 border-indigo-500/20 shadow-[0_0_60px_-15px_rgba(99,102,241,0.5)]">
                     {/* Placeholder shape since no real headshot image given */}
                     <div className="absolute inset-0 bg-gradient-to-br from-indigo-600 to-purple-800 flex items-center justify-center">
                        <span className="text-8xl font-display font-bold text-white/50">HI</span>
                     </div>
                   </div>
                </div>
              </div>
            </div>
          </div>
          
          <div>
            <h2 className="text-3xl font-display font-bold mb-6">Core Philosophy</h2>
            <div className="grid md:grid-cols-2 gap-8 font-light text-gray-300">
              <div className="bg-white/5 p-6 rounded-2xl border border-white/10">
                <h4 className="text-white font-bold mb-3 tracking-wide">Design First</h4>
                <p>Ugly software slows people down. NEXORA prioritizes a polished, high-contrast, dark-mode-first aesthetic that reduces eye strain and increases focus during high-volume retail hours.</p>
              </div>
              <div className="bg-white/5 p-6 rounded-2xl border border-white/10">
                <h4 className="text-white font-bold mb-3 tracking-wide">Always Online</h4>
                <p>NEXORA uses cutting-edge service workers and background sync. When your internet goes down, you keep selling. Once you're back online, everything syncs flawlessly.</p>
              </div>
            </div>
          </div>
        </motion.div>
      </div>
    </div>
  );
}
