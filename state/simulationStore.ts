import { create } from "zustand";
import type { SimulationNode, SimulationStep } from "@/types/mpcTypes";

const orderedSteps: SimulationStep[] = [
  "DEFINITION",
  "COMMISSION",
  "MEMPOOL",
  "EXECUTION",
  "CALLBACK",
];

interface SimulationStoreState {
  inputSecret: number;
  nodeCount: number;
  priorityFee: number;
  nodes: SimulationNode[];
  result: number | null;
  currentStep: SimulationStep;
}

interface SimulationStoreActions {
  setInputSecret: (inputSecret: number) => void;
  setNodeCount: (nodeCount: number) => void;
  setPriorityFee: (fee: number) => void;
  commissionComputation: () => void;
  enterMempool: () => void;
  executeComputation: () => void;
  triggerCallback: () => void;
  prevStep: () => void;
  nextStep: () => void;
  resetSimulation: () => void;
}

export type SimulationStore = SimulationStoreState & SimulationStoreActions;

const initialState: SimulationStoreState = {
  inputSecret: 0,
  nodeCount: 3,
  priorityFee: 100,
  nodes: [],
  result: null,
  currentStep: "DEFINITION",
};

export const useSimulationStore = create<SimulationStore>((set, get) => ({
  ...initialState,

  setInputSecret: (inputSecret) =>
    set((state) => ({
      ...state,
      inputSecret,
      nodes: [],
      result: null,
      currentStep: "DEFINITION",
    })),

  setNodeCount: (nodeCount) =>
    set((state) => ({
      ...state,
      nodeCount: Math.max(1, Math.floor(nodeCount)),
      nodes: [],
      result: null,
      currentStep: "DEFINITION",
    })),

  setPriorityFee: (priorityFee) => set((state) => ({ ...state, priorityFee })),

  commissionComputation: () =>
    set((state) => ({
      ...state,
      currentStep: "COMMISSION",
    })),

  enterMempool: () =>
    set((state) => ({
      ...state,
      currentStep: "MEMPOOL",
    })),

  executeComputation: () =>
    set((state) => {
      // Mock nodes computing in a cluster
      const nodes = Array.from({ length: state.nodeCount }).map((_, i) => ({
        id: `node-${i}`,
        share: Math.floor(Math.random() * 100), // Visual representation only
      }));

      return {
        ...state,
        nodes,
        currentStep: "EXECUTION",
      };
    }),

  triggerCallback: () =>
    set((state) => ({
      ...state,
      result: state.inputSecret * 2, // Example dummy computation Output
      currentStep: "CALLBACK",
    })),

  prevStep: () =>
    set((state) => {
      switch (state.currentStep) {
        case "CALLBACK":
          return { ...state, result: null, currentStep: "EXECUTION" };
        case "EXECUTION":
          return { ...state, nodes: [], currentStep: "MEMPOOL" };
        case "MEMPOOL":
          return { ...state, currentStep: "COMMISSION" };
        case "COMMISSION":
          return { ...state, currentStep: "DEFINITION" };
        case "DEFINITION":
        default:
          return state;
      }
    }),

  nextStep: () => {
    const state = get();

    switch (state.currentStep) {
      case "DEFINITION":
        get().commissionComputation();
        return;
      case "COMMISSION":
        get().enterMempool();
        return;
      case "MEMPOOL":
        get().executeComputation();
        return;
      case "EXECUTION":
        get().triggerCallback();
        return;
      case "CALLBACK":
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
