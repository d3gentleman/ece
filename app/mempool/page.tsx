'use client';

import { MempoolRace } from '@/components/visualizations/MempoolRace';
import { LessonContainer, LessonSection, SimulatorBridge } from '@/components/ui/LessonSection';
import { Zap, Server, Database, Coins } from 'lucide-react';

export default function MempoolRacePage() {
  return (
    <div className="min-h-screen text-white">
      <div className="max-w-5xl mx-auto px-6 pt-24 pb-16">

        <LessonContainer
          title="Mempool &amp; Priority Fees"
          subtitle="Arcium uses Solana as its orchestration layer. Learn how computations are queued, prioritized, and executed before racing your own."
          icon={Zap}
          accentColor="purple"
        >
          <LessonSection number={1} title="Solana as Orchestration Layer" icon={Server} accentColor="purple">
            <p>
              The Arcium Network leverages Solana to orchestrate and manage computational workflows. Solana&apos;s high throughput and low latency enable Arcium&apos;s core processes to operate seamlessly onchain.
            </p>
            <p>
              Solana-based programs coordinate three key areas: <strong>Node Management</strong> (registration, configuration, and scheduling of Arx Nodes), <strong>Computation Orchestration</strong> (collecting computations into the mempool, assigning tasks to Clusters, processing results), and <strong>Network Economics</strong> (payments, rewards, staking, and slashing).
            </p>
          </LessonSection>

          <LessonSection number={2} title="The Global Mempool" icon={Database} accentColor="purple">
            <p>
              Arcium uses a <strong>single global mempool</strong> where all commissioned computations are queued and prioritized for execution. Once a computation enters the mempool:
            </p>
            <div className="mt-2 space-y-2">
              <div className="flex items-start gap-3">
                <span className="mt-1 w-1.5 h-1.5 rounded-full bg-purple-400 shrink-0" />
                <p className="text-sm text-zinc-300">It awaits execution by eligible Arx Nodes, prioritized based on priority fees and network conditions.</p>
              </div>
              <div className="flex items-start gap-3">
                <span className="mt-1 w-1.5 h-1.5 rounded-full bg-purple-400 shrink-0" />
                <p className="text-sm text-zinc-300">Validity windows (&quot;valid after&quot; and &quot;valid before&quot; timestamps) determine execution eligibility.</p>
              </div>
              <div className="flex items-start gap-3">
                <span className="mt-1 w-1.5 h-1.5 rounded-full bg-purple-400 shrink-0" />
                <p className="text-sm text-zinc-300">Tasks are assigned dynamically to available Clusters of Nodes.</p>
              </div>
            </div>
          </LessonSection>

          <LessonSection number={3} title="Priority Fee Markets" icon={Coins} accentColor="purple">
            <p>
              While base pricing provides a baseline cost per Computation Unit (CU), <strong>priority fees</strong> enable customers to expedite their tasks. These markets operate within <strong>Cluster-specific markets or Cluster unions</strong>—groups of interconnected Clusters sharing overlapping nodes.
            </p>
            <p>
              Computations only compete for resources with others that share the same nodes. For urgent computations, customers can offer a sufficiently high priority fee to <strong>temporarily monopolize a Cluster&apos;s resources</strong>, bypassing competing tasks.
            </p>
            <div className="mt-4 p-4 bg-purple-500/5 border border-purple-500/20 rounded-xl">
              <p className="text-xs uppercase tracking-widest text-purple-400 font-bold mb-2">Cost formula</p>
              <p className="text-sm text-zinc-300">
                Total Fee = <strong>Base Fee</strong> + <strong>Priority Fee</strong>. Both are divided by the number of CUs used, meaning combining computations does not affect the per-unit cost.
              </p>
            </div>
          </LessonSection>
        </LessonContainer>

        <SimulatorBridge accentColor="purple" />
      </div>

      <div className="max-w-5xl mx-auto px-6 pb-16">
        <MempoolRace />
      </div>
    </div>
  );
}
