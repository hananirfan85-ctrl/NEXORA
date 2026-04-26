import React, { useState } from 'react';
import { motion } from 'framer-motion';
import { supabase } from '../lib/supabase';
import { useAuth } from '../contexts/AuthContext';
import toast from 'react-hot-toast';
import { Send, Mail, CheckCircle, MessageSquare } from 'lucide-react';

export default function ContactAdmin() {
  const { user } = useAuth();
  const [subject, setSubject] = useState('');
  const [message, setMessage] = useState('');
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [success, setSuccess] = useState(false);

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
    </div>
  );
}
