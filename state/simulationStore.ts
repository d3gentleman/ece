import { create } from "zustand";
import {
  assignSharesToNodeAssignments,
  computeNodeAssignmentResult,
} from "@/simulation/mpcSimulation";
import {
  reconstructSecret as reconstructSecretFromShares,
  splitSecret,
} from "@/simulation/secretSharing";
import type { SimulationNode, SimulationStep } from "@/types/mpcTypes";

const orderedSteps: SimulationStep[] = [
  "INPUT",
  "SPLIT",
  "DISTRIBUTE",
  "COMPUTE",
  "RECONSTRUCT",
];

interface SimulationStoreState {
  inputSecret: number;
  nodeCount: number;
  shares: number[];
  nodes: SimulationNode[];
  result: number | null;
  currentStep: SimulationStep;
}

interface SimulationStoreActions {
  setInputSecret: (inputSecret: number) => void;
  setNodeCount: (nodeCount: number) => void;
  generateShares: () => void;
  distributeShares: () => void;
  computeShares: () => void;
  reconstructSecret: () => void;
  prevStep: () => void;
  nextStep: () => void;
  resetSimulation: () => void;
}

export type SimulationStore = SimulationStoreState & SimulationStoreActions;

const initialState: SimulationStoreState = {
  inputSecret: 0,
  nodeCount: 3,
  shares: [],
  nodes: [],
  result: null,
  currentStep: "INPUT",
};

export const useSimulationStore = create<SimulationStore>((set, get) => ({
  ...initialState,

  setInputSecret: (inputSecret) =>
    set((state) => ({
      ...state,
      inputSecret,
      shares: [],
      nodes: [],
      result: null,
      currentStep: "INPUT",
    })),

  setNodeCount: (nodeCount) =>
    set((state) => ({
      ...state,
      nodeCount: Math.max(1, Math.floor(nodeCount)),
      shares: [],
      nodes: [],
      result: null,
      currentStep: "INPUT",
    })),

  generateShares: () =>
    set((state) => ({
      ...state,
      shares: splitSecret(state.inputSecret, state.nodeCount),
      nodes: [],
      result: null,
      currentStep: "SPLIT",
    })),

  distributeShares: () =>
    set((state) => {
      const assignments = assignSharesToNodeAssignments(state.shares);
      const nodes = Object.entries(assignments).map(([id, share]) => ({
        id,
        share,
      }));

      return {
        ...state,
        nodes,
        currentStep: "DISTRIBUTE",
      };
    }),

  computeShares: () =>
    set((state) => {
      const nodeAssignments = Object.fromEntries(
        state.nodes.map((node) => [node.id, node.share]),
      );
      const result = computeNodeAssignmentResult(nodeAssignments);

      return {
        ...state,
        result,
        currentStep: "COMPUTE",
      };
    }),

  reconstructSecret: () =>
    set((state) => ({
      ...state,
      result: reconstructSecretFromShares(state.shares),
      currentStep: "RECONSTRUCT",
    })),

  prevStep: () =>
    set((state) => {
      switch (state.currentStep) {
        case "RECONSTRUCT":
          return {
            ...state,
            currentStep: "COMPUTE",
          };
        case "COMPUTE":
          return {
            ...state,
            result: null,
            currentStep: "DISTRIBUTE",
          };
        case "DISTRIBUTE":
          return {
            ...state,
            nodes: [],
            result: null,
            currentStep: "SPLIT",
          };
        case "SPLIT":
          return {
            ...state,
            shares: [],
            nodes: [],
            result: null,
            currentStep: "INPUT",
          };
        case "INPUT":
        default:
          return state;
      }
    }),

  nextStep: () => {
    const state = get();

    switch (state.currentStep) {
      case "INPUT":
        get().generateShares();
        return;
      case "SPLIT":
        get().distributeShares();
        return;
      case "DISTRIBUTE":
        get().computeShares();
        return;
      case "COMPUTE":
        get().reconstructSecret();
        return;
      case "RECONSTRUCT":
        set((current) => ({
          ...current,
          currentStep: orderedSteps[orderedSteps.length - 1],
        }));
        return;
      default:
        return;
    }
  },

  resetSimulation: () => set(() => ({ ...initialState })),
}));
