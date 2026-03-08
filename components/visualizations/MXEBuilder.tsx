'use client';

import { useState, useMemo } from 'react';
import { useProgressStore } from '@/state/progressStore';
import {
  Shield, Server, Globe, Cpu, CheckCircle2, Lock,
  Users, Network, Key, Info, ChevronRight, Star,
  AlertTriangle, Fingerprint, Zap, Package
} from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';

// ── Section color system ───────────────────────────────────────────────────────

const SECTION_COLORS = {
  protocol:    { accent: '#a855f7', bg: 'rgba(168,85,247,0.08)',  border: 'rgba(168,85,247,0.35)', label: 'MPC Protocol',       icon: Key },
  permission:  { accent: '#06b6d4', bg: 'rgba(6,182,212,0.08)',   border: 'rgba(6,182,212,0.35)',  label: 'Cluster Permission',  icon: Lock },
  authority:   { accent: '#eab308', bg: 'rgba(234,179,8,0.08)',   border: 'rgba(234,179,8,0.35)',  label: 'Access Authority',    icon: Fingerprint },
  hardware:    { accent: '#22c55e', bg: 'rgba(34,197,94,0.08)',   border: 'rgba(34,197,94,0.35)',  label: 'Hardware Requirements', icon: Cpu },
  jurisdiction:{ accent: '#3b82f6', bg: 'rgba(59,130,246,0.08)', border: 'rgba(59,130,246,0.35)', label: 'Jurisdiction',        icon: Globe },
};

type SectionKey = keyof typeof SECTION_COLORS;

// ── Option cards ───────────────────────────────────────────────────────────────

function OptionCard({
  selected, onClick, disabled, title, subtitle, badge, section,
}: {
  selected: boolean; onClick: () => void; disabled: boolean;
  title: string; subtitle: string; badge?: string; section: SectionKey;
}) {
  const { accent, bg, border } = SECTION_COLORS[section];
  return (
    <button
      onClick={onClick}
      disabled={disabled}
      className="text-left p-3 rounded-xl border transition-all"
      style={selected
        ? { background: bg, borderColor: accent, boxShadow: `0 0 12px ${accent}30` }
        : { background: '#050505', borderColor: '#18181b' }
      }
    >
      <div className="flex items-start justify-between gap-2">
        <span className="text-sm font-bold" style={{ color: selected ? accent : '#a1a1aa' }}>{title}</span>
        {badge && selected && (
          <span className="text-[9px] font-bold px-1.5 py-0.5 rounded-full uppercase tracking-wide shrink-0"
            style={{ background: `${accent}25`, color: accent, border: `1px solid ${accent}50` }}>
            {badge}
          </span>
        )}
      </div>
      <p className="text-[11px] text-zinc-500 mt-0.5 leading-relaxed">{subtitle}</p>
    </button>
  );
}

// ── Section header ─────────────────────────────────────────────────────────────

function SectionHeader({ section, tooltip }: { section: SectionKey; tooltip: string }) {
  const { accent, label, icon: Icon } = SECTION_COLORS[section];
  return (
    <div className="flex items-center gap-2 mb-3">
      <div className="w-6 h-6 rounded-md flex items-center justify-center" style={{ background: `${accent}20` }}>
        <Icon size={13} style={{ color: accent }} />
      </div>
      <span className="text-sm font-bold text-white">{label}</span>
      <div className="group relative ml-auto">
        <Info size={13} className="text-zinc-600 cursor-help" />
        <div className="absolute right-0 top-5 w-52 text-[11px] text-zinc-300 bg-zinc-900 border border-zinc-700 rounded-lg p-2.5 opacity-0 group-hover:opacity-100 transition-opacity pointer-events-none z-50 leading-relaxed shadow-xl">
          {tooltip}
        </div>
      </div>
    </div>
  );
}

// ── Main component ─────────────────────────────────────────────────────────────

export function MXEBuilder() {
  const { markActivityCompleted } = useProgressStore();
  const [isDeployed, setIsDeployed] = useState(false);
  const [deployPhase, setDeployPhase] = useState<'idle' | 'dkg' | 'admission' | 'done'>('idle');
  const [config, setConfig] = useState({
    protocol:    'cerberus'    as 'cerberus' | 'manticore',
    permission:  'public'      as 'public' | 'partial' | 'full',
    authority:   'public'      as 'public' | 'restricted' | 'private',
    hardware:    'standard'    as 'standard' | 'high-compute' | 'tee',
    jurisdiction:'global'      as 'global' | 'eu' | 'us',
    clusterSize: 3,
  });

  // Derived display values
  const threshold = Math.ceil(config.clusterSize * 0.66);

  const securityLevel = useMemo(() => {
    let s = 0;
    if (config.protocol === 'cerberus') s += 2;
    if (config.protocol === 'manticore') s += 1;
    if (config.hardware === 'tee') s += 3;
    if (config.hardware === 'high-compute') s += 1;
    if (config.permission === 'full') s += 2;
    if (config.permission === 'public') s += 1;
    if (config.authority === 'private') s += 2;
    if (config.authority === 'restricted') s += 1;
    if (config.clusterSize >= 7) s += 2;
    else if (config.clusterSize >= 5) s += 1;
    return Math.min(10, s);
  }, [config]);

  const estimatedCostMultiplier = useMemo(() => {
    let c = 1.0;
    if (config.hardware === 'tee') c += 0.6;
    if (config.hardware === 'high-compute') c += 0.3;
    if (config.clusterSize > 5) c += (config.clusterSize - 5) * 0.1;
    if (config.jurisdiction === 'eu') c += 0.2;
    if (config.jurisdiction === 'us') c += 0.1;
    return c.toFixed(1);
  }, [config]);

  const randomNodeRequired = config.permission === 'public' || config.permission === 'partial';

  const set = (key: keyof typeof config, val: string | number) =>
    setConfig(prev => ({ ...prev, [key]: val }));

  const handleDeploy = async () => {
    setDeployPhase('dkg');
    await new Promise(r => setTimeout(r, 1400));
    setDeployPhase('admission');
    await new Promise(r => setTimeout(r, 1600));
    setDeployPhase('done');
    setIsDeployed(true);
    markActivityCompleted('mxe-builder');
  };

  const handleReset = () => {
    setIsDeployed(false);
    setDeployPhase('idle');
  };

  const disabled = isDeployed;
  const nodeAngles = Array.from({ length: config.clusterSize }, (_, i) =>
    (i / config.clusterSize) * Math.PI * 2 - Math.PI / 2
  );

  return (
    <div className="w-full max-w-6xl mx-auto flex flex-col gap-6">

      {/* ── Color legend strip ── */}
      <div className="flex flex-wrap gap-3 px-1">
        {(Object.entries(SECTION_COLORS) as [SectionKey, typeof SECTION_COLORS[SectionKey]][]).map(([key, c]) => {
          const Icon = c.icon;
          return (
            <div key={key} className="flex items-center gap-1.5 text-xs text-zinc-400">
              <Icon size={11} style={{ color: c.accent }} />
              <div className="w-2 h-2 rounded-full" style={{ background: c.accent }} />
              <span>{c.label}</span>
            </div>
          );
        })}
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">

        {/* ── Left: Config panels ── */}
        <div className="lg:col-span-5 flex flex-col gap-4">

          {/* MPC Protocol */}
          <section className="bg-black border border-zinc-800 rounded-2xl p-5 shadow-[0_0_40px_rgba(0,0,0,0.5)]">
            <SectionHeader section="protocol" tooltip="The cryptographic protocol determines how nodes jointly compute without seeing each other's inputs. Different protocols offer different security/performance trade-offs." />
            <div className="grid grid-cols-1 gap-2">
              <OptionCard section="protocol" selected={config.protocol === 'cerberus'} disabled={disabled}
                onClick={() => set('protocol', 'cerberus')} badge="Default"
                title="Cerberus" subtitle="Dishonest-majority protocol. Security holds even if over half the nodes are malicious. Best for high-security, high-trust environments." />
              <OptionCard section="protocol" selected={config.protocol === 'manticore'} disabled={disabled}
                onClick={() => set('protocol', 'manticore')}
                title="Manticore" subtitle="Honest-but-curious protocol. Nodes follow the protocol correctly but may try to infer data from what they observe. Higher throughput, lower overhead." />
            </div>
          </section>

          {/* Cluster Permission */}
          <section className="bg-zinc-900 border border-zinc-800 rounded-2xl p-5">
            <SectionHeader section="permission" tooltip="Permissioning controls which Arx Nodes can join your Cluster. Only Public/Non-Permissioned clusters use random node selection for Sybil resistance." />
            <div className="grid grid-cols-1 gap-2">
              <OptionCard section="permission" selected={config.permission === 'public'} disabled={disabled}
                onClick={() => set('permission', 'public')} badge="+ Random Node"
                title="Public / Non-Permissioned" subtitle="Open to all verified Arx Nodes. Network randomly selects at least one node for Sybil resistance. Best for decentralized use cases." />
              <OptionCard section="permission" selected={config.permission === 'partial'} disabled={disabled}
                onClick={() => set('permission', 'partial')} badge="+ Random Node"
                title="Partially Permissioned" subtitle="Hybrid: your internal nodes plus select external nodes for oversight. External nodes provide transparency and validation without sacrificing control." />
              <OptionCard section="permission" selected={config.permission === 'full'} disabled={disabled}
                onClick={() => set('permission', 'full')}
                title="Fully Permissioned" subtitle="Only your own Arx Nodes participate. Ideal for organizations with strict data security requirements, regulations (GDPR), or confidential internal operations." />
            </div>
            {randomNodeRequired && (
              <div className="mt-3 flex items-start gap-2 text-[11px] text-yellow-400 bg-yellow-400/10 border border-yellow-400/25 rounded-lg p-2.5">
                <Star size={11} className="mt-0.5 shrink-0" fill="currentColor" />
                <span>A randomly selected Arx Node will be included to prevent intra-cluster Sybil attacks. As long as this node is honest, cluster integrity is mathematically guaranteed.</span>
              </div>
            )}
          </section>

          {/* Access Authority */}
          <section className="bg-zinc-900 border border-zinc-800 rounded-2xl p-5">
            <SectionHeader section="authority" tooltip="Access Authority determines who can submit computations to your MXE. This is set per Computation Definition." />
            <div className="grid grid-cols-3 gap-2">
              {[
                { val: 'public',     label: 'Public',     desc: 'Anyone can submit computations' },
                { val: 'restricted', label: 'Restricted', desc: 'Only allowlisted addresses' },
                { val: 'private',    label: 'Private',    desc: 'Only you, exclusively' },
              ].map(opt => (
                <button key={opt.val} onClick={() => set('authority', opt.val)} disabled={disabled}
                  className="p-2.5 rounded-xl border text-left text-[11px] transition-all"
                  style={config.authority === opt.val
                    ? { background: SECTION_COLORS.authority.bg, borderColor: SECTION_COLORS.authority.accent }
                    : { background: '#050505', borderColor: '#18181b' }
                  }
                >
                  <span className="font-bold block mb-0.5" style={{ color: config.authority === opt.val ? SECTION_COLORS.authority.accent : '#a1a1aa' }}>{opt.label}</span>
                  <span className="text-zinc-600">{opt.desc}</span>
                </button>
              ))}
            </div>
          </section>

          {/* Hardware */}
          <section className="bg-zinc-900 border border-zinc-800 rounded-2xl p-5">
            <SectionHeader section="hardware" tooltip="Arx Nodes declare their hardware capabilities. Nodes that don't meet your requirement are excluded from your Cluster via Automatic Alternative Selection." />
            <div className="grid grid-cols-3 gap-2">
              {[
                { val: 'standard',     label: 'Standard CPU',    desc: 'General purpose workloads' },
                { val: 'high-compute', label: 'High Compute',    desc: 'Large-scale AI / ML tasks' },
                { val: 'tee',          label: 'TEE Required',    desc: 'Isolated hardware enclave — key shares protected from operator inspection' },
              ].map(opt => (
                <button key={opt.val} onClick={() => set('hardware', opt.val)} disabled={disabled}
                  className="p-2.5 rounded-xl border text-left text-[11px] transition-all"
                  style={config.hardware === opt.val
                    ? { background: SECTION_COLORS.hardware.bg, borderColor: SECTION_COLORS.hardware.accent }
                    : { background: '#050505', borderColor: '#18181b' }
                  }
                >
                  <span className="font-bold block mb-0.5" style={{ color: config.hardware === opt.val ? SECTION_COLORS.hardware.accent : '#a1a1aa' }}>{opt.label}</span>
                  <span className="text-zinc-600">{opt.desc}</span>
                </button>
              ))}
            </div>
          </section>

          {/* Jurisdiction + Cluster size */}
          <section className="bg-zinc-900 border border-zinc-800 rounded-2xl p-5">
            <SectionHeader section="jurisdiction" tooltip="Node jurisdiction follows ISO 3166-1 alpha-2 codes. Nodes self-declare and the community independently evaluates accuracy. Jurisdiction Blacklists can exclude certain regions." />
            <div className="flex gap-2 mb-4">
              {[
                { val: 'global', label: '🌐 Global' },
                { val: 'eu',     label: '🇪🇺 EU Only' },
                { val: 'us',     label: '🇺🇸 US Only' },
              ].map(reg => (
                <button key={reg.val} onClick={() => set('jurisdiction', reg.val)} disabled={disabled}
                  className="flex-1 py-2 px-3 rounded-xl border text-xs font-semibold transition-all"
                  style={config.jurisdiction === reg.val
                    ? { background: SECTION_COLORS.jurisdiction.bg, borderColor: SECTION_COLORS.jurisdiction.accent, color: SECTION_COLORS.jurisdiction.accent }
                    : { background: '#050505', borderColor: '#18181b', color: '#71717a' }
                  }
                >
                  {reg.label}
                </button>
              ))}
            </div>
            <div className="flex items-center justify-between mb-1.5">
              <label className="text-xs font-semibold text-zinc-400">Cluster Size</label>
              <span className="text-xs font-mono" style={{ color: SECTION_COLORS.jurisdiction.accent }}>{config.clusterSize} nodes · {threshold} of {config.clusterSize} threshold</span>
            </div>
            <input type="range" min={3} max={10} value={config.clusterSize} disabled={disabled}
              onChange={(e) => set('clusterSize', Number(e.target.value))}
              className="w-full mb-2"
              style={{ accentColor: SECTION_COLORS.jurisdiction.accent }}
            />
            <p className="text-[11px] text-zinc-600 leading-relaxed">
              At least <strong className="text-zinc-400">{threshold} nodes</strong> must participate honestly to maintain cluster security. Most Cluster properties, including the Node Priority List, are <strong className="text-zinc-400">immutable after creation</strong>. Node approval is required from every Arx Node before the Cluster becomes active.
            </p>
          </section>
        </div>

        {/* ── Right: Preview + summary ── */}
        <div className="lg:col-span-7 flex flex-col gap-5">

          {/* MXE Profile Card */}
          <div className="bg-black border border-zinc-800 rounded-2xl p-5 shadow-[0_0_40px_rgba(0,0,0,0.5)]">
            <h3 className="text-sm font-bold text-zinc-400 uppercase tracking-widest mb-4">MXE Configuration Summary</h3>
            <div className="grid grid-cols-2 sm:grid-cols-3 gap-3 mb-4">
              {[
                { label: 'Protocol',    val: config.protocol === 'cerberus' ? 'Cerberus' : 'Manticore', color: SECTION_COLORS.protocol.accent },
                { label: 'Permission',  val: config.permission === 'full' ? 'Fully Permissioned' : config.permission === 'partial' ? 'Partially Permissioned' : 'Public', color: SECTION_COLORS.permission.accent },
                { label: 'Authority',   val: config.authority.charAt(0).toUpperCase() + config.authority.slice(1), color: SECTION_COLORS.authority.accent },
                { label: 'Hardware',    val: config.hardware === 'tee' ? 'TEE Required' : config.hardware === 'high-compute' ? 'High Compute' : 'Standard CPU', color: SECTION_COLORS.hardware.accent },
                { label: 'Region',      val: config.jurisdiction === 'global' ? 'Global' : config.jurisdiction.toUpperCase(), color: SECTION_COLORS.jurisdiction.accent },
                { label: 'Cluster',     val: `${config.clusterSize} Nodes`, color: '#ffffff' },
              ].map(item => (
                <div key={item.label} className="bg-zinc-950/20 rounded-lg p-2.5 border border-zinc-800">
                  <p className="text-[10px] uppercase tracking-wider text-zinc-600 mb-0.5">{item.label}</p>
                  <p className="text-xs font-bold" style={{ color: item.color }}>{item.val}</p>
                </div>
              ))}
            </div>

            {/* Security + Cost bars */}
            <div className="flex gap-4">
              <div className="flex-1">
                <div className="flex justify-between text-[10px] text-zinc-500 mb-1">
                  <span>Security Level</span>
                  <span className="font-mono font-bold text-purple-400">{securityLevel}/10</span>
                </div>
                <div className="h-2 bg-zinc-800 rounded-full overflow-hidden">
                  <motion.div className="h-full rounded-full bg-gradient-to-r from-purple-600 to-purple-400"
                    animate={{ width: `${securityLevel * 10}%` }} transition={{ duration: 0.4 }} />
                </div>
              </div>
              <div className="flex-1">
                <div className="flex justify-between text-[10px] text-zinc-500 mb-1">
                  <span>Cost Multiplier</span>
                  <span className="font-mono font-bold text-yellow-400">{estimatedCostMultiplier}×</span>
                </div>
                <div className="h-2 bg-zinc-800 rounded-full overflow-hidden">
                  <motion.div className="h-full rounded-full bg-gradient-to-r from-yellow-600 to-yellow-400"
                    animate={{ width: `${Math.min(100, (Number(estimatedCostMultiplier) / 2.5) * 100)}%` }} transition={{ duration: 0.4 }} />
                </div>
              </div>
            </div>
          </div>

          {/* Cluster preview canvas */}
          <div className="bg-black border border-zinc-800 rounded-2xl overflow-hidden relative flex-1 shadow-[0_0_60px_rgba(0,0,0,0.8)]"
            style={{ minHeight: 320 }}>
            <div className="absolute top-3 left-4 z-10 flex items-center gap-2">
              <Network size={13} className="text-zinc-500" />
              <span className="text-[10px] font-bold uppercase tracking-widest text-zinc-500">Network Admission Preview</span>
            </div>

            {/* Background node cloud */}
            <div className="absolute inset-0 overflow-hidden pointer-events-none opacity-15">
              {Array.from({ length: 35 }).map((_, i) => (
                <div key={i} className="absolute w-1.5 h-1.5 rounded-full bg-zinc-500"
                  style={{ left: `${(i * 37 + 11) % 100}%`, top: `${(i * 53 + 17) % 100}%` }} />
              ))}
            </div>

            {/* Central cluster visualization */}
            <div className="flex items-center justify-center" style={{ height: 320 }}>
              <div className="relative flex items-center justify-center" style={{ width: 280, height: 280 }}>
                {/* Cluster ring */}
                <motion.div className="absolute rounded-full border-2 border-dashed"
                  style={{ inset: isDeployed ? 0 : 20 }}
                  animate={{
                    borderColor: isDeployed ? '#6366f1' : '#3f3f46',
                    backgroundColor: isDeployed ? 'rgba(99,102,241,0.06)' : 'rgba(0,0,0,0)',
                    boxShadow: isDeployed ? '0 0 40px rgba(99,102,241,0.15)' : '0 0 0px rgba(0,0,0,0)',
                  }}
                  transition={{ duration: 0.8 }}
                />

                {/* Active MXE label */}
                <AnimatePresence>
                  {isDeployed && (
                    <motion.div className="absolute text-center pointer-events-none"
                      initial={{ opacity: 0, scale: 0.8 }} animate={{ opacity: 1, scale: 1 }}
                    >
                      <Package size={20} className="mx-auto mb-1 text-indigo-400" />
                      <p className="text-[9px] font-bold uppercase tracking-[0.2em] text-indigo-400/60">MXE Active</p>
                    </motion.div>
                  )}
                </AnimatePresence>

                {/* SVG mesh lines */}
                {isDeployed && (
                  <svg className="absolute inset-0 pointer-events-none" width={280} height={280} style={{ overflow: 'visible' }}>
                    {nodeAngles.map((a, i) => nodeAngles.slice(i + 1).map((b, j) => {
                      const r = 108;
                      return (
                        <motion.line key={`${i}-${j}`}
                          x1={140 + r * Math.cos(a)} y1={140 + r * Math.sin(a)}
                          x2={140 + r * Math.cos(b)} y2={140 + r * Math.sin(b)}
                          stroke="#6366f1" strokeWidth={1}
                          initial={{ opacity: 0 }} animate={{ opacity: 0.3 }}
                          transition={{ delay: 0.3 + i * 0.05 }}
                        />
                      );
                    }))}
                  </svg>
                )}

                {/* Nodes */}
                {nodeAngles.map((angle, i) => {
                  const r = isDeployed ? 108 : 115;
                  const cx = 140 + r * Math.cos(angle);
                  const cy = 140 + r * Math.sin(angle);
                  const isRandom = randomNodeRequired && i === 0;
                  const isTee = config.hardware === 'tee';

                  return (
                    <motion.div key={i}
                      className="absolute w-11 h-11 rounded-full flex flex-col items-center justify-center text-white font-bold text-[9px] border-2"
                      style={{ left: cx - 22, top: cy - 22, zIndex: 10 }}
                      animate={{
                        backgroundColor: isDeployed ? (isRandom ? '#f59e0b' : '#4f46e5') : '#3f3f46',
                        borderColor: isDeployed ? (isRandom ? '#fbbf24' : '#6366f1') : '#52525b',
                        boxShadow: isDeployed ? `0 0 12px ${isRandom ? '#f59e0b60' : '#6366f160'}` : 'none',
                        scale: deployPhase === 'dkg' ? [1, 1.1, 1] : 1,
                      }}
                      transition={{ duration: 0.5, delay: isDeployed ? i * 0.08 : 0, scale: { repeat: 2, duration: 0.4 } }}
                    >
                      {isTee && isDeployed ? <Shield size={14} /> : <span>N{i + 1}</span>}
                      {isRandom && isDeployed && (
                        <Star size={7} className="text-zinc-900" fill="currentColor" />
                      )}
                    </motion.div>
                  );
                })}
              </div>
            </div>

            {/* Deployment progress bar */}
            <div className="absolute bottom-0 inset-x-0 border-t border-zinc-800 p-4 bg-zinc-900/80 backdrop-blur">
              <AnimatePresence mode="wait">
                {deployPhase === 'idle' && (
                  <motion.p key="idle" className="text-xs text-zinc-400" initial={{ opacity: 0 }} animate={{ opacity: 1 }}>
                    <Info size={12} className="inline mr-1.5 text-zinc-500" />
                    Configure your MXE. Each Arx Node must <strong className="text-white">individually approve</strong> Cluster admission — this is separate from MXE admission.
                  </motion.p>
                )}
                {deployPhase === 'dkg' && (
                  <motion.p key="dkg" className="text-xs text-purple-300 flex items-center gap-2" initial={{ opacity: 0 }} animate={{ opacity: 1 }}>
                    <motion.div animate={{ rotate: 360 }} transition={{ repeat: Infinity, duration: 1, ease: 'linear' }}>
                      <Key size={13} />
                    </motion.div>
                    Running Distributed Key Generation (DKG) — each node receives a cryptographic key share…
                  </motion.p>
                )}
                {deployPhase === 'admission' && (
                  <motion.p key="adm" className="text-xs text-cyan-300 flex items-center gap-2" initial={{ opacity: 0 }} animate={{ opacity: 1 }}>
                    <motion.div animate={{ rotate: 360 }} transition={{ repeat: Infinity, duration: 1, ease: 'linear' }}>
                      <Network size={13} />
                    </motion.div>
                    Requesting MXE admission from {config.clusterSize} Arx Nodes — awaiting unanimous approval…
                  </motion.p>
                )}
                {deployPhase === 'done' && (
                  <motion.div key="done" className="flex items-start gap-2" initial={{ opacity: 0 }} animate={{ opacity: 1 }}>
                    <CheckCircle2 size={14} className="text-green-400 shrink-0 mt-0.5" />
                    <p className="text-xs text-zinc-300 leading-relaxed">
                      <strong className="text-green-400">MXE Admitted!</strong> DKG complete. All {config.clusterSize} Arx Nodes approved Cluster membership and admitted this MXE.
                      {randomNodeRequired && <span className="text-yellow-400"> One randomly-selected node was included for Sybil resistance.</span>}
                      {' '}Smart contract state is now managed onchain via Solana.
                    </p>
                  </motion.div>
                )}
              </AnimatePresence>
            </div>
          </div>

          {/* Key facts callouts */}
          <div className="grid grid-cols-2 gap-3">
            {[
              { icon: AlertTriangle, color: '#ef4444', title: 'Admission can fail', body: 'If a single Arx Node rejects MXE admission, the MXE fails. Cluster formation also fails if any node rejects.' },
              { icon: Zap,           color: '#eab308', title: 'Priority Fees',      body: 'Customers pay a Base Fee + optional Priority Fee per Computation Unit (CU). Higher fees jump the mempool queue.' },
              { icon: Users,         color: '#06b6d4', title: 'Delegation',         body: 'Third-party delegators stake to Arx Nodes, boosting capacity. Delegators share rewards and slashing risk proportionally.' },
              { icon: Shield,        color: '#22c55e', title: 'Censorship Resistant', body: 'Cerberus cryptographically detects misbehavior. Submitting incorrect data or aborting triggers automated slashing.' },
            ].map(({ icon: Icon, color, title, body }) => (
              <div key={title} className="flex gap-2.5 bg-black border border-zinc-800 rounded-xl p-3 shadow-md">
                <div className="w-7 h-7 rounded-lg flex items-center justify-center shrink-0" style={{ background: `${color}18` }}>
                  <Icon size={13} style={{ color }} />
                </div>
                <div>
                  <p className="text-xs font-bold text-white mb-0.5">{title}</p>
                  <p className="text-[10px] text-zinc-500 leading-relaxed">{body}</p>
                </div>
              </div>
            ))}
          </div>

          {/* Deploy / Reset */}
          <div>
            {!isDeployed ? (
              <motion.button
                onClick={handleDeploy}
                className="w-full py-3.5 text-white font-bold rounded-2xl flex items-center justify-center gap-2"
                style={{ background: 'linear-gradient(135deg, #6366f1, #8b5cf6)', boxShadow: '0 0 24px rgba(99,102,241,0.35)' }}
                whileHover={{ scale: 1.01, boxShadow: '0 0 32px rgba(99,102,241,0.5)' }}
                whileTap={{ scale: 0.99 }}
                disabled={deployPhase !== 'idle'}
              >
                <Cpu size={18} />
                Deploy MXE to Network (+100 XP)
              </motion.button>
            ) : (
              <div className="flex gap-3">
                <button onClick={handleReset}
                  className="flex-1 py-3 bg-zinc-800 hover:bg-zinc-700 text-white font-bold rounded-2xl transition-colors">
                  Edit Configuration
                </button>
                <div className="flex-1 py-3 bg-green-500/10 border border-green-500/30 text-green-400 font-bold rounded-2xl flex justify-center items-center gap-2">
                  <CheckCircle2 size={16} /> MXE Active
                </div>
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}
