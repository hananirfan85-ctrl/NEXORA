import React from 'react';
import { motion } from 'motion/react';
import { ArrowLeft, Check, Zap } from 'lucide-react';
import { Link } from 'react-router-dom';

export default function Pricing() {
  const plans = [
    {
      name: "Starter",
      description: "Perfect for single-location retail setups.",
      price: "500 PKR",
      period: "/month",
      features: [
        "1 POS Terminal",
        "Basic Inventory Matrix",
        "Daily Sales Extracts",
        "Email Support",
        "256-bit Encryption"
      ],
      cta: "Start Free Trial",
      primary: false
    },
    {
      name: "Professional",
      description: "Advanced controls for growing multi-location teams.",
      price: "3000 PKR",
      period: "/month",
      features: [
        "5 POS Terminals",
        "Advanced Matrix & Analytics",
        "Offline Redundancy Sync",
        "Stock Depletion Alerts",
        "Priority 24/7 Support"
      ],
      cta: "Get Started",
      primary: true
    },
    {
      name: "Enterprise",
      description: "Custom architecture for high-volume networks.",
      price: "Custom",
      period: "",
      features: [
        "Unlimited Terminals",
        "Custom API Integrations",
        "Dedicated Account Engineer",
        "White-label Reports",
        "SLA Guarantee (99.99%)"
      ],
      cta: "Contact Sales",
      primary: false
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

      <div className="relative z-10 max-w-7xl mx-auto">
        <Link to="/home" className="inline-flex items-center gap-2 text-indigo-400 hover:text-indigo-300 font-medium mb-12 transition-colors group">
          <ArrowLeft size={16} className="group-hover:-translate-x-1 transition-transform" />
          Return to Launchpad
        </Link>

        <div className="text-center max-w-3xl mx-auto mb-20">
          <motion.div 
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
          >
            <h1 className="text-4xl md:text-6xl font-display font-bold text-white tracking-tight mb-6">Transparent Architecture</h1>
            <p className="text-xl text-gray-400 font-light">
              Choose the tier that matches your operational scale. All plans include 256-bit encryption and our core speed guarantees.
            </p>
          </motion.div>
        </div>

        <div className="grid md:grid-cols-3 gap-8 items-center max-w-6xl mx-auto">
          {plans.map((plan, idx) => (
            <motion.div 
              key={idx}
              initial={{ opacity: 0, y: 30 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: idx * 0.1 + 0.2 }}
              className={`relative rounded-3xl backdrop-blur-xl border ${
                plan.primary 
                  ? 'bg-indigo-600/10 border-indigo-500/50 shadow-[0_0_40px_-10px_rgba(99,102,241,0.3)] md:-translate-y-4' 
                  : 'bg-white/5 border-white/10 hover:bg-white/10'
              } p-8 flex flex-col h-full transition-all`}
            >
              {plan.primary && (
                <div className="absolute top-0 left-1/2 -translate-x-1/2 -translate-y-1/2">
                  <span className="bg-indigo-500 text-white text-xs font-mono font-bold tracking-widest uppercase px-3 py-1 rounded-full shadow-lg flex items-center gap-1.5">
                    <Zap size={14} /> Popular
                  </span>
                </div>
              )}
              
              <div className="mb-8">
                <h3 className="text-2xl font-display font-bold text-white mb-2">{plan.name}</h3>
                <p className="text-gray-400 text-sm font-light min-h-[40px]">{plan.description}</p>
              </div>
              
              <div className="mb-8 flex items-baseline gap-2">
                <span className="text-4xl lg:text-5xl font-mono font-bold text-white tracking-tighter">{plan.price}</span>
                <span className="text-gray-400 font-sans">{plan.period}</span>
              </div>
              
              <ul className="space-y-4 mb-8 flex-1">
                {plan.features.map((feature, fIdx) => (
                  <li key={fIdx} className="flex items-start gap-3 text-gray-300 font-sans font-light">
                    <Check size={18} className="text-indigo-400 shrink-0 mt-0.5" />
                    <span>{feature}</span>
                  </li>
                ))}
              </ul>
              
              <Link 
                to="/login" 
                className={`w-full py-4 px-6 rounded-xl font-mono font-bold tracking-widest uppercase text-sm flex justify-center transition-all ${
                  plan.primary 
                    ? 'bg-indigo-600 text-white hover:bg-indigo-500 hover:shadow-lg' 
                    : 'bg-white/10 text-white hover:bg-white/20'
                }`}
              >
                {plan.cta}
              </Link>
            </motion.div>
          ))}
        </div>
      </div>
    </div>
  );
}
