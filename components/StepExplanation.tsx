"use client";

import { useSimulationStore } from "@/state/simulationStore";
import type { SimulationStep } from "@/types/mpcTypes";

const stageMessages: Record<SimulationStep, string> = {
  INPUT: "The user provides a private value.",
  SPLIT: "The value is divided into secret shares.",
  DISTRIBUTE: "Shares are sent to distributed nodes.",
  COMPUTE: "Nodes perform computation using the shares.",
  RECONSTRUCT: "The shares combine to produce the final result.",
};

export default function StepExplanation() {
  const currentStep = useSimulationStore((state) => state.currentStep);

  return (
    <section className="rounded-lg border border-slate-200 bg-white p-4">
      <div className="text-xs font-semibold uppercase tracking-wide text-slate-500">
        Current Stage
      </div>
      <div className="mt-1 text-sm font-semibold text-slate-900">
        {currentStep}
      </div>
      <p className="mt-2 text-sm text-slate-700">{stageMessages[currentStep]}</p>
    </section>
  );
}
