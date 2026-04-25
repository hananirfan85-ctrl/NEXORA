import React from 'react';
import { motion } from 'motion/react';
import { ArrowLeft, BookOpen, Terminal, Shield, Zap } from 'lucide-react';
import { Link } from 'react-router-dom';

export default function Documentation() {
  const sections = [
    {
      title: "Quick Start",
      icon: <Zap className="w-6 h-6 text-indigo-400" />,
      content: "NEXA POS is designed as an immersive Point of Sale and Inventory Management tool. To begin, register for an account. By default, new accounts are held in a pending state until an owner or Super Admin approves access from the internal settings panel."
    },
    {
      title: "Inventory Matrix",
      icon: <BookOpen className="w-6 h-6 text-indigo-400" />,
      content: "The Inventory Matrix provides real-time stock levels. Each terminal automatically syncs its local cache with the primary Supabase database. You can track high-volume items, set low-stock thresholds, and instantly update pricing globally."
    },
    {
      title: "Point of Sale (POS)",
      icon: <Terminal className="w-6 h-6 text-indigo-400" />,
      content: "The POS interface is built for speed. It features sub-50ms latency for scanning or selecting items. Transactions are securely hashed and logged immutably. If the network drops, the POS enters 'Offline Mode' and queues transactions for sync upon reconnection."
    },
    {
      title: "Admin & Security",
      icon: <Shield className="w-6 h-6 text-indigo-400" />,
      content: "Only verified administrators can access the Master Dashboard, approve new employee accounts, or view global metrics. NEXA POS utilizes 256-bit encryption for all network traffic and leverages strict RLS (Row Level Security) policies."
    }
  ];

  return (
    <div className="relative min-h-screen bg-[#030305] font-sans selection:bg-indigo-500/30 selection:text-white py-16 px-4 sm:px-6 lg:px-8">
      {/* Background Layer */}
      <div className="fixed inset-0 z-0 pointer-events-none opacity-20"
        style={{
          backgroundImage: `linear-gradient(rgba(255, 255, 255, 0.1) 1px, transparent 1px), linear-gradient(90deg, rgba(255, 255, 255, 0.1) 1px, transparent 1px)`,
          backgroundSize: '80px 80px',
          backgroundPosition: 'center center'
        }}
      />
      <div className="fixed top-0 left-1/2 -translate-x-1/2 w-[800px] h-[400px] bg-indigo-600/20 blur-[120px] rounded-full pointer-events-none" />

      <div className="relative z-10 max-w-4xl mx-auto">
        <Link to="/home" className="inline-flex items-center gap-2 text-indigo-400 hover:text-indigo-300 font-medium mb-12 transition-colors group">
          <ArrowLeft size={16} className="group-hover:-translate-x-1 transition-transform" />
          Return to Launchpad
        </Link>

        <motion.div 
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="mb-16"
        >
          <h1 className="text-4xl md:text-5xl font-display font-bold text-white tracking-tight mb-4">Platform Documentation</h1>
          <p className="text-xl text-gray-400 font-light max-w-2xl">
            Everything you need to deploy, manage, and scale the NEXA POS immersive management system.
          </p>
        </motion.div>

        <div className="grid gap-8">
          {sections.map((section, idx) => (
            <motion.div 
              key={idx}
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: idx * 0.1 }}
              className="bg-white/5 border border-white/10 rounded-2xl p-8 backdrop-blur-xl hover:bg-white/[0.07] transition-colors"
            >
              <div className="flex items-center gap-4 mb-4">
                <div className="p-3 bg-indigo-500/10 rounded-xl border border-indigo-500/20">
                  {section.icon}
                </div>
                <h3 className="text-2xl font-display font-bold text-white">{section.title}</h3>
              </div>
              <p className="text-gray-300 leading-relaxed font-light ml-16">
                {section.content}
              </p>
            </motion.div>
          ))}
        </div>
      </div>
    </div>
  );
}
