import React, { useState, useEffect } from 'react';
import { NavLink, Outlet, useNavigate } from 'react-router-dom';
import { LayoutDashboard, Package, ShoppingCart, DollarSign, BarChart3, Clock, LogOut, Search, Menu, X, Download, WifiOff, Settings, Home, Users } from 'lucide-react';
import { useAuth } from '../../contexts/AuthContext';
import { motion, AnimatePresence } from 'motion/react';

const navItems = [
  { name: 'Dashboard', path: '/', icon: LayoutDashboard },
  { name: 'Inventory', path: '/inventory', icon: Package },
  { name: 'POS Billing', path: '/pos', icon: ShoppingCart },
  { name: 'Sales', path: '/sales', icon: DollarSign },
  { name: 'Customers', path: '/customers', icon: Users },
  { name: 'Reports', path: '/reports', icon: BarChart3 },
  { name: 'Records', path: '/records', icon: Clock },
  { name: 'Settings', path: '/settings', icon: Settings },
];

export function AppLayout() {
  const { signOut, user } = useAuth();
  const navigate = useNavigate();
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
  
  // PWA & Offline State
  const [deferredPrompt, setDeferredPrompt] = useState<any>(null);
  const [isOffline, setIsOffline] = useState(!navigator.onLine);
  const [showTermsModal, setShowTermsModal] = useState(false);

  useEffect(() => {
    const handleBeforeInstallPrompt = (e: any) => {
      e.preventDefault();
      setDeferredPrompt(e);
    };

    const handleOnline = () => setIsOffline(false);
    const handleOffline = () => setIsOffline(true);

    window.addEventListener('beforeinstallprompt', handleBeforeInstallPrompt);
    window.addEventListener('online', handleOnline);
    window.addEventListener('offline', handleOffline);

    return () => {
      window.removeEventListener('beforeinstallprompt', handleBeforeInstallPrompt);
      window.removeEventListener('online', handleOnline);
      window.removeEventListener('offline', handleOffline);
    };
  }, []);

  const initiateInstall = () => {
    setShowTermsModal(true);
  };

  const confirmInstall = async () => {
    if (!deferredPrompt) {
       setShowTermsModal(false);
       return;
    }
    
    deferredPrompt.prompt();
    const { outcome } = await deferredPrompt.userChoice;
    if (outcome === 'accepted') {
      setDeferredPrompt(null);
    }
    setShowTermsModal(false);
  };

  const handleLogout = async () => {
    await signOut();
    navigate('/login');
  };

  const closeMobileMenu = () => setIsMobileMenuOpen(false);

  return (
    <div className="flex h-screen bg-gray-50 text-gray-900 font-sans overflow-hidden">
      
      {/* Mobile Overlay */}
      <AnimatePresence>
        {isMobileMenuOpen && (
          <motion.div 
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            onClick={closeMobileMenu}
            className="fixed inset-0 bg-black/50 backdrop-blur-sm z-40 md:hidden"
          />
        )}
      </AnimatePresence>

      {/* Sidebar */}
      <aside className={`fixed inset-y-0 left-0 z-50 w-64 bg-white border-r border-gray-200 flex flex-col transform transition-transform duration-300 ease-in-out md:relative md:translate-x-0 ${isMobileMenuOpen ? 'translate-x-0' : '-translate-x-full'}`}>
        <div className="h-16 flex items-center justify-between px-6 border-b border-gray-200 shrink-0">
          <div className="flex items-center gap-2 text-indigo-600 font-bold text-xl tracking-tight">
            <img src="/logo.png" alt="NEXORA Logo" className="h-8 w-auto object-contain" onError={(e) => {
              (e.target as HTMLImageElement).src = 'data:image/svg+xml;base64,PHN2ZyB4bWxucz0iaHR0cDovL3d3dy53My5vcmcvMjAwMC9zdmciIHZpZXdCb3g9IjAgMCAyNCAyNCIgZmlsbD0ibm9uZSIgc3Ryb2tlPSIjNGY0NmU1IiBzdHJva2Utd2lkdGg9IjIiIHN0cm9rZS1saW5lY2FwPSJyb3VuZCIgc3Ryb2tlLWxpbmVqb2luPSJyb3VuZCI+PGNpcmNsZSBjeD0iOCIgY3k9IjIxIiByPSIxIi8+PGNpcmNsZSBjeD0iMTkiIGN5PSIyMSIgcj0iMSIvPjxwYXRoIGQ9Ik0yLjA1IDIuMDVoMmwzLjQzIDYuNThMMTAgMTRoOWwtLjI0LS43Ii8+PHBhdGggZD0iTTkgMTRoLjUiLz48cGF0aCBkPSJNOSAxNGwtLjI0LS43bC0zLjQzLTYuNTgiLz48L3N2Zz4='; // Fallback to cart SVG if logo.png not uploaded
            }} />
            <span>NEXORA</span>
          </div>
          <button onClick={closeMobileMenu} className="p-1 text-gray-500 hover:text-gray-700 md:hidden">
            <X size={20} />
          </button>
        </div>
        
        <nav className="flex-1 overflow-y-auto py-4 px-3 space-y-1 hide-scrollbar">
          {navItems.map((item) => {
            // Only admin can access POS/dashboard stuff if requested, 
            // but for now let's just make sure Admin Panel is only for admin.
            // "admin able to access the dashoboard and other features to use this and admin only access to this email hananirfan85@gmail.com"
            const isAdminRoute = item.path === '/admin';
            return (
              <NavLink
                key={item.name}
                to={item.path}
                onClick={closeMobileMenu}
                className={({ isActive }) =>
                  `flex items-center gap-3 px-3 py-2.5 rounded-lg transition-colors ${
                    isActive
                      ? 'bg-indigo-50 text-indigo-700 font-medium'
                      : 'text-gray-600 hover:bg-gray-100 hover:text-gray-900'
                  }`
                }
              >
                <item.icon size={20} />
                {item.name}
              </NavLink>
            );
          })}
          
          {user?.email === 'hananirfan85@gmail.com' && (
             <NavLink
             to="/admin"
             onClick={closeMobileMenu}
             className={({ isActive }) =>
               `flex items-center gap-3 px-3 py-2.5 rounded-lg transition-colors mt-4 border border-indigo-100 ${
                 isActive
                   ? 'bg-indigo-600 text-white font-medium shadow-md'
                   : 'text-indigo-700 hover:bg-indigo-50 hover:text-indigo-800'
               }`
             }
           >
             <LayoutDashboard size={20} />
             Admin Super Panel
           </NavLink>
          )}
        </nav>

        <div className="p-4 border-t border-gray-200 shrink-0">
          <div className="px-3 py-2 mb-2">
            <p className="text-xs font-medium text-gray-500 uppercase">Account</p>
            <p className="text-sm font-medium text-gray-900 truncate mt-1">{user?.email}</p>
          </div>
          <button
            onClick={handleLogout}
            className="flex items-center justify-center gap-2 w-full px-4 py-2 text-sm font-medium text-red-600 bg-red-50 hover:bg-red-100 rounded-lg transition-colors"
          >
            <LogOut size={16} />
            Sign Out
          </button>
        </div>
      </aside>

      {/* Main Content */}
      <main className="flex-1 flex flex-col min-w-0 overflow-hidden h-full relative">
        {/* Topbar */}
        <header className="h-16 bg-white border-b border-gray-200 flex items-center justify-between px-4 sm:px-6 shrink-0 z-30">
          <div className="flex items-center gap-4">
            <button 
              onClick={() => setIsMobileMenuOpen(true)}
              className="p-2 -ml-2 text-gray-600 hover:bg-gray-100 rounded-lg md:hidden"
            >
              <Menu size={24} />
            </button>
            <div className="relative w-full max-w-sm hidden sm:block">
              <Search className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400" size={18} />
              <input
                type="text"
                placeholder="Search anything..."
                className="w-full pl-10 pr-4 py-2 bg-gray-100 border-transparent rounded-lg text-sm focus:border-indigo-500 focus:bg-white focus:ring-2 focus:ring-indigo-200 transition-all outline-none"
              />
            </div>
          </div>
          
          <div className="flex items-center gap-3">
            {isOffline && (
              <div className="flex items-center gap-1.5 px-3 py-1.5 bg-orange-100 text-orange-700 rounded-full text-xs font-bold uppercase tracking-wider">
                <WifiOff size={14} />
                <span className="hidden sm:inline">Offline Mode</span>
              </div>
            )}
            
            <button 
              onClick={initiateInstall}
              className="flex items-center gap-2 px-3 py-1.5 bg-indigo-50 text-indigo-700 hover:bg-indigo-100 rounded-lg text-sm font-semibold transition-colors border border-indigo-200"
            >
              <Download size={16} />
              <span className="hidden sm:inline">Download</span>
              <span className="sm:hidden">Download</span>
            </button>

            <button 
              onClick={() => navigate('/home')}
              className="flex items-center gap-2 px-3 py-1.5 bg-white border border-gray-200 text-gray-700 hover:bg-gray-50 rounded-lg text-sm font-semibold transition-colors shadow-sm"
            >
              <Home size={16} />
              <span className="hidden sm:inline">Back to Home</span>
            </button>

            <div className="text-indigo-600 font-bold tracking-tight md:hidden flex items-center gap-2 ml-2">
              <img src="/logo.png" alt="NEXORA Logo" className="h-6 w-auto object-contain" onError={(e) => {
              (e.target as HTMLImageElement).src = 'data:image/svg+xml;base64,PHN2ZyB4bWxucz0iaHR0cDovL3d3dy53My5vcmcvMjAwMC9zdmciIHZpZXdCb3g9IjAgMCAyNCAyNCIgZmlsbD0ibm9uZSIgc3Ryb2tlPSIjNGY0NmU1IiBzdHJva2Utd2lkdGg9IjIiIHN0cm9rZS1saW5lY2FwPSJyb3VuZCIgc3Ryb2tlLWxpbmVqb2luPSJyb3VuZCI+PGNpcmNsZSBjeD0iOCIgY3k9IjIxIiByPSIxIi8+PGNpcmNsZSBjeD0iMTkiIGN5PSIyMSIgcj0iMSIvPjxwYXRoIGQ9Ik0yLjA1IDIuMDVoMmwzLjQzIDYuNThMMTAgMTRoOWwtLjI0LS43Ii8+PHBhdGggZD0iTTkgMTRoLjUiLz48cGF0aCBkPSJNOSAxNGwtLjI0LS43bC0zLjQzLTYuNTgiLz48L3N2Zz4='; // Fallback to cart SVG if logo.png not uploaded
            }} />
              <span className="hidden xs:inline">NEXORA</span>
            </div>
          </div>
        </header>

        {/* Page Content */}
        <div className="flex-1 overflow-y-auto p-4 sm:p-6 relative">
          <motion.div
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.3 }}
            className="max-w-7xl mx-auto w-full min-h-full"
          >
            <Outlet />
          </motion.div>
        </div>
      </main>

      {/* Terms and Agreements Modal for PWA Installation */}
      <AnimatePresence>
        {showTermsModal && (
          <div className="fixed inset-0 z-[100] flex items-center justify-center p-4 bg-black/50 backdrop-blur-sm">
            <motion.div
              initial={{ opacity: 0, scale: 0.95, y: 20 }}
              animate={{ opacity: 1, scale: 1, y: 0 }}
              exit={{ opacity: 0, scale: 0.95, y: 20 }}
              className="bg-white rounded-2xl shadow-xl w-full max-w-lg overflow-hidden flex flex-col max-h-[90vh]"
            >
              <div className="p-6 border-b border-gray-100 flex items-center justify-between shrink-0">
                <h3 className="text-xl font-bold text-gray-900">Software Agreement</h3>
                <button 
                  onClick={() => setShowTermsModal(false)}
                  className="p-2 text-gray-400 hover:text-gray-600 rounded-full hover:bg-gray-100 transition-colors"
                >
                  <X size={20} />
                </button>
              </div>
              
              <div className="p-6 overflow-y-auto text-sm text-gray-600 space-y-4">
                {!deferredPrompt ? (
                  <>
                    <p>NEXORA is a Progressive Web App (PWA). You can install it directly to your device for offline use without going through an app store.</p>
                    <div className="bg-gray-50 p-4 rounded-lg border border-gray-100">
                      <strong className="text-gray-900 block mb-2">On iOS (Safari):</strong>
                      <ol className="list-decimal pl-5 space-y-1">
                        <li>Tap the <strong>Share</strong> button at the bottom of the screen.</li>
                        <li>Scroll down and tap <strong>Add to Home Screen</strong>.</li>
                      </ol>
                    </div>
                    <div className="bg-gray-50 p-4 rounded-lg border border-gray-100">
                      <strong className="text-gray-900 block mb-2">On Desktop (Chrome/Edge):</strong>
                      <ol className="list-decimal pl-5 space-y-1">
                        <li>Click the <strong>Install</strong> icon on the right side of the URL/address bar.</li>
                        <li>Or click the 3-dots menu and select <strong>Install NEXORA</strong>.</li>
                      </ol>
                    </div>
                  </>
                ) : (
                  <>
                    <p>
                      <strong>1. Acceptance of Terms:</strong> By downloading and installing NEXORA, you agree to be bound by these Terms of Service.
                    </p>
                    <p>
                      <strong>2. Local Storage & Data:</strong> This application utilizes browser local storage and caching to function offline. 
                      By installing, you consent to the storage of this application data on your local device.
                    </p>
                    <p>
                      <strong>3. Analytics & Usage:</strong> NEXORA may collect diagnostic data to improve service reliability and performance metrics strictly directly proportional to your usage of the system.
                    </p>
                    <p>
                      <strong>4. Liability Limitation:</strong> NEXORA provides this POS system "as-is". We are not liable for business interruptions, financial calculations manually altered, or loss of device caching.
                    </p>
                  </>
                )}
              </div>

              <div className="p-6 bg-gray-50 border-t border-gray-100 flex gap-3 shrink-0">
                {!deferredPrompt ? (
                  <button
                    onClick={() => setShowTermsModal(false)}
                    className="w-full px-4 py-3 text-sm font-medium text-white bg-indigo-600 rounded-xl hover:bg-indigo-700 transition-colors shadow-sm"
                  >
                    Close
                  </button>
                ) : (
                  <>
                    <button
                      onClick={() => setShowTermsModal(false)}
                      className="flex-1 px-4 py-3 text-sm font-medium text-gray-700 bg-white border border-gray-300 rounded-xl hover:bg-gray-50 transition-colors"
                    >
                      Decline
                    </button>
                    <button
                      onClick={confirmInstall}
                      className="flex-1 px-4 py-3 text-sm font-medium text-white bg-indigo-600 rounded-xl hover:bg-indigo-700 transition-colors shadow-sm"
                    >
                      I Accept & Install
                    </button>
                  </>
                )}
              </div>
            </motion.div>
          </div>
        )}
      </AnimatePresence>
    </div>
  );
}
