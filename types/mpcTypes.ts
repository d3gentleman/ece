export type SimulationStep =
  | "DEFINITION"
  | "COMMISSION"
  | "MEMPOOL"
  | "EXECUTION"
  | "CALLBACK";

export interface SecretShare {
  id: string;
  owner: string;
  value: string;
}

export interface SimulationNode {
  id: string;
  share: number;
}

export interface MpcSimulationState {
  inputValue: number | null;
  shares: number[];
  nodeAssignments: Record<string, number>;
  result: number | null;
  currentStep: SimulationStep;
}
