'use client';

import { StakingSimulator } from '@/components/visualizations/StakingSimulator';
import { LessonContainer, LessonSection, SimulatorBridge } from '@/components/ui/LessonSection';
import { Pickaxe, Cpu, Coins, Users } from 'lucide-react';

export default function StakingSimulatorPage() {
  return (
    <div className="min-h-screen text-white">
      <div className="max-w-5xl mx-auto px-6 pt-24 pb-16">

        <LessonContainer
          title="Staking &amp; Delegation"
          subtitle="Staking is integral to the Arcium Network—it activates Arx Nodes and unlocks their computational resources. Learn how before you simulate."
          icon={Pickaxe}
          accentColor="amber"
        >
          <LessonSection number={1} title="Why Staking Matters" icon={Coins} accentColor="amber">
            <p>
              Staking activates Arx Nodes and unlocks their computational resources. <strong>Without sufficient stake, Nodes are ineligible to perform work</strong>, ensuring that computational resources are securely allocated to trusted and reliable Nodes.
            </p>
            <p>
              To activate an Arx Node, operators must meet a network constant called <strong>MINIMUM_SELF_DELEGATION_PER_1000_CLUSTERS</strong>, representing the minimum self-stake needed for the node to join up to 1,000 Clusters.
            </p>
          </LessonSection>

          <LessonSection number={2} title="The Node Hardware Claim" icon={Cpu} accentColor="amber">
            <p>
              When activating, a Node Operator makes a claim regarding their Node&apos;s <strong>maximum possible computational load capacity</strong>, called the Node Hardware Claim. This claim must be backed by a corresponding amount of delegated stake.
            </p>
            <div className="mt-4 p-4 bg-amber-500/5 border border-amber-500/20 rounded-xl">
              <p className="text-xs uppercase tracking-widest text-amber-400 font-bold mb-2">Key ratio</p>
              <p className="text-sm text-zinc-300">
                A network-wide constant called <strong>REQUIRED_STAKE_PER_UNIT_OF_CU_LOAD_CAPACITY</strong> links the amount of stake to the Node&apos;s claimed hardware spec. If total delegation falls short, the node is only assigned jobs proportional to its actual stake. If delegations exceed it, operators must upgrade hardware or face sub-linear reward reductions.
              </p>
            </div>
          </LessonSection>

          <LessonSection number={3} title="Delegation & Rewards" icon={Users} accentColor="amber">
            <p>
              There are two types of delegation: <strong>Self-delegation</strong> (stake that Arx Nodes commit to themselves) and <strong>Third-party delegation</strong> (external stakeholders who delegate assets to Arx Nodes).
            </p>
            <p>
              Computation rewards are distributed <strong>equally among all nodes</strong> participating in a Cluster for each computational job. Stake becomes active at the beginning of the next epoch after delegation. Delegators earn a pro-rata share of rewards (minus operator fees), and rewards auto-compound. Undelegation or redelegation triggers a one-epoch cooldown period.
            </p>
            <p>
              This near-linear stake-to-capacity relationship <strong>discourages centralization</strong> and promotes decentralized participation.
            </p>
          </LessonSection>
        </LessonContainer>

        <SimulatorBridge accentColor="amber" />
      </div>

      <div className="max-w-5xl mx-auto px-6 pb-16">
        <StakingSimulator />
      </div>
    </div>
  );
}
