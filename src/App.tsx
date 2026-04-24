import React, { useState, useEffect } from 'react';
import { BrowserRouter, Routes, Route, Navigate } from 'react-router-dom';
import { AuthProvider, useAuth } from './contexts/AuthContext';
import { supabase } from './lib/supabase';
import { AppLayout } from './components/layout/AppLayout';
import Landing from './pages/Landing';
import Login from './pages/Login';
import Signup from './pages/Signup';
import Documentation from './pages/Documentation';
import Pricing from './pages/Pricing';
import Dashboard from './pages/Dashboard';
import Inventory from './pages/Inventory';
import POS from './pages/POS';
import Sales from './pages/Sales';
import Reports from './pages/Reports';
import Records from './pages/Records';
import Customers from './pages/Customers';
import Settings from './pages/Settings';
import AdminPanel from './pages/AdminPanel';
import FeaturePage from './pages/FeaturePage';
import About from './pages/About';
import Terms from './pages/Terms';
import PrivacyPolicy from './pages/PrivacyPolicy';

import Chatbot from './components/Chatbot';

// Protected Route wrapper
function ProtectedRoute({ children }: { children: React.ReactNode }) {
  const { user, loading, signOut } = useAuth();
  const [roleStatus, setRoleStatus] = useState<string | null>(null);
  
  useEffect(() => {
    if (user) {
      if (user.email?.toLowerCase() === 'hananirfan85@gmail.com') {
         setRoleStatus('admin');
         return;
      }
      
      const checkRole = async () => {
        const { data } = await supabase.from('user_roles').select('role').eq('user_id', user.id).single();
        if (data) {
          setRoleStatus(data.role);
        } else {
          setRoleStatus('pending'); // default to pending if not fully set up
        }
      };
      
      checkRole();

      const subscription = supabase
        .channel('public:user_roles')
        .on('postgres_changes', { event: 'UPDATE', schema: 'public', table: 'user_roles', filter: `user_id=eq.${user.id}` }, (payload) => {
          setRoleStatus(payload.new.role);
        })
        .subscribe();

      return () => {
        supabase.removeChannel(subscription);
      };
    }
  }, [user]);

  if (loading || (user && !roleStatus)) {
    return <div className="min-h-screen flex items-center justify-center">Loading...</div>;
  }
  
  if (!user) return <Navigate to="/home" />;

  if (roleStatus === 'pending') {
    return (
      <div className="min-h-screen flex flex-col items-center justify-center bg-gray-50 text-center p-6">
        <h2 className="text-3xl font-bold text-gray-900 mb-4">Account Pending Approval</h2>
        <p className="text-gray-600 max-w-md mb-4 text-justify">
          You have successfully registered (<strong>{user.email}</strong>). However, access to the NEXORA dashboard requires administrator approval.
        </p>
        <p className="text-gray-500 mb-8 text-sm">
          Please contact support when you verify your purchase, to let the administrator grant your permissions.
        </p>
        <button 
          onClick={signOut} 
          className="px-6 py-2 bg-indigo-600 text-white rounded-lg font-medium hover:bg-indigo-700 transition"
        >
          Sign Out
        </button>
      </div>
    );
  }
  
  return <>{children}</>;
}

// Admin only route wrapper
function AdminRoute({ children }: { children: React.ReactNode }) {
  const { user, loading } = useAuth();
  
  if (loading) return <div className="min-h-screen flex items-center justify-center">Loading...</div>;
  if (!user || user.email !== 'hananirfan85@gmail.com') return <Navigate to="/" />;
  
  return <>{children}</>;
}

export default function App() {
  return (
    <AuthProvider>
      <BrowserRouter>
        <Chatbot />
        <Routes>
          <Route path="/home" element={<Landing />} />
          <Route path="/login" element={<Login />} />
          <Route path="/signup" element={<Signup />} />
          <Route path="/docs" element={<Documentation />} />
          <Route path="/about" element={<About />} />
          <Route path="/terms" element={<Terms />} />
          <Route path="/privacy-policy" element={<PrivacyPolicy />} />
          <Route path="/pricing" element={<Pricing />} />
          <Route path="/features/:featureId" element={<FeaturePage />} />
          
          <Route path="/" element={
            <ProtectedRoute>
              <AppLayout />
            </ProtectedRoute>
          }>
            <Route index element={<Dashboard />} />
            <Route path="inventory" element={<Inventory />} />
            <Route path="pos" element={<POS />} />
            <Route path="sales" element={<Sales />} />
            <Route path="customers" element={<Customers />} />
            <Route path="reports" element={<Reports />} />
            <Route path="records" element={<Records />} />
            <Route path="settings" element={<Settings />} />
            <Route path="admin" element={
              <AdminRoute>
                <AdminPanel />
              </AdminRoute>
            } />
          </Route>
          <Route path="*" element={<Navigate to="/" />} />
        </Routes>
      </BrowserRouter>
    </AuthProvider>
  );
}
