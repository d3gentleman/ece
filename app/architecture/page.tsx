import { ArchitectureExplorer } from '@/components/visualizations/ArchitectureExplorer';

export default function ArchitecturePage() {
  return (
    <div className="min-h-screen bg-zinc-950 text-white p-8">
      <div className="max-w-7xl mx-auto">
        <h1 className="text-4xl font-bold mb-4">Arcium Architecture Explorer</h1>
        <p className="text-zinc-400 max-w-3xl">
          Visualize the network topology consisting of Arx nodes grouped into execution clusters. Understand how Multipass Execution Environments (MXEs) are assigned, and trigger real-time defensive mechanisms like Sybil Resistance slashing.
        </p>
        
        <ArchitectureExplorer />
      </div>
    </div>
  );
}
