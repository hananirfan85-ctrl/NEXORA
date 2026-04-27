import React, { useState, useEffect } from 'react';
import { supabase } from '../lib/supabase';
import { useAuth } from '../contexts/AuthContext';
import { Send, MessageSquare, AlertCircle, CheckCircle, Clock } from 'lucide-react';

export default function ContactAdmin() {
  const { user } = useAuth();
  const [subject, setSubject] = useState('');
  const [message, setMessage] = useState('');
  const [loading, setLoading] = useState(false);
  const [success, setSuccess] = useState(false);
  const [error, setError] = useState('');
  const [history, setHistory] = useState<any[]>([]);
  const [historyLoading, setHistoryLoading] = useState(true);

  useEffect(() => {
    if (user) {
      fetchHistory();
    }
  }, [user]);

  const fetchHistory = async () => {
    try {
      setHistoryLoading(true);
      const { data, error } = await supabase
        .from('user_messages')
        .select('*')
        .eq('user_id', user?.id)
        .order('created_at', { ascending: false });

      if (error) throw error;
      setHistory(data || []);
    } catch (err: any) {
      console.error('Error fetching message history:', err);
      // Suppress PGRST205 for missing table
    } finally {
      setHistoryLoading(false);
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!user) return;
    
    setLoading(true);
    setError('');
    
    try {
      const { data, error: submitError } = await supabase.from('user_messages').insert([{
        user_id: user.id,
        email: user.email,
        subject,
        message,
        status: 'pending'
      }]).select().single();
      
      if (submitError) throw submitError;
      
      setSuccess(true);
      setSubject('');
      setMessage('');
      if (data) {
        setHistory(prev => [data, ...prev]);
      }
      
      setTimeout(() => setSuccess(false), 5000);
      
    } catch (err: any) {
      console.error('Submit error:', err);
      if (err.code === 'PGRST205') {
        setError('Messages table is not yet set up in the database. Please contact support.');
      } else {
        setError(err.message || 'Failed to send message. Please try again.');
      }
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="max-w-2xl mx-auto p-4 sm:p-6 lg:p-8">
      <div className="bg-white rounded-2xl shadow-sm border border-gray-100 p-6 md:p-8">
        <div className="flex items-center gap-4 border-b border-gray-100 pb-6 mb-6">
          <div className="bg-indigo-100 p-3 rounded-full text-indigo-600">
            <MessageSquare size={24} />
          </div>
          <div>
            <h1 className="text-2xl font-bold text-gray-900">Contact Admin</h1>
            <p className="text-sm text-gray-500">Send a direct message to the system administrator.</p>
          </div>
        </div>

        {error && (
          <div className="mb-6 p-4 bg-red-50 text-red-700 rounded-lg flex items-start gap-3 text-sm">
            <AlertCircle size={18} className="shrink-0 mt-0.5" />
            <p>{error}</p>
          </div>
        )}

        {success ? (
          <div className="py-8 text-center bg-gray-50 rounded-xl border border-gray-100">
            <div className="inline-flex bg-green-100 text-green-600 p-3 rounded-full mb-4">
              <CheckCircle size={32} />
            </div>
            <h3 className="text-lg font-bold text-gray-900 mb-2">Message Sent Successfully!</h3>
            <p className="text-gray-500 max-w-sm mx-auto">
              Your message has been securely sent to the administrator. They will review it shortly.
            </p>
            <button 
              onClick={() => setSuccess(false)}
              className="mt-6 text-indigo-600 font-medium hover:text-indigo-700"
            >
              Send another message
            </button>
          </div>
        ) : (
          <form onSubmit={handleSubmit} className="space-y-6">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Subject
              </label>
              <input
                type="text"
                value={subject}
                onChange={(e) => setSubject(e.target.value)}
                required
                className="w-full px-4 py-2 bg-gray-50 border border-gray-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:bg-white transition-colors"
                placeholder="Briefly state what this is about"
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Message Description
              </label>
              <textarea
                value={message}
                onChange={(e) => setMessage(e.target.value)}
                required
                rows={6}
                className="w-full px-4 py-3 bg-gray-50 border border-gray-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:bg-white transition-colors block resize-y"
                placeholder="Describe your issue or request in detail..."
              ></textarea>
            </div>

            <div className="pt-2">
              <button
                type="submit"
                disabled={loading}
                className="w-full flex items-center justify-center gap-2 bg-indigo-600 hover:bg-indigo-700 text-white font-medium py-3 px-6 rounded-xl transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
              >
                {loading ? (
                  <div className="w-5 h-5 border-2 border-white/30 border-t-white rounded-full animate-spin"></div>
                ) : (
                  <>
                    <Send size={18} />
                    Send Message
                  </>
                )}
              </button>
            </div>
          </form>
        )}
      </div>

      {history.length > 0 && (
        <div className="mt-8 bg-white rounded-2xl shadow-sm border border-gray-100 p-6 md:p-8">
          <h2 className="text-xl font-bold text-gray-900 mb-6">Message History</h2>
          <div className="space-y-6">
            {history.map((msg) => (
              <div key={msg.id} className="border border-gray-100 rounded-xl p-5 bg-gray-50/50">
                <div className="flex justify-between items-start mb-3">
                  <div>
                    <h3 className="font-semibold text-gray-900">{msg.subject}</h3>
                    <div className="flex items-center gap-2 mt-1 text-xs text-gray-500">
                      <Clock size={14} />
                      {new Date(msg.created_at).toLocaleString()}
                    </div>
                  </div>
                  <span className={`px-2.5 py-1 text-xs font-semibold rounded-full ${
                    msg.status === 'resolved' ? 'bg-green-100 text-green-700' :
                    msg.status === 'in_progress' ? 'bg-amber-100 text-amber-700' :
                    'bg-gray-200 text-gray-700'
                  }`}>
                    {msg.status.replace('_', ' ').toUpperCase()}
                  </span>
                </div>
                <div className="text-sm text-gray-700 mb-4 whitespace-pre-wrap bg-white p-3 rounded-lg border border-gray-100">
                  {msg.message}
                </div>
                
                {msg.reply && (
                  <div className="mt-4 bg-indigo-50 border border-indigo-100 rounded-lg p-4">
                    <div className="flex items-center gap-2 mb-2 text-indigo-700 font-semibold text-sm">
                      <MessageSquare size={16} />
                      Admin Reply:
                    </div>
                    <div className="text-sm text-indigo-900 whitespace-pre-wrap">
                      {msg.reply}
                    </div>
                  </div>
                )}
              </div>
            ))}
          </div>
        </div>
      )}
    </div>
  );
}
