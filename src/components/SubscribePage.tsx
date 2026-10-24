import React, { useState } from 'react';
import { Heart, Mail, Check } from 'lucide-react';

export const SubscribePage: React.FC = () => {
  const [email, setEmail] = useState('');
  const [status, setStatus] = useState<'idle' | 'loading' | 'success' | 'error'>('idle');
  const [message, setMessage] = useState('');

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setStatus('loading');
    
    try {
      const response = await fetch('/api/subscribe', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ email }),
      });
      
      const data = await response.json();
      
      if (response.ok) {
        setStatus('success');
        setMessage('Successfully subscribed! Check your email for confirmation.');
        setEmail('');
      } else {
        setStatus('error');
        setMessage(data.error || 'Subscription failed');
      }
    } catch (error) {
      setStatus('error');
      setMessage('Network error. Please try again.');
    }
  };

  return (
    <div className="min-h-screen bg-[#F8F9FA] flex items-center justify-center px-4 py-16">
      <div className="max-w-md w-full">
        <div className="bg-white rounded-3xl shadow-xl border border-purple-100 p-8">
          {/* Header */}
          <div className="text-center mb-8">
            <div className="inline-flex items-center justify-center w-16 h-16 rounded-full bg-gradient-to-br from-[#8B5CF6] to-[#EC4899] mb-4">
              <Heart className="w-8 h-8 text-white" />
            </div>
            <h1 className="font-display text-3xl font-bold text-[#111215] mb-2">
              Get Daily Affirmations
            </h1>
            <p className="text-neutral-600">
              Start each day with positive inspiration delivered to your inbox
            </p>
          </div>

          {/* Form */}
          <form onSubmit={handleSubmit} className="space-y-4">
            <div>
              <label htmlFor="email" className="block text-sm font-medium text-[#111215] mb-2">
                Email Address
              </label>
              <div className="relative">
                <Mail className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-neutral-400" />
                <input
                  type="email"
                  id="email"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  placeholder="your@email.com"
                  className="w-full pl-12 pr-4 py-3 rounded-xl border border-purple-100 focus:outline-none focus:ring-2 focus:ring-[#8B5CF6] focus:border-transparent"
                  required
                  disabled={status === 'loading' || status === 'success'}
                />
              </div>
            </div>

            {status === 'success' && (
              <div className="flex items-center gap-2 text-green-600 bg-green-50 px-4 py-3 rounded-xl">
                <Check className="w-5 h-5" />
                <span className="text-sm">{message}</span>
              </div>
            )}

            {status === 'error' && (
              <div className="text-red-600 bg-red-50 px-4 py-3 rounded-xl text-sm">
                {message}
              </div>
            )}

            <button
              type="submit"
              disabled={status === 'loading' || status === 'success'}
              className="w-full px-6 py-3 text-base font-semibold text-white bg-gradient-to-r from-[#8B5CF6] to-[#EC4899] hover:from-[#7C3AED] hover:to-[#DB2777] rounded-xl transition-all duration-200 shadow-lg shadow-purple-500/25 disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center gap-2"
            >
              {status === 'loading' ? (
                <div className="w-5 h-5 border-2 border-white border-t-transparent rounded-full animate-spin" />
              ) : status === 'success' ? (
                <>
                  <Check className="w-5 h-5" />
                  Subscribed
                </>
              ) : (
                'Subscribe Now'
              )}
            </button>
          </form>

          {/* Footer */}
          <p className="text-xs text-neutral-500 text-center mt-6">
            No spam, ever. Unsubscribe anytime.
          </p>
        </div>
      </div>
    </div>
  );
};
