export default function Home() {
  return (
    <div className="flex flex-col items-center justify-center min-h-screen p-8 text-center bg-zinc-950 text-white font-sans">
      <main className="flex flex-col gap-8 max-w-4xl mx-auto">
        <h1 className="text-5xl font-extrabold tracking-tight">
          Welcome to <span className="text-indigo-500">Arcium Explorer</span>
        </h1>
        <p className="text-xl text-zinc-400">
          An interactive educational platform explaining the complex cryptographic infrastructure of the Arcium Network.
        </p>
        
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mt-8">
          <a href="/visualizer" className="p-6 border border-zinc-800 rounded-2xl hover:bg-zinc-900 transition-colors group">
            <h2 className="text-2xl font-bold mb-2 group-hover:text-indigo-400 transition-colors">MPC Visualizer &rarr;</h2>
            <p className="text-zinc-500">Interactive step-by-step Multi-Party Computation execution.</p>
          </a>
          
          <a href="/architecture" className="p-6 border border-zinc-800 rounded-2xl hover:bg-zinc-900 transition-colors group">
            <h2 className="text-2xl font-bold mb-2 group-hover:text-indigo-400 transition-colors">Architecture &rarr;</h2>
            <p className="text-zinc-500">Explore Arx nodes, clusters, and network sybil resistance.</p>
          </a>
          
          <a href="/learn/secret-sharing" className="p-6 border border-zinc-800 rounded-2xl hover:bg-zinc-900 transition-colors group md:col-span-2">
            <h2 className="text-2xl font-bold mb-2 group-hover:text-indigo-400 transition-colors">Start Learning &rarr;</h2>
            <p className="text-zinc-500">Read concepts and dive deeper into the protocols powering Arcium.</p>
          </a>
        </div>
      </main>
    </div>
  );
}
