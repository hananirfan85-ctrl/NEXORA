import React, { useState } from 'react';
import { supabase } from '../lib/supabase';
import { useAuth } from '../contexts/AuthContext';
import { Send, MessageSquare, AlertCircle, CheckCircle } from 'lucide-react';

export default function ContactAdmin() {
  const { user } = useAuth();
  const [subject, setSubject] = useState('');
  const [message, setMessage] = useState('');
  const [loading, setLoading] = useState(false);
  const [success, setSuccess] = useState(false);
  const [error, setError] = useState('');

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!user) return;
    
    setLoading(true);
    setError('');
    
    try {
      const { error: submitError } = await supabase.from('user_messages').insert([{
        user_id: user.id,
        email: user.email,
        subject,
        message,
        status: 'pending'
      }]);
      
      if (submitError) throw submitError;
      
      setSuccess(true);
      setSubject('');
      setMessage('');
      
      // Auto-hide success message after some time
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
    </div>
  );
}
