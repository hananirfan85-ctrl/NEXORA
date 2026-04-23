import React, { useState, useEffect } from 'react';
import { supabase } from '../lib/supabase';
import { format } from 'date-fns';
import { Users, ShieldAlert, CheckCircle, Database } from 'lucide-react';

type AuthUser = {
  id: string;
  email: string;
  created_at: string;
};

export default function AdminPanel() {
  const [users, setUsers] = useState<AuthUser[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [needsSetup, setNeedsSetup] = useState(false);

  useEffect(() => {
    fetchUsers();
  }, []);

  const fetchUsers = async () => {
    setLoading(true);
    setError('');
    
    // We try to call the secure RPC to get users
    const { data, error } = await supabase.rpc('get_all_users');
    
    if (error) {
      if (
        error.message.includes('Could not find') || 
        error.message.includes('does not exist') ||
        error.message.includes('Access Denied')
      ) {
        setNeedsSetup(true);
      } else {
        setError(error.message);
        setNeedsSetup(false);
      }
    } else {
      setUsers(data || []);
      setNeedsSetup(false);
    }
    
    setLoading(false);
  };

  const sqlSetupCode = `
-- Run this in your Supabase SQL Editor to enable the Admin Panel
CREATE OR REPLACE FUNCTION get_all_users()
RETURNS TABLE (id uuid, email text, created_at timestamptz)
SECURITY DEFINER
AS $$
BEGIN
  -- Only allow the designated admin email
  IF auth.jwt() ->> 'email' != 'hananirfan85@gmail.com' THEN
    RAISE EXCEPTION 'Access Denied: Super Admin Only';
  END IF;

  RETURN QUERY SELECT au.id, au.email::text, au.created_at 
  FROM auth.users au 
  ORDER BY au.created_at DESC;
END;
$$ LANGUAGE plpgsql;
  `.trim();

  return (
    <div className="max-w-6xl mx-auto space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-bold text-gray-900 flex items-center gap-2">
            Super Admin Control Panel
          </h1>
          <p className="text-gray-500 text-sm mt-1">Manage platform users and overall access.</p>
        </div>
      </div>

      {needsSetup ? (
        <div className="bg-white rounded-xl shadow-sm border border-orange-200 overflow-hidden">
          <div className="p-6 bg-orange-50 border-b border-orange-200 flex items-start gap-4">
            <ShieldAlert className="text-orange-500 shrink-0 mt-1" size={24} />
            <div>
              <h2 className="text-lg font-bold text-orange-900">Database Setup Required</h2>
              <p className="text-orange-800 mt-1">
                To securely view all authenticated users, you need to create a secure database function.
                By default, clients cannot read from the auth.users table for security reasons.
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
                <li>Click <strong>New query</strong></li>
                <li>Paste the code and click <strong>Run</strong></li>
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
      ) : (
        <div className="bg-white border border-gray-100 shadow-sm rounded-xl overflow-hidden">
          <div className="p-4 bg-gray-50 border-b border-gray-100 flex items-center justify-between">
            <h2 className="font-bold text-gray-900 flex items-center gap-2">
              <Users size={18} className="text-indigo-600" />
              Registered Users ({users.length})
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
                    <th className="p-4 font-medium">Role</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-gray-100">
                  {users.map((u) => (
                    <tr key={u.id} className="hover:bg-indigo-50/30 transition-colors">
                      <td className="p-4">
                        <div className="font-medium text-gray-900">{u.email}</div>
                      </td>
                      <td className="p-4 text-xs font-mono text-gray-500">
                        {u.id}
                      </td>
                      <td className="p-4 text-sm text-gray-600">
                        {format(new Date(u.created_at), 'MMM d, yyyy h:mm a')}
                      </td>
                      <td className="p-4">
                        {u.email === 'hananirfan85@gmail.com' ? (
                          <span className="px-2 py-1 bg-indigo-100 text-indigo-800 text-xs font-bold rounded-md uppercase tracking-wide">Admin</span>
                        ) : (
                          <span className="px-2 py-1 bg-gray-100 text-gray-600 text-xs font-semibold rounded-md uppercase tracking-wide">Client</span>
                        )}
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          )}
        </div>
      )}
    </div>
  );
}
