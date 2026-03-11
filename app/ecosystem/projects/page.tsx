'use client';

import { motion } from 'framer-motion';
import { ExternalLink, Rocket } from 'lucide-react';

const projects = [
  {
    name: 'Umbra',
    category: 'DeFi / Privacy',
    description: 'A leading privacy protocol offering private transfers and encrypted swaps. Umbra was the first application launched on Arcium’s network.',
    tags: ['Payments', 'Swaps'],
    color: 'from-blue-500/20 to-blue-500/5'
  },
  {
    name: 'Nosana',
    category: 'AI / Computing',
    description: 'Decentralized GPU grid leveraging Arcium to process sensitive AI workloads in encrypted form, ensuring data privacy during inference.',
    tags: ['DePIN', 'AI Inference'],
    color: 'from-emerald-500/20 to-emerald-500/5'
  },
  {
    name: 'Jupiter',
    category: 'DeFi / Trading',
    description: 'Solana\'s premier DEX aggregator utilizing Arcium to explore trustless, decentralized dark pools to minimize MEV and quote fading.',
    tags: ['DEX', 'Dark Pools'],
    color: 'from-indigo-500/20 to-indigo-500/5'
  },
  {
    name: 'io.net',
    category: 'AI / Infrastructure',
    description: 'A decentralized computing network integrating with Arcium to facilitate secure, encrypted parallel processing for machine learning.',
    tags: ['DePIN', 'Machine Learning'],
    color: 'from-purple-500/20 to-purple-500/5'
  },
  {
    name: 'Squads',
    category: 'Infrastructure / Security',
    description: 'Smart contract wallet and multi-sig infrastructure utilizing Arcium for confidential transactions and highly secure key management.',
    tags: ['Wallets', 'Custody'],
    color: 'from-amber-500/20 to-amber-500/5'
  },
  {
    name: 'Send Arcade',
    category: 'Gaming',
    description: 'Fully onchain games enabling "hidden-information" elements, such as poker and blackjack, powered by Arcium\'s encrypted compute.',
    tags: ['Onchain Gaming', 'Casino'],
    color: 'from-rose-500/20 to-rose-500/5'
  }
];

export default function ProjectsPage() {
  return (
    <div className="min-h-screen text-white bg-black/[0.96] bg-[radial-gradient(ellipse_80%_80%_at_50%_-20%,rgba(120,119,198,0.3),rgba(255,255,255,0))]">
      <div className="max-w-7xl mx-auto px-6 pt-32 pb-24">
        
        {/* Header */}
        <div className="text-center max-w-3xl mx-auto mb-20 fade-in-up">
          <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-zinc-900 border border-zinc-800 mb-6 text-xs font-bold uppercase tracking-widest text-indigo-400">
            <Rocket className="w-3 h-3" /> Ecosystem Directory
          </div>
          <h1 className="text-5xl md:text-6xl font-extrabold tracking-tight mb-6 bg-gradient-to-b from-white to-zinc-400 bg-clip-text text-transparent">
            Built on Arcium
          </h1>
          <p className="text-xl text-zinc-400 leading-relaxed">
            Discover the applications, protocols, and infrastructure leveraging Multi-Party Computation to build the encrypted internet.
          </p>
        </div>

        {/* Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {projects.map((project, index) => (
            <motion.div
              initial={{ opacity: 0, scale: 0.95 }}
              animate={{ opacity: 1, scale: 1 }}
              transition={{ duration: 0.4, delay: index * 0.1 }}
              key={project.name}
              className="group relative rounded-3xl border border-zinc-800 bg-zinc-950/50 p-6 overflow-hidden hover:border-zinc-700 transition-colors flex flex-col h-full"
            >
              <div className={`absolute inset-0 bg-gradient-to-br ${project.color} opacity-0 group-hover:opacity-100 transition-opacity duration-500`} />
              
              <div className="relative z-10 flex flex-col h-full">
                <div className="flex justify-between items-start mb-4">
                  <h3 className="text-2xl font-bold text-white group-hover:text-indigo-300 transition-colors">
                    {project.name}
                  </h3>
                  <div className="w-8 h-8 rounded-full bg-zinc-900 border border-zinc-800 flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity duration-300 transition-transform group-hover:-translate-y-1 group-hover:translate-x-1">
                    <ExternalLink className="w-4 h-4 text-zinc-400" />
                  </div>
                </div>

                <div className="text-xs font-semibold text-zinc-500 uppercase tracking-wider mb-3">
                  {project.category}
                </div>
                
                <p className="text-zinc-400 leading-relaxed mb-6 flex-grow">
                  {project.description}
                </p>

                <div className="flex flex-wrap gap-2 mt-auto">
                  {project.tags.map(tag => (
                    <span key={tag} className="px-2.5 py-1 text-xs font-medium bg-zinc-900 border border-zinc-800 rounded-md text-zinc-300">
                      {tag}
                    </span>
                  ))}
                </div>
              </div>
            </motion.div>
          ))}
        </div>

      </div>
    </div>
  );
}
