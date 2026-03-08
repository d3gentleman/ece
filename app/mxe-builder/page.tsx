import { MXEBuilder } from '@/components/visualizations/MXEBuilder';

export default function MXEBuilderPage() {
  return (
    <div className="min-h-screen p-8">
      <div className="max-w-5xl mx-auto mb-8">
        <h1 className="text-4xl font-bold mb-4">MPC eXecution Environment (MXE) Builder</h1>
        <p className="text-zinc-400">
          Design your own MXE. An MXE is like an app-chain specifically tailored for encrypted execution. 
          Configure the cryptographic protocols, set the geographic regions, and define the hardware requirements for the Arx Nodes that will join your cluster.
        </p>
      </div>

      <MXEBuilder />
    </div>
  );
}
