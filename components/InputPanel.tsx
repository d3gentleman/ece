"use client";

import { useState } from "react";
import { useSimulationStore } from "@/state/simulationStore";

export default function InputPanel() {
  const storeSecret = useSimulationStore((state) => state.inputSecret);
  const storeNodeCount = useSimulationStore((state) => state.nodeCount);
  const currentStep = useSimulationStore((state) => state.currentStep);
  const setInputSecret = useSimulationStore((state) => state.setInputSecret);
  const setNodeCount = useSimulationStore((state) => state.setNodeCount);
  const generateShares = useSimulationStore((state) => state.generateShares);
  const prevStep = useSimulationStore((state) => state.prevStep);
  const nextStep = useSimulationStore((state) => state.nextStep);
  const resetSimulation = useSimulationStore((state) => state.resetSimulation);

  const [secretInput, setSecretInput] = useState<string>(`${storeSecret}`);
  const [nodeCountInput, setNodeCountInput] = useState<string>(`${storeNodeCount}`);
  const [errorMessage, setErrorMessage] = useState<string | null>(null);
  const [hasNextClicked, setHasNextClicked] = useState(false);
  const canAdvance = currentStep !== "INPUT" && currentStep !== "RECONSTRUCT";
  const canGoBack = hasNextClicked && currentStep !== "INPUT";

  const handleStart = (event: React.FormEvent<HTMLFormElement>) => {
    event.preventDefault();

    const parsedSecret = Number(secretInput);
    const parsedNodeCount = Number(nodeCountInput);

    if (!Number.isInteger(parsedSecret)) {
      setErrorMessage("Secret must be an integer.");
      return;
    }

    if (!Number.isInteger(parsedNodeCount) || parsedNodeCount < 1) {
      setErrorMessage("Node count must be an integer greater than 0.");
      return;
    }

    setErrorMessage(null);
    setInputSecret(parsedSecret);
    setNodeCount(parsedNodeCount);
    generateShares();
    setHasNextClicked(false);
  };

  const handleNext = () => {
    if (!canAdvance) {
      return;
    }

    setHasNextClicked(true);
    nextStep();
  };

  const handleBack = () => {
    if (!canGoBack) {
      return;
    }

    prevStep();
  };

  const handleReset = () => {
    setHasNextClicked(false);
    resetSimulation();
  };

  return (
    <section className="rounded-lg border border-slate-200 p-4">
      <div className="flex items-center justify-between">
        <h2 className="text-lg font-semibold">Input Panel</h2>
        <span className="rounded-full bg-slate-100 px-3 py-1 text-xs font-medium text-slate-600">
          step: {currentStep}
        </span>
      </div>

      <form onSubmit={handleStart} className="mt-3 grid gap-3 sm:grid-cols-2">
        <label className="flex flex-col gap-1 text-sm text-slate-700">
          Secret integer
          <input
            type="number"
            step={1}
            value={secretInput}
            onChange={(event) => setSecretInput(event.target.value)}
            className="rounded-md border border-slate-300 px-3 py-2 text-sm text-slate-900 outline-none focus:border-slate-500"
            placeholder="42"
          />
        </label>

        <label className="flex flex-col gap-1 text-sm text-slate-700">
          Node count
          <input
            type="number"
            min={1}
            step={1}
            value={nodeCountInput}
            onChange={(event) => setNodeCountInput(event.target.value)}
            className="rounded-md border border-slate-300 px-3 py-2 text-sm text-slate-900 outline-none focus:border-slate-500"
            placeholder="3"
          />
        </label>

        <button
          type="submit"
          className="sm:col-span-2 rounded-md bg-slate-900 px-4 py-2 text-sm font-semibold text-white hover:bg-slate-700"
        >
          Start Simulation
        </button>

        <div className="sm:col-span-2 flex flex-wrap gap-2">
          <button
            type="button"
            onClick={handleBack}
            disabled={!canGoBack}
            className="rounded-md border border-slate-300 bg-white px-4 py-2 text-sm font-semibold text-slate-700 hover:bg-slate-100 disabled:cursor-not-allowed disabled:bg-slate-100 disabled:text-slate-400"
          >
            Back
          </button>
          <button
            type="button"
            onClick={handleNext}
            disabled={!canAdvance}
            className="rounded-md bg-slate-700 px-4 py-2 text-sm font-semibold text-white hover:bg-slate-600 disabled:cursor-not-allowed disabled:bg-slate-300 disabled:text-slate-500"
          >
            Next
          </button>
        </div>

        <div className="sm:col-span-2">
          <button
            type="button"
            onClick={handleReset}
            className="rounded-md border border-slate-300 bg-white px-4 py-2 text-sm font-semibold text-slate-700 hover:bg-slate-100"
          >
            Reset
          </button>
        </div>

        {errorMessage ? (
          <p className="sm:col-span-2 text-sm text-red-600">{errorMessage}</p>
        ) : null}
      </form>
    </section>
  );
}
