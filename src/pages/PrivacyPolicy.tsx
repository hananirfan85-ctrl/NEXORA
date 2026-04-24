import React from 'react';
import { Link } from 'react-router-dom';
import { ArrowLeft } from 'lucide-react';
import { motion } from 'motion/react';

export default function PrivacyPolicy() {
  return (
    <div className="min-h-screen bg-[#030305] text-gray-300 font-sans selection:bg-indigo-500/30 selection:text-white py-12 px-4 sm:px-6 lg:px-8">
      <div className="max-w-3xl mx-auto">
        <Link to="/home" className="inline-flex items-center gap-2 text-indigo-400 hover:text-indigo-300 font-medium mb-12 transition-colors group">
          <ArrowLeft size={16} className="group-hover:-translate-x-1 transition-transform" />
          Back to Home
        </Link>
        
        <motion.div 
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="bg-white/5 backdrop-blur-xl border border-white/10 rounded-3xl p-8 md:p-12 shadow-2xl"
        >
          <h1 className="text-4xl font-display font-bold text-white mb-8">Privacy Policy</h1>
          
          <div className="space-y-6 text-sm md:text-base leading-relaxed">
            <section>
              <h2 className="text-2xl font-bold text-white mb-3">1. Information We Collect</h2>
              <p>
                We collect information you provide directly, such as your email address when you create an account. Additionally, when you use our POS features, the system stores transactional data, inventory states, and operational metrics.
              </p>
            </section>

            <section>
              <h2 className="text-2xl font-bold text-white mb-3">2. How We Use Your Information</h2>
              <p>
                Your data is used entirely to support the functionality of the NEXORA system. This includes synchronization across devices, executing AI analytics, operating secure login processes, and troubleshooting technical issues. We use this data to improve your inventory control and give you better operational insights.
              </p>
            </section>

            <section>
              <h2 className="text-2xl font-bold text-white mb-3">3. Data Storage and Security</h2>
              <p>
                By nature of being an offline-first PWA, much of your data may be stored in your own device's local storage mechanisms (e.g. IndexedDB, LocalStorage). Remote data is protected using industry-standard encryptions on our Supabase-backed instances. However, you are responsible for the physical and software security of the endpoint devices using NEXORA.
              </p>
            </section>

            <section>
              <h2 className="text-2xl font-bold text-white mb-3">4. Analytics and AI Services</h2>
              <p>
                NEXORA incorporates AI tools to simplify and analyze POS interactions. By using the AI elements of our platform, you acknowledge that certain queries and aggregated data may be processed by trusted third-party Large Language Models (LLMs) used to generate summaries. We do not explicitly sell your customer data to advertisers.
              </p>
            </section>
          </div>
        </motion.div>
      </div>
    </div>
  );
}
