"use client";

import { useSimulationStore } from "@/state/simulationStore";

const stepOrder = ["INPUT", "SPLIT", "DISTRIBUTE", "COMPUTE", "RECONSTRUCT"];

export default function StepController() {
  const currentStep = useSimulationStore((state) => state.currentStep);
  const generateShares = useSimulationStore((state) => state.generateShares);
  const nextStep = useSimulationStore((state) => state.nextStep);
  const resetSimulation = useSimulationStore((state) => state.resetSimulation);

  const stepIndex = stepOrder.indexOf(currentStep);
  const canAdvance = currentStep !== "INPUT" && currentStep !== "RECONSTRUCT";

  return (
    <section className="rounded-lg border border-slate-200 p-4">
      <div className="flex items-center justify-between">
        <h2 className="text-lg font-semibold">Step Controller</h2>
        <span className="rounded-full bg-slate-100 px-3 py-1 text-xs font-medium text-slate-600">
          step {Math.max(stepIndex + 1, 1)} of {stepOrder.length}: {currentStep}
        </span>
      </div>

      <div className="mt-3 flex flex-wrap gap-2">
        <button
          type="button"
          onClick={generateShares}
          className="rounded-md bg-slate-900 px-4 py-2 text-sm font-semibold text-white hover:bg-slate-700"
        >
          Start Simulation
        </button>

        <button
          type="button"
          onClick={nextStep}
          disabled={!canAdvance}
          className="rounded-md bg-slate-700 px-4 py-2 text-sm font-semibold text-white hover:bg-slate-600 disabled:cursor-not-allowed disabled:bg-slate-300 disabled:text-slate-500"
        >
          Next Step
        </button>

        <button
          type="button"
          onClick={resetSimulation}
          className="rounded-md border border-slate-300 bg-white px-4 py-2 text-sm font-semibold text-slate-700 hover:bg-slate-100"
        >
          Reset
        </button>
      </div>
    </section>
  );
}
