'use client';

import { MXEBuilder } from '@/components/visualizations/MXEBuilder';
import { LessonContainer, LessonSection, SimulatorBridge } from '@/components/ui/LessonSection';
import { Code, Cpu, Shield, Users } from 'lucide-react';

export default function MXEBuilderPage() {
  return (
    <div className="min-h-screen text-white">
      <div className="max-w-5xl mx-auto px-6 pt-24 pb-16">

        <LessonContainer
          title="MPC eXecution Environments"
          subtitle="MXEs are the virtual machines of the encrypted supercomputer. Learn how they work before configuring your own."
          icon={Code}
          accentColor="indigo"
        >
          <LessonSection number={1} title="What is an MXE?" icon={Cpu} accentColor="indigo">
            <p>
              <strong>MXEs (MPC eXecution Environments)</strong> are dedicated, compartmentalized environments where computations are defined and securely executed. They allow for parallel processing—Clusters can concurrently compute for various MXEs—improving throughput and security.
            </p>
            <p>
              MXEs are highly configurable, enabling Computation Customers to define their security requirements, encryption schemes, and performance parameters. While individual computations are executed within specific Clusters of Arx Nodes, <strong>multiple Clusters can be associated with a single MXE</strong>, ensuring reliability even if certain nodes are offline or under high load.
            </p>
          </LessonSection>

          <LessonSection number={2} title="Configuring an MXE" icon={Code} accentColor="indigo">
            <p>
              When creating an MXE, customers configure several key aspects:
            </p>
            <div className="mt-2 space-y-3">
              <div className="p-3 bg-indigo-500/5 border border-indigo-500/15 rounded-lg">
                <p className="text-sm text-zinc-300"><strong>Execution Logic</strong> — The computation logic is defined as a circuit using the Arcis developer framework which compiles functions marked with <code className="text-indigo-300 bg-indigo-500/10 px-1 rounded">#[instruction]</code> into individual circuits.</p>
              </div>
              <div className="p-3 bg-indigo-500/5 border border-indigo-500/15 rounded-lg">
                <p className="text-sm text-zinc-300"><strong>Access Authority</strong> — Who can execute: None, Private (single entity), Restricted (defined list), or Public (anyone).</p>
              </div>
              <div className="p-3 bg-indigo-500/5 border border-indigo-500/15 rounded-lg">
                <p className="text-sm text-zinc-300"><strong>Parameters</strong> — Inputs can be Plaintext (raw, unencrypted) or Ciphertext (encrypted with a symmetric cipher).</p>
              </div>
            </div>
          </LessonSection>

          <LessonSection number={3} title="Cluster Permission Models" icon={Shield} accentColor="indigo">
            <p>
              Clusters that power MXEs come in three permission tiers, each offering different levels of control and decentralization:
            </p>
            <p>
              <strong>Fully-Permissioned:</strong> Organizations operate only their own internal Arx Nodes—ideal for stringent data security, regulatory obligations (e.g., GDPR), or highly sensitive computations.
            </p>
            <p>
              <strong>Partially-Permissioned:</strong> A hybrid model combining internal nodes with select external nodes. Useful when outsider oversight is desired alongside internal control, such as training AI models internally while validating results externally.
            </p>
            <p>
              <strong>Public/Non-Permissioned:</strong> Open to any verified Arx Node in the network. Only public clusters use the random node selection process for sybil resistance, promoting maximum decentralization.
            </p>
          </LessonSection>
        </LessonContainer>

        <SimulatorBridge accentColor="indigo" />
      </div>

      <div className="max-w-5xl mx-auto px-6 pb-16">
        <MXEBuilder />
      </div>
    </div>
  );
}
