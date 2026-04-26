import React, { useState } from 'react';
import { motion } from 'framer-motion';
import { Check, Download as DownloadIcon, Monitor, Settings, HelpCircle } from 'lucide-react';
import { Link } from 'react-router-dom';

const Download: React.FC = () => {
  const [acceptedTerms, setAcceptedTerms] = useState(false);

  const handleDownload = (e: React.MouseEvent<HTMLAnchorElement>) => {
    if (!acceptedTerms) {
      e.preventDefault();
      alert('Please accept the Terms and Agreements to download.');
      return;
    }
  };

  return (
    <div className="min-h-screen bg-gray-50 flex flex-col">
      <div className="flex-1 max-w-6xl w-full mx-auto p-4 sm:p-6 lg:p-8 mt-10">
        
        {/* Hero Section */}
        <div className="text-center mb-16">
          <motion.div 
            initial={{ opacity: 0, y: -20 }}
            animate={{ opacity: 1, y: 0 }}
            className="inline-flex items-center justify-center p-4 bg-indigo-100 rounded-full mb-6"
          >
            <Monitor size={48} className="text-indigo-600" />
          </motion.div>
          <h1 className="text-4xl md:text-5xl font-extrabold text-gray-900 mb-6 tracking-tight">
            Download NEXA POS for Desktop
          </h1>
          <p className="text-xl text-gray-600 max-w-2xl mx-auto mb-10 leading-relaxed">
            Get the high-performance, offline-first desktop application for your point of sale operations. Engineered for speed and reliability.
          </p>

          <div className="max-w-md mx-auto bg-white p-6 rounded-2xl shadow-xl border border-gray-100">
            <div className="flex items-start text-left gap-3 mb-6 p-4 bg-indigo-50/50 rounded-lg border border-indigo-100">
              <input 
                type="checkbox" 
                id="terms" 
                checked={acceptedTerms}
                onChange={(e) => setAcceptedTerms(e.target.checked)}
                className="mt-1 shrink-0 w-5 h-5 text-indigo-600 border-gray-300 rounded focus:ring-indigo-500 cursor-pointer"
              />
              <label htmlFor="terms" className="text-sm text-gray-700 select-none cursor-pointer">
                I have read and accept the <Link to="/terms" className="text-indigo-600 font-medium hover:underline">Terms and Agreements</Link> and acknowledge that this software is provided for authorized point of sale operations.
              </label>
            </div>

            <a 
              href="/NexaPOS-Setup.exe" 
              download
              onClick={handleDownload}
              className={`inline-flex w-full justify-center items-center gap-2 px-6 py-4 font-bold text-lg rounded-xl transition-all shadow-lg ${
                acceptedTerms 
                  ? 'bg-indigo-600 hover:bg-indigo-700 text-white shadow-indigo-600/30 transform hover:-translate-y-1' 
                  : 'bg-gray-200 text-gray-500 cursor-not-allowed shadow-none'
              }`}
            >
              <DownloadIcon size={24} />
              Download Installer (.exe)
            </a>
            <p className="text-xs text-gray-500 mt-4 font-medium">Windows 10/11 • 64-bit • Version 2.4.0</p>
          </div>
        </div>

        {/* Instructions Container */}
        <div className="grid md:grid-cols-2 gap-8 mb-20">
          
          <div className="bg-white p-8 rounded-2xl shadow-sm border border-gray-100 h-full">
            <div className="flex items-center gap-4 mb-6">
              <div className="w-12 h-12 bg-blue-100 text-blue-600 rounded-xl flex items-center justify-center">
                <DownloadIcon size={24} />
              </div>
              <h2 className="text-2xl font-bold text-gray-900">1. How to Download</h2>
            </div>
            <ul className="space-y-4 text-gray-600">
              <li className="flex items-start gap-3">
                <Check className="shrink-0 text-emerald-500 mt-0.5" size={20} />
                <span>Check the "I accept the Terms and Agreements" box above.</span>
              </li>
              <li className="flex items-start gap-3">
                <Check className="shrink-0 text-emerald-500 mt-0.5" size={20} />
                <span>Click the prominent <strong>Download Installer</strong> button.</span>
              </li>
              <li className="flex items-start gap-3">
                <Check className="shrink-0 text-emerald-500 mt-0.5" size={20} />
                <span>Wait for the <code>NexaPOS-Setup.exe</code> file to finish downloading to your computer (usually in your Downloads folder).</span>
              </li>
            </ul>
          </div>

          <div className="bg-white p-8 rounded-2xl shadow-sm border border-gray-100 h-full">
            <div className="flex items-center gap-4 mb-6">
              <div className="w-12 h-12 bg-purple-100 text-purple-600 rounded-xl flex items-center justify-center">
                <Monitor size={24} />
              </div>
              <h2 className="text-2xl font-bold text-gray-900">2. Installation Process</h2>
            </div>
            <ul className="space-y-4 text-gray-600">
              <li className="flex items-start gap-3">
                <Check className="shrink-0 text-emerald-500 mt-0.5" size={20} />
                <span>Locate the downloaded <code>NexaPOS-Setup.exe</code> file and double-click to open it.</span>
              </li>
              <li className="flex items-start gap-3">
                <Check className="shrink-0 text-emerald-500 mt-0.5" size={20} />
                <span>If prompted by Windows SmartScreen, click "More info" and then "Run anyway".</span>
              </li>
              <li className="flex items-start gap-3">
                <Check className="shrink-0 text-emerald-500 mt-0.5" size={20} />
                <span>Follow the on-screen setup wizard to choose an installation directory and click "Install".</span>
              </li>
            </ul>
          </div>

          <div className="bg-white p-8 rounded-2xl shadow-sm border border-gray-100 h-full">
            <div className="flex items-center gap-4 mb-6">
              <div className="w-12 h-12 bg-emerald-100 text-emerald-600 rounded-xl flex items-center justify-center">
                <Settings size={24} />
              </div>
              <h2 className="text-2xl font-bold text-gray-900">3. Setup Instructions</h2>
            </div>
            <ul className="space-y-4 text-gray-600">
              <li className="flex items-start gap-3">
                <Check className="shrink-0 text-emerald-500 mt-0.5" size={20} />
                <span>Launch NEXA POS from your Start Menu or Desktop shortcut.</span>
              </li>
              <li className="flex items-start gap-3">
                <Check className="shrink-0 text-emerald-500 mt-0.5" size={20} />
                <span>Log in using your registered admin credentials.</span>
              </li>
              <li className="flex items-start gap-3">
                <Check className="shrink-0 text-emerald-500 mt-0.5" size={20} />
                <span>The system will automatically initialize your local database and sync your existing settings from the cloud.</span>
              </li>
            </ul>
          </div>

          <div className="bg-white p-8 rounded-2xl shadow-sm border border-gray-100 h-full">
            <div className="flex items-center gap-4 mb-6">
              <div className="w-12 h-12 bg-orange-100 text-orange-600 rounded-xl flex items-center justify-center">
                <HelpCircle size={24} />
              </div>
              <h2 className="text-2xl font-bold text-gray-900">4. Troubleshooting</h2>
            </div>
            <ul className="space-y-4 text-gray-600">
              <li className="flex items-start gap-3">
                 <strong className="block text-gray-900">Antivirus Warnings:</strong>
                 <span className="text-sm">Some strict enterprise antivirus software may falsely flag the installer. Add NEXA POS to your exclusions list.</span>
              </li>
              <li className="flex items-start gap-3">
                 <strong className="block text-gray-900">Blank Screen on Startup:</strong>
                 <span className="text-sm">Ensure your internet connection is active during the *first* launch so the hardware can authenticate to the cloud.</span>
              </li>
            </ul>
          </div>
          
        </div>
      </div>
    </div>
  );
};

export default Download;
