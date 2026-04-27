import React, { useState, useEffect } from 'react';
import { supabase } from '../lib/supabase';
import { useAuth } from '../contexts/AuthContext';
import { Plus, ArrowDownCircle, ArrowUpCircle, Wallet, Trash2 } from 'lucide-react';
import toast from 'react-hot-toast';

interface CashFlow {
  id: string;
  date: string;
  type: 'income' | 'expense';
  amount: number;
  description: string;
}

export default function CashFlows() {
  const { user } = useAuth();
  const [cashFlows, setCashFlows] = useState<CashFlow[]>([]);
  const [loading, setLoading] = useState(true);
  const [isModalOpen, setIsModalOpen] = useState(false);

  // Form State
  const [date, setDate] = useState(new Date().toISOString().split('T')[0]);
  const [type, setType] = useState<'income' | 'expense'>('income');
  const [amount, setAmount] = useState('');
  const [description, setDescription] = useState('');

  useEffect(() => {
    if (user) fetchCashFlows();
  }, [user]);

  const fetchCashFlows = async () => {
    try {
      const { data, error } = await supabase
        .from('cash_flows')
        .select('*')
        .order('date', { ascending: false });

      if (error) throw error;
      setCashFlows(data || []);
    } catch (error) {
      console.error('Error fetching cash flows:', error);
      toast.error('Failed to load cash flows. You may be viewing offline data.');
    } finally {
      setLoading(false);
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!user) return;
    if (!amount || Number(amount) <= 0) {
      toast.error('Please enter a valid amount');
      return;
    }

    try {
      const { error } = await supabase.from('cash_flows').insert([{
        user_id: user.id,
        date,
        type,
        amount: Number(amount),
        description
      }]);

      if (error) throw error;
      toast.success('Record added successfully');
      setIsModalOpen(false);
      setAmount('');
      setDescription('');
      fetchCashFlows();
    } catch (error) {
      console.error('Error adding record:', error);
      toast.error('Failed to add record');
    }
  };

  const handleDelete = async (id: string) => {
    if (!confirm('Are you sure you want to delete this record?')) return;
    try {
      const { error } = await supabase.from('cash_flows').delete().eq('id', id);
      if (error) throw error;
      toast.success('Record deleted');
      fetchCashFlows();
    } catch (error) {
      console.error('Error deleting record:', error);
      toast.error('Failed to delete record');
    }
  };

  const totalIncome = cashFlows.filter(cf => cf.type === 'income').reduce((sum, cf) => sum + Number(cf.amount), 0);
  const totalExpense = cashFlows.filter(cf => cf.type === 'expense').reduce((sum, cf) => sum + Number(cf.amount), 0);
  const netBalance = totalIncome - totalExpense;

  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <div>
          <h1 className="text-2xl font-bold text-gray-900">Cash Flow</h1>
          <p className="text-gray-600 mt-1">Track your business income and expenses</p>
        </div>
        <button
          onClick={() => setIsModalOpen(true)}
          className="flex items-center px-4 py-2 bg-indigo-600 text-white rounded-md hover:bg-indigo-700"
        >
          <Plus className="w-5 h-5 mr-2" />
          Add Record
        </button>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        <div className="bg-white p-6 rounded-lg shadow-sm border border-gray-100 flex items-center justify-between">
          <div>
            <p className="text-sm font-medium text-gray-500 mb-1">Total Income</p>
            <p className="text-2xl font-bold text-green-600">PKR {totalIncome.toFixed(2)}</p>
          </div>
          <div className="p-3 bg-green-50 rounded-full">
            <ArrowDownCircle className="w-6 h-6 text-green-600" />
          </div>
        </div>

        <div className="bg-white p-6 rounded-lg shadow-sm border border-gray-100 flex items-center justify-between">
          <div>
            <p className="text-sm font-medium text-gray-500 mb-1">Total Expenses</p>
            <p className="text-2xl font-bold text-red-600">PKR {totalExpense.toFixed(2)}</p>
          </div>
          <div className="p-3 bg-red-50 rounded-full">
            <ArrowUpCircle className="w-6 h-6 text-red-600" />
          </div>
        </div>

        <div className="bg-white p-6 rounded-lg shadow-sm border border-gray-100 flex items-center justify-between">
          <div>
            <p className="text-sm font-medium text-gray-500 mb-1">Net Balance</p>
            <p className={`text-2xl font-bold ${netBalance >= 0 ? 'text-indigo-600' : 'text-red-600'}`}>
              PKR {netBalance.toFixed(2)}
            </p>
          </div>
          <div className={`p-3 rounded-full ${netBalance >= 0 ? 'bg-indigo-50' : 'bg-red-50'}`}>
            <Wallet className={`w-6 h-6 ${netBalance >= 0 ? 'text-indigo-600' : 'text-red-600'}`} />
          </div>
        </div>
      </div>

      <div className="bg-white rounded-lg shadow-sm border border-gray-100 overflow-hidden">
        <div className="p-6 border-b border-gray-100">
          <h2 className="text-lg font-semibold text-gray-800">Transaction History</h2>
        </div>
        <div className="overflow-x-auto">
          <table className="w-full text-left text-sm text-gray-500">
            <thead className="text-xs text-gray-700 uppercase bg-gray-50">
              <tr>
                <th className="px-6 py-4">Date</th>
                <th className="px-6 py-4">Type</th>
                <th className="px-6 py-4">Description</th>
                <th className="px-6 py-4">Amount</th>
                <th className="px-6 py-4">Actions</th>
              </tr>
            </thead>
            <tbody>
              {loading ? (
                <tr>
                  <td colSpan={5} className="px-6 py-4 text-center">Loading...</td>
                </tr>
              ) : cashFlows.length === 0 ? (
                <tr>
                  <td colSpan={5} className="px-6 py-4 text-center">No records found.</td>
                </tr>
              ) : (
                cashFlows.map((cf) => (
                  <tr key={cf.id} className="border-b border-gray-50 hover:bg-gray-50">
                    <td className="px-6 py-4 font-medium text-gray-900">{new Date(cf.date).toLocaleDateString()}</td>
                    <td className="px-6 py-4">
                      <span className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium capitalize ${
                        cf.type === 'income' ? 'bg-green-100 text-green-800' : 'bg-red-100 text-red-800'
                      }`}>
                        {cf.type}
                      </span>
                    </td>
                    <td className="px-6 py-4">{cf.description || '-'}</td>
                    <td className={`px-6 py-4 font-bold ${cf.type === 'income' ? 'text-green-600' : 'text-red-600'}`}>
                      {cf.type === 'income' ? '+' : '-'} PKR {Number(cf.amount).toFixed(2)}
                    </td>
                    <td className="px-6 py-4">
                      <button 
                        onClick={() => handleDelete(cf.id)}
                        className="text-red-500 hover:text-red-700"
                        title="Delete Record"
                      >
                        <Trash2 className="w-5 h-5" />
                      </button>
                    </td>
                  </tr>
                ))
              )}
            </tbody>
          </table>
        </div>
      </div>

      {isModalOpen && (
        <div className="fixed inset-0 bg-black/50 flex items-center justify-center p-4 z-50">
          <div className="bg-white rounded-lg p-6 w-full max-w-md">
            <h2 className="text-xl font-bold text-gray-900 mb-4">Add Cash Flow Record</h2>
            <form onSubmit={handleSubmit} className="space-y-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Type</label>
                <div className="grid grid-cols-2 gap-4">
                  <button
                    type="button"
                    onClick={() => setType('income')}
                    className={`py-2 px-4 rounded-md border text-sm font-medium ${
                      type === 'income' 
                        ? 'bg-green-50 border-green-200 text-green-700' 
                        : 'border-gray-300 text-gray-700 hover:bg-gray-50'
                    }`}
                  >
                    Income
                  </button>
                  <button
                    type="button"
                    onClick={() => setType('expense')}
                    className={`py-2 px-4 rounded-md border text-sm font-medium ${
                      type === 'expense' 
                        ? 'bg-red-50 border-red-200 text-red-700' 
                        : 'border-gray-300 text-gray-700 hover:bg-gray-50'
                    }`}
                  >
                    Expense
                  </button>
                </div>
              </div>
              
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Date</label>
                <input
                  type="date"
                  required
                  value={date}
                  onChange={(e) => setDate(e.target.value)}
                  className="w-full px-3 py-2 border rounded-md focus:ring-indigo-500 focus:border-indigo-500"
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Amount (PKR)</label>
                <input
                  type="number"
                  step="0.01"
                  required
                  min="0.01"
                  value={amount}
                  onChange={(e) => setAmount(e.target.value)}
                  placeholder="0.00"
                  className="w-full px-3 py-2 border rounded-md focus:ring-indigo-500 focus:border-indigo-500"
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Description (Optional)</label>
                <input
                  type="text"
                  value={description}
                  onChange={(e) => setDescription(e.target.value)}
                  placeholder="Rent, utilities, product sales..."
                  className="w-full px-3 py-2 border rounded-md focus:ring-indigo-500 focus:border-indigo-500"
                />
              </div>

              <div className="flex justify-end space-x-3 mt-6">
                <button
                  type="button"
                  onClick={() => setIsModalOpen(false)}
                  className="px-4 py-2 text-gray-700 hover:bg-gray-100 rounded-md"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="px-4 py-2 bg-indigo-600 text-white rounded-md hover:bg-indigo-700"
                >
                  Save Record
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}
