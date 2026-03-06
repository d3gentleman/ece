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

  const [secretInput, setSecretInput] = useState<string>(`${storeSecret}`);
  const [nodeCountInput, setNodeCountInput] = useState<string>(`${storeNodeCount}`);
  const [errorMessage, setErrorMessage] = useState<string | null>(null);

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

        {errorMessage ? (
          <p className="sm:col-span-2 text-sm text-red-600">{errorMessage}</p>
        ) : null}
      </form>
    </section>
  );
}
