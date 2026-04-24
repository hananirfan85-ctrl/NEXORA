import React from 'react';
import { Link } from 'react-router-dom';
import { ArrowLeft } from 'lucide-react';
import { motion } from 'motion/react';

export default function Terms() {
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
          <h1 className="text-4xl font-display font-bold text-white mb-8">Terms of Service</h1>
          
          <div className="space-y-6 text-sm md:text-base leading-relaxed">
            <section>
              <h2 className="text-2xl font-bold text-white mb-3">1. Acceptance of Terms</h2>
              <p>
                By accessing and using NEXORA, you agree to be bound by these Terms of Service. If you do not agree to these terms, please do not use our software. We reserve the right to update these terms at any time without prior notice.
              </p>
            </section>

            <section>
              <h2 className="text-2xl font-bold text-white mb-3">2. Description of Service</h2>
              <p>
                NEXORA provides a comprehensive Point of Sale (POS) and inventory management system designed to operate both online and offline through Progressive Web App (PWA) technology. The service includes, but is not limited to, inventory tracking, sales processing, customer relationship management, and AI-assisted analytics.
              </p>
            </section>

            <section>
              <h2 className="text-2xl font-bold text-white mb-3">3. User Responsibilities</h2>
              <p>
                You are responsible for maintaining the confidentiality of your account credentials. You agree that any activities occurring under your account are your sole responsibility. NEXORA cannot be held liable for any data loss or misuse resulting from unauthorized access to your devices or account.
              </p>
            </section>

            <section>
              <h2 className="text-2xl font-bold text-white mb-3">4. Offline Functionality and Data Storage</h2>
              <p>
                NEXORA relies on local browser storage for its offline-first capabilities. By using this service, you consent to data being cached locally on your device. It is your responsibility to ensure your device eventually connects to the internet to sync pending transactions with the database. We are not liable for any discrepancies resulting from cleared browser caches before syncing.
              </p>
            </section>

            <section>
              <h2 className="text-2xl font-bold text-white mb-3">5. Limitation of Liability</h2>
              <p>
                NEXORA and its developers shall not be liable for any indirect, incidental, special, or consequential damages resulting from the use or inability to use the service. This includes business interruption, loss of profits, or data corruption.
              </p>
            </section>
          </div>
        </motion.div>
      </div>
    </div>
  );
}
