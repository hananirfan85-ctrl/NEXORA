import React, { useEffect } from 'react';
import { motion } from 'motion/react';
import { ArrowLeft, CheckCircle, Zap, ShieldCheck, BarChart3, Clock, Rocket } from 'lucide-react';
import { Link, useParams } from 'react-router-dom';

const features = {
  'point-of-sale': {
    title: 'Point of Sale API & Interface',
    subtitle: 'Lightning-fast checkout, built for extreme volume and complete offline reliability.',
    desc: 'The NEXA POS Point of Sale module brings an architectural leap in retail management. We stripped away the bloat of traditional web apps and built a streamlined interface that responds in milliseconds.',
    benefits: ['Sub-second transaction parsing', 'Full offline synchronization', 'Customizable receipt templates', 'Multi-payment tender support', 'Barcode scanner integration'],
    sections: [
      {
        icon: Zap,
        title: "Microsecond Latency",
        content: "Traditional POS systems take 2-3 seconds per scan. NEXA POS processes line items locally using IndexedDB, reducing cart operation latency to under 50 milliseconds. Whether you are scanning one item or one hundred, the interface never skips a beat."
      },
      {
        icon: ShieldCheck,
        title: "Architectural Reliability",
        content: "Built on an offline-first service worker architecture. The POS doesn't just 'tolerate' being offline—it is designed to function exactly the same. No missing styles, no hanging loading spinners."
      },
      {
        icon: BarChart3,
        title: "Dynamic Price Matrices",
        content: "Apply wholesale discounts, bulk pricing rules, and seasonal markdowns without complex configurations. The billing engine calculates tax and multi-tier discounts on the fly."
      },
      {
        icon: Clock,
        title: "End-of-Day Reconciliation",
        content: "Balance your cash drawer with digital accuracy. The system automatically tracks every drop, payout, and tender type, creating an immutable audit log for total peace of mind at the end of a shift."
      }
    ]
  },
  'inventory-matrix': {
    title: 'Inventory Matrix Core',
    subtitle: 'Track every SKU across all locations with surgical precision.',
    desc: 'Deep inventory management that scales with your business. Get real-time alerts for low stock, track supplier performance, and manage complex variants with ease.',
    benefits: ['Real-time stock deduction', 'Expiry date tracking for perishables', 'Purchase order generation', 'Supplier management portal', 'Low stock AI predictions'],
    sections: [
      {
        icon: BarChart3,
        title: "High-Density Tracking",
        content: "Map your physical store exactly as it is. Track inventory by aisle, bin, or warehouse zone. Perform cycle counts without shutting down the store using our mobile-optimized auditor tool."
      },
      {
        icon: ShieldCheck,
        title: "Immutable Stock Ledgers",
        content: "Every single inventory movement—whether a sale, a return, or a manual adjustment—is logged in a permanent ledger. Trace the exact lifecycle of any product to eliminate shrinkage."
      },
      {
        icon: Zap,
        title: "Supplier Automation",
        content: "When stock hits the reorder point, NEXA POS can automatically draft a purchase order to your preferred supplier. Review, approve, and send in three clicks."
      },
      {
        icon: Rocket,
        title: "Variant & Matrix Management",
        content: "Selling shirts in 5 sizes and 6 colors? Managing 30 SKUs used to be a nightmare. Our grid-based variant manager lets you update prices and stock for complex item families in one screen."
      }
    ]
  },
  'real-time-analytics': {
    title: 'Analytical Engine',
    subtitle: 'Actionable insights, generated the moment you sell.',
    desc: 'Stop guessing and start knowing. Our Analytics engine parses every transaction to give you beautifully rendered charts on profit margins, top-selling items, and performance trends.',
    benefits: ['Live profit/loss dashboards', 'Exportable custom reports', 'Sales predictions based on historical data', 'Multi-branch performance roll-up', 'Cash register balance tracking'],
    sections: [
      {
        icon: BarChart3,
        title: "Live Dashboarding",
        content: "Watch your business pulse in real-time. The dashboard refreshes instantly as sales occur at the register. Compare today's performance against yesterday, last week, or last year with a single toggle."
      },
      {
        icon: Rocket,
        title: "Predictive Engines",
        content: "NEXA POS analyzes historical sales velocity to predict when you will run out of a specific item. Stop reacting to zero-stock events and start forecasting your purchasing needs weeks in advance."
      },
      {
        icon: ShieldCheck,
        title: "Employee Performance Metrics",
        content: "See who your top performers are. Track metrics like average basket size, units per transaction, and return rates per employee to optimize your team's training and scheduling."
      },
      {
        icon: Clock,
        title: "Automated Reporting",
        content: "Schedule your critical reports to be generated and emailed directly to your inbox at the end of the day. Stay informed without logging in."
      }
    ]
  },
  'offline-sync': {
    title: 'Offline Sync Protocol',
    subtitle: 'Military-grade data resilience for emerging markets.',
    desc: 'Our proprietary background sync engine stores all transactions in an advanced IndexedDB matrix. Once a connection is restored, data is immediately flushed to the cloud with zero collision.',
    benefits: ['Work indefinitely without internet', 'Conflict-free data resolution', 'Automatic background flushing', 'Cloud backup upon connection', 'Seamless multi-device state handling'],
    sections: [
      {
        icon: Zap,
        title: "Zero UI Blocking",
        content: "When the internet drops, your cashiers won't even notice. The POS interface never freezes waiting for a network timeout. Sales are instantly committed locally and queued."
      },
      {
        icon: ShieldCheck,
        title: "Conflict Resolution",
        content: "What happens if a product is sold offline while its price is updated online? NEXA POS's sync matrix uses timestamp-based conflict resolution to ensure logical data integrity upon reconnection."
      },
      {
        icon: Rocket,
        title: "Multi-Node Flushing",
        content: "If you have 5 registers acting offline, they seamlessly buffer their data. Once online, they utilize a chunked payload delivery system to prevent server overwhelming and ensure every byte is safely stored."
      },
      {
        icon: Clock,
        title: "State Recovery",
        content: "Even if the browser crashes or the device loses power during an offline session, the local database ensures that pending transactions are recovered upon reboot."
      }
    ]
  }
};

export default function FeaturePage() {
  const { featureId } = useParams();
  const feature = features[featureId as keyof typeof features];

  useEffect(() => {
    window.scrollTo(0, 0);
  }, [featureId]);

  if (!feature) {
    return (
      <div className="min-h-screen bg-[#050505] flex flex-col items-center justify-center p-6 text-center text-white">
        <h1 className="text-3xl font-bold mb-4 font-display">Feature not found</h1>
        <Link to="/home" className="text-indigo-500 hover:text-indigo-400 font-mono tracking-widest uppercase">Return to Home</Link>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-[#050505] text-white selection:bg-indigo-500/30 overflow-hidden">
      
      {/* Background Decor */}
      <div className="fixed inset-0 z-0 pointer-events-none overflow-hidden opacity-20">
        <div className="absolute top-0 right-0 w-[500px] h-[500px] bg-indigo-600 rounded-full mix-blend-screen filter blur-[150px] opacity-20" />
        <div className="absolute bottom-0 left-0 w-[600px] h-[600px] bg-blue-600 rounded-full mix-blend-screen filter blur-[150px] opacity-20" />
      </div>

      <div className="relative z-10 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-24 border-x border-white/5 bg-black/20 backdrop-blur-3xl min-h-screen">
        <Link to="/home" className="inline-flex items-center gap-2 text-gray-400 hover:text-white transition-colors mb-16 group">
          <ArrowLeft size={16} className="group-hover:-translate-x-1 transition-transform" />
          <span className="font-mono text-xs tracking-widest uppercase">Back to Platform</span>
        </Link>
        
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6 }}
        >
          <div className="mb-8 inline-block px-4 py-1.5 rounded-full border border-indigo-500/30 bg-indigo-500/10 text-indigo-300 font-mono text-xs tracking-widest uppercase">
            Platform Engine Detail
          </div>
          <h1 className="text-5xl md:text-7xl font-display font-extrabold tracking-tight mb-6 drop-shadow-xl">
            {feature.title}
          </h1>
          <p className="text-xl md:text-2xl font-sans font-light text-gray-400 max-w-3xl mb-16 leading-relaxed">
            {feature.subtitle}
          </p>
          
          {/* Main Hero Overview */}
          <div className="bg-white/5 border border-white/10 rounded-3xl p-8 md:p-12 mb-16 backdrop-blur-xl shadow-2xl">
            <h3 className="text-sm font-mono text-indigo-400 tracking-widest uppercase mb-4">Architecture Brief</h3>
            <p className="text-xl text-gray-200 leading-relaxed font-light mb-12 max-w-4xl">
              {feature.desc}
            </p>
            
            <h3 className="text-sm font-mono text-indigo-400 tracking-widest uppercase mb-6">Execution Pillars</h3>
            <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-6">
              {feature.benefits.map((b, i) => (
                <motion.div 
                  key={i}
                  initial={{ opacity: 0, scale: 0.95 }}
                  animate={{ opacity: 1, scale: 1 }}
                  transition={{ delay: 0.1 * i }}
                  className="bg-black/40 border border-white/5 p-4 rounded-xl flex items-center gap-3"
                >
                  <CheckCircle className="text-indigo-500 shrink-0" size={18} />
                  <span className="text-sm text-gray-300 font-light">{b}</span>
                </motion.div>
              ))}
            </div>
          </div>

          {/* Detailed Massive Sections */}
          <div className="space-y-8">
             {feature.sections.map((section, idx) => {
               const Icon = section.icon;
               return (
                 <motion.div 
                   key={idx}
                   initial={{ opacity: 0, y: 20 }}
                   whileInView={{ opacity: 1, y: 0 }}
                   viewport={{ once: true }}
                   transition={{ duration: 0.5, delay: idx * 0.1 }}
                   className="flex flex-col md:flex-row gap-8 items-start bg-gradient-to-r from-white/5 to-transparent border border-white/10 rounded-3xl p-8 hover:border-indigo-500/30 transition-colors"
                 >
                   <div className="w-16 h-16 rounded-2xl bg-indigo-500/10 border border-indigo-500/20 flex items-center justify-center shrink-0">
                     <Icon className="text-indigo-400" size={28} />
                   </div>
                   <div>
                     <h3 className="text-2xl font-display font-bold text-white mb-4">{section.title}</h3>
                     <p className="text-gray-400 font-sans font-light leading-relaxed text-lg max-w-4xl">
                       {section.content}
                     </p>
                   </div>
                 </motion.div>
               );
             })}
          </div>
          
          {/* Call to action */}
          <div className="mt-32 pb-16 text-center border-t border-white/10 pt-16">
            <h2 className="text-3xl font-display font-bold mb-8">Ready to upgrade your infrastructure?</h2>
            <Link to="/signup" className="inline-flex justify-center items-center gap-3 rounded-full bg-indigo-600 px-8 py-4 text-sm font-mono tracking-widest font-bold text-white shadow-xl shadow-indigo-600/30 hover:bg-indigo-500 hover:scale-[1.02] transition-all uppercase">
              Deploy NEXA POS Platform
              <Rocket size={18} />
            </Link>
          </div>
        </motion.div>
      </div>
    </div>
  );
}
