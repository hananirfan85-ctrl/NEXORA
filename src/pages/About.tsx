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
            About NEXA POS
          </h1>
          <p className="text-xl md:text-2xl font-sans font-light text-gray-400 mb-12 leading-relaxed">
            NEXA POS is a next-generation Point of Sale (POS), CRM, and Inventory Management system designed for speed, simplicity, and extreme scalability. Built with a focus on immersive aesthetics and offline-first capabilities.
          </p>
          
          <div className="w-full h-px border-t border-white/10 mb-12" />

          <div className="mb-16">
            <h2 className="text-3xl font-display font-bold mb-8">The Visionaries Behind It</h2>
            
            <div className="grid md:grid-cols-3 gap-8">
              {/* Hanan Irfan */}
              <div className="bg-white/5 backdrop-blur-xl border border-white/10 rounded-3xl p-8 shadow-2xl flex flex-col justify-between">
                <div>
                  <h3 className="text-3xl font-bold font-display text-transparent bg-clip-text bg-gradient-to-r from-indigo-400 to-cyan-300 mb-4">Hanan Irfan</h3>
                  <p className="text-gray-300 font-light text-base mb-8">
                    Founder & Lead Architect at NEXA POS. Passionate about bringing world-class, enterprise-grade tools to businesses of all sizes through elegant code and intuitive design.
                  </p>
                  
                  <ul className="space-y-4 mb-8">
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
                  </ul>
                </div>
                <div className="flex justify-center mt-auto">
                  <div className="relative w-32 h-32 rounded-full overflow-hidden border-2 border-indigo-500/20 shadow-[0_0_30px_-10px_rgba(99,102,241,0.5)]">
  <img
    src="https://pbs.twimg.com/profile_images/2022622427378020352/xOqGLbdb_400x400.jpg"
    alt="Hanan Irfan"
    className="w-full h-full object-cover"
  />
</div>
                </div>
              </div>

              {/* Ahmad Ali */}
              <div className="bg-white/5 backdrop-blur-xl border border-white/10 rounded-3xl p-8 shadow-2xl flex flex-col justify-between">
                <div>
                  <h3 className="text-3xl font-bold font-display text-transparent bg-clip-text bg-gradient-to-r from-blue-400 to-emerald-300 mb-4">Ahmad Ali</h3>
                  <p className="text-gray-300 font-light text-base mb-8">
                    Co-Founder & Core Developer. Specializing in robust system architecture and ensuring seamless functionality across our expansive feature sets.
                  </p>
                  
                  <ul className="space-y-4 mb-8">
                    <li className="flex items-center gap-4 text-gray-200">
                      <div className="w-10 h-10 rounded-full bg-blue-500/20 flex items-center justify-center border border-blue-500/30">
                        <User size={18} className="text-blue-400" />
                      </div>
                      <div className="font-mono text-sm uppercase tracking-widest">20 Years Old</div>
                    </li>
                    <li className="flex items-center gap-4 text-gray-200">
                      <div className="w-10 h-10 rounded-full bg-blue-500/20 flex items-center justify-center border border-blue-500/30">
                        <GraduationCap size={18} className="text-blue-400" />
                      </div>
                      <div>
                        <div className="font-mono text-sm uppercase tracking-widest">KFUEIT University</div>
                        <div className="text-xs text-gray-400 mt-1">4th Semester, BSCS</div>
                      </div>
                    </li>
                  </ul>
                </div>
                <div className="flex justify-center mt-auto">
                  <div className="relative w-32 h-32 rounded-full overflow-hidden border-2 border-blue-500/20 shadow-[0_0_30px_-10px_rgba(59,130,246,0.5)]">
  <img
    src="https://pbs.twimg.com/media/HHE-qPsaEAAlNNi?format=jpg&name=120x120"
    alt="Profile"
    className="w-full h-full object-cover"
  />
</div>
                </div>
              </div>
              
              {/* Danish Ali */}
              <div className="bg-white/5 backdrop-blur-xl border border-white/10 rounded-3xl p-8 shadow-2xl flex flex-col justify-between">
                <div>
                  <h3 className="text-3xl font-bold font-display text-transparent bg-clip-text bg-gradient-to-r from-teal-400 to-green-300 mb-4">Danish Ali</h3>
                  <p className="text-gray-300 font-light text-base mb-8">
                    Co-Founder. Brings innovative ideas to our operations, ensuring that the software perfectly aligns with our users' real-world needs.
                  </p>
                  
                  <ul className="space-y-4 mb-8">
                    <li className="flex items-center gap-4 text-gray-200">
                      <div className="w-10 h-10 rounded-full bg-teal-500/20 flex items-center justify-center border border-teal-500/30">
                        <User size={18} className="text-teal-400" />
                      </div>
                      <div className="font-mono text-sm uppercase tracking-widest">20 Years Old</div>
                    </li>
                    <li className="flex items-center gap-4 text-gray-200">
                      <div className="w-10 h-10 rounded-full bg-teal-500/20 flex items-center justify-center border border-teal-500/30">
                        <GraduationCap size={18} className="text-teal-400" />
                      </div>
                      <div>
                        <div className="font-mono text-sm uppercase tracking-widest">KFUEIT University</div>
                        <div className="text-xs text-gray-400 mt-1">4th Semester, BSCS</div>
                      </div>
                    </li>
                  </ul>
                </div>
                <div className="flex justify-center mt-auto">
                  <div className="relative w-32 h-32 rounded-full overflow-hidden border-2 border-teal-500/20 shadow-[0_0_30px_-10px_rgba(45,212,191,0.5)]">
  <img
    src="https://pbs.twimg.com/media/HG1xU2sbwAAbik3?format=jpg&name=medium"
    alt="Profile"
    className="w-full h-full object-cover"
  />
</div>
                </div>
              </div>
            </div>
          </div>
          
          <div>
            <h2 className="text-3xl font-display font-bold mb-6">Software Awareness & Philosophy</h2>
            <p className="text-gray-400 font-light mb-8 max-w-3xl leading-relaxed">
              Our main focus is to change how modern businesses operate by delivering advanced tools previously reserved for massive corporations, packaged into an intuitive interface that anybody can learn in minutes.
            </p>
            <div className="grid md:grid-cols-2 gap-8 font-light text-gray-300">
              <div className="bg-white/5 p-6 rounded-2xl border border-white/10">
                <h4 className="text-white font-bold mb-3 tracking-wide">Design First</h4>
                <p>Ugly software slows people down. NEXA POS prioritizes a polished, high-contrast, dark-mode-first aesthetic that reduces eye strain and increases focus during high-volume retail hours.</p>
              </div>
              <div className="bg-white/5 p-6 rounded-2xl border border-white/10">
                <h4 className="text-white font-bold mb-3 tracking-wide">Anywhere, Offline & Online</h4>
                <p>NEXA POS works seamlessly through cutting-edge Electron integration on Desktop, enabling extreme performance. Keep selling offline, and sync to the cloud instantly when back online.</p>
              </div>
              <div className="bg-white/5 p-6 rounded-2xl border border-white/10">
                <h4 className="text-white font-bold mb-3 tracking-wide">Enterprise Feature Set</h4>
                <p>Complete with an intuitive CRM Admin Panel, automated analytics, offline caching mechanisms, and secure Supabase backend to keep your inventory matrix perfectly balanced at all times.</p>
              </div>
              <div className="bg-white/5 p-6 rounded-2xl border border-white/10">
                <h4 className="text-white font-bold mb-3 tracking-wide">Install Anywhere</h4>
                <p>Install via your browser to launch it right from your dock or home screen, offering an instantaneous, app-like experience backed by Service Workers.</p>
              </div>
            </div>
          </div>
        </motion.div>
      </div>
    </div>
  );
}
