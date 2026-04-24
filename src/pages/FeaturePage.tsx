import React, { useEffect } from 'react';
import { motion } from 'motion/react';
import { ArrowLeft, CheckCircle } from 'lucide-react';
import { Link, useParams } from 'react-router-dom';

const features = {
  'point-of-sale': {
    title: 'Point of Sale',
    subtitle: 'Lightning-fast checkout, completely offline capable.',
    desc: 'The NEXORA Point of Sale module is built for extreme speed and reliability. Never lose a sale due to internet outages again. Supports barcode scanners, receipt printers, and cash drawers directly from your device.',
    benefits: ['Sub-second transaction parsing', 'Full offline synchronization', 'Customizable receipt templates', 'Multi-payment tender support', 'Barcode scanner integration']
  },
  'inventory-matrix': {
    title: 'Inventory Matrix',
    subtitle: 'Track every SKU across all locations with precision.',
    desc: 'Deep inventory management that scales with your business. Get real-time alerts for low stock, track supplier performance, and manage complex variants with ease.',
    benefits: ['Real-time stock deduction', 'Expiry date tracking for perishables', 'Purchase order generation', 'Supplier management portal', 'Low stock AI predictions']
  },
  'real-time-analytics': {
    title: 'Real-time Analytics',
    subtitle: 'Actionable insights, generated the moment you sell.',
    desc: 'Stop guessing and start knowing. Our Analytics engine parses every transaction to give you beautifully rendered charts on profit margins, top-selling items, and performance trends.',
    benefits: ['Live profit/loss dashboards', 'Exportable custom reports', 'Sales predictions based on historical data', 'Multi-branch performance roll-up', 'Cash register balance tracking']
  },
  'offline-sync': {
    title: 'Offline Sync Technology',
    subtitle: 'Military-grade data resilience for emerging markets.',
    desc: 'Our proprietary background sync engine stores all transactions in an advanced IndexedDB matrix. Once a connection is restored, data is immediately flushed to the cloud with zero collision.',
    benefits: ['Work indefinitely without internet', 'Conflict-free data resolution', 'Automatic background flushing', 'Cloud backup upon connection', 'Seamless multi-device state handling']
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
      <div className="min-h-screen bg-gray-50 flex flex-col items-center justify-center p-6 text-center">
        <h1 className="text-3xl font-bold mb-4">Feature not found</h1>
        <Link to="/home" className="text-indigo-600 hover:text-indigo-800">Return to Home</Link>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-[#050505] text-white selection:bg-indigo-500/30">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-24">
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
            {feature.title}
          </h1>
          <p className="text-xl md:text-2xl font-sans font-light text-gray-400 max-w-3xl mb-12">
            {feature.subtitle}
          </p>
          
          <div className="w-full h-px border-t border-white/10 mb-12" />

          <div className="grid md:grid-cols-2 gap-16">
            <div>
              <h3 className="text-xl font-bold mb-6 tracking-wide">Overview</h3>
              <p className="text-gray-300 leading-relaxed font-light text-lg">
                {feature.desc}
              </p>
            </div>
            
            <div>
              <h3 className="text-xl font-bold mb-6 tracking-wide">Core Benefits</h3>
              <ul className="space-y-4">
                {feature.benefits.map((b, i) => (
                  <motion.li 
                    key={i}
                    initial={{ opacity: 0, x: 20 }}
                    animate={{ opacity: 1, x: 0 }}
                    transition={{ delay: 0.1 * i }}
                    className="flex items-start gap-4"
                  >
                    <CheckCircle className="text-indigo-500 shrink-0 mt-0.5" size={20} />
                    <span className="text-gray-300 font-light">{b}</span>
                  </motion.li>
                ))}
              </ul>
            </div>
          </div>
          
          <div className="mt-24 text-center">
            <Link to="/signup" className="inline-flex justify-center whitespace-nowrap rounded-xl bg-indigo-600 px-8 py-4 text-sm font-mono tracking-widest font-bold text-white shadow-lg shadow-indigo-600/20 hover:bg-indigo-500 hover:scale-[1.02] transition-all uppercase">
              Get Started Now
            </Link>
          </div>
        </motion.div>
      </div>
    </div>
  );
}
