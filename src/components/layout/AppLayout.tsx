import React, { useState, useEffect } from 'react';
import { NavLink, Outlet, useNavigate } from 'react-router-dom';
import { LayoutDashboard, Package, ShoppingCart, DollarSign, BarChart3, Clock, LogOut, Search, Menu, X, Download, WifiOff, Settings, Home, Users, Hexagon, MessageSquare } from 'lucide-react';
import { useAuth } from '../../contexts/AuthContext';
import { supabase } from '../../lib/supabase';
import toast from 'react-hot-toast';
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
  { name: 'Contact Admin', path: '/contact-admin', icon: MessageSquare }
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

  useEffect(() => {
    const checkLowStock = async () => {
      if (!user) return;
      
      const { data, error } = await supabase
        .from('products')
        .select('name, stock')
        .lte('stock', 5)
        .order('stock', { ascending: true });
        
      if (!error && data && data.length > 0) {
        const itemNames = data.map(i => i.name).join(', ');
        toast.error(
          <div>
            <strong>Low Stock Alert ({data.length})</strong>
            <p className="text-sm mt-1 text-gray-800">{itemNames}</p>
          </div>, 
          {
            duration: 8000,
            position: 'top-right',
            icon: '⚠️',
            style: {
              background: '#FEF2F2',
              border: '1px solid #F87171',
              color: '#991B1B'
            }
          }
        );
      }
    };
    
    // Check shortly after mounting to allow other things to render
    const timer = setTimeout(() => {
      checkLowStock();
    }, 2000);
    
    return () => clearTimeout(timer);
  }, [user]);

  const initiateInstall = async () => {
    if (!deferredPrompt) return;
    
    deferredPrompt.prompt();
    const { outcome } = await deferredPrompt.userChoice;
    if (outcome === 'accepted') {
      setDeferredPrompt(null);
    }
  };

  const handleLogout = async () => {
    await signOut();
    navigate('/login');
  };

  const closeMobileMenu = () => setIsMobileMenuOpen(false);

  return (
    <div className="flex h-screen bg-gradient-to-br from-indigo-50/50 via-white to-[#f5f5fa] text-gray-900 font-sans overflow-hidden">
      
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
            <img src="/logo.png" alt="NEXA POS Logo" className="h-10 w-auto" />
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
            const isAdminPath = item.path === '/admin';
            
            // Remove Customers page ONLY in admin panel account
            if (user?.email === 'hananirfan85@gmail.com' && item.name === 'Customers') {
              return null;
            }
            
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
        <header className="h-[auto] min-h-16 py-2 bg-white border-b border-gray-200 flex flex-wrap sm:flex-nowrap items-center justify-between px-4 sm:px-6 shrink-0 z-30 gap-2 sm:gap-4">
          <div className="flex items-center gap-4 shrink-0">
            <button 
              onClick={() => setIsMobileMenuOpen(true)}
              className="p-2 -ml-2 text-gray-600 hover:bg-gray-100 rounded-lg md:hidden"
            >
              <Menu size={24} />
            </button>
            <div className="text-indigo-600 font-bold tracking-tight md:hidden flex items-center gap-2 mr-2">
              <img src="/logo.png" alt="NEXA POS Logo" className="h-8 w-auto" />
            </div>
            <div className="relative w-full max-w-sm hidden sm:block">
              <Search className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400" size={18} />
              <input
                type="text"
                placeholder="Search anything..."
                className="w-full pl-10 pr-4 py-2 bg-gray-100 border-transparent rounded-lg text-sm focus:border-indigo-500 focus:bg-white focus:ring-2 focus:ring-indigo-200 transition-all outline-none"
              />
            </div>
          </div>
          
          <div className="flex items-center gap-2 sm:gap-3 flex-1 sm:flex-none justify-end overflow-x-auto no-scrollbar shrink-0">
            {isOffline && (
              <div className="flex items-center gap-1.5 px-3 py-1.5 bg-orange-100 text-orange-700 rounded-full text-xs font-bold uppercase tracking-wider shrink-0">
                <WifiOff size={14} />
                <span className="hidden sm:inline">Offline Mode</span>
              </div>
            )}
            
            {deferredPrompt && (
              <button 
                onClick={initiateInstall}
                className="flex items-center gap-2 px-3 py-1.5 bg-indigo-50 text-indigo-700 hover:bg-indigo-100 rounded-lg text-sm font-semibold transition-colors border border-indigo-200 shrink-0"
              >
                <Download size={16} />
                <span className="hidden sm:inline">Install App</span>
                <span className="sm:hidden">Install</span>
              </button>
            )}

            <button 
              onClick={() => navigate('/home')}
              className="flex items-center gap-2 px-3 py-1.5 bg-white border border-gray-200 text-gray-700 hover:bg-gray-50 rounded-lg text-sm font-semibold transition-colors shadow-sm shrink-0"
            >
              <Home size={16} />
              <span className="hidden sm:inline">Back</span>
            </button>
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
    </div>
  );
}
