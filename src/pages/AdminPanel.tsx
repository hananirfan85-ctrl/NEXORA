import React, { useState, useEffect } from 'react';
import { supabase } from '../lib/supabase';
import { format } from 'date-fns';
import { Users, ShieldAlert, CheckCircle, Database, Edit2, Check, X } from 'lucide-react';

type AuthUser = {
  id: string;
  email: string;
  role: string;
  created_at: string;
};

export default function AdminPanel() {
  const [users, setUsers] = useState<AuthUser[]>([]);
  const [messages, setMessages] = useState<any[]>([]);
  const [activeTab, setActiveTab] = useState<'clients' | 'messages'>('clients');
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [needsSetup, setNeedsSetup] = useState(false);
  const [editingRoleFor, setEditingRoleFor] = useState<string | null>(null);
  const [newRoleStr, setNewRoleStr] = useState<string>('');
  const [replyText, setReplyText] = useState<Record<string, string>>({});

  useEffect(() => {
    if (activeTab === 'clients') {
      fetchUsers();
    } else {
      fetchMessages();
    }
  }, [activeTab]);

  const fetchMessages = async () => {
    setLoading(true);
    const { data, error } = await supabase.from('user_messages').select('*').order('created_at', { ascending: false });
    if (error) {
      if (error.message.includes('relation "public.user_messages" does not exist')) {
         setNeedsSetup(true);
      } else {
         setError(error.message);
      }
    } else {
      setMessages(data || []);
      setNeedsSetup(false);
    }
    setLoading(false);
  };

  const fetchUsers = async () => {
    setLoading(true);
    setError('');
    
    const { data, error } = await supabase.rpc('get_all_users_with_roles');
    // Also check if get_my_role exists to ensure full setup
    const { error: roleError } = await supabase.rpc('get_my_role');
    
    console.log("Admin fetch users result:", data, error);
    
    if (error || (roleError && roleError.message.includes('Could not find'))) {
      if (
        (error && (error.message.includes('Could not find') || 
         error.message.includes('does not exist') ||
         error.message.includes('Access Denied'))) ||
        (roleError && roleError.message.includes('Could not find'))
      ) {
        setNeedsSetup(true);
        setError(error ? error.message : "Missing get_my_role function. Please run the SQL setup code again."); // store it anyway so we can see it
      } else {
        setError(error ? error.message : "Unknown error");
        setNeedsSetup(false);
      }
    } else {
      setUsers(data || []);
      setNeedsSetup(false);
    }
    
    setLoading(false);
  };

  const handleUpdateRole = async (userId: string, email: string) => {
    try {
      const { error } = await supabase.rpc('update_user_role', {
        target_user_id: userId,
        target_email: email,
        new_role: newRoleStr
      });
      if (error) throw error;
      
      setEditingRoleFor(null);
      fetchUsers();
    } catch (err: any) {
      alert("Error updating role: " + err.message);
    }
  };

  const sqlSetupCode = `
-- Create user_roles table if it doesn't exist
CREATE TABLE IF NOT EXISTS public.user_roles (
  user_id UUID PRIMARY KEY REFERENCES auth.users(id) ON DELETE CASCADE,
  email TEXT NOT NULL,
  role TEXT NOT NULL DEFAULT 'pending',
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Backfill any existing users into user_roles
INSERT INTO public.user_roles (user_id, email, role)
SELECT id, email, 'pending' FROM auth.users
ON CONFLICT (user_id) DO NOTHING;

-- === CRM AND LEDGER SETUP ===
CREATE TABLE IF NOT EXISTS public.user_messages (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id UUID,
  email TEXT NOT NULL,
  subject TEXT,
  message TEXT NOT NULL,
  reply TEXT,
  status TEXT DEFAULT 'pending',
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);
ALTER TABLE public.user_messages ENABLE ROW LEVEL SECURITY;
CREATE POLICY "Anyone can insert" ON public.user_messages FOR INSERT WITH CHECK (true);
CREATE POLICY "Users can read own messages" ON public.user_messages FOR SELECT USING (auth.uid() = user_id);
CREATE POLICY "Admins can manage" ON public.user_messages FOR ALL USING (auth.jwt() ->> 'email' = 'hananirfan85@gmail.com');

CREATE TABLE IF NOT EXISTS public.customers (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id UUID NOT NULL REFERENCES auth.users(id) ON DELETE CASCADE,
  name TEXT NOT NULL,
  email TEXT,
  phone TEXT,
  address TEXT,
  loyalty_points INTEGER DEFAULT 0,
  total_purchases NUMERIC DEFAULT 0,
  ledger_balance NUMERIC DEFAULT 0,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Enable RLS for customers
ALTER TABLE public.customers ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Users can manage their own customers" 
ON public.customers FOR ALL USING (auth.uid() = user_id);

CREATE TABLE IF NOT EXISTS public.customer_ledgers (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  customer_id UUID NOT NULL REFERENCES public.customers(id) ON DELETE CASCADE,
  user_id UUID NOT NULL REFERENCES auth.users(id) ON DELETE CASCADE,
  amount NUMERIC NOT NULL,
  type TEXT NOT NULL CHECK (type IN ('charge', 'payment')),
  description TEXT,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

ALTER TABLE public.customer_ledgers ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Users can manage their own customer ledgers"
ON public.customer_ledgers FOR ALL USING (auth.uid() = user_id);

-- === STORE SETTINGS & UNITS ===
CREATE TABLE IF NOT EXISTS public.store_settings (
  user_id UUID PRIMARY KEY REFERENCES auth.users(id) ON DELETE CASCADE,
  store_type TEXT,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

ALTER TABLE public.store_settings ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Users can manage their own store settings" 
ON public.store_settings FOR ALL USING (auth.uid() = user_id);

DO $$ 
BEGIN 
    IF NOT EXISTS (SELECT 1 FROM information_schema.columns WHERE table_name='products' AND column_name='unit') THEN 
        ALTER TABLE public.products ADD COLUMN unit TEXT; 
    END IF; 
END $$;
-- ===============================

-- Run this in your Supabase SQL Editor to enable the advanced CRM Admin Panel
CREATE OR REPLACE FUNCTION get_all_users_with_roles()
RETURNS TABLE (id uuid, email text, role text, created_at timestamptz)
SECURITY DEFINER
AS $$
BEGIN
  IF lower(auth.jwt() ->> 'email') != 'hananirfan85@gmail.com' THEN
    RAISE EXCEPTION 'Access Denied: Super Admin Only';
  END IF;

  RETURN QUERY 
  SELECT au.id, au.email::text, COALESCE(ur.role, 'pending'), au.created_at 
  FROM auth.users au 
  LEFT JOIN public.user_roles ur ON au.id = ur.user_id
  ORDER BY au.created_at DESC;
END;
$$ LANGUAGE plpgsql;

CREATE OR REPLACE FUNCTION update_user_role(target_user_id uuid, target_email text, new_role text)
RETURNS void
SECURITY DEFINER
AS $$
BEGIN
  IF lower(auth.jwt() ->> 'email') != 'hananirfan85@gmail.com' THEN
    RAISE EXCEPTION 'Access Denied: Super Admin Only';
  END IF;

  INSERT INTO public.user_roles (user_id, email, role)
  VALUES (target_user_id, target_email, new_role)
  ON CONFLICT (user_id) DO UPDATE SET role = EXCLUDED.role;
END;
$$ LANGUAGE plpgsql;

CREATE OR REPLACE FUNCTION get_my_role()
RETURNS text
SECURITY DEFINER
AS $$
DECLARE
  my_role text;
BEGIN
  SELECT role INTO my_role FROM public.user_roles WHERE user_id = auth.uid();
  RETURN COALESCE(my_role, 'pending');
END;
$$ LANGUAGE plpgsql;
  `.trim();

  return (
    <div className="max-w-6xl mx-auto space-y-6">
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div>
          <h1 className="text-2xl font-bold text-gray-900 flex items-center gap-2">
            Super Admin Dashboard
          </h1>
          <p className="text-gray-500 text-sm mt-1">Manage platform clients, support tickets, and system health.</p>
        </div>
        
        <div className="flex bg-gray-100 p-1 rounded-lg">
          <button 
            onClick={() => setActiveTab('clients')}
            className={`px-4 py-2 text-sm font-medium rounded-md transition-all ${activeTab === 'clients' ? 'bg-white shadow-sm text-indigo-600' : 'text-gray-600 hover:text-gray-900'}`}
          >
            Clients
          </button>
          <button 
            onClick={() => setActiveTab('tickets')}
            className={`px-4 py-2 text-sm font-medium rounded-md transition-all ${activeTab === 'tickets' ? 'bg-white shadow-sm text-indigo-600' : 'text-gray-600 hover:text-gray-900'}`}
          >
            User Messages
          </button>
        </div>
      </div>
      
      {activeTab === 'clients' && (
        <div className="bg-indigo-50 border border-indigo-200 text-indigo-800 p-4 rounded-xl flex gap-3 text-sm">
          <Users className="shrink-0 mt-0.5" size={20} />
          <div>
            <strong className="block mb-1 text-base">Important Notice Regarding Clients Approvals:</strong>
            Since you are testing this on your deployed Vercel application (nexapossystem.vercel.app), your clients will <strong>still see the pending approval page</strong> until you actually <strong>push these new code updates to your GitHub repository</strong> so Vercel can rebuild the app with the newly added backend SQL integrations. <br className="my-2" /> Make sure clients refresh their page after the new deployment finishes on Vercel.
          </div>
        </div>
      )}

      {needsSetup ? (
        <div className="bg-white rounded-xl shadow-sm border border-orange-200 overflow-hidden">
          {error && <div className="p-3 bg-red-50 text-red-600 text-sm font-mono border-b border-red-200">Error: {error}</div>}
          <div className="p-6 bg-orange-50 border-b border-orange-200 flex items-start gap-4">
            <ShieldAlert className="text-orange-500 shrink-0 mt-1" size={24} />
            <div>
              <h2 className="text-lg font-bold text-orange-900">Database Setup Required</h2>
              <p className="text-orange-800 mt-1">
                To securely view all authenticated users and grant them access, you need to sync the new user_roles functions.
              </p>
            </div>
          </div>
          <div className="p-6 space-y-4">
            <h3 className="font-semibold text-gray-900 flex items-center gap-2">
              <Database size={18} className="text-gray-500" />
              1. Copy this SQL snippet:
            </h3>
            <pre className="bg-gray-900 text-gray-100 p-4 rounded-lg overflow-x-auto text-sm font-mono leading-relaxed">
              {sqlSetupCode}
            </pre>
            <div className="space-y-2 mt-6">
              <h3 className="font-semibold text-gray-900">2. Run it in Supabase</h3>
              <ul className="list-decimal pl-5 text-gray-600 space-y-1">
                <li>Go to your Supabase Dashboard</li>
                <li>Click on <strong>SQL Editor</strong> on the left sidebar</li>
                <li>Pase the code and click <strong>Run</strong></li>
              </ul>
            </div>
            <div className="pt-4 border-t border-gray-100 mt-6">
              <button
                onClick={fetchUsers}
                className="flex items-center gap-2 bg-indigo-600 text-white px-6 py-2.5 rounded-lg hover:bg-indigo-700 font-medium transition-colors"
              >
                <CheckCircle size={18} />
                I have run the SQL, Check Again
              </button>
            </div>
          </div>
        </div>
      ) : activeTab === 'clients' ? (
        <div className="bg-white border border-gray-100 shadow-sm rounded-xl overflow-hidden">
          <div className="p-4 bg-gray-50 border-b border-gray-100 flex items-center justify-between">
              <h2 className="font-bold text-gray-900 flex items-center gap-2">
                <Users size={18} className="text-indigo-600" />
                Registered Clients ({users.length})
              </h2>
              <button
                onClick={fetchUsers}
                className="text-sm font-medium text-indigo-600 hover:text-indigo-800"
              >
                Refresh
              </button>
            </div>
            
            {loading ? (
              <div className="p-8 text-center text-gray-500">Loading users...</div>
            ) : error ? (
              <div className="p-8 text-center text-red-500 bg-red-50">{error}</div>
            ) : users.length === 0 ? (
              <div className="p-8 text-center text-gray-500">No users found.</div>
            ) : (
              <div className="overflow-x-auto">
                <table className="w-full text-left border-collapse">
                  <thead>
                    <tr className="bg-gray-50/50 text-gray-500 text-xs uppercase tracking-wider border-b border-gray-100">
                      <th className="p-4 font-medium">Email Address</th>
                      <th className="p-4 font-medium">User ID</th>
                      <th className="p-4 font-medium">Joined At</th>
                      <th className="p-4 font-medium">Role Status</th>
                      <th className="p-4 font-medium text-right">Actions</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-gray-100">
                    {users.map((u) => (
                      <tr key={u.id} className="hover:bg-indigo-50/30 transition-colors">
                        <td className="p-4">
                          <div className="font-medium text-gray-900">{u.email}</div>
                        </td>
                        <td className="p-4 text-xs font-mono text-gray-500">
                          ...{u.id.substring(u.id.length - 8)}
                        </td>
                        <td className="p-4 text-sm text-gray-600">
                          {format(new Date(u.created_at), 'MMM d, yyyy h:mm a')}
                        </td>
                        <td className="p-4">
                          {u.email === 'hananirfan85@gmail.com' ? (
                            <span className="px-2 py-1 bg-purple-100 text-purple-800 text-xs font-bold rounded-md uppercase tracking-wide">Super Admin</span>
                          ) : editingRoleFor === u.id ? (
                            <div className="flex items-center gap-2">
                               <select
                                 className="text-sm border border-gray-300 rounded-md py-1 px-2 outline-none"
                                 value={newRoleStr}
                                 onChange={(e) => setNewRoleStr(e.target.value)}
                               >
                                 <option value="pending">Pending</option>
                                 <option value="client">Client (Approved)</option>
                               </select>
                               <button onClick={() => handleUpdateRole(u.id, u.email)} className="p-1 bg-green-100 text-green-700 rounded hover:bg-green-200">
                                 <Check size={16} />
                               </button>
                               <button onClick={() => setEditingRoleFor(null)} className="p-1 bg-red-100 text-red-700 rounded hover:bg-red-200">
                                 <X size={16} />
                               </button>
                            </div>
                          ) : (
                            <span className={`px-2 py-1 text-xs font-bold rounded-md uppercase tracking-wide ${u.role === 'client' ? 'bg-green-100 text-green-800' : 'bg-yellow-100 text-yellow-800'}`}>
                              {u.role}
                            </span>
                          )}
                        </td>
                        <td className="p-4 text-right">
                          {u.email !== 'hananirfan85@gmail.com' && editingRoleFor !== u.id && (
                             <button 
                               onClick={() => { setEditingRoleFor(u.id); setNewRoleStr(u.role); }}
                               className="text-indigo-600 hover:text-indigo-800 text-sm font-medium flex items-center gap-1 justify-end w-full"
                             >
                               <Edit2 size={14} /> Edit Role
                             </button>
                          )}
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            )}
          </div>
        ) : (
          <div className="bg-white border border-gray-100 shadow-sm rounded-xl overflow-hidden">
            <div className="p-4 bg-gray-50 border-b border-gray-100 flex items-center justify-between">
              <h2 className="font-bold text-gray-900 flex items-center gap-2">
                <Users size={18} className="text-indigo-600" />
                User Messages ({messages.length})
              </h2>
              <button
                onClick={fetchMessages}
                className="text-sm font-medium text-indigo-600 hover:text-indigo-800"
              >
                Refresh
              </button>
            </div>
            
            {loading ? (
              <div className="p-8 text-center text-gray-500">Loading messages...</div>
            ) : error ? (
              <div className="p-8 text-center text-red-500 bg-red-50">{error}</div>
            ) : messages.length === 0 ? (
              <div className="p-8 text-center text-gray-500">No user messages found.</div>
            ) : (
              <div className="divide-y divide-gray-100">
                {messages.map(t => (
                  <div key={t.id} className="p-6 hover:bg-gray-50 transition-colors">
                    <div className="flex justify-between items-start mb-2">
                       <div>
                         <span className={`px-2 py-1 text-xs font-bold rounded-md uppercase tracking-wide mr-2 ${t.status === 'pending' ? 'bg-red-100 text-red-800' : 'bg-green-100 text-green-800'}`}>{t.status}</span>
                         <span className="font-medium text-gray-900">{t.email}</span>
                       </div>
                       <span className="text-sm text-gray-500">{format(new Date(t.created_at), 'MMM d, yyyy h:mm a')}</span>
                    </div>
                    {t.subject && <div className="font-medium text-gray-800 mt-2">Subject: {t.subject}</div>}
                    <p className="text-gray-700 mt-2 whitespace-pre-wrap rounded-lg bg-gray-100 p-4 border border-gray-200">{t.message}</p>
                    
                    {t.reply ? (
                      <div className="mt-4 bg-indigo-50 border border-indigo-100 p-4 rounded-lg">
                        <strong className="text-indigo-800 text-sm block mb-1">Admin Reply:</strong>
                        <p className="text-indigo-900 text-sm whitespace-pre-wrap">{t.reply}</p>
                      </div>
                    ) : (
                      t.status === 'pending' && (
                        <div className="mt-4">
                          <textarea
                            className="w-full text-sm p-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500 transition-all resize-none"
                            rows={3}
                            placeholder="Type your reply here to save it in system..."
                            value={replyText[t.id] || ''}
                            onChange={(e) => setReplyText({ ...replyText, [t.id]: e.target.value })}
                          />
                          <div className="mt-3 flex gap-3">
                            <button
                               onClick={async () => {
                                 const reply = replyText[t.id] || '';
                                 
                                 // Update DB with reply and status
                                 const { error } = await supabase.from('user_messages').update({ status: 'replied', reply }).eq('id', t.id);
                                 if (error) {
                                   alert('Error saving reply: ' + error.message);
                                 } else {
                                   fetchMessages();
                                 }
                               }}
                               className="text-sm bg-indigo-600 text-white px-4 py-2 rounded-lg font-medium shadow hover:bg-indigo-700 transition-colors"
                            >
                               Save Reply
                            </button>
                            <button 
                              onClick={async () => {
                                 const { error } = await supabase.from('user_messages').update({ status: 'replied', reply: 'Marked as read/closed without reply.' }).eq('id', t.id);
                                 if (error) {
                                   alert('Error marking as read: ' + error.message);
                                 } else {
                                   fetchMessages();
                                 }
                              }}
                              className="text-sm bg-gray-200 text-gray-800 px-4 py-2 rounded-lg font-medium hover:bg-gray-300 transition-colors"
                            >
                              Mark Read (No Reply)
                            </button>
                          </div>
                        </div>
                      )
                    )}
                  </div>
                ))}
              </div>
            )}
          </div>
        )}
    </div>
  );
}
