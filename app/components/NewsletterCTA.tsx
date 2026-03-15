'use client';

import { useState } from 'react';

type Status = 'idle' | 'loading' | 'success' | 'error';

export default function NewsletterCTA() {
  const [email, setEmail] = useState('');
  const [status, setStatus] = useState<Status>('idle');
  const [message, setMessage] = useState('');

  async function handleSubmit(e: React.FormEvent<HTMLFormElement>) {
    e.preventDefault();
    if (!email) return;
    setStatus('loading');
    setMessage('');
    try {
      const res = await fetch(
        'https://boomsauce-app-production.up.railway.app/api/subscribe',
        {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({ email, source: 'polypulse-newsletter' }),
        }
      );
      if (!res.ok) {
        const body = await res.json().catch(() => ({}));
        throw new Error((body as { error?: string }).error || `HTTP ${res.status}`);
      }
      setStatus('success');
      setMessage('You\'re subscribed. Check your inbox for confirmation.');
      setEmail('');
    } catch (err) {
      setStatus('error');
      setMessage(err instanceof Error ? err.message : 'Something went wrong. Please try again.');
    }
  }

  return (
    <div className="bg-gradient-to-br from-[#8b5cf6]/10 to-[#06b6d4]/10 border border-[#8b5cf6]/20 rounded-2xl p-8 text-center">
      <h3 className="text-xl font-bold text-white mb-2">
        Subscribe to PolyPulse Weekly
      </h3>
      <p className="text-sm text-[#9ca3af] mb-6 max-w-md mx-auto">
        Join traders getting weekly prediction market intelligence — market movers, smart money plays, and AI-powered signals.
      </p>
      <form onSubmit={handleSubmit}>
        <div className="flex flex-col sm:flex-row gap-3 max-w-md mx-auto">
          <input
            type="email"
            placeholder="your@email.com"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            required
            disabled={status === 'loading' || status === 'success'}
            className="flex-1 bg-[#0a0f1a] border border-[#1f2937] rounded-lg px-4 py-3 text-sm text-white placeholder-[#9ca3af] focus:outline-none focus:border-[#8b5cf6] transition-colors disabled:opacity-60"
          />
          <button
            type="submit"
            disabled={status === 'loading' || status === 'success'}
            className="bg-[#8b5cf6] hover:bg-[#7c3aed] text-white text-sm font-semibold px-6 py-3 rounded-lg transition-colors disabled:opacity-60 disabled:cursor-not-allowed"
          >
            {status === 'loading' ? 'Subscribing...' : status === 'success' ? 'Subscribed' : 'Subscribe'}
          </button>
        </div>
        {message ? (
          <p className={`text-xs mt-3 ${status === 'error' ? 'text-rose-400' : 'text-emerald-400'}`}>
            {message}
          </p>
        ) : (
          <p className="text-xs text-[#9ca3af]/60 mt-3">
            No spam, unsubscribe anytime.
          </p>
        )}
      </form>
    </div>
  );
}
