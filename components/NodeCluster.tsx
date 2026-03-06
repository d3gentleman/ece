"use client";

import { useMemo } from "react";
import { useSimulationStore } from "@/state/simulationStore";

function formatShare(value: number | undefined): string {
  if (value === undefined) {
    return "pending";
  }

  return Number.isInteger(value) ? `${value}` : value.toFixed(2);
}

export default function NodeCluster() {
  const nodeCount = useSimulationStore((state) => state.nodeCount);
  const shares = useSimulationStore((state) => state.shares);
  const distributedNodes = useSimulationStore((state) => state.nodes);
  const currentStep = useSimulationStore((state) => state.currentStep);

  const nodesById = useMemo(
    () => new Map(distributedNodes.map((node) => [node.id, node.share])),
    [distributedNodes],
  );

  return (
    <section className="rounded-lg border border-slate-200 p-4">
      <div className="flex items-center justify-between">
        <h2 className="text-lg font-semibold">Node Cluster</h2>
        <span className="rounded-full bg-slate-100 px-3 py-1 text-xs font-medium text-slate-600">
          step: {currentStep}
        </span>
      </div>

      <div className="mt-3 grid gap-3 sm:grid-cols-2 lg:grid-cols-3">
        {Array.from({ length: Math.max(1, nodeCount) }, (_, index) => {
          const nodeId = `node-${index + 1}`;
          const distributedShare = nodesById.get(nodeId);
          const generatedShare = shares[index];
          const shareValue =
            distributedShare === undefined ? generatedShare : distributedShare;
          const isDistributed = distributedShare !== undefined;

          return (
            <article
              key={nodeId}
              className="rounded-lg border border-slate-200 bg-white p-3"
            >
              <div className="text-sm font-semibold text-slate-900">
                {isDistributed ? `Compute Node ${index + 1}` : `Node ${index + 1}`}
              </div>
              <div className="mt-1 text-sm text-slate-700">
                share: {formatShare(shareValue)}
              </div>
              <div className="mt-1 text-xs text-slate-500">
                {isDistributed
                  ? "Share distributed to node"
                  : "Waiting for distribution"}
              </div>
            </article>
          );
        })}
      </div>
    </section>
  );
}
