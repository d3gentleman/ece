import { SimulationStep } from '../engine';
import { useSimulationStore } from '../../state/simulationStore';

export const mpcSequence: SimulationStep[] = [
  {
    id: 'definition',
    name: 'Definition',
    description: 'A computation is defined within an MXE, specifying inputs, outputs, and access permissions.',
    action: () => {
      useSimulationStore.getState().setInputSecret(42);
    }
  },
  {
    id: 'commission',
    name: 'Commissioning',
    description: 'The defined computation is instantiated by specifying arguments, execution windows, and priority fees.',
    action: () => {
      useSimulationStore.getState().commissionComputation();
    }
  },
  {
    id: 'mempool',
    name: 'Mempool Placement',
    description: 'The commissioned computation is queued in the global Solana mempool waiting for Arcium Cluster execution.',
    action: () => {
      useSimulationStore.getState().enterMempool();
    }
  },
  {
    id: 'execution',
    name: 'Encrypted Execution',
    description: 'Arx Nodes within a Cluster securely execute the computation across encrypted data via Multi-Party Computation.',
    action: () => {
      useSimulationStore.getState().executeComputation();
    }
  },
  {
    id: 'callback',
    name: 'Post-Execution Callbacks',
    description: 'Following execution, dynamic onchain callbacks process the result and notify the recipient.',
    action: () => {
      useSimulationStore.getState().triggerCallback();
    }
  }
];
