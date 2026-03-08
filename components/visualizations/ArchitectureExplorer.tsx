'use client';

import { useState, useCallback, useEffect } from 'react';
import { useProgressStore } from '@/state/progressStore';
import { motion, AnimatePresence } from 'framer-motion';
import {
  Shield, Server, Cpu, ZapOff, CheckCircle, AlertTriangle,
  Lock, Star, Info, ChevronRight, Activity, Network
} from 'lucide-react';

// ── Types ─────────────────────────────────────────────────────────────────────

interface ArxNode {
  id: string;
  x: number;
  y: number;
  clusterId: string | null;
  status: 'idle' | 'computing' | 'offline' | 'slashed';
  reputation: number;
  isTee: boolean;
  isRandomNode: boolean; // mandated random inclusion for Sybil resistance
  stake: number; // tokens staked
}

interface Cluster {
  id: string;
  name: string;
  cx: number;  // center x
  cy: number;  // center y
  rx: number;  // half-width (ellipse)
  ry: number;  // half-height (ellipse)
  activeMxe: string | null;
  color: string;     // hex accent
  glow: string;      // rgba glow
  bgClass: string;   // tailwind bg tint
}

interface EventLog {
  id: number;
  time: string;
  text: string;
  type: 'info' | 'warn' | 'success' | 'danger';
}

// ── Cluster color palette ─────────────────────────────────────────────────────

const CLUSTERS: Cluster[] = [
  {
    id: 'c1',
    name: 'Alpha Cluster',
    cx: 270, cy: 270, rx: 160, ry: 150,
    activeMxe: 'AI Training MXE',
    color: '#6366f1',
    glow: 'rgba(99,102,241,0.25)',
    bgClass: 'bg-indigo-500',
  },
  {
    id: 'c2',
    name: 'Beta Cluster',
    cx: 630, cy: 310, rx: 145, ry: 130,
    activeMxe: 'DeFi Trading MXE',
    color: '#06b6d4',
    glow: 'rgba(6,182,212,0.25)',
    bgClass: 'bg-cyan-500',
  },
];

const CLUSTER_MAP = Object.fromEntries(CLUSTERS.map(c => [c.id, c]));

// ── Initial node topology ─────────────────────────────────────────────────────

const INITIAL_NODES: ArxNode[] = [
  // Alpha Cluster — all TEE except the mandatory random node (n4)
  { id: 'n1', x: 175, y: 175, clusterId: 'c1', status: 'computing', reputation: 98, isTee: true,  isRandomNode: false, stake: 12000 },
  { id: 'n2', x: 310, y: 155, clusterId: 'c1', status: 'computing', reputation: 95, isTee: true,  isRandomNode: false, stake: 9500  },
  { id: 'n3', x: 180, y: 330, clusterId: 'c1', status: 'idle',      reputation: 99, isTee: true,  isRandomNode: false, stake: 15000 },
  { id: 'n4', x: 330, y: 310, clusterId: 'c1', status: 'computing', reputation: 82, isTee: false, isRandomNode: true,  stake: 6000  },
  // Beta Cluster
  { id: 'n5', x: 570, y: 255, clusterId: 'c2', status: 'computing', reputation: 91, isTee: true,  isRandomNode: false, stake: 11000 },
  { id: 'n6', x: 690, y: 240, clusterId: 'c2', status: 'idle',      reputation: 88, isTee: true,  isRandomNode: false, stake: 8200  },
  { id: 'n7', x: 650, y: 380, clusterId: 'c2', status: 'offline',   reputation: 74, isTee: false, isRandomNode: false, stake: 5000  },
  // Unassigned pool (potential Sybil attackers)
  { id: 'n8',  x: 820, y: 90,  clusterId: null, status: 'idle', reputation: 58, isTee: false, isRandomNode: false, stake: 1200 },
  { id: 'n9',  x: 870, y: 155, clusterId: null, status: 'idle', reputation: 52, isTee: false, isRandomNode: false, stake: 900  },
  { id: 'n10', x: 780, y: 195, clusterId: null, status: 'idle', reputation: 61, isTee: false, isRandomNode: false, stake: 1400 },
];

// ── Helpers ───────────────────────────────────────────────────────────────────

function reputationLabel(r: number) {
  if (r >= 90) return { label: 'Excellent', color: '#22c55e' };
  if (r >= 75) return { label: 'Good',      color: '#84cc16' };
  if (r >= 55) return { label: 'Fair',      color: '#eab308' };
  return               { label: 'Poor',     color: '#ef4444' };
}

function statusColor(s: ArxNode['status'], clusterId: string | null) {
  if (s === 'slashed')   return '#ef4444';
  if (s === 'offline')   return '#f97316';
  if (s === 'computing') return clusterId ? CLUSTER_MAP[clusterId]?.color ?? '#6366f1' : '#6366f1';
  return '#52525b'; // idle
}

function nowTime() {
  return new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit', second: '2-digit' });
}

let logIdCounter = 10;

// ── Node circle on canvas ─────────────────────────────────────────────────────

function ArxNodeCircle({
  node, isSelected, simulatingSybil, onClick,
}: {
  node: ArxNode; isSelected: boolean; simulatingSybil: boolean; onClick: () => void;
}) {
  const isMalicious = simulatingSybil && ['n8', 'n9', 'n10'].includes(node.id);
  const fill = isMalicious ? '#ef4444' : statusColor(node.status, node.clusterId);
  const glow = isMalicious ? 'rgba(239,68,68,0.6)' : node.status === 'computing'
    ? (node.clusterId ? CLUSTER_MAP[node.clusterId]?.glow : undefined)
    : undefined;

  return (
    <motion.div
      className="absolute cursor-pointer"
      style={{ left: node.x - 24, top: node.y - 24, zIndex: 15 }}
      animate={{ x: 0, y: 0 }}
      onClick={onClick}
    >
      {/* Pulse ring while computing */}
      {node.status === 'computing' && !isMalicious && (
        <motion.div
          className="absolute rounded-full pointer-events-none"
          style={{ inset: -6, border: `2px solid ${fill}` }}
          animate={{ scale: [1, 1.7], opacity: [0.7, 0] }}
          transition={{ duration: 1.6, repeat: Infinity, ease: 'easeOut' }}
        />
      )}
      {/* Attack halo */}
      {isMalicious && (
        <motion.div
          className="absolute rounded-full bg-red-500/20 pointer-events-none"
          style={{ inset: -10 }}
          animate={{ scale: [1, 1.4, 1], opacity: [0.5, 0.9, 0.5] }}
          transition={{ duration: 1, repeat: Infinity }}
        />
      )}
      {/* Node body */}
      <motion.div
        className="w-12 h-12 rounded-full flex flex-col items-center justify-center text-white font-bold text-[9px] select-none relative"
        style={{
          background: fill,
          boxShadow: glow ? `0 0 16px 4px ${glow}, 0 0 6px 2px ${fill}44` : isSelected ? '0 0 0 3px #fff' : 'none',
          border: isSelected ? '2px solid #fff' : `2px solid ${fill}`,
        }}
        animate={{ scale: isMalicious ? [1, 1.1, 1] : 1 }}
        transition={{ duration: 0.6, repeat: isMalicious ? Infinity : 0 }}
      >
        <span className="uppercase tracking-wide leading-none">{node.id.toUpperCase()}</span>
        {node.isTee && <Shield size={8} className="opacity-80 mt-0.5" />}
      </motion.div>
      {/* Random node badge */}
      {node.isRandomNode && (
        <div
          className="absolute -top-2 -right-2 w-5 h-5 rounded-full bg-yellow-400 border border-zinc-900 flex items-center justify-center"
          title="Mandated random node (Sybil Resistance)"
        >
          <Star size={9} className="text-zinc-900" fill="currentColor" />
        </div>
      )}
    </motion.div>
  );
}

// ── Main component ────────────────────────────────────────────────────────────

export function ArchitectureExplorer() {
  const { markActivityCompleted } = useProgressStore();
  const [nodes, setNodes] = useState<ArxNode[]>(INITIAL_NODES);
  const [selectedNode, setSelectedNode] = useState<ArxNode | null>(null);
  const [simulatingSybil, setSimulatingSybil] = useState(false);
  const [activeTab, setActiveTab] = useState<'node' | 'concepts'>('node');
  const [eventLog, setEventLog] = useState<EventLog[]>([
    { id: 1, time: nowTime(), text: 'Network topology loaded. Alpha Cluster and Beta Cluster online.', type: 'info' },
    { id: 2, time: nowTime(), text: 'Alpha Cluster: executing AI Training MXE computations.', type: 'success' },
    { id: 3, time: nowTime(), text: 'Beta Cluster: executing DeFi Trading MXE computations.', type: 'success' },
    { id: 4, time: nowTime(), text: 'N7 reported offline. Forced migration may be triggered.', type: 'warn' },
  ]);

  const addLog = useCallback((text: string, type: EventLog['type']) => {
    setEventLog(prev => [{ id: ++logIdCounter, time: nowTime(), text, type }, ...prev].slice(0, 20));
  }, []);

  // Keep selected node in sync after state changes
  useEffect(() => {
    if (selectedNode) {
      const updated = nodes.find(n => n.id === selectedNode.id);
      if (updated) setSelectedNode(updated);
    }
  }, [nodes]); // eslint-disable-line

  const triggerSybilAttack = () => {
    if (simulatingSybil) return;
    setSimulatingSybil(true);
    addLog('⚠ Sybil attack detected! Low-reputation nodes attempting to infiltrate Beta Cluster.', 'danger');

    // Move attacker nodes toward Beta cluster center
    setNodes(prev => prev.map(n => {
      if (['n8', 'n9', 'n10'].includes(n.id)) {
        return { ...n, status: 'offline' as const, clusterId: 'c2' };
      }
      return n;
    }));

    setTimeout(() => {
      addLog('Proof of Stake threshold not met — admission rejected for all three nodes.', 'warn');
    }, 1500);

    setTimeout(() => {
      addLog('Slashing penalty applied: staked tokens reduced due to protocol violation.', 'danger');
      setNodes(prev => prev.map(n => {
        if (['n8', 'n9', 'n10'].includes(n.id)) {
          return { ...n, status: 'slashed' as const, reputation: Math.max(0, n.reputation - 40), stake: Math.floor(n.stake * 0.4), clusterId: null };
        }
        return n;
      }));
    }, 3000);

    setTimeout(() => {
      addLog('Sybil attack repelled. Network integrity maintained via random node inclusion.', 'success');
      setSimulatingSybil(false);
      markActivityCompleted('architecture');
    }, 5000);
  };

  const resetNetwork = () => {
    setNodes(INITIAL_NODES);
    setSelectedNode(null);
    setSimulatingSybil(false);
    setEventLog([{ id: ++logIdCounter, time: nowTime(), text: 'Network reset to initial state.', type: 'info' }]);
  };

  const W = 960, H = 540;

  // Collect all intra-cluster edges
  const edges: { ax: number; ay: number; bx: number; by: number; active: boolean; color: string }[] = [];
  CLUSTERS.forEach(c => {
    const clusterNodes = nodes.filter(n => n.clusterId === c.id);
    for (let i = 0; i < clusterNodes.length; i++) {
      for (let j = i + 1; j < clusterNodes.length; j++) {
        const a = clusterNodes[i], b = clusterNodes[j];
        edges.push({
          ax: a.x, ay: a.y, bx: b.x, by: b.y,
          active: a.status === 'computing' && b.status === 'computing',
          color: c.color,
        });
      }
    }
  });

  // Sybil attack edges
  const attackEdges = simulatingSybil
    ? nodes.filter(n => ['n8', 'n9', 'n10'].includes(n.id)).map(n => ({ x: n.x, y: n.y }))
    : [];

  return (
    <div className="flex flex-col gap-6 w-full mt-4">

      {/* ── Top action bar ── */}
      <div className="flex flex-wrap items-center justify-between gap-3 p-4 bg-black border border-zinc-800 rounded-xl shadow-lg">
        <div className="flex items-center gap-3">
          <Network size={20} className="text-indigo-400" />
          <div>
            <h2 className="text-base font-bold leading-tight">Live Network Map</h2>
            <p className="text-xs text-zinc-500">Click any <strong className="text-white">Arx Node</strong> to inspect its profile. Watch connections light up as clusters compute.</p>
          </div>
        </div>
        <div className="flex items-center gap-2">
          <button
            onClick={resetNetwork}
            className="px-3 py-1.5 rounded-lg text-xs font-semibold text-zinc-400 hover:text-white bg-zinc-800 hover:bg-zinc-700 transition-colors"
          >
            Reset
          </button>
          <motion.button
            onClick={triggerSybilAttack}
            disabled={simulatingSybil}
            className={`px-4 py-2 rounded-lg text-sm font-bold flex items-center gap-2 transition-all border ${
              simulatingSybil
                ? 'bg-zinc-800 text-zinc-500 border-zinc-700 cursor-not-allowed'
                : 'bg-red-500/15 text-red-400 border-red-500/40 hover:bg-red-500/25'
            }`}
            animate={simulatingSybil ? {} : { boxShadow: ['0 0 0px #ef444440', '0 0 14px #ef444440', '0 0 0px #ef444440'] }}
            transition={{ duration: 2.5, repeat: Infinity }}
          >
            <Shield size={15} />
            {simulatingSybil ? 'Attack in Progress...' : 'Simulate Sybil Attack'}
          </motion.button>
        </div>
      </div>

      {/* ── Color legend ── */}
      <div className="flex flex-wrap gap-4 px-1 text-xs text-zinc-400">
        {CLUSTERS.map(c => (
          <div key={c.id} className="flex items-center gap-1.5">
            <div className="w-3 h-3 rounded-full" style={{ background: c.color, boxShadow: `0 0 6px ${c.color}` }} />
            <span>{c.name}</span>
          </div>
        ))}
        <div className="flex items-center gap-1.5"><div className="w-3 h-3 rounded-full bg-zinc-500" /><span>Idle</span></div>
        <div className="flex items-center gap-1.5"><div className="w-3 h-3 rounded-full bg-orange-500" /><span>Offline</span></div>
        <div className="flex items-center gap-1.5"><div className="w-3 h-3 rounded-full bg-red-500" /><span>Slashed</span></div>
        <div className="flex items-center gap-1.5">
          <div className="w-4 h-4 rounded-full bg-yellow-400 flex items-center justify-center"><Star size={8} className="text-zinc-900" fill="currentColor" /></div>
          <span>Mandatory Random Node</span>
        </div>
        <div className="flex items-center gap-1.5"><Shield size={12} className="text-zinc-400" /><span>TEE Hardware</span></div>
      </div>

      {/* ── Main canvas + sidebar ── */}
      <div className="flex flex-col xl:flex-row gap-5">

        {/* Canvas */}
        <motion.div
          className="relative flex-grow rounded-2xl border border-zinc-800 overflow-hidden bg-black shadow-2xl"
          style={{ minHeight: H }}
          animate={{ borderColor: simulatingSybil ? '#ef444460' : '#27272a' }}
        >
          {/* SVG connections */}
          <svg className="absolute inset-0 pointer-events-none" width={W} height={H} style={{ overflow: 'visible' }}>
            <defs>
              <filter id="glow-indigo">
                <feGaussianBlur stdDeviation="3" result="blur" />
                <feMerge><feMergeNode in="blur" /><feMergeNode in="SourceGraphic" /></feMerge>
              </filter>
            </defs>

            {/* Cluster ellipses */}
            {CLUSTERS.map(c => (
              <g key={c.id}>
                <ellipse
                  cx={c.cx} cy={c.cy} rx={c.rx} ry={c.ry}
                  fill={c.glow} stroke={c.color} strokeWidth={1.5} strokeOpacity={0.6}
                />
                {/* Cluster label */}
                <text x={c.cx} y={c.cy - c.ry - 10} textAnchor="middle" fill={c.color} fontSize={11} fontWeight={700} letterSpacing={1} opacity={0.9}>
                  {c.name.toUpperCase()}
                </text>
                {/* MXE badge */}
                {c.activeMxe && (
                  <text x={c.cx} y={c.cy + c.ry + 18} textAnchor="middle" fill={c.color} fontSize={9} opacity={0.7}>
                    MXE: {c.activeMxe}
                  </text>
                )}
              </g>
            ))}

            {/* Intra-cluster mesh edges */}
            {edges.map((e, i) => (
              <motion.line
                key={i}
                x1={e.ax} y1={e.ay} x2={e.bx} y2={e.by}
                stroke={e.active ? e.color : '#3f3f46'}
                strokeWidth={e.active ? 1.5 : 0.8}
                strokeOpacity={e.active ? 0.8 : 0.25}
                strokeDasharray={e.active ? '5 3' : undefined}
                animate={e.active ? { strokeDashoffset: [0, -80] } : {}}
                transition={{ duration: 2, repeat: Infinity, ease: 'linear' }}
              />
            ))}

            {/* Sybil attack vectors */}
            <AnimatePresence>
              {attackEdges.map((a, i) => (
                <motion.line
                  key={`atk-${i}`}
                  x1={a.x} y1={a.y} x2={CLUSTERS[1].cx} y2={CLUSTERS[1].cy}
                  stroke="#ef4444" strokeWidth={2} strokeDasharray="4 3"
                  initial={{ opacity: 0, pathLength: 0 }}
                  animate={{ opacity: 0.8, pathLength: 1, strokeDashoffset: [0, -60] }}
                  exit={{ opacity: 0 }}
                  transition={{ duration: 0.6, delay: i * 0.1, strokeDashoffset: { duration: 1.2, repeat: Infinity, ease: 'linear' } }}
                />
              ))}
            </AnimatePresence>

            {/* Selected node highlight ring */}
            {selectedNode && (
              <circle
                cx={selectedNode.x} cy={selectedNode.y} r={30}
                fill="none" stroke="#fff" strokeWidth={2} opacity={0.8}
              />
            )}
          </svg>

          {/* Arx node circles */}
          {nodes.map(node => (
            <ArxNodeCircle
              key={node.id}
              node={node}
              isSelected={selectedNode?.id === node.id}
              simulatingSybil={simulatingSybil}
              onClick={() => { setSelectedNode(node); setActiveTab('node'); }}
            />
          ))}

          {/* Unassigned pool label */}
          <div className="absolute top-4 right-4 text-[9px] text-zinc-600 uppercase tracking-widest font-semibold pointer-events-none">
            Unassigned Pool
          </div>

          {/* Sybil attack overlay banner */}
          <AnimatePresence>
            {simulatingSybil && (
              <motion.div
                className="absolute bottom-0 inset-x-0 p-4 bg-red-950/80 border-t border-red-500/40 backdrop-blur-sm"
                initial={{ y: 60, opacity: 0 }}
                animate={{ y: 0, opacity: 1 }}
                exit={{ y: 60, opacity: 0 }}
              >
                <div className="flex items-start gap-3">
                  <AlertTriangle className="text-red-400 flex-shrink-0 mt-0.5" size={18} />
                  <div>
                    <p className="text-red-300 font-bold text-sm">Sybil Attack Detected!</p>
                    <p className="text-xs text-zinc-400 mt-0.5 leading-relaxed">
                      Low-reputation, low-stake nodes N8, N9, and N10 attempted to flood Beta Cluster.
                      Arcium's <strong className="text-white">Proof of Stake</strong> threshold and <strong className="text-white">randomised node inclusion</strong> prevented the takeover.
                      Slashing penalties are being applied.
                    </p>
                  </div>
                </div>
              </motion.div>
            )}
          </AnimatePresence>
        </motion.div>

        {/* ── Right sidebar ── */}
        <div className="w-full xl:w-80 flex flex-col gap-4">

          {/* Tab switcher */}
          <div className="flex rounded-xl overflow-hidden border border-zinc-800">
            {(['node', 'concepts'] as const).map(tab => (
              <button
                key={tab}
                onClick={() => setActiveTab(tab)}
                className={`flex-1 py-2 text-xs font-bold uppercase tracking-wider transition-colors ${
                  activeTab === tab ? 'bg-indigo-600 text-white' : 'bg-zinc-900 text-zinc-500 hover:text-white'
                }`}
              >
                {tab === 'node' ? '🔍 Node Inspector' : '📖 Concepts'}
              </button>
            ))}
          </div>

          {/* Node inspector panel */}
          {activeTab === 'node' && (
            <AnimatePresence mode="wait">
              {selectedNode ? (
                <motion.div
                  key={selectedNode.id}
                  className="bg-black border border-zinc-800 rounded-xl p-5 flex flex-col gap-4 shadow-xl"
                  initial={{ opacity: 0, y: 6 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0 }}
                >
                  {/* Header */}
                  <div className="flex items-center justify-between">
                    <div className="flex items-center gap-2">
                      <div
                        className="w-10 h-10 rounded-full flex items-center justify-center font-bold text-white text-xs"
                        style={{ background: statusColor(selectedNode.status, selectedNode.clusterId) }}
                      >
                        {selectedNode.id.toUpperCase()}
                      </div>
                      <div>
                        <p className="font-bold font-mono text-white">{selectedNode.id.toUpperCase()}</p>
                        <p className="text-[10px] text-zinc-500 capitalize">{selectedNode.status}</p>
                      </div>
                    </div>
                    {selectedNode.isTee && (
                      <div className="flex items-center gap-1 text-green-400 text-xs bg-green-500/10 border border-green-500/30 px-2 py-1 rounded-full">
                        <Shield size={11} /> TEE
                      </div>
                    )}
                  </div>

                  {/* Cluster assignment */}
                  <div className="bg-zinc-950/40 rounded-lg p-3 border border-zinc-800">
                    <p className="text-[10px] uppercase tracking-wider text-zinc-500 mb-1.5">Cluster Assignment</p>
                    {selectedNode.clusterId ? (() => {
                      const c = CLUSTER_MAP[selectedNode.clusterId];
                      return (
                        <div className="flex items-center gap-2">
                          <div className="w-2.5 h-2.5 rounded-full" style={{ background: c.color }} />
                          <p className="text-sm font-semibold text-white">{c.name}</p>
                        </div>
                      );
                    })() : (
                      <p className="text-sm text-zinc-400">Unassigned Pool</p>
                    )}
                    {selectedNode.isRandomNode && (
                      <p className="text-[10px] text-yellow-400 mt-1.5 flex items-center gap-1">
                        <Star size={10} fill="currentColor" />
                        Randomly selected for Sybil resistance — prevents collusion.
                      </p>
                    )}
                    {!selectedNode.clusterId && (
                      <p className="text-[10px] text-zinc-600 mt-1">Eligible for random inclusion in public clusters. Low reputation reduces selection chance.</p>
                    )}
                  </div>

                  {/* Reputation score */}
                  <div className="bg-zinc-950/40 rounded-lg p-3 border border-zinc-800">
                    <div className="flex items-center justify-between mb-2">
                      <p className="text-[10px] uppercase tracking-wider text-zinc-500">Reputation Score</p>
                      <span className="text-sm font-bold" style={{ color: reputationLabel(selectedNode.reputation).color }}>
                        {selectedNode.reputation}/100 — {reputationLabel(selectedNode.reputation).label}
                      </span>
                    </div>
                    {/* Bar */}
                    <div className="h-2 w-full bg-zinc-800 rounded-full overflow-hidden">
                      <motion.div
                        className="h-full rounded-full"
                        style={{ background: reputationLabel(selectedNode.reputation).color }}
                        initial={{ width: 0 }}
                        animate={{ width: `${selectedNode.reputation}%` }}
                        transition={{ duration: 0.5, ease: 'easeOut' }}
                      />
                    </div>
                    <p className="text-[10px] text-zinc-600 mt-1.5 leading-relaxed">
                      Built from uptime, response time & slashing history. High-reputation nodes are selected for more Clusters and earn more rewards.
                    </p>
                  </div>

                  {/* Stake */}
                  <div className="flex justify-between items-center bg-zinc-950/40 p-3 rounded-lg border border-zinc-800">
                    <div>
                      <p className="text-[10px] uppercase tracking-wider text-zinc-500">Staked Collateral</p>
                      <p className="text-sm font-bold text-white font-mono">{selectedNode.stake.toLocaleString()} ARC</p>
                    </div>
                    <div className="text-right">
                      <p className="text-[10px] uppercase tracking-wider text-zinc-500">Hardware</p>
                      <p className="text-sm font-semibold text-white flex items-center gap-1 justify-end">
                        {selectedNode.isTee
                          ? <><Shield size={12} className="text-green-400" /> TEE Secure</>
                          : <><Cpu size={12} className="text-zinc-400" /> Standard CPU</>
                        }
                      </p>
                    </div>
                  </div>

                  {/* Status explainer */}
                  <div className={`rounded-lg p-3 border text-xs leading-relaxed ${
                    selectedNode.status === 'computing' ? 'bg-indigo-500/10 border-indigo-500/30 text-indigo-300' :
                    selectedNode.status === 'offline'   ? 'bg-orange-500/10 border-orange-500/30 text-orange-300' :
                    selectedNode.status === 'slashed'   ? 'bg-red-500/10 border-red-500/30 text-red-300' :
                                                          'bg-zinc-800 border-zinc-700 text-zinc-400'
                  }`}>
                    {selectedNode.status === 'computing' && <><Activity size={12} className="inline mr-1" />Node is actively executing encrypted computations inside its Cluster.</>}
                    {selectedNode.status === 'idle'      && <><CheckCircle size={12} className="inline mr-1" />Node is online and available — awaiting assignment to new computations.</>}
                    {selectedNode.status === 'offline'   && <><ZapOff size={12} className="inline mr-1" />Node is offline. A forced migration may be triggered if downtime persists, with stake costs deducted.</>}
                    {selectedNode.status === 'slashed'   && <><AlertTriangle size={12} className="inline mr-1" />Slashing applied for protocol violation. Stake reduced and reputation damaged. Node removed from Cluster.</>}
                  </div>
                </motion.div>
              ) : (
                <motion.div
                  className="bg-black border border-zinc-800 border-dashed rounded-xl p-8 flex flex-col items-center justify-center text-center text-zinc-600 gap-3 shadow-inner"
                  initial={{ opacity: 0 }} animate={{ opacity: 1 }}
                >
                  <Server size={36} className="opacity-20" />
                  <p className="text-sm">Click any <strong className="text-zinc-400">Arx Node</strong> on the map to inspect its profile.</p>
                  <p className="text-xs text-zinc-700">Explore reputation scores, stake, TEE status, and cluster assignments.</p>
                </motion.div>
              )}
            </AnimatePresence>
          )}

          {/* Concepts panel */}
          {activeTab === 'concepts' && (
            <motion.div
              className="bg-black border border-zinc-800 rounded-xl p-5 flex flex-col gap-4 overflow-y-auto max-h-[520px] shadow-xl"
              initial={{ opacity: 0, y: 6 }} animate={{ opacity: 1, y: 0 }}
            >
              {[
                {
                  icon: <Server size={14} />, color: '#6366f1', title: 'Arx Nodes',
                  body: 'Named from Latin "arx" meaning fortress — each node is a secure, decentralized computational worker. Nodes must stake collateral to participate. Deviation from protocol is punished by slashing.'
                },
                {
                  icon: <Network size={14} />, color: '#06b6d4', title: 'Clusters',
                  body: 'Groups of Arx Nodes assembled by Computation Customers to execute encrypted computations. One Cluster can concurrently serve multiple MXEs. Nodes must approve their Cluster assignment.'
                },
                {
                  icon: <Star size={14} />, color: '#eab308', title: 'Reputation Score',
                  body: 'An offchain score reflecting a node\'s uptime, response time, and slashing history. High-reputation nodes attract more Cluster assignments and delegated stake, increasing their rewards.'
                },
                {
                  icon: <Shield size={14} />, color: '#22c55e', title: 'TEE (Trusted Execution Env.)',
                  body: 'Optional hardware security layer that creates an isolated enclave to protect key shares from unauthorized access. TEE nodes cannot have their key shares inspected — not even by the operator.'
                },
                {
                  icon: <Lock size={14} />, color: '#f97316', title: 'Sybil Resistance',
                  body: 'Every public (non-permissioned) Cluster must include at least one randomly selected node. Even if all other nodes collude, this node acts as an independent counterbalance, preserving cluster integrity.'
                },
                {
                  icon: <AlertTriangle size={14} />, color: '#ef4444', title: 'Slashing',
                  body: 'Nodes that deviate from protocol (non-participation, cheating, concurrent downtime) face stake reduction. Delegators sharing stake with a misbehaving node are also slashed proportionally.'
                },
              ].map(({ icon, color, title, body }) => (
                <div key={title} className="flex gap-3">
                  <div className="flex-shrink-0 w-7 h-7 rounded-lg flex items-center justify-center" style={{ background: `${color}20`, color }}>
                    {icon}
                  </div>
                  <div>
                    <p className="text-sm font-bold text-white mb-0.5">{title}</p>
                    <p className="text-xs text-zinc-400 leading-relaxed">{body}</p>
                  </div>
                </div>
              ))}
            </motion.div>
          )}

          {/* ── Event Log ── */}
          <div className="bg-black border border-zinc-800 rounded-xl p-4 flex flex-col gap-2 shadow-xl">
            <h4 className="text-[10px] uppercase tracking-widest text-zinc-500 font-bold flex items-center gap-1.5 mb-1">
              <Activity size={11} /> Live Event Log
            </h4>
            <div className="flex flex-col gap-1.5 max-h-40 overflow-y-auto">
              <AnimatePresence initial={false}>
                {eventLog.map(e => (
                  <motion.div
                    key={e.id}
                    className="flex gap-2 items-start"
                    initial={{ opacity: 0, x: -8 }}
                    animate={{ opacity: 1, x: 0 }}
                    transition={{ duration: 0.25 }}
                  >
                    <ChevronRight size={10} className={`flex-shrink-0 mt-0.5 ${
                      e.type === 'success' ? 'text-green-500' :
                      e.type === 'warn'    ? 'text-yellow-500' :
                      e.type === 'danger'  ? 'text-red-500' : 'text-zinc-500'
                    }`} />
                    <span className="text-[10px] text-zinc-400 leading-relaxed">{e.text}</span>
                  </motion.div>
                ))}
              </AnimatePresence>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
