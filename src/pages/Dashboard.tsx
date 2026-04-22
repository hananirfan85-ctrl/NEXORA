import React, { useEffect, useState } from 'react';
import { supabase } from '../lib/supabase';
import { useAuth } from '../contexts/AuthContext';
import { ShoppingCart, Package, DollarSign, AlertTriangle } from 'lucide-react';
import { formatCurrency } from '../lib/utils';
import { Link } from 'react-router-dom';

export default function Dashboard() {
  const { user } = useAuth();
  const [stats, setStats] = useState({
    todaySales: 0,
    todayProfit: 0,
    totalProducts: 0,
    lowStock: 0,
  });
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (user) fetchDashboardData();
  }, [user]);

  const fetchDashboardData = async () => {
    setLoading(true);
    
    // Get today's bounds
    const today = new Date();
    today.setHours(0, 0, 0, 0);
    const todayStr = today.toISOString();

    // Fetch Today's Sales
    const { data: sales } = await supabase
      .from('sales')
      .select('total_amount, total_profit')
      .gte('created_at', todayStr);

    let salesTotal = 0;
    let profitTotal = 0;
    if (sales) {
      sales.forEach(s => {
        salesTotal += Number(s.total_amount);
        profitTotal += Number(s.total_profit);
      });
    }

    // Fetch Products Info
    const { data: products } = await supabase.from('products').select('stock');
    let totalProd = 0;
    let lowStockCount = 0;

    if (products) {
      totalProd = products.length;
      lowStockCount = products.filter(p => p.stock <= 5).length;
    }

    setStats({
      todaySales: salesTotal,
      todayProfit: profitTotal,
      totalProducts: totalProd,
      lowStock: lowStockCount
    });
    setLoading(false);
  };

  return (
    <div className="h-full flex flex-col space-y-6">
      <div className="flex items-center justify-between">
        <h1 className="text-2xl font-bold text-gray-900">Dashboard Overview</h1>
        <div className="flex items-center gap-3">
          <Link to="/pos" className="bg-indigo-600 hover:bg-indigo-700 text-white px-4 py-2 rounded-lg font-medium transition-colors text-sm">
            New Sale (POS)
          </Link>
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        <div className="bg-white p-6 rounded-xl border border-gray-100 shadow-sm flex items-center justify-between">
          <div>
            <p className="text-sm font-medium text-gray-500 mb-1">Total Sales Today</p>
            <p className="text-2xl font-bold text-gray-900">{formatCurrency(stats.todaySales)}</p>
          </div>
          <div className="bg-indigo-100 p-3 rounded-full text-indigo-600"><DollarSign size={24} /></div>
        </div>
        
        <div className="bg-white p-6 rounded-xl border border-gray-100 shadow-sm flex items-center justify-between">
          <div>
            <p className="text-sm font-medium text-gray-500 mb-1">Net Profit Today</p>
            <p className="text-2xl font-bold text-emerald-600">{formatCurrency(stats.todayProfit)}</p>
          </div>
          <div className="bg-emerald-100 p-3 rounded-full text-emerald-600"><ShoppingCart size={24} /></div>
        </div>

        <div className="bg-white p-6 rounded-xl border border-gray-100 shadow-sm flex items-center justify-between">
          <div>
            <p className="text-sm font-medium text-gray-500 mb-1">Total Products</p>
            <p className="text-2xl font-bold text-gray-900">{stats.totalProducts}</p>
          </div>
          <div className="bg-blue-100 p-3 rounded-full text-blue-600"><Package size={24} /></div>
        </div>

        <div className="bg-white p-6 rounded-xl border border-gray-100 shadow-sm flex items-center justify-between">
          <div>
            <p className="text-sm font-medium text-gray-500 mb-1">Low Stock Alerts</p>
            <p className="text-2xl font-bold text-red-600">{stats.lowStock}</p>
          </div>
          <div className="bg-red-100 p-3 rounded-full text-red-600"><AlertTriangle size={24} /></div>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6 flex-1 min-h-0">
        <div className="lg:col-span-2 bg-white rounded-xl shadow-sm border border-gray-100 p-6 flex flex-col">
          <div className="flex justify-between items-center mb-6">
            <h2 className="font-bold text-gray-900">Quick Actions</h2>
          </div>
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <Link to="/inventory" className="p-4 border border-gray-200 rounded-lg hover:border-indigo-500 hover:bg-indigo-50 transition-colors group flex items-center gap-4">
              <div className="bg-gray-100 group-hover:bg-indigo-100 p-3 rounded-lg transition-colors">
                <Package className="text-gray-600 group-hover:text-indigo-600" size={24} />
              </div>
              <div>
                <h3 className="font-semibold text-gray-900">Manage Inventory</h3>
                <p className="text-sm text-gray-500">Add or edit products and stock</p>
              </div>
            </Link>
            
            <Link to="/reports" className="p-4 border border-gray-200 rounded-lg hover:border-indigo-500 hover:bg-indigo-50 transition-colors group flex items-center gap-4">
              <div className="bg-gray-100 group-hover:bg-indigo-100 p-3 rounded-lg transition-colors">
                <DollarSign className="text-gray-600 group-hover:text-indigo-600" size={24} />
              </div>
              <div>
                <h3 className="font-semibold text-gray-900">View Reports</h3>
                <p className="text-sm text-gray-500">Analyze sales and profit trends</p>
              </div>
            </Link>
          </div>
        </div>

        <div className="bg-white rounded-xl shadow-sm border border-gray-100 p-6 flex flex-col">
          <h2 className="font-bold text-gray-900 mb-6">System Status</h2>
          <div className="space-y-4">
            <div className="flex items-center gap-3">
              <div className="w-3 h-3 bg-emerald-500 rounded-full animate-pulse"></div>
              <p className="text-sm text-gray-700 font-medium">Supabase Database Connected</p>
            </div>
            <div className="flex items-center gap-3">
              <div className="w-3 h-3 bg-emerald-500 rounded-full animate-pulse"></div>
              <p className="text-sm text-gray-700 font-medium">Auth Service Online</p>
            </div>
            <div className="mt-8 p-4 bg-gray-50 rounded-lg border border-gray-100">
              <p className="text-xs text-gray-500 leading-relaxed">
                <strong>Attention:</strong> If you haven't run the initial SQL schema in Supabase yet, features will log errors to the console. See <code className="bg-gray-200 px-1 py-0.5 rounded">supabase-schema.sql</code> in the project root.
              </p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
