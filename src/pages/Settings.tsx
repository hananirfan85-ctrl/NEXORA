import React, { useState, useEffect } from 'react';
import { Save, Store, MapPin, AlignCenter } from 'lucide-react';
import { motion } from 'motion/react';

export default function Settings() {
  const [businessName, setBusinessName] = useState('');
  const [address, setAddress] = useState('');
  const [footerMessage, setFooterMessage] = useState('');
  const [showSaved, setShowSaved] = useState(false);

  useEffect(() => {
    const savedName = localStorage.getItem('nexora_business_name');
    const savedAddress = localStorage.getItem('nexora_address');
    const savedFooter = localStorage.getItem('nexora_footer');

    if (savedName) setBusinessName(savedName);
    else setBusinessName('NEXORA POS');

    if (savedAddress) setAddress(savedAddress);
    if (savedFooter) setFooterMessage(savedFooter);
    else setFooterMessage('Thank you for shopping with us!');
  }, []);

  const handleSave = () => {
    localStorage.setItem('nexora_business_name', businessName);
    localStorage.setItem('nexora_address', address);
    localStorage.setItem('nexora_footer', footerMessage);
    
    setShowSaved(true);
    setTimeout(() => setShowSaved(false), 3000);
  };

  return (
    <div className="max-w-4xl mx-auto space-y-6">
      <div className="flex items-center justify-between">
        <h1 className="text-2xl font-bold text-gray-900">Settings</h1>
      </div>

      <div className="bg-white rounded-xl shadow-sm border border-gray-100 overflow-hidden">
        <div className="p-6 border-b border-gray-100 bg-gray-50/50">
          <h2 className="text-lg font-semibold text-gray-900">Receipt Template Settings</h2>
          <p className="text-sm text-gray-500 mt-1">Customize the receipt printed for your customers.</p>
        </div>

        <div className="p-6 space-y-6">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div className="space-y-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Business Name
                </label>
                <div className="relative">
                  <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none text-gray-400">
                    <Store size={18} />
                  </div>
                  <input
                    type="text"
                    value={businessName}
                    onChange={(e) => setBusinessName(e.target.value)}
                    className="pl-10 w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-indigo-500 focus:border-indigo-500 sm:text-sm transition-colors"
                    placeholder="e.g. Nexus Supermarket"
                  />
                </div>
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Business Address
                </label>
                <div className="relative">
                  <div className="absolute inset-y-0 left-0 pl-3 pt-2.5 pointer-events-none text-gray-400">
                    <MapPin size={18} />
                  </div>
                  <textarea
                    value={address}
                    onChange={(e) => setAddress(e.target.value)}
                    rows={3}
                    className="pl-10 w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-indigo-500 focus:border-indigo-500 sm:text-sm transition-colors"
                    placeholder="123 Main Street&#10;City, Country"
                  />
                </div>
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Footer Message
                </label>
                <div className="relative">
                  <div className="absolute inset-y-0 left-0 pl-3 pt-2.5 pointer-events-none text-gray-400">
                    <AlignCenter size={18} />
                  </div>
                  <textarea
                    value={footerMessage}
                    onChange={(e) => setFooterMessage(e.target.value)}
                    rows={2}
                    className="pl-10 w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-indigo-500 focus:border-indigo-500 sm:text-sm transition-colors"
                    placeholder="Thank you for shopping with us!"
                  />
                </div>
              </div>
              
              <div className="pt-4">
                <button
                  onClick={handleSave}
                  className="flex items-center justify-center gap-2 w-full md:w-auto px-6 py-2.5 bg-indigo-600 text-white font-medium rounded-lg hover:bg-indigo-700 transition-colors"
                >
                  <Save size={18} />
                  Save Settings
                </button>
                {showSaved && (
                  <motion.p
                    initial={{ opacity: 0, y: 5 }}
                    animate={{ opacity: 1, y: 0 }}
                    className="text-sm font-medium text-emerald-600 mt-3"
                  >
                    Settings saved successfully!
                  </motion.p>
                )}
              </div>
            </div>

            {/* Receipt Preview */}
            <div className="bg-gray-100 rounded-xl p-6 flex items-center justify-center border border-gray-200">
              <div className="bg-white p-6 shadow-sm border border-gray-200 w-full max-w-sm rounded font-mono text-sm">
                <div className="text-center space-y-1 mb-6">
                  <h3 className="font-bold text-lg">{businessName || 'Business Name'}</h3>
                  <p className="text-gray-500 text-xs whitespace-pre-wrap">{address || '123 Business Address\nCity, State'}</p>
                </div>
                
                <div className="border-t border-b border-dashed border-gray-300 py-3 my-3">
                  <div className="flex justify-between text-xs text-gray-500 mb-2">
                    <span>1x Item Name</span>
                    <span>$10.00</span>
                  </div>
                  <div className="flex justify-between font-bold">
                    <span>TOTAL</span>
                    <span>$10.00</span>
                  </div>
                </div>

                <div className="text-center mt-6 text-xs text-gray-500 whitespace-pre-wrap">
                  {footerMessage || 'Thank you for your business!'}
                </div>
              </div>
            </div>

          </div>
        </div>
      </div>
    </div>
  );
}
