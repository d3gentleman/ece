import { reconstructSecret, splitSecret } from "@/simulation/secretSharing";
import type { MpcSimulationState, SimulationStep } from "@/types/mpcTypes";

export const SIMULATION_STEPS: SimulationStep[] = [
  "INPUT",
  "SPLIT",
  "DISTRIBUTE",
  "COMPUTE",
  "RECONSTRUCT",
];

export function assignSharesToNodeAssignments(
  shares: number[],
): Record<string, number> {
  return shares.reduce<Record<string, number>>((assignments, share, index) => {
    assignments[`node-${index + 1}`] = share;
    return assignments;
  }, {});
}

export function computeNodeAssignmentResult(
  nodeAssignments: Record<string, number>,
): number {
  return Object.values(nodeAssignments).reduce((sum, value) => sum + value, 0);
}

export function createInitialSimulationState(
  inputValue: number | null = null,
): MpcSimulationState {
  return {
    inputValue,
    shares: [],
    nodeAssignments: {},
    result: null,
    currentStep: "INPUT",
  };
}

export function advanceSimulationStep(
  state: MpcSimulationState,
  nodes: number,
): MpcSimulationState {
  if (!Number.isInteger(nodes) || nodes < 1) {
    throw new Error("nodes must be an integer greater than 0");
  }

  switch (state.currentStep) {
    case "INPUT":
      return {
        ...state,
        currentStep: "SPLIT",
      };

    case "SPLIT": {
      if (state.inputValue === null || !Number.isFinite(state.inputValue)) {
        throw new Error("inputValue must be set before splitting");
      }

      const shares = splitSecret(state.inputValue, nodes);
      return {
        ...state,
        shares,
        currentStep: "DISTRIBUTE",
      };
    }

    case "DISTRIBUTE": {
      const nodeAssignments = assignSharesToNodeAssignments(state.shares);

      return {
        ...state,
        nodeAssignments,
        currentStep: "COMPUTE",
      };
    }

    case "COMPUTE": {
      const result = computeNodeAssignmentResult(state.nodeAssignments);

      return {
        ...state,
        result,
        currentStep: "RECONSTRUCT",
      };
    }

    case "RECONSTRUCT":
      return {
        ...state,
        result: reconstructSecret(state.shares),
        currentStep: "RECONSTRUCT",
      };

    default:
      return state;
  }
}

export function runSimulation(
  inputValue: number,
  nodes: number,
): MpcSimulationState {
  let state = createInitialSimulationState(inputValue);

  for (let index = 0; index < SIMULATION_STEPS.length - 1; index += 1) {
    state = advanceSimulationStep(state, nodes);
  }

  return state;
}

export function runPlaceholderMpc(
  state: MpcSimulationState,
): MpcSimulationState {
  const inputValue = state.inputValue ?? 0;
  return runSimulation(inputValue, Math.max(1, state.shares.length || 3));
}
