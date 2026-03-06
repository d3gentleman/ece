"use client";

import { useSimulationStore } from "@/state/simulationStore";
import type { SimulationStep } from "@/types/mpcTypes";

const stages: Array<{
  step: SimulationStep;
  colorClass: string;
}> = [
  { step: "INPUT", colorClass: "bg-slate-500" },
  { step: "SPLIT", colorClass: "bg-purple-500" },
  { step: "DISTRIBUTE", colorClass: "bg-blue-500" },
  { step: "COMPUTE", colorClass: "bg-orange-500" },
  { step: "RECONSTRUCT", colorClass: "bg-green-500" },
];

export default function StepProgressBar() {
  const currentStep = useSimulationStore((state) => state.currentStep);

  return (
    <section className="rounded-lg border border-slate-200 bg-white p-4">
      <h2 className="text-sm font-semibold tracking-wide text-slate-700">
        Simulation Stages
      </h2>

      <div className="mt-3 flex flex-wrap items-center gap-2">
        {stages.map((stage, index) => {
          const isCurrent = stage.step === currentStep;

          return (
            <div key={stage.step} className="flex items-center gap-2">
              <div
                className={`flex items-center gap-2 rounded-md border px-3 py-2 transition ${
                  isCurrent
                    ? "border-slate-400 bg-slate-50 opacity-100"
                    : "border-slate-200 bg-slate-50/50 opacity-45"
                }`}
              >
                <span
                  className={`h-3 w-3 rounded-sm ${stage.colorClass}`}
                  aria-hidden="true"
                />
                <span className="text-xs font-semibold tracking-wide text-slate-800">
                  {stage.step}
                </span>
              </div>

              {index < stages.length - 1 ? (
                <span className="text-sm text-slate-400" aria-hidden="true">
                  →
                </span>
              ) : null}
            </div>
          );
        })}
      </div>
    </section>
  );
}
