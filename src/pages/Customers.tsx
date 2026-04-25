import React, { useState, useEffect } from 'react';
import { supabase } from '../lib/supabase';
import { useAuth } from '../contexts/AuthContext';
import { format } from 'date-fns';
import { Users, Search, Plus, MailOpen, TrendingUp, Filter, Star, BookOpen, Clock, LogIn, ArrowUpRight, ArrowDownRight } from 'lucide-react';
import { formatCurrency } from '../lib/utils';
import { motion, AnimatePresence } from 'motion/react';
import AdminPanel from './AdminPanel';

type Customer = {
  id: string;
  name: string;
  email: string;
  phone: string;
  address: string;
  loyalty_points: number;
  total_purchases: number;
  ledger_balance: number;
  created_at: string;
};

export default function Customers() {
  const { user } = useAuth();

  const [customers, setCustomers] = useState<Customer[]>([]);
  const [loading, setLoading] = useState(true);
  const [search, setSearch] = useState('');
  const [showAddModal, setShowAddModal] = useState(false);
  const [selectedTag, setSelectedTag] = useState<string>('all');
  
  // Ledger State
  const [selectedCustomerForLedger, setSelectedCustomerForLedger] = useState<Customer | null>(null);
  const [ledgerEntries, setLedgerEntries] = useState<any[]>([]);
  const [ledgerLoading, setLedgerLoading] = useState(false);
  const [newLedgerEntry, setNewLedgerEntry] = useState({ amount: '', type: 'charge', description: '' });

  // New Customer Form
  const [newCustomer, setNewCustomer] = useState({ name: '', email: '', phone: '', address: '' });

  useEffect(() => {
    fetchCustomers();
  }, []);

  const fetchCustomers = async () => {
    setLoading(true);
    const { data: userData } = await supabase.auth.getUser();
    if (!userData.user) return;
    
    // Using simple RLS queries
    const { data } = await supabase
      .from('customers')
      .select('*')
      .order('created_at', { ascending: false });
      
    if (data) setCustomers(data);
    setLoading(false);
  };

  const handleAddCustomer = async (e: React.FormEvent) => {
    e.preventDefault();
    const { data: userData } = await supabase.auth.getUser();
    if (!userData.user) return;

    await supabase.from('customers').insert([{
      user_id: userData.user.id,
      ...newCustomer
    }]);

    setShowAddModal(false);
    setNewCustomer({ name: '', email: '', phone: '', address: '' });
    fetchCustomers();
  };

  const openLedger = async (customer: Customer) => {
    setSelectedCustomerForLedger(customer);
    fetchLedger(customer.id);
  };

  const fetchLedger = async (customerId: string) => {
    setLedgerLoading(true);
    const { data } = await supabase
      .from('customer_ledgers')
      .select('*')
      .eq('customer_id', customerId)
      .order('created_at', { ascending: false });
      
    if (data) setLedgerEntries(data);
    setLedgerLoading(false);
  };

  const handleAddLedgerEntry = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!selectedCustomerForLedger || !user) return;
    const amount = parseFloat(newLedgerEntry.amount);
    if (isNaN(amount) || amount <= 0) return;
    
    const entryType = newLedgerEntry.type;

    await supabase.from('customer_ledgers').insert([{
      customer_id: selectedCustomerForLedger.id,
      user_id: user.id,
      amount: amount,
      type: entryType,
      description: newLedgerEntry.description
    }]);

    // Update customer ledger_balance
    let newBalance = Number(selectedCustomerForLedger.ledger_balance || 0);
    if (entryType === 'charge') {
       newBalance += amount;
    } else {
       newBalance -= amount;
    }

    await supabase.from('customers').update({ ledger_balance: newBalance }).eq('id', selectedCustomerForLedger.id);
    
    setNewLedgerEntry({ amount: '', type: 'charge', description: '' });
    fetchLedger(selectedCustomerForLedger.id);
    fetchCustomers();
    
    // Update local state for immediate feedback
    setSelectedCustomerForLedger(prev => prev ? { ...prev, ledger_balance: newBalance } : prev);
  };

  const filteredCustomers = customers.filter(c => {
    const matchesSearch = c.name.toLowerCase().includes(search.toLowerCase()) || 
                          (c.email || '').toLowerCase().includes(search.toLowerCase());
    if (!matchesSearch) return false;
    
    if (selectedTag === 'vip') return c.total_purchases > 50000;
    if (selectedTag === 'due') return Number(c.ledger_balance) > 0;
    if (selectedTag === 'new') return new Date(c.created_at).getTime() > Date.now() - 30 * 24 * 60 * 60 * 1000;
    return true;
  });

  return (
    <div className="h-full flex flex-col space-y-6">
      <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
        <div>
          <h1 className="text-2xl font-bold text-gray-900">Customer Management</h1>
          <p className="text-gray-500 text-sm mt-1">CRM: Track loyalty, ledgers, and purchase history.</p>
        </div>
        <button 
          onClick={() => setShowAddModal(true)}
          className="bg-indigo-600 text-white px-4 py-2 rounded-lg font-medium hover:bg-indigo-700 transition"
        >
          <span className="flex items-center gap-2">
            <Plus size={18} /> Add Customer
          </span>
        </button>
      </div>

      <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
         <div className="bg-white p-4 rounded-xl border border-gray-100 shadow-sm flex items-center justify-between">
           <div>
             <p className="text-sm text-gray-500 font-medium">Total Customers</p>
             <p className="text-2xl font-bold text-gray-900 mt-1">{customers.length}</p>
           </div>
           <div className="w-10 h-10 rounded-full bg-indigo-50 flex items-center justify-center text-indigo-600">
             <Users size={20} />
           </div>
         </div>
         <div className="bg-white p-4 rounded-xl border border-gray-100 shadow-sm flex items-center justify-between">
           <div>
             <p className="text-sm text-gray-500 font-medium">VIP Clients {'>'} 50k PKR</p>
             <p className="text-2xl font-bold text-gray-900 mt-1">{customers.filter(c => c.total_purchases > 50000).length}</p>
           </div>
           <div className="w-10 h-10 rounded-full bg-emerald-50 flex items-center justify-center text-emerald-600">
             <Star size={20} />
           </div>
         </div>
         <div className="bg-white p-4 rounded-xl border border-gray-100 shadow-sm flex items-center justify-between">
           <div>
             <p className="text-sm text-gray-500 font-medium">Total Ledger Due</p>
             <p className="text-2xl font-bold text-red-600 mt-1">
               {formatCurrency(customers.reduce((acc, c) => acc + (Number(c.ledger_balance) > 0 ? Number(c.ledger_balance) : 0), 0))}
             </p>
           </div>
           <div className="w-10 h-10 rounded-full bg-red-50 flex items-center justify-center text-red-600">
             <TrendingUp size={20} />
           </div>
         </div>
      </div>

      <div className="bg-white rounded-xl shadow-sm border border-gray-100 flex-1 overflow-hidden flex flex-col">
        <div className="p-4 border-b border-gray-100 flex flex-col sm:flex-row gap-4 items-center justify-between bg-gray-50">
          <div className="relative w-full sm:w-96">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400" size={18} />
            <input
              type="text"
              placeholder="Search by name or email..."
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              className="w-full pl-10 pr-4 py-2 border border-gray-200 rounded-lg text-sm focus:border-indigo-500 focus:ring-1 focus:ring-indigo-500 outline-none"
            />
          </div>
          <div className="flex gap-2 w-full sm:w-auto overflow-x-auto pb-1 sm:pb-0">
             <button 
               onClick={() => setSelectedTag('all')}
               className={`px-3 py-1.5 rounded-full text-xs font-bold transition-colors ${selectedTag === 'all' ? 'bg-indigo-600 text-white' : 'bg-gray-200 text-gray-600 hover:bg-gray-300'}`}
             >
               All
             </button>
             <button 
               onClick={() => setSelectedTag('due')}
               className={`px-3 py-1.5 rounded-full text-xs font-bold transition-colors ${selectedTag === 'due' ? 'bg-red-600 text-white' : 'bg-gray-200 text-gray-600 hover:bg-gray-300'}`}
             >
               Ledger Due
             </button>
             <button 
               onClick={() => setSelectedTag('vip')}
               className={`px-3 py-1.5 rounded-full text-xs font-bold transition-colors ${selectedTag === 'vip' ? 'bg-emerald-600 text-white' : 'bg-gray-200 text-gray-600 hover:bg-gray-300'}`}
             >
               VIPs
             </button>
          </div>
        </div>

        <div className="flex-1 overflow-auto">
          <table className="w-full text-left border-collapse min-w-[800px]">
            <thead>
              <tr className="bg-gray-50/50 text-gray-500 text-xs uppercase tracking-wider border-b border-gray-100 sticky top-0 backdrop-blur-sm">
                <th className="p-4 font-medium">Customer Details</th>
                <th className="p-4 font-medium">Contact</th>
                <th className="p-4 font-medium">Loyalty Score</th>
                <th className="p-4 font-medium">Ledger Balance</th>
                <th className="p-4 font-medium text-right">Actions</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-100">
              {loading ? (
                <tr><td colSpan={5} className="p-8 text-center text-gray-500">Loading CRM data...</td></tr>
              ) : filteredCustomers.length === 0 ? (
                <tr><td colSpan={5} className="p-8 text-center text-gray-500">No customers found.</td></tr>
              ) : (
                filteredCustomers.map((c) => (
                  <tr key={c.id} className="hover:bg-indigo-50/30 transition-colors">
                    <td className="p-4">
                      <div className="font-bold text-gray-900">{c.name}</div>
                      <div className="text-xs text-gray-500 mt-1">Added {format(new Date(c.created_at), 'MMM d, yyyy')}</div>
                    </td>
                    <td className="p-4">
                      {c.email && <div className="text-sm text-gray-600 text-sm overflow-hidden text-ellipsis max-w-[200px]">{c.email}</div>}
                      {c.phone && <div className="text-sm font-mono text-gray-500 mt-0.5">{c.phone}</div>}
                      {(!c.email && !c.phone) && <span className="text-xs text-gray-400">No contact info</span>}
                    </td>
                    <td className="p-4">
                      <div className="flex gap-1 items-center">
                         <Star size={14} className={c.loyalty_points > 100 ? "text-amber-400 fill-current" : "text-gray-300"} />
                         <span className="font-bold text-gray-700">{c.loyalty_points} <span className="text-xs font-normal text-gray-400">pts</span></span>
                      </div>
                    </td>
                    <td className="p-4">
                      <div className={`font-mono font-medium ${Number(c.ledger_balance) > 0 ? 'text-red-600' : Number(c.ledger_balance) < 0 ? 'text-emerald-600' : 'text-gray-500'}`}>
                        {Number(c.ledger_balance) > 0 ? 'Due: ' : Number(c.ledger_balance) < 0 ? 'Adv: ' : ''}
                        {formatCurrency(Math.abs(Number(c.ledger_balance) || 0))}
                      </div>
                    </td>
                    <td className="p-4 text-right space-x-2 flex justify-end gap-2">
                      <button 
                        onClick={() => openLedger(c)}
                        className="px-3 py-1.5 text-xs font-bold bg-indigo-50 text-indigo-700 hover:bg-indigo-100 rounded-lg transition border border-indigo-200 flex items-center gap-1.5"
                      >
                        <BookOpen size={14} /> Ledger
                      </button>
                    </td>
                  </tr>
                ))
              )}
            </tbody>
          </table>
        </div>
      </div>

      {/* Ledger Modal */}
      <AnimatePresence>
        {selectedCustomerForLedger && (
          <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/50 backdrop-blur-sm">
            <motion.div
              initial={{ opacity: 0, scale: 0.95 }}
              animate={{ opacity: 1, scale: 1 }}
              exit={{ opacity: 0, scale: 0.95 }}
              className="bg-white rounded-2xl shadow-xl w-full max-w-2xl overflow-hidden flex flex-col max-h-[90vh]"
            >
              <div className="p-6 border-b border-gray-100 flex justify-between items-center bg-gray-50 shrink-0">
                <div>
                  <h3 className="text-lg font-bold text-gray-900 flex items-center gap-2">
                    <BookOpen size={20} className="text-indigo-600" />
                    {selectedCustomerForLedger.name}'s Ledger
                  </h3>
                  <div className={`mt-1 text-sm font-bold ${Number(selectedCustomerForLedger.ledger_balance) > 0 ? 'text-red-600' : 'text-emerald-600'}`}>
                    Current Balance: {Number(selectedCustomerForLedger.ledger_balance) > 0 ? 'Due ' : 'Advance '} 
                    {formatCurrency(Math.abs(Number(selectedCustomerForLedger.ledger_balance) || 0))}
                  </div>
                </div>
                <button onClick={() => setSelectedCustomerForLedger(null)} className="p-2 text-gray-500 hover:bg-gray-200 rounded-lg">
                  <Plus className="rotate-45" size={20} />
                </button>
              </div>

              <div className="p-4 border-b border-gray-100 shrink-0 bg-white">
                <form onSubmit={handleAddLedgerEntry} className="flex gap-3 items-end">
                  <div className="w-1/4">
                    <label className="block text-xs font-bold text-gray-500 uppercase tracking-wider mb-1">Type</label>
                    <select
                      value={newLedgerEntry.type}
                      onChange={e => setNewLedgerEntry({...newLedgerEntry, type: e.target.value})}
                      className="w-full px-3 py-2.5 border border-gray-300 rounded-lg text-sm outline-none"
                    >
                      <option value="charge">Given on Credit (Charge)</option>
                      <option value="payment">Payment Received</option>
                    </select>
                  </div>
                  <div className="w-1/4">
                    <label className="block text-xs font-bold text-gray-500 uppercase tracking-wider mb-1">Amount</label>
                    <input
                      required
                      type="number"
                      min="0.01" step="0.01"
                      value={newLedgerEntry.amount}
                      onChange={e => setNewLedgerEntry({...newLedgerEntry, amount: e.target.value})}
                      className="w-full px-3 py-2.5 border border-gray-300 rounded-lg text-sm outline-none"
                      placeholder="0.00"
                    />
                  </div>
                  <div className="flex-1">
                    <label className="block text-xs font-bold text-gray-500 uppercase tracking-wider mb-1">Description</label>
                    <input
                      type="text"
                      required
                      value={newLedgerEntry.description}
                      onChange={e => setNewLedgerEntry({...newLedgerEntry, description: e.target.value})}
                      className="w-full px-3 py-2.5 border border-gray-300 rounded-lg text-sm outline-none"
                      placeholder="e.g. Paid cash, Or items bought"
                    />
                  </div>
                  <button type="submit" className="px-5 py-2.5 bg-indigo-600 text-white rounded-lg text-sm font-bold hover:bg-indigo-700">
                    Add
                  </button>
                </form>
              </div>

              <div className="flex-1 overflow-auto bg-gray-50">
                {ledgerLoading ? (
                  <div className="p-8 text-center text-gray-500">Loading ledger...</div>
                ) : ledgerEntries.length === 0 ? (
                  <div className="p-8 text-center text-gray-500">No ledger entries yet.</div>
                ) : (
                  <div className="divide-y divide-gray-100">
                    {ledgerEntries.map(entry => (
                      <div key={entry.id} className="p-4 flex items-center justify-between bg-white hover:bg-gray-50/50 transition">
                        <div className="flex items-center gap-4">
                          <div className={`p-2 rounded-full ${entry.type === 'charge' ? 'bg-red-50 text-red-600' : 'bg-emerald-50 text-emerald-600'}`}>
                            {entry.type === 'charge' ? <ArrowUpRight size={18} /> : <ArrowDownRight size={18} />}
                          </div>
                          <div>
                            <p className="font-bold text-gray-900">{entry.description}</p>
                            <p className="text-xs text-gray-500 mt-0.5">{format(new Date(entry.created_at), 'MMM d, yyyy h:mm a')}</p>
                          </div>
                        </div>
                        <div className={`font-mono font-bold text-lg ${entry.type === 'charge' ? 'text-red-600' : 'text-emerald-600'}`}>
                          {entry.type === 'charge' ? '+' : '-'}{formatCurrency(entry.amount)}
                        </div>
                      </div>
                    ))}
                  </div>
                )}
              </div>
            </motion.div>
          </div>
        )}
      </AnimatePresence>

      {/* Add Customer Modal */}
      <AnimatePresence>
        {showAddModal && (
          <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/50 backdrop-blur-sm">
            <motion.div
              initial={{ opacity: 0, scale: 0.95 }}
              animate={{ opacity: 1, scale: 1 }}
              exit={{ opacity: 0, scale: 0.95 }}
              className="bg-white rounded-2xl shadow-xl w-full max-w-md overflow-hidden"
            >
              <div className="p-6 border-b border-gray-100 flex justify-between items-center bg-gray-50">
                <h3 className="text-lg font-bold text-gray-900">Add to CRM</h3>
              </div>
              <form onSubmit={handleAddCustomer} className="p-6 space-y-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">Full Name</label>
                  <input
                    required
                    type="text"
                    value={newCustomer.name}
                    onChange={e => setNewCustomer({...newCustomer, name: e.target.value})}
                    className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-indigo-500"
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">Email <span className="text-gray-400 font-normal">(Optional)</span></label>
                  <input
                    type="email"
                    value={newCustomer.email}
                    onChange={e => setNewCustomer({...newCustomer, email: e.target.value})}
                    className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-indigo-500"
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">Phone <span className="text-gray-400 font-normal">(Optional)</span></label>
                  <input
                    type="text"
                    value={newCustomer.phone}
                    onChange={e => setNewCustomer({...newCustomer, phone: e.target.value})}
                    className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-indigo-500"
                  />
                </div>
                <div className="pt-4 flex gap-3">
                  <button
                    type="button"
                    onClick={() => setShowAddModal(false)}
                    className="flex-1 px-4 py-2 text-gray-700 bg-gray-100 hover:bg-gray-200 rounded-lg font-medium transition"
                  >
                    Cancel
                  </button>
                  <button
                    type="submit"
                    className="flex-1 px-4 py-2 text-white bg-indigo-600 hover:bg-indigo-700 rounded-lg font-medium transition"
                  >
                    Save Customer
                  </button>
                </div>
              </form>
            </motion.div>
          </div>
        )}
      </AnimatePresence>
    </div>
  );
}

