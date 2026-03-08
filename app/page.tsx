import Link from 'next/link';
import { 
  BrainCircuit, 
  Activity, 
  Code, 
  Pickaxe, 
  Zap, 
  Book,
  ChevronRight,
  Shield,
  Cpu,
  Lock
} from 'lucide-react';

export default function Home() {
  const features = [
    {
      title: 'MPC Visualizer',
      description: 'Interactive step-by-step Multi-Party Computation execution and encrypted data flows.',
      href: '/visualizer',
      icon: BrainCircuit,
      color: 'text-blue-400',
      bg: 'bg-blue-500/10',
      border: 'border-blue-500/20'
    },
    {
      title: 'Architecture',
      description: 'Explore Arx nodes, clusters, and network sybil resistance mechanisms.',
      href: '/architecture',
      icon: Activity,
      color: 'text-emerald-400',
      bg: 'bg-emerald-500/10',
      border: 'border-emerald-500/20'
    },
    {
      title: 'MXE Builder',
      description: 'Configure and deploy specialized MPC eXecution Environments.',
      href: '/mxe-builder',
      icon: Code,
      color: 'text-indigo-400',
      bg: 'bg-indigo-500/10',
      border: 'border-indigo-500/20'
    },
    {
      title: 'Staking Simulator',
      description: 'Test node activation, hardware claims, and delegation rewards.',
      href: '/staking',
      icon: Pickaxe,
      color: 'text-amber-400',
      bg: 'bg-amber-500/10',
      border: 'border-amber-500/20'
    },
    {
      title: 'Mempool Race',
      description: 'Visualize priority fee markets and global computation queuing.',
      href: '/mempool',
      icon: Zap,
      color: 'text-purple-400',
      bg: 'bg-purple-500/10',
      border: 'border-purple-500/20'
    },
    {
      title: 'Glossary',
      description: 'Comprehensive reference for Arcium protocols and terminology.',
      href: '/glossary',
      icon: Book,
      color: 'text-rose-400',
      bg: 'bg-rose-500/10',
      border: 'border-rose-500/20'
    }
  ];

  return (
    <div className="flex flex-col min-h-screen bg-black text-white selection:bg-indigo-500/30">
      <main className="flex-1 flex flex-col items-center px-6 pt-20 pb-32 max-w-7xl mx-auto w-full">
        
        {/* Hero Section */}
        <div className="text-center mb-24 relative">
          <div className="absolute -top-20 left-1/2 -translate-x-1/2 w-96 h-96 bg-indigo-500/10 blur-[120px] rounded-full -z-10" />
          
          <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-zinc-900 border border-zinc-800 mb-6 text-xs font-bold uppercase tracking-widest text-indigo-400">
            <Shield size={12} />
            Encrypted Computing Infrastructure
          </div>
          <h1 className="text-5xl md:text-7xl font-extrabold tracking-tight mb-6 bg-gradient-to-b from-white to-zinc-500 bg-clip-text text-transparent">
            Arcium <span className="text-indigo-500">Edu</span>
          </h1>
          
          <p className="text-xl text-zinc-400 max-w-2xl mx-auto leading-relaxed">
            The interactive portal to the world's most advanced encrypted supercomputer. 
            Visual aids to understand the future of decentralized confidentiality.
          </p>
        </div>

        {/* Feature Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 w-full">
          {features.map((feature) => (
            <Link 
              key={feature.title}
              href={feature.href}
              className={`group relative flex flex-col p-8 bg-black border ${feature.border} rounded-3xl hover:border-zinc-700 transition-all hover:bg-zinc-900/40 hover:-translate-y-1`}
            >
              <div className={`w-12 h-12 ${feature.bg} rounded-2xl flex items-center justify-center mb-6 group-hover:scale-110 transition-transform`}>
                <feature.icon className={`${feature.color}`} size={24} />
              </div>
              
              <h2 className="text-2xl font-bold mb-3 flex items-center gap-2">
                {feature.title}
                <ChevronRight className="opacity-0 -translate-x-2 group-hover:opacity-100 group-hover:translate-x-0 transition-all text-zinc-600" size={20} />
              </h2>
              
              <p className="text-zinc-500 text-sm leading-relaxed mb-6 flex-1">
                {feature.description}
              </p>

              <div className="flex items-center gap-4 text-[10px] font-bold uppercase tracking-widest text-zinc-600">
                <span className="flex items-center gap-1"><Cpu size={10} /> Interactive</span>
                <span className="flex items-center gap-1"><Lock size={10} /> Secure</span>
              </div>

              {/* Hover Glow */}
              <div className="absolute inset-0 bg-gradient-to-br from-white/[0.03] to-transparent opacity-0 group-hover:opacity-100 transition-opacity rounded-3xl" />
            </Link>
          ))}
        </div>

        {/* Bottom Banner */}
        <div className="mt-32 w-full p-12 rounded-[2.5rem] bg-indigo-600 relative overflow-hidden flex flex-col items-center text-center">
          <div className="absolute inset-0 bg-[radial-gradient(circle_at_top_right,rgba(255,255,255,0.2),transparent)]" />
          <div className="relative z-10">
            <h2 className="text-3xl md:text-4xl font-bold text-white mb-4">Ready to Build Encrypted?</h2>
            <p className="text-indigo-100 mb-8 max-w-xl mx-auto">
              Join the Arcium ecosystem and start developing privacy-preserving applications today with our powerful Arcis framework.
            </p>
            <div className="flex flex-wrap justify-center gap-4">
              <a 
                href="https://docs.arcium.com" 
                target="_blank"
                className="px-8 py-3 bg-white text-indigo-600 font-bold rounded-full hover:bg-zinc-100 transition-colors shadow-xl"
              >
                Documentation
              </a>
              <a 
                href="https://discord.com/invite/arcium" 
                target="_blank"
                className="px-8 py-3 bg-indigo-500 text-white font-bold rounded-full border border-indigo-400 hover:bg-indigo-400 transition-colors"
              >
                Join Discord
              </a>
            </div>
          </div>
          
          {/* Decorative Elements */}
          <div className="absolute -bottom-10 -right-10 w-40 h-40 bg-white/10 rounded-full blur-3xl" />
          <div className="absolute -top-10 -left-10 w-40 h-40 bg-zinc-900/20 rounded-full blur-3xl" />
        </div>

      </main>
      
      {/* Footer */}
      <footer className="py-12 border-t border-zinc-900 text-center">
        <p className="text-zinc-600 text-sm">
          &copy; {new Date().getFullYear()} Arcium Network. All rights reserved.
        </p>
      </footer>
    </div>
  );
}
