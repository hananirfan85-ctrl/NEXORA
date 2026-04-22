import React, { useEffect, useState } from 'react';
import { supabase } from '../lib/supabase';
import { useAuth } from '../contexts/AuthContext';
import { format } from 'date-fns';
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, Legend, LineChart, Line } from 'recharts';
import { DollarSign, TrendingUp, PackageSearch } from 'lucide-react';
import { formatCurrency } from '../lib/utils';

export default function Reports() {
  const { user } = useAuth();
  const [salesData, setSalesData] = useState<any[]>([]);
  const [summary, setSummary] = useState({ revenue: 0, profit: 0, itemsSold: 0 });

  useEffect(() => {
    if (user) fetchReportsData();
  }, [user]);

  const fetchReportsData = async () => {
    // Get last 30 days of sales
    const thirtyDaysAgo = new Date();
    thirtyDaysAgo.setDate(thirtyDaysAgo.getDate() - 30);

    const { data: sales } = await supabase
      .from('sales')
      .select('*')
      .gte('created_at', thirtyDaysAgo.toISOString())
      .order('created_at', { ascending: true });

    if (sales) {
      // Aggregate by day
      const dailyMap: Record<string, { date: string, revenue: number, profit: number }> = {};
      let totalRev = 0;
      let totalProf = 0;

      sales.forEach(sale => {
        const d = format(new Date(sale.created_at), 'MMM dd');
        if (!dailyMap[d]) dailyMap[d] = { date: d, revenue: 0, profit: 0 };
        dailyMap[d].revenue += Number(sale.total_amount);
        dailyMap[d].profit += Number(sale.total_profit);
        
        totalRev += Number(sale.total_amount);
        totalProf += Number(sale.total_profit);
      });

      setSalesData(Object.values(dailyMap));
      setSummary({ revenue: totalRev, profit: totalProf, itemsSold: sales.length }); // Approximation for items
    }
  };

  return (
    <div className="h-full flex flex-col space-y-6 overflow-y-auto pb-8 hide-scrollbar">
      <h1 className="text-2xl font-bold text-gray-900 flex-shrink-0">Analytics & Reports (Last 30 Days)</h1>

      {/* Summary Cards */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6 shrink-0">
        <div className="bg-white p-6 rounded-xl border border-gray-100 shadow-sm flex items-center gap-4">
          <div className="bg-indigo-100 p-4 rounded-full text-indigo-600"><DollarSign size={24} /></div>
          <div>
            <p className="text-sm font-medium text-gray-500">Gross Revenue</p>
            <p className="text-2xl font-bold text-gray-900">{formatCurrency(summary.revenue)}</p>
          </div>
        </div>
        <div className="bg-white p-6 rounded-xl border border-gray-100 shadow-sm flex items-center gap-4">
          <div className="bg-emerald-100 p-4 rounded-full text-emerald-600"><TrendingUp size={24} /></div>
          <div>
            <p className="text-sm font-medium text-gray-500">Net Profit</p>
            <p className="text-2xl font-bold text-gray-900">{formatCurrency(summary.profit)}</p>
          </div>
        </div>
        <div className="bg-white p-6 rounded-xl border border-gray-100 shadow-sm flex items-center gap-4">
          <div className="bg-blue-100 p-4 rounded-full text-blue-600"><PackageSearch size={24} /></div>
          <div>
            <p className="text-sm font-medium text-gray-500">Total Transactions</p>
            <p className="text-2xl font-bold text-gray-900">{summary.itemsSold}</p>
          </div>
        </div>
      </div>

      {/* Charts */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 min-h-[400px]">
        {/* Revenue Chart */}
        <div className="bg-white p-6 rounded-xl border border-gray-100 shadow-sm flex flex-col">
          <h2 className="text-lg font-bold text-gray-900 mb-6 font-sans">Daily Revenue</h2>
          <div className="flex-1 w-full min-h-[300px]">
            <ResponsiveContainer width="100%" height="100%">
              <BarChart data={salesData} margin={{ top: 0, right: 0, left: -20, bottom: 0 }}>
                <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#f3f4f6" />
                <XAxis dataKey="date" axisLine={false} tickLine={false} tick={{ fontSize: 12, fill: '#6b7280' }} dy={10} />
                <YAxis axisLine={false} tickLine={false} tick={{ fontSize: 12, fill: '#6b7280' }} tickFormatter={(val) => `Rs ${val}`} />
                <Tooltip cursor={{ fill: '#f9fafb' }} contentStyle={{ borderRadius: '8px', border: 'none', boxShadow: '0 4px 6px -1px rgb(0 0 0 / 0.1)' }} />
                <Bar dataKey="revenue" name="Revenue" fill="#4f46e5" radius={[4, 4, 0, 0]} />
              </BarChart>
            </ResponsiveContainer>
          </div>
        </div>

        {/* Profit Trend */}
        <div className="bg-white p-6 rounded-xl border border-gray-100 shadow-sm flex flex-col">
          <h2 className="text-lg font-bold text-gray-900 mb-6 font-sans">Profit Trend</h2>
          <div className="flex-1 w-full min-h-[300px]">
            <ResponsiveContainer width="100%" height="100%">
              <LineChart data={salesData} margin={{ top: 0, right: 0, left: -20, bottom: 0 }}>
                <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#f3f4f6" />
                <XAxis dataKey="date" axisLine={false} tickLine={false} tick={{ fontSize: 12, fill: '#6b7280' }} dy={10} />
                <YAxis axisLine={false} tickLine={false} tick={{ fontSize: 12, fill: '#6b7280' }} tickFormatter={(val) => `Rs ${val}`} />
                <Tooltip contentStyle={{ borderRadius: '8px', border: 'none', boxShadow: '0 4px 6px -1px rgb(0 0 0 / 0.1)' }} />
                <Line type="monotone" dataKey="profit" name="Profit" stroke="#10b981" strokeWidth={3} dot={{ r: 4, strokeWidth: 2 }} activeDot={{ r: 6 }} />
              </LineChart>
            </ResponsiveContainer>
          </div>
        </div>
      </div>
    </div>
  );
}
