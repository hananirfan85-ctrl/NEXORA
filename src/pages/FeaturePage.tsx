import React, { useEffect } from 'react';
import { motion } from 'motion/react';
import { ArrowLeft, CheckCircle, Zap, ShieldCheck, BarChart3, Clock, Rocket } from 'lucide-react';
import { Link, useParams } from 'react-router-dom';

const features = {
  'billing': {
    title: 'Fast & Easy Billing',
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
      },
      {
        icon: Rocket,
        title: "Split Tenders & Credit",
        content: "Allow customers to pay half in cash and half on card effortlessly. Instantly handle advanced payment use-cases without confusing the cashier or requiring manager overrides."
      },
      {
        icon: CheckCircle,
        title: "Seamless Receipt Customization",
        content: "Automatically print thermal receipts with your business logo, custom footers, and dynamically updated QR codes for digital verifications."
      }
    ]
  },
  'inventory': {
    title: 'Real-Time Inventory',
    subtitle: 'Track every SKU across all locations with surgical precision.',
    desc: 'Deep inventory management that scales with your business. Get real-time alerts for low stock, track supplier performance, and manage complex variants with ease.',
    benefits: ['Real-time stock deduction', 'Low stock warnings', 'Category filtering', 'Detailed price management', 'Automated low stock alerts'],
    sections: [
      {
        icon: BarChart3,
        title: "High-Density Tracking",
        content: "Map your physical store exactly as it is. Track inventory by aisle, bin, or warehouse zone. Perform cycle counts without shutting down the store."
      },
      {
        icon: ShieldCheck,
        title: "Immutable Stock Ledgers",
        content: "Every single inventory movement—whether a sale, a return, or a manual adjustment—is logged in a permanent ledger. Trace the exact lifecycle of any product to eliminate shrinkage."
      },
      {
        icon: Zap,
        title: "Fast Categorization",
        content: "Stop scrolling endlessly. Quickly categorize your items by type and instantly filter through your catalog during restocks or inventory audits."
      },
      {
        icon: Rocket,
        title: "Simplified Matrix Updates",
        content: "Quickly manage stock and pricing across your entire retail catalog without navigating through dozens of complex menus."
      },
      {
        icon: Clock,
        title: "Stock Movement Tracking",
        content: "Every inventory adjustment and sale is recorded. Trace the exact lifecycle of any product to eliminate shrinkage and maintain balanced books."
      },
      {
        icon: CheckCircle,
        title: "Barcode Printing & Generation",
        content: "Generate and print custom barcode labels directly from the system. Keep your physical inventory scannable and completely synchronized with the database."
      }
    ]
  },
  'reports': {
    title: 'Advanced Reports',
    subtitle: 'Actionable insights, generated the moment you sell.',
    desc: 'Stop guessing and start knowing. Our Analytics engine parses every transaction to give you beautifully rendered charts on profit margins, gross revenue, and transaction trends.',
    benefits: ['Live profit/loss dashboards', 'Gross revenue charting', 'Profit trend lines', 'Last 30-day analytics', 'Transaction volume tracking'],
    sections: [
      {
        icon: BarChart3,
        title: "Live Dashboarding",
        content: "Watch your business pulse in real-time. The dashboard aggregates gross revenue and net profit instantly as sales occur at the register."
      },
      {
        icon: Rocket,
        title: "Daily Revenue Charting",
        content: "NEXA POS visually graphs your sales over the last 30 days, helping you easily identify which days had the highest gross revenue."
      },
      {
        icon: ShieldCheck,
        title: "Profit Trend Lines",
        content: "A dedicated profit trend line chart clearly delineates your net profit margins over time, letting you trace profitability distinct from sheer volume."
      },
      {
        icon: Clock,
        title: "Data Reliability",
        content: "Your reports are instantly generated directly from your sales ledger. No manual spreadsheet export required to know your monthly standing."
      }
    ]
  },
  'crm': {
    title: 'CRM & Ledgers',
    subtitle: 'Track loyalty and retain your best customers.',
    desc: 'Customer relationships dictate future revenue. Maintain a highly detailed digital ledger for each customer, tracking their loyalty points, total purchases, and contact details entirely securely in the cloud.',
    benefits: ['Detailed Customer Records', 'Contact Info Storage', 'Purchase Volume Tracking', 'Loyalty Points Tracking', 'Quick Identification'],
    sections: [
      {
        icon: ShieldCheck,
        title: "Secure Customer Databases",
        content: "Keep all client information safely stored. Phone numbers, emails, and physical addresses are easily accessible."
      },
      {
        icon: Zap,
        title: "Digital Customer Ledgers",
        content: "Create records for your VIPs. Quickly retrieve customer details to speed up their experience at checkout."
      },
      {
        icon: Rocket,
        title: "Points & Purchase Tracking",
        content: "NEXA POS stores total lifetime purchases and loyalty points so you can easily identify your most valuable customers."
      }
    ]
  },
  'users': {
    title: 'Multi-User Access',
    subtitle: 'Granular permissions securely gating your empire.',
    desc: 'Scale your business by building out your workforce safely. Provide roles and strict permissions to various employees, giving them exactly what they need, and nothing more.',
    benefits: ['Role Based Access Control', 'Admin Override Capabilities', 'Action Activity Logs', 'Pending Approval Tiers', 'Data Security'],
    sections: [
      {
        icon: ShieldCheck,
        title: "Row Level Security (RLS)",
        content: "Postgres RLS is automatically enforced. Users are strictly contained within their assigned data access boundaries."
      },
      {
        icon: Zap,
        title: "Pending Approval Tiers",
        content: "Every new user account created requires strict Super Admin verification. You dictate who joins your digital environment. Prevent unauthorized endpoints permanently."
      },
      {
        icon: Clock,
        title: "Action Activity Logs",
        content: "Important actions like completing sales are logged directly into the system. By tracking precisely who processed which transaction, you ensure accountability."
      }
    ]
  },
  'cashflow': {
    title: 'Cash Flow Insights',
    subtitle: 'Track every income and expense in your business effortlessly.',
    desc: 'With this feature, you can track every income and expense in your business. For example, you can enter each transaction by date—recording when money came in and when money went out. This will allow you to see when your business is in profit and when your cash flow is negative.',
    benefits: ['Detailed Transaction Histories', 'Categorize Income vs Expenses', 'Live Net Balance Display', 'Immutable Historical Records', 'Secure Cloud Summarizations'],
    sections: [
      {
        icon: BarChart3,
        title: 'Net Profit Tracking',
        content: 'Understand your true financial standing at a glance. By inputting operational expenses against your automated POS sales income, you can view your real net balance.'
      },
      {
        icon: Clock,
        title: 'Chronological Logs',
        content: 'Log daily expenses like utility bills and bulk supply purchases. Scroll back through months of chronological data to pinpoint cash flow bottlenecks.'
      },
      {
        icon: ShieldCheck,
        title: 'Data Integrity',
        content: 'Every record is encrypted in the database. Ensure no fraudulent entries are made by leveraging strict user access controls mapped to your cash flow ledger.'
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
