'use client';

import { useState } from 'react';
import { useProgressStore } from '@/state/progressStore';
import { VisualizationCanvas } from './VisualizationCanvas';
import { Node } from './Node';
import { ClusterBoundary } from './ClusterBoundary';
import { Connection } from './Connection';
import { motion, AnimatePresence } from 'framer-motion';
import { Shield, Server, Box, Info } from 'lucide-react';

interface ArxNode {
  id: string;
  x: number;
  y: number;
  clusterId: string | null;
  status: 'idle' | 'computing' | 'offline';
  reputation: number;
  isTee: boolean;
}

interface Cluster {
  id: string;
  name: string;
  x: number;
  y: number;
  radius: number;
  activeMxe: string | null;
}

export function ArchitectureExplorer() {
  const [selectedNode, setSelectedNode] = useState<ArxNode | null>(null);
  const [simulatingSybil, setSimulatingSybil] = useState(false);
  const { markActivityCompleted } = useProgressStore();

  // Static topology setup for demonstration
  const clusters: Cluster[] = [
    { id: 'c1', name: 'Alpha Compute Group', x: 250, y: 250, radius: 140, activeMxe: 'AI Training MXE' },
    { id: 'c2', name: 'Beta Validate Group', x: 650, y: 350, radius: 120, activeMxe: null },
  ];

  // Distribute nodes within/outside clusters
  const [nodes, setNodes] = useState<ArxNode[]>([
    // Cluster 1 Nodes
    { id: 'n1', x: 180, y: 180, clusterId: 'c1', status: 'computing', reputation: 98, isTee: true },
    { id: 'n2', x: 300, y: 160, clusterId: 'c1', status: 'computing', reputation: 95, isTee: true },
    { id: 'n3', x: 200, y: 300, clusterId: 'c1', status: 'idle', reputation: 99, isTee: true },
    { id: 'n4', x: 320, y: 280, clusterId: 'c1', status: 'computing', reputation: 85, isTee: false }, // The required random node
    
    // Cluster 2 Nodes
    { id: 'n5', x: 600, y: 300, clusterId: 'c2', status: 'idle', reputation: 90, isTee: true },
    { id: 'n6', x: 700, y: 280, clusterId: 'c2', status: 'idle', reputation: 91, isTee: true },
    { id: 'n7', x: 650, y: 400, clusterId: 'c2', status: 'offline', reputation: 80, isTee: false },

    // Unassigned Pool Nodes (Sybil Demo)
    { id: 'n8', x: 800, y: 100, clusterId: null, status: 'idle', reputation: 60, isTee: false },
    { id: 'n9', x: 850, y: 150, clusterId: null, status: 'idle', reputation: 55, isTee: false },
    { id: 'n10', x: 750, y: 180, clusterId: null, status: 'idle', reputation: 65, isTee: false },
  ]);

  const triggerSybilAttack = () => {
    setSimulatingSybil(true);
    // Move malicious nodes towards Cluster 2 to "take over"
    setNodes(prev => prev.map(n => {
      if (['n8', 'n9', 'n10'].includes(n.id)) {
        return { ...n, x: n.x - 150, y: n.y + 100, clusterId: 'c2', status: 'offline' };
      }
      return n;
    }));

    // Reset after delay
    setTimeout(() => {
      setSimulatingSybil(false);
      setNodes(prev => prev.map(n => {
        if (['n8', 'n9', 'n10'].includes(n.id)) {
           // Move back, simulating "slashing" or rejection
          return { ...n, x: n.x + 150, y: n.y - 100, clusterId: null, status: 'idle', reputation: 0 };
        }
        return n;
      }));
      markActivityCompleted('architecture');
    }, 4000);
  };

  const handleNodeClick = (node: ArxNode) => {
    setSelectedNode(node);
  };

  return (
    <div className="flex flex-col xl:flex-row gap-6 w-full mt-6">
      
      {/* Interactive Topology Map */}
      <div className="flex-grow">
        <div className="flex items-center justify-between p-4 bg-zinc-900 border border-zinc-800 rounded-xl mb-4">
          <h2 className="text-xl font-bold flex items-center gap-2"><Server className="text-indigo-400" /> Network Map</h2>
          <button 
            onClick={triggerSybilAttack}
            disabled={simulatingSybil}
            className={`px-4 py-2 rounded-lg text-sm font-semibold transition-colors flex items-center gap-2 ${simulatingSybil ? 'bg-zinc-800 text-zinc-500' : 'bg-red-500/20 text-red-400 hover:bg-red-500/30 border border-red-500/30'}`}
          >
            <Shield size={16} /> 
            {simulatingSybil ? 'Resisting Attack...' : 'Simulate Sybil Attack'}
          </button>
        </div>

        <VisualizationCanvas width={1000} height={600}>
          {/* Render Clusters */}
          {clusters.map(cluster => (
            <div key={cluster.id}>
              <ClusterBoundary 
                x={cluster.x - cluster.radius} 
                y={cluster.y - cluster.radius} 
                width={cluster.radius * 2} 
                height={cluster.radius * 2} 
                label={cluster.name} 
              />
              {/* MXE Indicator */}
              {cluster.activeMxe && (
                <motion.div 
                   className="absolute px-3 py-1 bg-green-500/20 border border-green-500/50 rounded-full text-green-400 text-xs font-bold flex items-center gap-1 shadow-[0_0_15px_rgba(34,197,94,0.3)] z-0"
                   initial={{ opacity: 0, y: -10 }}
                   animate={{ opacity: 1, y: 0 }}
                   style={{ left: cluster.x - 60, top: cluster.y - cluster.radius - 12 }}
                >
                  <Box size={14} /> MXE: {cluster.activeMxe}
                </motion.div>
              )}
            </div>
          ))}

          {/* Render Connections (Intra-cluster mesh) */}
          {nodes.filter(n => n.clusterId === 'c1').map((source, i, arr) => 
             arr.slice(i + 1).map(target => (
               <Connection 
                 key={`${source.id}-${target.id}`} 
                 startX={source.x + 24} 
                 startY={source.y + 24} 
                 endX={target.x + 24} 
                 endY={target.y + 24} 
                 active={source.status === 'computing' && target.status === 'computing'}
               />
             ))
          )}

          {/* Render Sybil Attack Vectors */}
          <AnimatePresence>
            {simulatingSybil && nodes.filter(n => ['n8', 'n9', 'n10'].includes(n.id)).map(n => (
              <motion.div
                key={`atk-${n.id}`}
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                exit={{ opacity: 0 }}
              >
                <Connection 
                  startX={n.x + 24} startY={n.y + 24} 
                  endX={650} endY={350} // Cluster 2 center
                  active={false}
                />
              </motion.div>
            ))}
          </AnimatePresence>

          {/* Render Nodes */}
          {nodes.map(node => (
            <div key={node.id} onClick={() => handleNodeClick(node)} className="cursor-pointer">
              {/* Halos for malicious nodes during attack */}
              {simulatingSybil && ['n8', 'n9', 'n10'].includes(node.id) && (
                <motion.div 
                  className="absolute w-20 h-20 bg-red-500/20 rounded-full -ml-4 -mt-4 opacity-0"
                  animate={{ opacity: [0, 1, 0], scale: [0.8, 1.2, 0.8] }}
                  transition={{ repeat: Infinity, duration: 1.5 }}
                  style={{ x: node.x, y: node.y }}
                />
              )}
              
              <Node 
                id={node.id} 
                x={node.x} 
                y={node.y} 
                status={simulatingSybil && ['n8', 'n9', 'n10'].includes(node.id) ? 'offline' : node.status} 
                label={node.id.toUpperCase()} 
              />
              
              {/* Highlight Ring for Selected */}
              {selectedNode?.id === node.id && (
                <div 
                  className="absolute w-16 h-16 border-2 border-indigo-400 rounded-full -ml-2 -mt-2 pointer-events-none"
                  style={{ left: node.x, top: node.y }}
                />
              )}
            </div>
          ))}
        </VisualizationCanvas>
      </div>

      {/* Sidebar Info Panel */}
      <div className="w-full xl:w-80 flex flex-col gap-4">
        <div className="bg-zinc-900 border border-zinc-800 rounded-xl p-6 h-full min-h-[400px]">
          <h3 className="text-xl font-bold mb-4 border-b border-zinc-800 pb-2 flex items-center gap-2">
            <Info className="text-zinc-500" />
            Selection Details
          </h3>
          
          {selectedNode ? (
            <div className="flex flex-col gap-4 animate-in fade-in duration-300">
              <div>
                <span className="text-xs text-zinc-500 uppercase tracking-wider">Node ID</span>
                <p className="text-lg font-mono text-indigo-400">{selectedNode.id.toUpperCase()}</p>
              </div>
              
              <div>
                <span className="text-xs text-zinc-500 uppercase tracking-wider">Cluster Assignment</span>
                <p className="font-medium text-white">{selectedNode.clusterId ? clusters.find(c => c.id === selectedNode.clusterId)?.name : 'Unassigned Pool'}</p>
                {!selectedNode.clusterId && <p className="text-xs text-zinc-500 mt-1">Available for random inclusion or new clusters.</p>}
              </div>

              <div>
                <span className="text-xs text-zinc-500 uppercase tracking-wider">Status</span>
                <div className="flex items-center gap-2 mt-1">
                  <span className={`w-3 h-3 rounded-full ${selectedNode.status === 'computing' ? 'bg-indigo-500' : selectedNode.status === 'idle' ? 'bg-zinc-500' : 'bg-red-500'}`}></span>
                  <span className="capitalize text-sm font-medium">{selectedNode.status}</span>
                </div>
              </div>

              <div className="flex justify-between items-center bg-zinc-950 p-3 rounded-lg border border-zinc-800">
                <span className="text-sm text-zinc-400">Reputation Score</span>
                <span className={`font-bold ${selectedNode.reputation > 80 ? 'text-green-400' : selectedNode.reputation > 50 ? 'text-yellow-400' : 'text-red-400'}`}>
                  {selectedNode.reputation}/100
                </span>
              </div>

              <div className="flex justify-between items-center bg-zinc-950 p-3 rounded-lg border border-zinc-800">
                <span className="text-sm text-zinc-400">Hardware Layer</span>
                <span className="font-bold text-white flex items-center gap-1">
                  {selectedNode.isTee ? <><Shield size={14} className="text-green-500"/> TEE Active</> : 'Standard CPU'}
                </span>
              </div>
              
              {selectedNode.clusterId && !selectedNode.isTee && (
                <p className="text-xs text-indigo-400 italic">
                  * Selected as the mandated random consensus node to prevent collusion.
                </p>
              )}
            </div>
          ) : (
            <div className="flex flex-col items-center justify-center h-48 text-zinc-500 text-center">
              <Box size={40} className="opacity-20 mb-4" />
              <p>Click on any Arx Node in the network map to view its detailed hardware and consensus profile.</p>
            </div>
          )}
        </div>

        {simulatingSybil && (
          <div className="bg-red-500/10 border border-red-500/20 rounded-xl p-4 animate-in slide-in-from-bottom-5">
            <h4 className="text-red-400 font-bold mb-1 flex items-center gap-2"><Shield size={16} /> Sybil Attack Detected</h4>
            <p className="text-sm text-zinc-400 leading-relaxed">
              Low reputation nodes are attempting to aggressively join the Beta Compute Group. The network's <strong>Proof of Stake</strong> and <strong>Trust Scoring</strong> automatically rejects their MXE admission and slashes their stake.
            </p>
          </div>
        )}
      </div>
    </div>
  );
}
