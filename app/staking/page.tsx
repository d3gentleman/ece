import { StakingSimulator } from '@/components/visualizations/StakingSimulator';

export default function StakingSimulatorPage() {
  return (
    <div className="min-h-screen p-8">
      <div className="max-w-5xl mx-auto mb-8">
        <h1 className="text-4xl font-bold mb-4">Staking & Delegation Simulator</h1>
        <p className="text-zinc-400">
          Learn the crypto-economics of running an Arx Node. Combine Self-Delegation, Hardware Claims, and Third-Party Delegations to maximize your node's computational capacity and earn rewards on the Arcium Network.
        </p>
      </div>

      <StakingSimulator />
    </div>
  );
}
