import React, { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { supabase } from '../lib/supabase';
import { useAuth } from '../contexts/AuthContext';
import toast from 'react-hot-toast';
import { Send, Mail, CheckCircle, MessageSquare, Clock, Filter } from 'lucide-react';
import { format } from 'date-fns';

export default function ContactAdmin() {
  const { user } = useAuth();
  const [subject, setSubject] = useState('');
  const [message, setMessage] = useState('');
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [success, setSuccess] = useState(false);
  const [messages, setMessages] = useState<any[]>([]);
  const [loadingMessages, setLoadingMessages] = useState(false);

  useEffect(() => {
    if (user) {
      fetchMessages();
    }
  }, [user]);

  const fetchMessages = async () => {
    setLoadingMessages(true);
    try {
      const { data, error } = await supabase
        .from('user_messages')
        .select('*')
        .eq('user_id', user?.id)
        .order('created_at', { ascending: false });

      if (error) throw error;
      setMessages(data || []);
    } catch (err: any) {
      console.error(err);
    } finally {
      setLoadingMessages(false);
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!subject || !message || !user) return;

    setIsSubmitting(true);
    try {
      const { error } = await supabase.from('user_messages').insert([
        {
          user_id: user.id,
          email: user.email,
          subject,
          message,
          status: 'pending'
        }
      ]);

      if (error) {
        if (error.message.includes('does not exist')) {
          toast.error("Database table 'user_messages' is not setup by admin yet.");
        } else {
          throw error;
        }
      } else {
        toast.success("Message sent successfully!");
        setSubject('');
        setMessage('');
        setSuccess(true);
        fetchMessages();
        setTimeout(() => setSuccess(false), 3000);
      }
    } catch (err: any) {
      toast.error(err.message || 'Failed to send message.');
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div className="max-w-4xl mx-auto h-full space-y-6">
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div>
          <h1 className="text-2xl font-bold text-gray-900 flex items-center gap-2">
            <MessageSquare size={24} className="text-indigo-600" />
            Contact Admin
          </h1>
          <p className="text-gray-500 text-sm mt-1">Send a message directly to the administrator for support.</p>
        </div>
      </div>

      <motion.div
        initial={{ opacity: 0, y: 10 }}
        animate={{ opacity: 1, y: 0 }}
        className="bg-white rounded-xl shadow-sm border border-gray-100 overflow-hidden"
      >
        <div className="grid md:grid-cols-5 divide-y md:divide-y-0 md:divide-x divide-gray-100">
          
          <div className="p-6 md:col-span-3">
            <form onSubmit={handleSubmit} className="space-y-5">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Email <span className="text-gray-400 font-normal">(Sent as)</span></label>
                <div className="w-full px-4 py-2 bg-gray-50 text-gray-500 rounded-lg border border-gray-200 cursor-not-allowed">
                  {user?.email}
                </div>
              </div>
              
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Subject</label>
                <input
                  required
                  type="text"
                  value={subject}
                  onChange={(e) => setSubject(e.target.value)}
                  placeholder="Need help with..."
                  className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500 outline-none transition-all"
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Message</label>
                <textarea
                  required
                  rows={6}
                  value={message}
                  onChange={(e) => setMessage(e.target.value)}
                  placeholder="Write your issue or question here in detail..."
                  className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500 outline-none transition-all resize-none"
                />
              </div>

              <div className="pt-2">
                <button
                  type="submit"
                  disabled={isSubmitting || success}
                  className={`flex items-center justify-center gap-2 w-full py-3 rounded-lg font-medium transition-all ${
                    success 
                      ? 'bg-green-500 text-white' 
                      : 'bg-indigo-600 hover:bg-indigo-700 text-white shadow-sm'
                  } disabled:opacity-70`}
                >
                  {success ? (
                    <>
                      <CheckCircle size={18} />
                      Sent Successfully!
                    </>
                  ) : (
                    <>
                      <Send size={18} />
                      {isSubmitting ? 'Sending...' : 'Send Message to Admin'}
                    </>
                  )}
                </button>
              </div>
            </form>
          </div>
          
          <div className="p-6 md:col-span-2 bg-gray-50 flex flex-col items-center justify-center text-center space-y-4">
            <div className="w-16 h-16 bg-indigo-100 text-indigo-600 rounded-full flex items-center justify-center mb-2">
              <Mail size={32} />
            </div>
            <div>
              <h3 className="font-semibold text-gray-900 mb-2">Direct Channel</h3>
              <p className="text-gray-600 text-sm leading-relaxed px-4">
                Your message will be securely delivered to the system administrator. You will receive a direct reply to your registered email address ({user?.email}).
              </p>
            </div>
            <div className="mt-6 pt-6 border-t border-gray-200 w-full">
               <p className="text-xs text-gray-500">Average response time is within 24 hours.</p>
            </div>
          </div>
          
        </div>
      </motion.div>
      <motion.div
        initial={{ opacity: 0, y: 10 }}
        animate={{ opacity: 1, y: 0 }}
        className="bg-white rounded-xl shadow-sm border border-gray-100 overflow-hidden"
      >
        <div className="p-6 border-b border-gray-100 flex justify-between items-center bg-gray-50/50">
          <h2 className="text-lg font-semibold text-gray-900 flex items-center gap-2">
            <Clock size={20} className="text-indigo-600" />
            Message History
          </h2>
        </div>
        
        <div className="divide-y divide-gray-100 max-h-[500px] overflow-y-auto">
          {loadingMessages ? (
            <div className="p-8 text-center text-gray-500">Loading messages...</div>
          ) : messages.length === 0 ? (
            <div className="p-12 text-center text-gray-400">
              <MessageSquare size={32} className="mx-auto mb-3 opacity-20" />
              <p>No messages sent yet.</p>
            </div>
          ) : (
            messages.map((msg) => (
              <div key={msg.id} className="p-6 hover:bg-gray-50/50 transition-colors">
                <div className="flex justify-between items-start mb-3">
                  <div>
                    <span className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-semibold uppercase tracking-wide mr-3 ${
                      msg.status === 'replied' 
                        ? 'bg-green-100 text-green-800' 
                        : 'bg-amber-100 text-amber-800'
                    }`}>
                      {msg.status}
                    </span>
                    <span className="font-medium text-gray-900">{msg.subject}</span>
                  </div>
                  <span className="text-sm text-gray-500">{format(new Date(msg.created_at), 'MMM d, yyyy h:mm a')}</span>
                </div>
                
                <p className="text-gray-600 text-sm whitespace-pre-wrap mb-4 bg-white p-4 rounded-lg border border-gray-100 shadow-sm">{msg.message}</p>
                
                {msg.reply && (
                  <div className="ml-6 pl-4 border-l-2 border-indigo-200 mt-2 bg-indigo-50/30 p-4 rounded-r-lg">
                    <strong className="text-indigo-800 text-xs uppercase tracking-wider block mb-2">Admin Reply</strong>
                    <p className="text-gray-800 text-sm whitespace-pre-wrap">{msg.reply}</p>
                  </div>
                )}
              </div>
            ))
          )}
        </div>
      </motion.div>
    </div>
  );
}
