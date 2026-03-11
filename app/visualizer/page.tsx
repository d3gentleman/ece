'use client';

import { MPCVisualizer } from '@/components/visualizations/MPCVisualizer';
import { LessonContainer, LessonSection, SimulatorBridge } from '@/components/ui/LessonSection';
import { BrainCircuit, Lock, Share2, ShieldCheck } from 'lucide-react';

export default function VisualizerPage() {
  return (
    <div className="min-h-screen text-white">
      <div className="max-w-5xl mx-auto px-6 pt-24 pb-16">

        <LessonContainer
          title="Multi-Party Computation"
          subtitle="Learn how Arcium enables multiple parties to jointly compute functions while keeping every individual input completely private."
          icon={BrainCircuit}
          accentColor="blue"
        >
          <LessonSection number={1} title="What is MPC?" icon={Lock} accentColor="blue">
            <p>
              Multi-Party Computation (MPC) is the cryptographic backbone of Arcium. It allows multiple parties to <strong>jointly compute a function over their inputs</strong> while keeping those inputs private—no single party ever sees another&apos;s data.
            </p>
            <p>
              In traditional computation, whoever processes the data must access it, exposing it to attacks, exploits, and risky trust assumptions. MPC eliminates this tradeoff entirely.
            </p>
          </LessonSection>

          <LessonSection number={2} title="Secret Sharing" icon={Share2} accentColor="blue">
            <p>
              <strong>Secret Sharing</strong> is a key cryptographic method within MPC. It works by splitting data into fragments that are distributed across Arx Nodes. No individual node has access to the full data.
            </p>
            <p>
              Each fragment alone is meaningless—only when combined in a specific way can the original data be reconstructed. This ensures that even if some nodes are compromised, the data remains secure.
            </p>
            <div className="mt-4 p-4 bg-blue-500/5 border border-blue-500/20 rounded-xl">
              <p className="text-xs uppercase tracking-widest text-blue-400 font-bold mb-2">How it works</p>
              <p className="text-sm text-zinc-300">
                Input data → Split into <strong>N shares</strong> → Distribute to <strong>N nodes</strong> → Each node computes on its share → Results are combined → Only the final output is revealed.
              </p>
            </div>
          </LessonSection>

          <LessonSection number={3} title="Trustless Execution" icon={ShieldCheck} accentColor="blue">
            <p>
              In the Arcium Network, computations are executed in a <strong>trustless manner</strong>, meaning no central authority is needed to verify the integrity of data processing.
            </p>
            <p>
              Instead, cryptographic mechanisms ensure computations are correct. Nodes are required to stake collateral to participate, and any deviation from the protocol results in penalties (slashing of stake). This guarantees that data remains confidential and computation outcomes are accurate.
            </p>
            <p>
              <strong>Threshold Encryption</strong> further ensures that the decryption process can only occur when a minimum number of authorized parties collaborate.
            </p>
          </LessonSection>
        </LessonContainer>

        <SimulatorBridge accentColor="blue" />
      </div>

      <div className="max-w-7xl mx-auto px-6 pb-16">
        <MPCVisualizer />
      </div>
    </div>
  );
}
