import { MempoolRace } from '@/components/visualizations/MempoolRace';

export default function MempoolRacePage() {
  return (
    <div className="min-h-screen p-8">
      <div className="max-w-5xl mx-auto mb-8">
        <h1 className="text-4xl font-bold mb-4">Solana Mempool Priority Race</h1>
        <p className="text-zinc-400">
          Computations on Arcium are queued via the global Solana Mempool. To prioritize your computation, you attach a Priority Fee. 
          Queue up jobs with varying fees below and watch the Arcium Clusters prioritize the highest-paying tasks for execution.
        </p>
      </div>

      <MempoolRace />
    </div>
  );
}
