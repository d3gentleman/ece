import { MPCVisualizer } from '@/components/visualizations/MPCVisualizer';

export default function VisualizerPage() {
  return (
    <div className="min-h-screen bg-zinc-950 text-white p-8">
      <div className="max-w-4xl mx-auto mb-8">
        <h1 className="text-4xl font-bold mb-6">Interactive MPC Visualizer</h1>
        <p className="text-zinc-400">
          Observe how data is split into secret shares and distributed across nodes to securely compute a result without ever revealing the original inputs.
        </p>
      </div>

      <MPCVisualizer />
    </div>
  );
}
