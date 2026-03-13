'use client';

export default function NewsletterCTA() {
  return (
    <div className="bg-gradient-to-br from-[#8b5cf6]/10 to-[#06b6d4]/10 border border-[#8b5cf6]/20 rounded-2xl p-8 text-center">
      <h3 className="text-xl font-bold text-white mb-2">
        Subscribe to PolyPulse Weekly
      </h3>
      <p className="text-sm text-[#9ca3af] mb-6 max-w-md mx-auto">
        Join traders getting weekly prediction market intelligence — market movers, smart money plays, and AI-powered signals.
      </p>
      <div className="flex flex-col sm:flex-row gap-3 max-w-md mx-auto">
        <input
          type="email"
          placeholder="your@email.com"
          className="flex-1 bg-[#0a0f1a] border border-[#1f2937] rounded-lg px-4 py-3 text-sm text-white placeholder-[#9ca3af] focus:outline-none focus:border-[#8b5cf6] transition-colors"
          disabled
        />
        <button
          className="bg-[#8b5cf6] hover:bg-[#7c3aed] text-white text-sm font-semibold px-6 py-3 rounded-lg transition-colors cursor-not-allowed opacity-80"
          disabled
        >
          Subscribe
        </button>
      </div>
      <p className="text-xs text-[#9ca3af]/60 mt-3">
        Coming soon. No spam, unsubscribe anytime.
      </p>
    </div>
  );
}
