'use client';

import { ArchitectureExplorer } from '@/components/visualizations/ArchitectureExplorer';
import { LessonContainer, LessonSection, SimulatorBridge } from '@/components/ui/LessonSection';
import { Activity, Cpu, Network, ShieldAlert } from 'lucide-react';

export default function ArchitecturePage() {
  return (
    <div className="min-h-screen text-white">
      <div className="max-w-5xl mx-auto px-6 pt-24 pb-16">

        <LessonContainer
          title="Arcium Architecture"
          subtitle="Understand how Arx Nodes, Clusters, and arxOS form the encrypted supercomputer, and how the network defends itself against attacks."
          icon={Activity}
          accentColor="emerald"
        >
          <LessonSection number={1} title="The Encrypted Supercomputer" icon={Cpu} accentColor="emerald">
            <p>
              Arcium&apos;s network is best understood as an <strong>encrypted supercomputer</strong>. Each Arx Node acts as a single processor contributing computational resources. Through the assembly and unification of all these processors, the supercomputer materializes.
            </p>
            <p>
              The stack consists of three layers: <strong>arxOS</strong> (the distributed, encrypted operating system powering all nodes), <strong>MXEs</strong> (MPC eXecution Environments—the virtual machines where computations are defined and securely executed), and <strong>Arcis</strong> (a Rust-based developer framework for building on top of the infrastructure).
            </p>
          </LessonSection>

          <LessonSection number={2} title="Clusters of Arx Nodes" icon={Network} accentColor="emerald">
            <p>
              <strong>Clusters</strong> are groups of Arx Nodes that collaborate to execute confidential computations. They are created by Computation Customers who define a set of nodes based on specific requirements, such as computational capacity, security features, and node reputations.
            </p>
            <p>
              Key cluster attributes include: <strong>Computational Load Capacity</strong> (the maximum volume a cluster can handle), <strong>Active Node Requirements</strong> (minimum number of active nodes, including a Node Priority List for backups), and <strong>Security Requirements</strong> (protocols that the cluster must follow).
            </p>
            <div className="mt-4 p-4 bg-emerald-500/5 border border-emerald-500/20 rounded-xl">
              <p className="text-xs uppercase tracking-widest text-emerald-400 font-bold mb-2">Key detail</p>
              <p className="text-sm text-zinc-300">
                A single Cluster can support <strong>multiple MXEs concurrently</strong>, and MXEs can be configured to utilize multiple Clusters—enabling high availability and flexible workload distribution.
              </p>
            </div>
          </LessonSection>

          <LessonSection number={3} title="Sybil Resistance" icon={ShieldAlert} accentColor="emerald">
            <p>
              Sybil attacks involve a single entity creating multiple false identities to disproportionately influence the network. Arcium counters this on two fronts:
            </p>
            <p>
              <strong>Intra-Cluster:</strong> At least one randomly selected node is included in every non-permissioned cluster, acting as an independent counterbalance. As long as one honest node exists, the cluster&apos;s integrity holds.
            </p>
            <p>
              <strong>Network-Wide:</strong> Strategies include increasing cluster node-set sizes, requiring Trusted Execution Environments (TEEs), node operator reputation systems, community monitoring, and imposing heavier slashing penalties for concurrent node downtimes—discouraging similar configs or geographic proximity.
            </p>
          </LessonSection>
        </LessonContainer>

        <SimulatorBridge accentColor="emerald" />
      </div>

      <div className="max-w-7xl mx-auto px-6 pb-16">
        <ArchitectureExplorer />
      </div>
    </div>
  );
}
