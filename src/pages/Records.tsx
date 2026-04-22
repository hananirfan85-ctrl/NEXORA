import React, { useEffect, useState } from 'react';
import { supabase, ActivityLog } from '../lib/supabase';
import { useAuth } from '../contexts/AuthContext';
import { format } from 'date-fns';
import { FileEdit, PlusSquare, Trash2, ShoppingBag, Clock } from 'lucide-react';

export default function Records() {
  const { user } = useAuth();
  const [logs, setLogs] = useState<ActivityLog[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (user) fetchLogs();
  }, [user]);

  const fetchLogs = async () => {
    setLoading(true);
    const { data } = await supabase
      .from('activity_logs')
      .select('*')
      .order('created_at', { ascending: false })
      .limit(100);
    
    if (data) setLogs(data);
    setLoading(false);
  };

  const getIcon = (action: string) => {
    switch(action) {
      case 'ADD_PRODUCT': return <PlusSquare size={16} className="text-emerald-600" />;
      case 'UPDATE_PRODUCT': return <FileEdit size={16} className="text-blue-600" />;
      case 'DELETE_PRODUCT': return <Trash2 size={16} className="text-red-600" />;
      case 'SALE': return <ShoppingBag size={16} className="text-indigo-600" />;
      default: return <Clock size={16} className="text-gray-500" />;
    }
  };

  const getColor = (action: string) => {
    switch(action) {
      case 'ADD_PRODUCT': return 'bg-emerald-100 border-emerald-200';
      case 'UPDATE_PRODUCT': return 'bg-blue-100 border-blue-200';
      case 'DELETE_PRODUCT': return 'bg-red-100 border-red-200';
      case 'SALE': return 'bg-indigo-100 border-indigo-200';
      default: return 'bg-gray-100 border-gray-200';
    }
  };

  return (
    <div className="h-full flex flex-col space-y-6">
      <div className="flex items-center justify-between">
        <h1 className="text-2xl font-bold text-gray-900">Activity Records</h1>
      </div>

      <div className="bg-white rounded-xl shadow-sm border border-gray-100 flex-1 overflow-auto p-6">
        {loading ? (
          <div className="text-center text-gray-500 py-8">Loading records...</div>
        ) : logs.length === 0 ? (
          <div className="text-center text-gray-500 py-8">No activity recorded yet.</div>
        ) : (
          <div className="relative border-l border-gray-200 ml-4 space-y-8 pb-4">
            {logs.map(log => (
              <div key={log.id} className="relative pl-8">
                {/* Timeline dot */}
                <div className={`absolute -left-3.5 top-1 w-7 h-7 rounded-full border-2 flex items-center justify-center ${getColor(log.action)}`}>
                  {getIcon(log.action)}
                </div>
                
                <div className="bg-gray-50 p-4 rounded-lg border border-gray-100 inline-block min-w-full sm:min-w-[400px]">
                  <p className="text-sm font-semibold text-gray-900 mb-1">{log.action.replace('_', ' ')}</p>
                  <p className="text-sm text-gray-600 mb-2">{log.description}</p>
                  <p className="text-xs text-gray-400 font-medium">
                    {format(new Date(log.created_at), 'PPP at p')}
                  </p>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
}
