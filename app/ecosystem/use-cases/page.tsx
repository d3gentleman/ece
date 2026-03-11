'use client';

import { ShieldCheck, HeartPulse, Building2, Coins, Server, LockKeyhole } from 'lucide-react';
import { motion } from 'framer-motion';

const useCases = [
  {
    title: 'Confidential DeFi & Dark Pools',
    description: 'Execute trades and swaps without revealing intent, eliminating MEV, frontrunning, and market manipulation. Prices and orders remain encrypted until execution.',
    icon: Coins,
    color: 'from-blue-500/20 to-blue-500/5',
    iconColor: 'text-blue-400'
  },
  {
    title: 'Collaborative AI Model Training',
    description: 'Train powerful models on sensitive data from multiple sources without any party exposing their raw datasets. Essential for healthcare and financial AI.',
    icon: Server,
    color: 'from-indigo-500/20 to-indigo-500/5',
    iconColor: 'text-indigo-400'
  },
  {
    title: 'Secure Healthcare Data Exchange',
    description: 'Allow medical researchers to run analytics across disparate hospital databases while maintaining strict patient confidentiality and regulatory compliance.',
    icon: HeartPulse,
    color: 'from-rose-500/20 to-rose-500/5',
    iconColor: 'text-rose-400'
  },
  {
    title: 'Institutional Identity & Compliance',
    description: 'Verify user identities and compliance statuses (KYC/AML) without publicly broadcasting PII onchain. Trustlessly prove attributes while hiding the underlying data.',
    icon: Building2,
    color: 'from-emerald-500/20 to-emerald-500/5',
    iconColor: 'text-emerald-400'
  },
  {
    title: 'Private Voting & Governance',
    description: 'Conduct DAOs or corporate elections where votes are cryptographically verified and tallied without revealing individual voter choices.',
    icon: ShieldCheck,
    color: 'from-purple-500/20 to-purple-500/5',
    iconColor: 'text-purple-400'
  },
  {
    title: 'Secure Multiplayer Gaming',
    description: 'Enable onchain games with "hidden information" states, such as fog of war or hidden hands in poker, entirely through trustless encrypted compute.',
    icon: LockKeyhole,
    color: 'from-amber-500/20 to-amber-500/5',
    iconColor: 'text-amber-400'
  }
];

export default function UseCasesPage() {
  return (
    <div className="min-h-screen text-white bg-black/[0.96] bg-[radial-gradient(ellipse_80%_80%_at_50%_-20%,rgba(120,119,198,0.3),rgba(255,255,255,0))]">
      <div className="max-w-7xl mx-auto px-6 pt-32 pb-24">
        
        {/* Header */}
        <div className="text-center max-w-3xl mx-auto mb-20 fade-in-up">
          <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-zinc-900 border border-zinc-800 mb-6 text-xs font-bold uppercase tracking-widest text-indigo-400">
            <LightbulbIcon className="w-3 h-3" /> Use Cases
          </div>
          <h1 className="text-5xl md:text-6xl font-extrabold tracking-tight mb-6 bg-gradient-to-b from-white to-zinc-400 bg-clip-text text-transparent">
            Powering the Encrypted Internet
          </h1>
          <p className="text-xl text-zinc-400 leading-relaxed">
            Arcium&apos;s Multi-Party Computation infrastructure unlocks new paradigms across every major industry by removing the tradeoff between data utility and data privacy.
          </p>
        </div>

        {/* Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {useCases.map((useCase, index) => {
            const Icon = useCase.icon;
            return (
              <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.5, delay: index * 0.1 }}
                key={useCase.title}
                className="group relative rounded-3xl border border-zinc-800 bg-zinc-950/50 p-8 overflow-hidden hover:border-zinc-700 transition-colors"
              >
                <div className={`absolute inset-0 bg-gradient-to-br ${useCase.color} opacity-0 group-hover:opacity-100 transition-opacity duration-500`} />
                
                <div className="relative z-10">
                  <div className={`w-12 h-12 rounded-xl bg-zinc-900 border border-zinc-800 flex items-center justify-center mb-6 ${useCase.iconColor}`}>
                    <Icon className="w-6 h-6" />
                  </div>
                  <h3 className="text-xl font-bold text-white mb-3">
                    {useCase.title}
                  </h3>
                  <p className="text-zinc-400 leading-relaxed">
                    {useCase.description}
                  </p>
                </div>
              </motion.div>
            );
          })}
        </div>

      </div>
    </div>
  );
}

function LightbulbIcon(props: React.SVGProps<SVGSVGElement>) {
  return (
    <svg
      {...props}
      xmlns="http://www.w3.org/2000/svg"
      width="24"
      height="24"
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth="2"
      strokeLinecap="round"
      strokeLinejoin="round"
    >
      <path d="M15 14c.2-1 .7-1.7 1.5-2.5 1-.9 1.5-2.2 1.5-3.5A6 6 0 0 0 6 8c0 1 .2 2.2 1.5 3.5.7.9 1.3 1.5 1.5 2.5" />
      <path d="M9 18h6" />
      <path d="M10 22h4" />
    </svg>
  );
}
