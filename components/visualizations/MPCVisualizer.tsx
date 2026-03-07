'use client';

import { useEffect, useState } from 'react';
import { useSimulationStore } from '@/state/simulationStore';
import { useProgressStore } from '@/state/progressStore';
import { VisualizationCanvas } from './VisualizationCanvas';
import { Node } from './Node';
import { Connection } from './Connection';
import { SecretShare } from './SecretShare';
import { ClusterBoundary } from './ClusterBoundary';
import { Play, Pause, SkipForward, SkipBack, RotateCcw } from 'lucide-react';

export function MPCVisualizer() {
  const {
    inputSecret,
    nodeCount,
    priorityFee,
    nodes,
    result,
    currentStep,
    setInputSecret,
    setNodeCount,
    setPriorityFee,
    nextStep,
    prevStep,
    resetSimulation
  } = useSimulationStore();

  const [isPlaying, setIsPlaying] = useState(false);
  const { markActivityCompleted } = useProgressStore();

  // Auto-play logic
  useEffect(() => {
    let interval: NodeJS.Timeout;
    if (isPlaying && currentStep !== 'CALLBACK') {
      interval = setInterval(() => {
        nextStep();
      }, 2500); // 2.5 seconds per step for auto-play
    } else if (currentStep === 'CALLBACK') {
      setIsPlaying(false);
      markActivityCompleted('mpc');
    }
    return () => clearInterval(interval);
  }, [isPlaying, currentStep, nextStep, markActivityCompleted]);

  // Canvas dimensions
  const width = 800;
  const height = 500;
  
  const clusterCenterX = width / 2;
  const clusterCenterY = height / 2;
  const radius = 140;

  // Calculate node positions in a circle within the cluster
  const nodePositions = Array.from({ length: nodeCount }).map((_, i) => {
    const angle = (i / nodeCount) * 2 * Math.PI - Math.PI / 2; // start at top
    return {
      id: `node-${i}`,
      x: clusterCenterX + radius * Math.cos(angle) - 24, // 24 is half of node width
      y: clusterCenterY + radius * Math.sin(angle) - 24,
    };
  });

  // Mempool coordinate
  const mempoolX = 100;
  const mempoolY = height / 2;

  return (
    <div className="flex flex-col gap-6 w-full max-w-4xl mx-auto">
      {/* Controls Bar */}
      <div className="flex flex-wrap items-center justify-between p-4 bg-zinc-900 border border-zinc-800 rounded-xl">
        <div className="flex items-center gap-4">
          <div className="flex flex-col">
            <label className="text-xs text-zinc-500 mb-1">Input Data</label>
            <input 
              type="number" 
              value={inputSecret}
              onChange={(e) => setInputSecret(Number(e.target.value))}
              disabled={currentStep !== 'DEFINITION'}
              className="px-3 py-1.5 bg-zinc-950 border border-zinc-700 rounded-md text-sm w-24 focus:outline-none focus:border-indigo-500 disabled:opacity-50"
            />
          </div>
          <div className="flex flex-col">
            <label className="text-xs text-zinc-500 mb-1">Priority Fee</label>
            <input 
              type="number" 
              value={priorityFee}
              onChange={(e) => setPriorityFee(Number(e.target.value))}
              disabled={currentStep !== 'DEFINITION' && currentStep !== 'COMMISSION'}
              className="px-3 py-1.5 bg-zinc-950 border border-zinc-700 rounded-md text-sm w-24 focus:outline-none focus:border-indigo-500 disabled:opacity-50"
            />
          </div>
          <div className="flex flex-col">
            <label className="text-xs text-zinc-500 mb-1">Nodes (Cluster Size)</label>
            <input 
              type="number" 
              min={3}
              max={10}
              value={nodeCount}
              onChange={(e) => setNodeCount(Number(e.target.value))}
              disabled={currentStep !== 'DEFINITION'}
              className="px-3 py-1.5 bg-zinc-950 border border-zinc-700 rounded-md text-sm w-24 focus:outline-none focus:border-indigo-500 disabled:opacity-50"
            />
          </div>
        </div>

        <div className="flex items-center gap-2">
          <button 
            onClick={resetSimulation}
            className="p-2 hover:bg-zinc-800 rounded-lg text-zinc-400 hover:text-white transition-colors"
            title="Reset"
          >
            <RotateCcw size={20} />
          </button>
          
          <div className="w-px h-6 bg-zinc-800 mx-2"></div>

          <button 
            onClick={prevStep}
            disabled={currentStep === 'DEFINITION'}
            className="p-2 hover:bg-zinc-800 rounded-lg text-zinc-400 hover:text-white transition-colors disabled:opacity-50 disabled:hover:bg-transparent disabled:hover:text-zinc-400"
            title="Previous Step"
          >
            <SkipBack size={20} />
          </button>

          <button 
            onClick={() => setIsPlaying(!isPlaying)}
            disabled={currentStep === 'CALLBACK'}
            className={`p-2 rounded-lg transition-colors ${isPlaying ? 'bg-indigo-500/20 text-indigo-400' : 'bg-zinc-800 text-white hover:bg-zinc-700'}`}
            title={isPlaying ? "Pause" : "Play"}
          >
            {isPlaying ? <Pause size={20} /> : <Play size={20} />}
          </button>

          <button 
            onClick={nextStep}
            disabled={currentStep === 'CALLBACK'}
            className="p-2 hover:bg-zinc-800 rounded-lg text-zinc-400 hover:text-white transition-colors disabled:opacity-50 disabled:hover:bg-transparent disabled:hover:text-zinc-400"
            title="Next Step"
          >
            <SkipForward size={20} />
          </button>
        </div>
      </div>

      {/* Step Indicator */}
      <div className="flex justify-between items-center px-4">
        {['DEF.', 'COMMISSION', 'MEMPOOL', 'EXECUTION', 'CALLBACK'].map((step, idx) => (
          <div key={step} className="flex flex-col items-center gap-2 flex-1">
            <div className={`h-1 w-full rounded-full ${['DEFINITION', 'COMMISSION', 'MEMPOOL', 'EXECUTION', 'CALLBACK'].indexOf(currentStep) >= idx ? 'bg-indigo-500' : 'bg-zinc-800'}`} />
            <span className={`text-xs font-medium ${['DEFINITION', 'COMMISSION', 'MEMPOOL', 'EXECUTION', 'CALLBACK'].indexOf(currentStep) >= idx ? 'text-indigo-400' : 'text-zinc-600'}`}>{step}</span>
          </div>
        ))}
      </div>

      {/* Visualization Canvas */}
      <VisualizationCanvas width={width} height={height}>
        {/* Solana Onchain Mempool */}
        <div 
          className={`absolute flex flex-col items-center justify-center w-32 h-32 bg-zinc-900 border-2 ${currentStep === 'MEMPOOL' ? 'border-indigo-500' : 'border-zinc-700'} rounded-lg transition-colors z-10`}
          style={{ left: mempoolX - 64, top: mempoolY - 64 }}
        >
           <span className="text-zinc-400 text-xs uppercase font-bold tracking-widest mb-2">Mempool</span>
           {['MEMPOOL', 'COMMISSION'].includes(currentStep) && (
              <div className="w-16 h-8 bg-indigo-600/20 border border-indigo-500 rounded text-[10px] text-indigo-300 flex items-center justify-center font-mono">
                Job #{priorityFee}
              </div>
           )}
        </div>

        {/* Connections from Mempool to Cluster Nodes */}
        {nodePositions.map((pos, idx) => (
          <Connection 
            key={`conn-mempool-${idx}`} 
            startX={mempoolX + 64} 
            startY={mempoolY} 
            endX={pos.x + 24} // adjust to center of node
            endY={pos.y + 24} 
            active={currentStep === 'EXECUTION'}
          />
        ))}

        {/* Cluster Background */}
        <ClusterBoundary 
          x={clusterCenterX - radius - 50} 
          y={clusterCenterY - radius - 50} 
          width={radius * 2 + 100} 
          height={radius * 2 + 100} 
          label="Execution Cluster (MXE)" 
        />

        {/* Inter-node connections (MPC requires nodes talking to each other) */}
        {nodePositions.map((startPos, i) => (
          nodePositions.slice(i + 1).map((endPos, j) => (
             <Connection 
              key={`conn-inter-${i}-${j}`} 
              startX={startPos.x + 24} 
              startY={startPos.y + 24} 
              endX={endPos.x + 24} 
              endY={endPos.y + 24} 
              active={currentStep === 'EXECUTION'}
            />
          ))
        ))}

        {/* Nodes */}
        {nodePositions.map((pos, idx) => {
          let status: 'idle' | 'computing' | 'offline' = 'idle';
          if (currentStep === 'EXECUTION') status = 'computing';
          
          let label = `Arx ${idx+1}`;
          if (currentStep === 'EXECUTION' && nodes[idx]) {
             label = `Share ${nodes[idx].share}`;
          }

          return (
            <Node 
              key={pos.id} 
              id={pos.id} 
              x={pos.x} 
              y={pos.y} 
              status={status} 
              label={label} 
            />
          );
        })}

        {/* Commission Animation */}
        {currentStep === 'COMMISSION' && (
          <SecretShare 
            startX={mempoolX - 100}
            startY={mempoolY}
            endX={mempoolX - 32}
            endY={mempoolY}
            delay={0}
          />
        )}

        {/* Callback Animation */}
        {currentStep === 'CALLBACK' && nodePositions.map((pos, idx) => (
          <SecretShare 
            key={`callback-${idx}`}
            startX={pos.x + 24}
            startY={pos.y + 24}
            endX={mempoolX + 64}
            endY={mempoolY}
            delay={idx * 0.15}
          />
        ))}
        
      </VisualizationCanvas>

      {/* Explanation Box */}
      <div className="p-6 bg-zinc-900 border border-zinc-800 rounded-xl mt-4">
        <h3 className="text-lg font-bold text-white mb-2">
          {currentStep === 'DEFINITION' && 'Step 1: MXE Definition'}
          {currentStep === 'COMMISSION' && 'Step 2: Commissioning'}
          {currentStep === 'MEMPOOL' && 'Step 3: Mempool Placement'}
          {currentStep === 'EXECUTION' && 'Step 4: Encrypted Execution'}
          {currentStep === 'CALLBACK' && 'Step 5: Post-Execution Callbacks'}
        </h3>
        <p className="text-zinc-400">
          {currentStep === 'DEFINITION' && 'A Computation Customer defines a new computation within an MXE. They specify inputs, code logic to run, and choose whether it\'s permissioned or public.'}
          {currentStep === 'COMMISSION' && 'The customer instantiates the job by paying a Base Fee plus an optional Priority Fee to expedite it within the network.'}
          {currentStep === 'MEMPOOL' && 'The computation enters the global Solana Mempool where it awaits cluster assignment based on Priority Fees and validity windows.'}
          {currentStep === 'EXECUTION' && 'A Cluster of Arx nodes is assigned. They use Distributed Key Generation and Secret Sharing to perform homomorphic computations across the group entirely blind without central aggregation.'}
          {currentStep === 'CALLBACK' && 'Execution concludes. The network triggers predefined static or dynamic onchain callbacks directly via Solana returning the result.'}
        </p>
      </div>
    </div>
  );
}
