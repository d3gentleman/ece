'use client';

import { useEffect, useState, useCallback } from 'react';
import { useSimulationStore } from '@/state/simulationStore';
import { useProgressStore } from '@/state/progressStore';
import { motion, AnimatePresence } from 'framer-motion';
import { Play, Pause, SkipForward, SkipBack, RotateCcw, Lock, Cpu, Database, Zap, CheckCircle } from 'lucide-react';

// ─── Step color system ──────────────────────────────────────────────────────
const STEP_THEME = {
  DEFINITION: {
    label: 'Definition',
    number: 1,
    icon: Lock,
    accent: '#3b82f6',       // blue-500
    glow: 'rgba(59,130,246,0.35)',
    bg: 'rgba(59,130,246,0.08)',
    border: 'rgba(59,130,246,0.4)',
    text: 'text-blue-400',
    border_cls: 'border-blue-500',
    badge: 'bg-blue-500/20 text-blue-300 border border-blue-500/40',
    description: 'A Computation Customer defines a new job within an MXE — specifying inputs, logic, access permissions, and output callbacks.',
  },
  COMMISSION: {
    label: 'Commission',
    number: 2,
    icon: Zap,
    accent: '#eab308',       // yellow-500
    glow: 'rgba(234,179,8,0.35)',
    bg: 'rgba(234,179,8,0.08)',
    border: 'rgba(234,179,8,0.4)',
    text: 'text-yellow-400',
    border_cls: 'border-yellow-500',
    badge: 'bg-yellow-500/20 text-yellow-300 border border-yellow-500/40',
    description: 'The customer instantiates the job, attaches a Priority Fee to determine queue position, and submits it to the global Solana Mempool.',
  },
  MEMPOOL: {
    label: 'Mempool',
    number: 3,
    icon: Database,
    accent: '#a855f7',       // purple-500
    glow: 'rgba(168,85,247,0.35)',
    bg: 'rgba(168,85,247,0.08)',
    border: 'rgba(168,85,247,0.4)',
    text: 'text-purple-400',
    border_cls: 'border-purple-500',
    badge: 'bg-purple-500/20 text-purple-300 border border-purple-500/40',
    description: 'The job waits in the global onchain Mempool. Priority Fees compete within Cluster-specific markets — higher fees jump the queue.',
  },
  EXECUTION: {
    label: 'Execution',
    number: 4,
    icon: Cpu,
    accent: '#06b6d4',       // cyan-500
    glow: 'rgba(6,182,212,0.35)',
    bg: 'rgba(6,182,212,0.08)',
    border: 'rgba(6,182,212,0.4)',
    text: 'text-cyan-400',
    border_cls: 'border-cyan-500',
    badge: 'bg-cyan-500/20 text-cyan-300 border border-cyan-500/40',
    description: 'A Cluster of Arx Nodes receives secret shares and performs homomorphic MPC — computing directly on encrypted fragments without ever seeing the raw data.',
  },
  CALLBACK: {
    label: 'Callback',
    number: 5,
    icon: CheckCircle,
    accent: '#22c55e',       // green-500
    glow: 'rgba(34,197,94,0.35)',
    bg: 'rgba(34,197,94,0.08)',
    border: 'rgba(34,197,94,0.4)',
    text: 'text-green-400',
    border_cls: 'border-green-500',
    badge: 'bg-green-500/20 text-green-300 border border-green-500/40',
    description: 'Execution concludes. The network triggers predefined onchain callbacks — delivering the verified result directly to the designated recipient.',
  },
} as const;

type StepKey = keyof typeof STEP_THEME;

// ─── Animated particle that travels along a straight line ──────────────────
function TravelingParticle({
  startX, startY, endX, endY, color, delay = 0, duration = 1.2,
}: {
  startX: number; startY: number; endX: number; endY: number;
  color: string; delay?: number; duration?: number;
}) {
  return (
    <motion.div
      className="absolute w-3 h-3 rounded-full pointer-events-none"
      style={{ background: color, boxShadow: `0 0 12px 4px ${color}`, zIndex: 20 }}
      initial={{ x: startX - 6, y: startY - 6, opacity: 0, scale: 0.5 }}
      animate={{ x: endX - 6, y: endY - 6, opacity: [0, 1, 1, 0], scale: [0.5, 1.2, 1, 0.5] }}
      transition={{ duration, delay, ease: 'easeInOut', repeat: Infinity, repeatDelay: 0.6 }}
    />
  );
}

// ─── Pulsing ring on a node during EXECUTION ───────────────────────────────
function PulseRing({ x, y, color }: { x: number; y: number; color: string }) {
  return (
    <motion.div
      className="absolute rounded-full pointer-events-none"
      style={{ left: x - 4, top: y - 4, width: 56, height: 56, border: `2px solid ${color}`, zIndex: 5 }}
      initial={{ opacity: 0.8, scale: 1 }}
      animate={{ opacity: 0, scale: 2.2 }}
      transition={{ duration: 1.4, repeat: Infinity, ease: 'easeOut' }}
    />
  );
}

// ─── SVG connection line ────────────────────────────────────────────────────
function AnimatedLine({
  startX, startY, endX, endY, color, active, animated = false,
}: {
  startX: number; startY: number; endX: number; endY: number;
  color: string; active: boolean; animated?: boolean;
}) {
  const id = `dash-${startX}-${endX}`;
  return (
    <svg className="absolute inset-0 pointer-events-none" style={{ width: '100%', height: '100%', overflow: 'visible', zIndex: 1 }}>
      {animated && (
        <defs>
          <motion.marker id={id} />
        </defs>
      )}
      <motion.line
        x1={startX} y1={startY} x2={endX} y2={endY}
        stroke={active ? color : '#27272a'}
        strokeWidth={active ? 2 : 1}
        strokeOpacity={active ? 1 : 0.4}
        strokeDasharray={active && animated ? '6 4' : undefined}
        initial={{ pathLength: 0, opacity: 0 }}
        animate={{ pathLength: 1, opacity: 1, strokeDashoffset: animated ? [0, -100] : 0 }}
        transition={{
          pathLength: { duration: 0.4 },
          opacity: { duration: 0.3 },
          strokeDashoffset: { duration: 2, repeat: Infinity, ease: 'linear' },
        }}
      />
    </svg>
  );
}

// ─── Single Arx Node circle ─────────────────────────────────────────────────
function ArxNode({
  x, y, label, accent, isActive, shareValue,
}: {
  x: number; y: number; label: string; accent: string; isActive: boolean; shareValue?: number;
}) {
  return (
    <motion.div
      className="absolute flex flex-col items-center justify-center rounded-full font-bold text-white text-[10px]"
      style={{
        left: x - 28, top: y - 28, width: 56, height: 56,
        background: isActive ? accent : '#3f3f46',
        boxShadow: isActive ? `0 0 18px 4px ${accent}88, 0 0 6px 2px ${accent}` : 'none',
        border: `2px solid ${isActive ? accent : '#52525b'}`,
        zIndex: 10,
      }}
      initial={{ scale: 0, opacity: 0 }}
      animate={{ scale: 1, opacity: 1 }}
      transition={{ type: 'spring', stiffness: 280, damping: 18 }}
    >
      {shareValue !== undefined ? (
        <div className="flex flex-col items-center leading-none gap-0.5">
          <span className="text-[8px] opacity-60 uppercase tracking-wide">Share</span>
          <span className="font-mono text-sm">{shareValue.toString(16).padStart(2,'0').toUpperCase()}</span>
        </div>
      ) : (
        label
      )}
    </motion.div>
  );
}

// ─── Main Component ─────────────────────────────────────────────────────────
export function MPCVisualizer() {
  const {
    inputSecret, nodeCount, priorityFee,
    nodes, result, currentStep,
    setInputSecret, setNodeCount, setPriorityFee,
    nextStep, prevStep, resetSimulation,
  } = useSimulationStore();

  const [isPlaying, setIsPlaying] = useState(false);
  const { markActivityCompleted } = useProgressStore();
  const theme = STEP_THEME[currentStep as StepKey];

  // Auto-play
  useEffect(() => {
    let interval: NodeJS.Timeout;
    if (isPlaying && currentStep !== 'CALLBACK') {
      interval = setInterval(() => nextStep(), 2800);
    } else if (currentStep === 'CALLBACK') {
      setIsPlaying(false);
      markActivityCompleted('mpc');
    }
    return () => clearInterval(interval);
  }, [isPlaying, currentStep, nextStep, markActivityCompleted]);

  // Canvas layout
  const W = 780, H = 440;
  const clusterCX = 490, clusterCY = H / 2, clusterR = 150;
  const mempoolX = 110, mempoolY = H / 2;
  const customerX = 60, customerY = 80;
  const resultX = W - 60, resultY = 80;

  const nodePositions = Array.from({ length: nodeCount }).map((_, i) => {
    const angle = (i / nodeCount) * 2 * Math.PI - Math.PI / 2;
    return { x: clusterCX + clusterR * Math.cos(angle), y: clusterCY + clusterR * Math.sin(angle) };
  });

  const stepKeys = Object.keys(STEP_THEME) as StepKey[];
  const currentIdx = stepKeys.indexOf(currentStep as StepKey);

  return (
    <div className="flex flex-col gap-5 w-full max-w-5xl mx-auto">

      {/* ── Step Progress Bar ── */}
      <div className="grid gap-1" style={{ gridTemplateColumns: `repeat(${stepKeys.length}, 1fr)` }}>
        {stepKeys.map((key, i) => {
          const t = STEP_THEME[key];
          const Icon = t.icon;
          const isDone = i < currentIdx;
          const isCurrent = i === currentIdx;
          return (
            <div key={key} className="flex flex-col items-center gap-1.5">
              <motion.div
                className="h-1.5 w-full rounded-full"
                style={{ background: isDone || isCurrent ? t.accent : '#27272a' }}
                animate={{ opacity: isCurrent ? [0.6, 1, 0.6] : 1 }}
                transition={{ duration: 1.5, repeat: isCurrent ? Infinity : 0 }}
              />
              <div className={`flex items-center gap-1.5 text-xs font-semibold transition-colors ${isCurrent ? t.text : isDone ? 'text-zinc-400' : 'text-zinc-600'}`}>
                <Icon size={12} />
                <span className="hidden sm:inline">{t.label}</span>
              </div>
            </div>
          );
        })}
      </div>

      {/* ── Controls + Config ── */}
      <motion.div
        className="flex flex-wrap items-center justify-between p-4 rounded-xl border gap-4"
        animate={{ borderColor: theme.accent, backgroundColor: theme.bg }}
        transition={{ duration: 0.5 }}
      >
        <div className="flex items-center gap-4">
          {[
            { label: 'Secret Input', value: inputSecret, onChange: setInputSecret, disabled: currentStep !== 'DEFINITION', min: 0, max: 999 },
            { label: 'Priority Fee', value: priorityFee, onChange: setPriorityFee, disabled: false, min: 1, max: 999 },
            { label: 'Cluster Nodes', value: nodeCount, onChange: setNodeCount, disabled: currentStep !== 'DEFINITION', min: 3, max: 7 },
          ].map(({ label, value, onChange, disabled, min, max }) => (
            <div key={label} className="flex flex-col">
              <label className="text-[10px] uppercase tracking-wider text-zinc-500 mb-1">{label}</label>
              <input
                type="number" value={value} min={min} max={max}
                onChange={(e) => onChange(Number(e.target.value))}
                disabled={disabled}
                className="w-20 px-2 py-1.5 bg-black border border-zinc-800 rounded-lg text-sm font-mono text-white focus:outline-none disabled:opacity-40"
                style={{ borderColor: disabled ? undefined : theme.accent + '80' }}
              />
            </div>
          ))}
        </div>

        <div className="flex items-center gap-2">
          <button onClick={resetSimulation} className="p-2 rounded-lg text-zinc-500 hover:text-white hover:bg-zinc-900 transition-colors" title="Reset">
            <RotateCcw size={18} />
          </button>
          <div className="w-px h-5 bg-zinc-800" />
          <button onClick={prevStep} disabled={currentStep === 'DEFINITION'} className="p-2 rounded-lg text-zinc-400 hover:text-white hover:bg-zinc-900 transition-colors disabled:opacity-30">
            <SkipBack size={18} />
          </button>
          <motion.button
            onClick={() => setIsPlaying(!isPlaying)}
            disabled={currentStep === 'CALLBACK'}
            className="px-4 py-2 rounded-lg text-sm font-semibold flex items-center gap-2 transition-all disabled:opacity-30"
            style={{ background: theme.accent, color: '#000', boxShadow: `0 0 12px ${theme.glow}` }}
            whileHover={{ scale: 1.05 }}
            whileTap={{ scale: 0.97 }}
            animate={{ boxShadow: [`0 0 8px ${theme.glow}`, `0 0 20px ${theme.glow}`, `0 0 8px ${theme.glow}`] }}
            transition={{ duration: 2, repeat: Infinity }}
          >
            {isPlaying ? <Pause size={16} /> : <Play size={16} />}
            {isPlaying ? 'Pause' : 'Play'}
          </motion.button>
          <button onClick={nextStep} disabled={currentStep === 'CALLBACK'} className="p-2 rounded-lg text-zinc-400 hover:text-white hover:bg-zinc-900 transition-colors disabled:opacity-30">
            <SkipForward size={18} />
          </button>
        </div>
      </motion.div>

      {/* ── Main Canvas ── */}
      <motion.div
        className="relative w-full rounded-2xl overflow-hidden border bg-black"
        style={{ height: H }}
        animate={{ borderColor: theme.border }}
        transition={{ duration: 0.4 }}
      >
        {/* Ambient background glow that follows step color */}
        <motion.div
          className="absolute inset-0 pointer-events-none"
          animate={{ background: `radial-gradient(ellipse 60% 60% at 50% 50%, ${theme.glow} 0%, transparent 70%)` }}
          transition={{ duration: 0.6 }}
        />

        {/* ── SVG Layer: all lines ── */}
        <svg className="absolute inset-0 w-full h-full pointer-events-none" style={{ overflow: 'visible', zIndex: 1 }}>
          {/* Mempool → all nodes */}
          {nodePositions.map((pos, i) => (
            <motion.line
              key={`m${i}`}
              x1={mempoolX} y1={mempoolY} x2={pos.x} y2={pos.y}
              stroke={currentStep === 'MEMPOOL' || currentStep === 'EXECUTION' ? theme.accent : '#27272a'}
              strokeWidth={currentStep === 'EXECUTION' ? 2 : 1}
              strokeOpacity={0.6}
              strokeDasharray={currentStep === 'EXECUTION' ? '5 4' : undefined}
              animate={{ strokeDashoffset: currentStep === 'EXECUTION' ? [0, -90] : 0 }}
              transition={{ strokeDashoffset: { duration: 1.8, repeat: Infinity, ease: 'linear' } }}
            />
          ))}
          {/* Inter-node mesh during EXECUTION */}
          {currentStep === 'EXECUTION' && nodePositions.map((s, i) =>
            nodePositions.slice(i + 1).map((e, j) => (
              <motion.line
                key={`n${i}-${j}`}
                x1={s.x} y1={s.y} x2={e.x} y2={e.y}
                stroke={theme.accent}
                strokeWidth={1.5}
                strokeOpacity={0.5}
                strokeDasharray="4 3"
                animate={{ strokeDashoffset: [0, -70] }}
                transition={{ duration: 1.5, repeat: Infinity, ease: 'linear' }}
              />
            ))
          )}
          {/* Result arrow during CALLBACK */}
          {currentStep === 'CALLBACK' && nodePositions.map((pos, i) => (
            <motion.line
              key={`cb${i}`}
              x1={pos.x} y1={pos.y} x2={resultX} y2={resultY}
              stroke={theme.accent}
              strokeWidth={2}
              initial={{ pathLength: 0 }}
              animate={{ pathLength: 1 }}
              transition={{ duration: 0.5, delay: i * 0.1 }}
            />
          ))}
        </svg>

        {/* ── Customer node (top-left) ── */}
        <AnimatePresence>
          <motion.div
            className="absolute flex flex-col items-center justify-center text-center"
            style={{ left: customerX - 36, top: customerY - 36, width: 72, height: 72, zIndex: 10 }}
            initial={{ scale: 0 }} animate={{ scale: 1 }} transition={{ type: 'spring' }}
          >
            <div
              className="w-full h-full rounded-xl flex flex-col items-center justify-center text-[9px] font-bold uppercase tracking-wide"
              style={{
                background: currentStep === 'DEFINITION' || currentStep === 'COMMISSION' ? STEP_THEME.DEFINITION.bg : '#050505',
                border: `1.5px solid ${currentStep === 'DEFINITION' || currentStep === 'COMMISSION' ? STEP_THEME.DEFINITION.accent : '#18181b'}`,
                boxShadow: currentStep === 'DEFINITION' ? `0 0 18px ${STEP_THEME.DEFINITION.glow}` : 'none',
                color: '#ffffff',
              }}
            >
              <span className="text-lg mb-0.5">👤</span>
              <span>Customer</span>
            </div>
          </motion.div>
        </AnimatePresence>

        {/* ── Mempool box ── */}
        <motion.div
          className="absolute flex flex-col items-center justify-center rounded-xl text-center"
          style={{
            left: mempoolX - 52, top: mempoolY - 60, width: 104, height: 120, zIndex: 10,
            border: `1.5px solid ${currentStep === 'MEMPOOL' ? STEP_THEME.MEMPOOL.accent : currentStep === 'COMMISSION' ? STEP_THEME.COMMISSION.accent : '#18181b'}`,
            background: currentStep === 'MEMPOOL' ? STEP_THEME.MEMPOOL.bg : currentStep === 'COMMISSION' ? STEP_THEME.COMMISSION.bg : '#050505',
          }}
          animate={{
            boxShadow: currentStep === 'MEMPOOL' ? [`0 0 10px ${STEP_THEME.MEMPOOL.glow}`, `0 0 28px ${STEP_THEME.MEMPOOL.glow}`, `0 0 10px ${STEP_THEME.MEMPOOL.glow}`] : 'none',
          }}
          transition={{ duration: 1.5, repeat: Infinity }}
        >
          <Database size={16} className="mb-1 text-zinc-400" />
          <span className="text-[9px] uppercase tracking-widest text-zinc-400 font-bold">Mempool</span>
          <AnimatePresence>
            {['COMMISSION', 'MEMPOOL'].includes(currentStep) && (
              <motion.div
                className="mt-2 px-2 py-1 rounded-md text-[10px] font-mono font-bold"
                style={{ background: STEP_THEME.COMMISSION.badge.split(' ')[0].replace('bg-',''), border: `1px solid ${STEP_THEME.COMMISSION.accent}50`, color: STEP_THEME.COMMISSION.accent }}
                initial={{ opacity: 0, y: 4 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0 }}
              >
                Fee: {priorityFee}
              </motion.div>
            )}
          </AnimatePresence>
        </motion.div>

        {/* ── Cluster ring ── */}
        <motion.div
          className="absolute rounded-full"
          style={{
            left: clusterCX - clusterR - 30, top: clusterCY - clusterR - 30,
            width: (clusterR + 30) * 2, height: (clusterR + 30) * 2,
            border: `1.5px solid ${currentStep === 'EXECUTION' ? STEP_THEME.EXECUTION.accent : '#3f3f46'}`,
            background: currentStep === 'EXECUTION' ? STEP_THEME.EXECUTION.bg : 'transparent',
            zIndex: 2,
          }}
          animate={{
            boxShadow: currentStep === 'EXECUTION' ? [`0 0 0px ${STEP_THEME.EXECUTION.glow}`, `0 0 30px ${STEP_THEME.EXECUTION.glow}`, `0 0 0px ${STEP_THEME.EXECUTION.glow}`] : 'none',
          }}
          transition={{ duration: 2, repeat: Infinity }}
        />
        <div
          className="absolute text-[9px] font-bold uppercase tracking-widest text-zinc-500"
          style={{ left: clusterCX - 60, top: clusterCY - clusterR - 50, zIndex: 12 }}
        >
          Execution Cluster (MXE)
        </div>

        {/* ── Arx Nodes ── */}
        {nodePositions.map((pos, idx) => {
          const isExec = currentStep === 'EXECUTION';
          const isCb = currentStep === 'CALLBACK';
          return (
            <div key={idx}>
              {isExec && <PulseRing x={pos.x} y={pos.y} color={STEP_THEME.EXECUTION.accent} />}
              <ArxNode
                x={pos.x} y={pos.y}
                label={`Arx ${idx + 1}`}
                accent={isCb ? STEP_THEME.CALLBACK.accent : isExec ? STEP_THEME.EXECUTION.accent : '#52525b'}
                isActive={isExec || isCb || currentStep === 'MEMPOOL'}
                shareValue={isExec && nodes[idx] ? nodes[idx].share : undefined}
              />
            </div>
          );
        })}

        {/* ── Traveling particles: Customer → Mempool during COMMISSION ── */}
        {currentStep === 'COMMISSION' && (
          <TravelingParticle
            startX={customerX} startY={customerY}
            endX={mempoolX} endY={mempoolY}
            color={STEP_THEME.COMMISSION.accent} duration={1.0}
          />
        )}

        {/* ── Traveling particles: Mempool → all nodes during MEMPOOL ── */}
        {currentStep === 'MEMPOOL' && nodePositions.map((pos, i) => (
          <TravelingParticle
            key={i}
            startX={mempoolX} startY={mempoolY}
            endX={pos.x} endY={pos.y}
            color={STEP_THEME.MEMPOOL.accent} delay={i * 0.2} duration={1.3}
          />
        ))}

        {/* ── Traveling particles: inter-node during EXECUTION ── */}
        {currentStep === 'EXECUTION' && nodePositions.map((s, i) =>
          nodePositions.slice(i + 1).map((e, j) => (
            <TravelingParticle
              key={`ex${i}-${j}`}
              startX={s.x} startY={s.y}
              endX={e.x} endY={e.y}
              color={STEP_THEME.EXECUTION.accent} delay={(i + j) * 0.18} duration={1.1}
            />
          ))
        )}

        {/* ── Result box (top-right) during CALLBACK ── */}
        <AnimatePresence>
          {currentStep === 'CALLBACK' && (
            <motion.div
              className="absolute flex flex-col items-center justify-center rounded-xl"
              style={{ left: resultX - 54, top: resultY - 44, width: 108, height: 88, zIndex: 15 }}
              initial={{ scale: 0, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
              transition={{ type: 'spring', stiffness: 260, damping: 18, delay: 0.4 }}
            >
              <div
                className="w-full h-full rounded-xl flex flex-col items-center justify-center gap-1"
                style={{
                  background: STEP_THEME.CALLBACK.bg,
                  border: `1.5px solid ${STEP_THEME.CALLBACK.accent}`,
                  boxShadow: `0 0 24px ${STEP_THEME.CALLBACK.glow}`,
                }}
              >
                <CheckCircle size={18} color={STEP_THEME.CALLBACK.accent} />
                <span className="text-[9px] uppercase tracking-wider text-zinc-400 font-bold">Result</span>
                <span className="text-xl font-mono font-bold" style={{ color: STEP_THEME.CALLBACK.accent }}>
                  {result}
                </span>
              </div>
            </motion.div>
          )}
        </AnimatePresence>

        {/* ── Traveling particles to result during CALLBACK ── */}
        {currentStep === 'CALLBACK' && nodePositions.map((pos, i) => (
          <TravelingParticle
            key={`r${i}`}
            startX={pos.x} startY={pos.y}
            endX={resultX} endY={resultY}
            color={STEP_THEME.CALLBACK.accent} delay={i * 0.15} duration={1.2}
          />
        ))}
      </motion.div>

      {/* ── Step Explanation + Legend Row ── */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">

        {/* Explanation card */}
        <motion.div
          key={currentStep}
          className="md:col-span-2 p-5 rounded-xl border"
          style={{ borderColor: theme.border, background: theme.bg }}
          initial={{ opacity: 0, y: 8 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.35 }}
        >
          <div className="flex items-center gap-3 mb-3">
            <div className="flex items-center justify-center w-8 h-8 rounded-lg text-black font-bold text-sm" style={{ background: theme.accent }}>
              {theme.number}
            </div>
            <h3 className={`text-lg font-bold ${theme.text}`}>{theme.label}</h3>
          </div>
          <p className="text-zinc-400 text-sm leading-relaxed">{theme.description}</p>
        </motion.div>

        {/* Color legend */}
        <div className="p-5 rounded-xl border border-zinc-800 bg-black/40 shadow-xl">
          <h4 className="text-xs uppercase tracking-widest text-zinc-500 font-semibold mb-3">Step Color Key</h4>
          <div className="flex flex-col gap-2">
            {stepKeys.map((key) => {
              const t = STEP_THEME[key];
              const Icon = t.icon;
              const isCurr = key === currentStep;
              return (
                <div key={key} className={`flex items-center gap-2.5 transition-opacity ${isCurr ? 'opacity-100' : 'opacity-40'}`}>
                  <div className="w-2.5 h-2.5 rounded-full flex-shrink-0" style={{ background: t.accent, boxShadow: isCurr ? `0 0 6px ${t.accent}` : 'none' }} />
                  <Icon size={11} style={{ color: t.accent }} />
                  <span className="text-xs font-medium" style={{ color: isCurr ? t.accent : '#71717a' }}>{t.label}</span>
                </div>
              );
            })}
          </div>
        </div>
      </div>
    </div>
  );
}
