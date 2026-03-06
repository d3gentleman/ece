"use client";

import { useEffect, useMemo } from "react";
import { AnimatePresence, motion } from "framer-motion";
import ReactFlow, {
  Background,
  Controls,
  MarkerType,
  Position,
  useEdgesState,
  useNodesState,
  type Edge,
  type Node,
} from "reactflow";
import { useSimulationStore } from "@/state/simulationStore";
import type { SimulationStep } from "@/types/mpcTypes";

type OverlayPoint = {
  x: number;
  y: number;
};

const inputOverlayPoint: OverlayPoint = { x: 50, y: 14 };
const outputOverlayPoint: OverlayPoint = { x: 50, y: 84 };

const stepColors: Record<
  SimulationStep,
  { color: string; softBg: string; glow: string }
> = {
  INPUT: {
    color: "#64748b",
    softBg: "#f1f5f9",
    glow: "rgba(100,116,139,0.25)",
  },
  SPLIT: {
    color: "#a855f7",
    softBg: "#faf5ff",
    glow: "rgba(168,85,247,0.28)",
  },
  DISTRIBUTE: {
    color: "#3b82f6",
    softBg: "#eff6ff",
    glow: "rgba(59,130,246,0.28)",
  },
  COMPUTE: {
    color: "#f97316",
    softBg: "#fff7ed",
    glow: "rgba(249,115,22,0.28)",
  },
  RECONSTRUCT: {
    color: "#22c55e",
    softBg: "#f0fdf4",
    glow: "rgba(34,197,94,0.30)",
  },
};

function formatValue(value: number | null | undefined): string {
  if (value === null || value === undefined) {
    return "pending";
  }

  return Number.isInteger(value) ? `${value}` : value.toFixed(2);
}

function getClusterOverlayPoints(count: number): OverlayPoint[] {
  const safeCount = Math.max(1, count);

  if (safeCount === 1) {
    return [{ x: 50, y: 50 }];
  }

  return Array.from({ length: safeCount }, (_, index) => ({
    x: 18 + (index * 64) / (safeCount - 1),
    y: 50,
  }));
}

function NodeLabel(props: {
  title: string;
  detail: string;
  tooltip: string;
}) {
  const { title, detail, tooltip } = props;

  return (
    <div className="group relative text-center">
      <div className="font-semibold">{title}</div>
      <div className="text-xs text-slate-600">{detail}</div>
      <div className="pointer-events-none absolute left-1/2 top-0 z-20 w-56 -translate-x-1/2 -translate-y-[120%] rounded-md border border-slate-700 bg-slate-900 px-2 py-1 text-[11px] leading-4 text-slate-100 opacity-0 shadow-lg transition-opacity duration-150 group-hover:opacity-100">
        {tooltip}
      </div>
    </div>
  );
}

function buildFlowNodes(params: {
  clusterCount: number;
  inputSecret: number;
  shares: number[];
  distributedShares: number[];
  currentStep: SimulationStep;
  result: number | null;
}): Node[] {
  const {
    clusterCount,
    inputSecret,
    shares,
    distributedShares,
    currentStep,
    result,
  } = params;
  const stageStyle = stepColors[currentStep];
  const isComputeStage = currentStep === "COMPUTE";
  const isSplitStage = currentStep === "SPLIT";
  const isReconstructStage = currentStep === "RECONSTRUCT";
  const shouldShowShares = currentStep !== "INPUT";
  const finalResult = isReconstructStage ? result : null;

  const graphNodes: Node[] = [
    {
      id: "input",
      position: { x: 280, y: 20 },
      sourcePosition: Position.Bottom,
      draggable: false,
      style: {
        borderColor: isSplitStage ? stepColors.SPLIT.color : stageStyle.color,
        borderWidth: 2,
        borderRadius: 10,
        width: 160,
        background: isSplitStage ? stepColors.SPLIT.softBg : "#f8fafc",
        overflow: "visible",
        boxShadow: isSplitStage
          ? `0 0 0 4px ${stepColors.SPLIT.glow}`
          : "0 0 0 0 transparent",
      },
      data: {
        label: (
          <NodeLabel
            title="Input"
            detail={`secret: ${formatValue(inputSecret)}`}
            tooltip="This is the private value provided by the user."
          />
        ),
      },
    },
  ];

  const spacing = 170;
  const startX = 310 - ((clusterCount - 1) * spacing) / 2;

  for (let index = 0; index < clusterCount; index += 1) {
    const share =
      distributedShares[index] ?? (shouldShowShares ? shares[index] : undefined);

    graphNodes.push({
      id: `cluster-${index + 1}`,
      position: { x: startX + spacing * index, y: 190 },
      targetPosition: Position.Top,
      sourcePosition: Position.Bottom,
      draggable: false,
      style: {
        borderColor: isComputeStage ? stepColors.COMPUTE.color : stageStyle.color,
        borderWidth: 2,
        borderRadius: 10,
        width: 170,
        background: isComputeStage ? stepColors.COMPUTE.softBg : "#ffffff",
        overflow: "visible",
        boxShadow: isComputeStage
          ? `0 0 0 4px ${stepColors.COMPUTE.glow}`
          : "none",
      },
      data: {
        label: (
          <NodeLabel
            title={`Node ${index + 1}`}
            detail={`share: ${formatValue(share)}`}
            tooltip="Each node holds only one fragment of the secret."
          />
        ),
      },
    });
  }

  graphNodes.push({
    id: "output",
    position: { x: 280, y: 360 },
    targetPosition: Position.Top,
    draggable: false,
    style: {
      borderColor: isReconstructStage
        ? stepColors.RECONSTRUCT.color
        : stageStyle.color,
      borderWidth: 2,
      borderRadius: 10,
      width: 170,
      background: isReconstructStage ? stepColors.RECONSTRUCT.softBg : "#f8fafc",
      overflow: "visible",
      boxShadow: isReconstructStage
        ? `0 0 0 4px ${stepColors.RECONSTRUCT.glow}`
        : "0 0 0 0 transparent",
    },
    data: {
      label: (
        <NodeLabel
          title="Output"
          detail={`result: ${formatValue(finalResult)}`}
          tooltip="The final result is reconstructed from the shares."
        />
      ),
    },
  });

  return graphNodes;
}

function buildFlowEdges(params: {
  clusterCount: number;
  shares: number[];
  distributedShares: number[];
  currentStep: SimulationStep;
}): Edge[] {
  const { clusterCount, shares, distributedShares, currentStep } = params;
  const stageStyle = stepColors[currentStep];
  const inputEdgeColor =
    currentStep === "DISTRIBUTE" ? stepColors.DISTRIBUTE.color : stageStyle.color;
  const outputEdgeColor =
    currentStep === "RECONSTRUCT"
      ? stepColors.RECONSTRUCT.color
      : stageStyle.color;
  const shouldShowShares = currentStep !== "INPUT";
  const edges: Edge[] = [];

  for (let index = 0; index < clusterCount; index += 1) {
    const clusterId = `cluster-${index + 1}`;
    const share =
      distributedShares[index] ?? (shouldShowShares ? shares[index] : undefined);

    edges.push({
      id: `edge-input-${clusterId}`,
      source: "input",
      target: clusterId,
      label: share === undefined ? "share" : formatValue(share),
      markerEnd: { type: MarkerType.ArrowClosed, color: inputEdgeColor },
      animated: currentStep === "DISTRIBUTE",
      style: { stroke: inputEdgeColor, strokeWidth: 2 },
    });

    edges.push({
      id: `edge-${clusterId}-output`,
      source: clusterId,
      target: "output",
      label: share === undefined ? "flow" : formatValue(share),
      markerEnd: { type: MarkerType.ArrowClosed, color: outputEdgeColor },
      animated: currentStep === "RECONSTRUCT",
      style: { stroke: outputEdgeColor, strokeWidth: 2 },
    });
  }

  return edges;
}

export default function GraphCanvas() {
  const inputSecret = useSimulationStore((state) => state.inputSecret);
  const nodeCount = useSimulationStore((state) => state.nodeCount);
  const shares = useSimulationStore((state) => state.shares);
  const distributedNodes = useSimulationStore((state) => state.nodes);
  const result = useSimulationStore((state) => state.result);
  const currentStep = useSimulationStore((state) => state.currentStep);

  const clusterCount = Math.max(1, nodeCount);
  const distributedShares = useMemo(
    () => distributedNodes.map((node) => node.share),
    [distributedNodes],
  );

  const [flowNodes, setFlowNodes, onNodesChange] = useNodesState<Node>([]);
  const [flowEdges, setFlowEdges, onEdgesChange] = useEdgesState<Edge>([]);
  const overlayPoints = useMemo(
    () => getClusterOverlayPoints(clusterCount),
    [clusterCount],
  );

  useEffect(() => {
    setFlowNodes(
      buildFlowNodes({
        clusterCount,
        inputSecret,
        shares,
        distributedShares,
        currentStep,
        result,
      }),
    );
  }, [
    clusterCount,
    currentStep,
    distributedShares,
    inputSecret,
    result,
    setFlowNodes,
    shares,
  ]);

  useEffect(() => {
    setFlowEdges(
      buildFlowEdges({
        clusterCount,
        shares,
        distributedShares,
        currentStep,
      }),
    );
  }, [clusterCount, currentStep, distributedShares, setFlowEdges, shares]);

  return (
    <section className="rounded-lg border border-slate-200 p-4">
      <h2 className="text-lg font-semibold">Graph Canvas</h2>
      <div className="relative mt-3 h-[460px] overflow-hidden rounded-lg border border-slate-200 bg-white">
        <ReactFlow
          fitView
          nodes={flowNodes}
          edges={flowEdges}
          onNodesChange={onNodesChange}
          onEdgesChange={onEdgesChange}
          nodesDraggable={false}
          nodesConnectable={false}
          elementsSelectable={false}
          proOptions={{ hideAttribution: true }}
        >
          <Background gap={20} size={1} color="#cbd5e1" />
          <Controls showInteractive={false} />
        </ReactFlow>

        <div className="pointer-events-none absolute inset-0 z-10">
          <AnimatePresence mode="wait">
            {currentStep === "SPLIT" ? (
              <motion.div
                key={`split-${currentStep}-${clusterCount}`}
                className="absolute inset-0"
                initial={{ opacity: 1 }}
                animate={{ opacity: 1 }}
                exit={{ opacity: 0 }}
              >
                {overlayPoints.map((point, index) => (
                  <motion.span
                    key={`split-particle-${index}`}
                    className="absolute block h-2.5 w-2.5 -translate-x-1/2 -translate-y-1/2 rounded-full bg-purple-500"
                    style={{
                      left: `${inputOverlayPoint.x}%`,
                      top: `${inputOverlayPoint.y}%`,
                    }}
                    initial={{ opacity: 0, scale: 1.1 }}
                    animate={{
                      left: `${point.x}%`,
                      top: `${point.y}%`,
                      opacity: [0, 1, 0.25],
                      scale: [1.1, 1, 0.8],
                    }}
                    transition={{
                      duration: 0.9,
                      delay: index * 0.08,
                      ease: "easeOut",
                    }}
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
                {overlayPoints.map((point, index) => (
                  <motion.div
                    key={`dist-token-${index}`}
                    className="absolute -translate-x-1/2 -translate-y-1/2 rounded-md bg-blue-600 px-2 py-1 text-[10px] font-semibold text-white shadow"
                    style={{
                      left: `${inputOverlayPoint.x}%`,
                      top: `${inputOverlayPoint.y}%`,
                    }}
                    initial={{ opacity: 0, scale: 0.9 }}
                    animate={{
                      left: `${point.x}%`,
                      top: `${point.y}%`,
                      opacity: [0, 1, 1],
                      scale: [0.9, 1, 1],
                    }}
                    transition={{
                      duration: 1,
                      delay: index * 0.1,
                      ease: "easeInOut",
                    }}
                  >
                    {shares[index] === undefined
                      ? `S${index + 1}`
                      : formatValue(shares[index])}
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
                {overlayPoints.map((point, index) => (
                  <motion.div
                    key={`reconstruct-token-${index}`}
                    className="absolute -translate-x-1/2 -translate-y-1/2 rounded-md bg-green-600 px-2 py-1 text-[10px] font-semibold text-white shadow"
                    style={{
                      left: `${point.x}%`,
                      top: `${point.y}%`,
                    }}
                    initial={{ opacity: 1, scale: 1 }}
                    animate={{
                      left: `${outputOverlayPoint.x}%`,
                      top: `${outputOverlayPoint.y}%`,
                      opacity: [1, 1, 0.2],
                      scale: [1, 0.95, 0.75],
                    }}
                    transition={{
                      duration: 1,
                      delay: index * 0.08,
                      ease: "easeInOut",
                    }}
                  >
                    {shares[index] === undefined
                      ? `S${index + 1}`
                      : formatValue(shares[index])}
                  </motion.div>
                ))}
              </motion.div>
            ) : null}
          </AnimatePresence>
        </div>
      </div>
    </section>
  );
}
