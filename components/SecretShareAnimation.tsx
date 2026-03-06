"use client";

import { AnimatePresence, motion } from "framer-motion";
import { useSimulationStore } from "@/state/simulationStore";
import type { SimulationStep } from "@/types/mpcTypes";

type Point = {
  x: number;
  y: number;
};

const inputPoint: Point = { x: 50, y: 14 };
const outputPoint: Point = { x: 50, y: 84 };

function formatShare(value: number | undefined): string {
  if (value === undefined) {
    return "pending";
  }

  return Number.isInteger(value) ? `${value}` : value.toFixed(2);
}

function formatResult(value: number | null): string {
  if (value === null) {
    return "pending";
  }

  return Number.isInteger(value) ? `${value}` : value.toFixed(2);
}

function getClusterPoints(count: number): Point[] {
  const safeCount = Math.max(1, count);

  if (safeCount === 1) {
    return [{ x: 50, y: 50 }];
  }

  return Array.from({ length: safeCount }, (_, index) => ({
    x: 15 + (index * 70) / (safeCount - 1),
    y: 50,
  }));
}

function stageLabel(step: SimulationStep): string {
  switch (step) {
    case "INPUT":
      return "Awaiting input";
    case "SPLIT":
      return "Splitting secret into additive shares";
    case "DISTRIBUTE":
      return "Distributing shares to cluster nodes";
    case "COMPUTE":
      return "Computing on distributed shares";
    case "RECONSTRUCT":
      return "Reconstructing final output";
    default:
      return step;
  }
}

export default function SecretShareAnimation() {
  const inputSecret = useSimulationStore((state) => state.inputSecret);
  const nodeCount = useSimulationStore((state) => state.nodeCount);
  const shares = useSimulationStore((state) => state.shares);
  const result = useSimulationStore((state) => state.result);
  const currentStep = useSimulationStore((state) => state.currentStep);

  const clusterPoints = getClusterPoints(nodeCount);

  return (
    <section className="rounded-lg border border-slate-200 p-4">
      <div className="flex items-center justify-between">
        <h2 className="text-lg font-semibold">Secret Share Animation</h2>
        <span className="rounded-full bg-slate-100 px-3 py-1 text-xs font-medium text-slate-600">
          {stageLabel(currentStep)}
        </span>
      </div>

      <div className="relative mt-3 h-[420px] overflow-hidden rounded-lg border border-slate-200 bg-[linear-gradient(180deg,#f8fafc_0%,#eef2ff_100%)]">
        <motion.div
          className="absolute -translate-x-1/2 -translate-y-1/2 rounded-lg border border-slate-300 bg-white px-3 py-2 text-center text-sm shadow-sm"
          style={{ left: `${inputPoint.x}%`, top: `${inputPoint.y}%` }}
          animate={
            currentStep === "SPLIT"
              ? { scale: [1, 1.08, 1], boxShadow: "0 0 0 4px rgba(14,165,233,0.20)" }
              : { scale: 1, boxShadow: "0 0 0 0 rgba(14,165,233,0)" }
          }
          transition={{ duration: 0.8 }}
        >
          <div className="font-semibold">Input</div>
          <div className="text-xs text-slate-600">secret: {inputSecret}</div>
        </motion.div>

        {clusterPoints.map((point, index) => {
          const share = currentStep === "INPUT" ? undefined : shares[index];

          return (
            <motion.div
              key={`cluster-node-${index}`}
              className="absolute -translate-x-1/2 -translate-y-1/2 rounded-lg border bg-white px-3 py-2 text-center text-sm shadow-sm"
              style={{ left: `${point.x}%`, top: `${point.y}%` }}
              animate={
                currentStep === "COMPUTE"
                  ? {
                      scale: [1, 1.08, 1],
                      borderColor: "#f97316",
                      backgroundColor: "#fff7ed",
                      boxShadow: [
                        "0 0 0 0 rgba(249,115,22,0.00)",
                        "0 0 0 6px rgba(249,115,22,0.25)",
                        "0 0 0 0 rgba(249,115,22,0.00)",
                      ],
                    }
                  : {
                      scale: 1,
                      borderColor: "#cbd5e1",
                      backgroundColor: "#ffffff",
                      boxShadow: "0 0 0 0 rgba(249,115,22,0.00)",
                    }
              }
              transition={
                currentStep === "COMPUTE"
                  ? {
                      duration: 1,
                      repeat: Infinity,
                      repeatType: "loop",
                      delay: index * 0.08,
                    }
                  : { duration: 0.25 }
              }
            >
              <div className="font-semibold">Node {index + 1}</div>
              <div className="text-xs text-slate-600">share: {formatShare(share)}</div>
            </motion.div>
          );
        })}

        <motion.div
          className="absolute -translate-x-1/2 -translate-y-1/2 rounded-lg border border-slate-300 bg-white px-3 py-2 text-center text-sm shadow-sm"
          style={{ left: `${outputPoint.x}%`, top: `${outputPoint.y}%` }}
          animate={
            currentStep === "RECONSTRUCT"
              ? {
                  scale: [1, 1.1, 1],
                  borderColor: "#0f766e",
                  backgroundColor: "#ecfeff",
                  boxShadow: [
                    "0 0 0 0 rgba(15,118,110,0.00)",
                    "0 0 0 8px rgba(15,118,110,0.22)",
                    "0 0 0 0 rgba(15,118,110,0.00)",
                  ],
                }
              : {
                  scale: 1,
                  borderColor: "#cbd5e1",
                  backgroundColor: "#ffffff",
                  boxShadow: "0 0 0 0 rgba(15,118,110,0.00)",
                }
          }
          transition={
            currentStep === "RECONSTRUCT"
              ? { duration: 1, repeat: 1, repeatType: "reverse" }
              : { duration: 0.25 }
          }
        >
          <div className="font-semibold">Output</div>
          <div className="text-xs text-slate-600">
            result: {formatResult(currentStep === "RECONSTRUCT" ? result : null)}
          </div>
        </motion.div>

        <AnimatePresence mode="wait">
          {currentStep === "SPLIT" ? (
            <motion.div
              key={`split-${currentStep}-${shares.length}`}
              className="absolute inset-0"
              initial={{ opacity: 1 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
            >
              {clusterPoints.map((point, index) => (
                <motion.div
                  key={`split-token-${index}`}
                  className="absolute h-3 w-3 -translate-x-1/2 -translate-y-1/2 rounded-full bg-sky-500"
                  style={{ left: `${inputPoint.x}%`, top: `${inputPoint.y}%` }}
                  initial={{ opacity: 0, scale: 1.2 }}
                  animate={{
                    left: `${inputPoint.x + (point.x - inputPoint.x) * 0.35}%`,
                    top: `${inputPoint.y + (point.y - inputPoint.y) * 0.35}%`,
                    opacity: [0, 1, 0.3],
                    scale: [1.2, 1, 0.7],
                  }}
                  transition={{ duration: 0.9, delay: index * 0.08 }}
                />
              ))}
            </motion.div>
          ) : null}
        </AnimatePresence>

        <AnimatePresence mode="wait">
          {currentStep === "DISTRIBUTE" ? (
            <motion.div
              key={`distribute-${currentStep}-${shares.join(",")}`}
              className="absolute inset-0"
              initial={{ opacity: 1 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
            >
              {clusterPoints.map((point, index) => (
                <motion.div
                  key={`dist-token-${index}`}
                  className="absolute -translate-x-1/2 -translate-y-1/2 rounded-md bg-sky-600 px-2 py-1 text-[10px] font-semibold text-white"
                  initial={{
                    left: `${inputPoint.x}%`,
                    top: `${inputPoint.y}%`,
                    opacity: 0,
                    scale: 0.9,
                  }}
                  animate={{
                    left: `${point.x}%`,
                    top: `${point.y}%`,
                    opacity: [0, 1, 1],
                    scale: [0.9, 1, 1],
                  }}
                  transition={{ duration: 0.95, delay: index * 0.1 }}
                >
                  {formatShare(shares[index])}
                </motion.div>
              ))}
            </motion.div>
          ) : null}
        </AnimatePresence>

        <AnimatePresence mode="wait">
          {currentStep === "RECONSTRUCT" ? (
            <motion.div
              key={`reconstruct-${currentStep}-${shares.join(",")}`}
              className="absolute inset-0"
              initial={{ opacity: 1 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
            >
              {clusterPoints.map((point, index) => (
                <motion.div
                  key={`recombine-token-${index}`}
                  className="absolute -translate-x-1/2 -translate-y-1/2 rounded-md bg-teal-600 px-2 py-1 text-[10px] font-semibold text-white"
                  initial={{
                    left: `${point.x}%`,
                    top: `${point.y}%`,
                    opacity: 1,
                    scale: 1,
                  }}
                  animate={{
                    left: `${outputPoint.x}%`,
                    top: `${outputPoint.y}%`,
                    opacity: [1, 1, 0.2],
                    scale: [1, 0.95, 0.7],
                  }}
                  transition={{ duration: 0.95, delay: index * 0.08 }}
                >
                  {formatShare(shares[index])}
                </motion.div>
              ))}
            </motion.div>
          ) : null}
        </AnimatePresence>
      </div>
    </section>
  );
}
