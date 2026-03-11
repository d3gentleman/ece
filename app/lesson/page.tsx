'use client';

import React, { useState, useRef, useEffect } from 'react';
import Link from 'next/link';
import { motion, AnimatePresence, useInView } from 'framer-motion';
import {
  ShieldAlert, ShieldCheck, Network, Cpu, Users, Database,
  ArrowRight, Server, Lock, Zap, CheckCircle2, XCircle,
  ChevronDown, BrainCircuit, Activity, Pickaxe, BookOpen
} from 'lucide-react';

// ─── Types ───────────────────────────────────────────────────────────────────
type QuizOption = { label: string; correct: boolean };
type QuizState = 'idle' | 'correct' | 'wrong';

// ─── Chapter Progress Nav ─────────────────────────────────────────────────────
const CHAPTERS = [
  { id: 'problem',    label: 'The Problem' },
  { id: 'solution',   label: 'The Solution' },
  { id: 'how',        label: 'How MPC Works' },
  { id: 'infra',      label: 'Infrastructure' },
  { id: 'people',     label: 'Stakeholders' },
];

function ChapterNav({ activeChapter }: { activeChapter: string }) {
  return (
    <div className="hidden lg:flex flex-col gap-1 sticky top-24 w-52 shrink-0 self-start">
      <p className="text-xs uppercase tracking-widest text-zinc-600 font-semibold mb-3">In This Lesson</p>
      {CHAPTERS.map((ch, i) => (
        <a
          key={ch.id}
          href={`#${ch.id}`}
          className={`flex items-center gap-3 px-3 py-2 rounded-lg text-sm font-medium transition-all ${
            activeChapter === ch.id
              ? 'bg-indigo-500/10 text-indigo-400 border border-indigo-500/20'
              : 'text-zinc-500 hover:text-zinc-300'
          }`}
        >
          <span className={`w-5 h-5 rounded-full border flex items-center justify-center text-xs shrink-0 ${
            activeChapter === ch.id ? 'border-indigo-500 text-indigo-400' : 'border-zinc-700 text-zinc-600'
          }`}>{i + 1}</span>
          {ch.label}
        </a>
      ))}
    </div>
  );
}

// ─── Scroll-reveal wrapper ────────────────────────────────────────────────────
function Reveal({ children, delay = 0 }: { children: React.ReactNode; delay?: number }) {
  const ref = useRef<HTMLDivElement>(null);
  const inView = useInView(ref, { once: true, margin: '-80px' });
  return (
    <motion.div
      ref={ref}
      initial={{ opacity: 0, y: 30 }}
      animate={inView ? { opacity: 1, y: 0 } : {}}
      transition={{ duration: 0.6, delay, ease: 'easeOut' }}
    >
      {children}
    </motion.div>
  );
}

// ─── Quiz Component ───────────────────────────────────────────────────────────
function Quiz({ question, options, explanation }: { question: string; options: QuizOption[]; explanation: string }) {
  const [state, setState] = useState<QuizState>('idle');
  const [chosen, setChosen] = useState<number | null>(null);

  const handleAnswer = (i: number) => {
    if (state !== 'idle') return;
    setChosen(i);
    setState(options[i].correct ? 'correct' : 'wrong');
  };

  return (
    <div className="mt-8 p-6 bg-zinc-950 border border-zinc-800 rounded-2xl">
      <div className="flex items-center gap-2 mb-4">
        <BrainCircuit className="w-4 h-4 text-indigo-400" />
        <span className="text-xs uppercase tracking-widest font-bold text-indigo-400">Knowledge Check</span>
      </div>
      <p className="text-zinc-200 font-medium mb-4">{question}</p>
      <div className="grid gap-2">
        {options.map((opt, i) => {
          const isChosen = chosen === i;
          const isWrong = isChosen && !opt.correct;
          const isRight = isChosen && opt.correct;
          const showCorrect = state !== 'idle' && opt.correct;

          return (
            <button
              key={i}
              disabled={state !== 'idle'}
              onClick={() => handleAnswer(i)}
              className={`flex items-center gap-3 w-full text-left px-4 py-3 rounded-xl border text-sm transition-all ${
                showCorrect
                  ? 'border-emerald-500/50 bg-emerald-500/10 text-emerald-300'
                  : isWrong
                  ? 'border-red-500/50 bg-red-500/10 text-red-300'
                  : state === 'idle'
                  ? 'border-zinc-800 bg-zinc-900/50 text-zinc-300 hover:border-zinc-700 hover:bg-zinc-900'
                  : 'border-zinc-800 bg-zinc-900/30 text-zinc-600'
              }`}
            >
              {showCorrect ? <CheckCircle2 className="w-4 h-4 text-emerald-400 shrink-0" />
              : isWrong ? <XCircle className="w-4 h-4 text-red-400 shrink-0" />
              : <span className="w-4 h-4 rounded-full border border-current opacity-40 shrink-0" />}
              {opt.label}
            </button>
          );
        })}
      </div>
      <AnimatePresence>
        {state !== 'idle' && (
          <motion.div
            initial={{ opacity: 0, height: 0 }}
            animate={{ opacity: 1, height: 'auto' }}
            exit={{ opacity: 0, height: 0 }}
            className={`mt-4 p-4 rounded-xl text-sm ${state === 'correct' ? 'bg-emerald-500/10 text-emerald-300 border border-emerald-500/20' : 'bg-red-500/10 text-red-300 border border-red-500/20'}`}
          >
            {state === 'correct' ? '✓ Correct! ' : '✗ Not quite. '}{explanation}
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}

// ─── Interactive Secret-Sharing Demo ─────────────────────────────────────────
function SecretShareDemo() {
  const [secret, setSecret] = useState(42);
  const [revealed, setRevealed] = useState(false);
  const [shares, setShares] = useState<number[]>([]);

  const generateShares = () => {
    // Additive secret sharing: generate 2 random shares, 3rd is derived
    const a = Math.floor(Math.random() * 200) - 100;
    const b = Math.floor(Math.random() * 200) - 100;
    const c = secret - a - b;
    setShares([a, b, c]);
    setRevealed(false);
  };

  const combined = shares.reduce((s, x) => s + x, 0);

  return (
    <div className="mt-8 p-6 border border-indigo-500/20 bg-indigo-500/5 rounded-2xl">
      <div className="flex items-center gap-2 mb-4">
        <Activity className="w-4 h-4 text-indigo-400" />
        <span className="text-xs uppercase tracking-widest font-bold text-indigo-400">Interactive Demo</span>
      </div>
      <p className="text-zinc-300 font-medium mb-6">
        Watch secret sharing happen in real time. Enter a secret number, split it into 3 shares, then combine to verify.
      </p>

      {/* Input */}
      <div className="flex flex-wrap items-center gap-4 mb-6">
        <div>
          <label className="block text-xs text-zinc-500 mb-1">Your Secret Number</label>
          <input
            type="number"
            value={secret}
            onChange={e => { setSecret(Number(e.target.value)); setShares([]); setRevealed(false); }}
            className="w-28 px-3 py-2 bg-zinc-900 border border-zinc-700 rounded-lg text-white text-center font-mono focus:outline-none focus:border-indigo-500"
          />
        </div>
        <button
          onClick={generateShares}
          className="mt-5 px-5 py-2.5 bg-indigo-600 hover:bg-indigo-500 text-white rounded-lg text-sm font-semibold transition-colors cursor-pointer"
        >
          Split into Shares →
        </button>
      </div>

      {/* Shares */}
      <AnimatePresence>
        {shares.length > 0 && (
          <motion.div
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            className="space-y-4"
          >
            {/* Flow diagram */}
            <div className="flex flex-col sm:flex-row items-center justify-center gap-3 py-4">
              {/* Secret */}
              <div className="flex flex-col items-center gap-1.5">
                <span className="text-xs text-zinc-500">Secret</span>
                <div className="w-16 h-16 rounded-xl bg-indigo-500/20 border border-indigo-500/40 flex items-center justify-center font-mono text-xl font-bold text-indigo-300">
                  {secret}
                </div>
              </div>

              <div className="flex items-center gap-1 text-zinc-600">
                <div className="hidden sm:block w-8 h-px bg-zinc-700" />
                <ChevronDown className="sm:hidden w-4 h-4" />
                <div className="sm:hidden w-px h-6 bg-zinc-700" />
              </div>

              {/* Shares */}
              <div className="flex gap-3">
                {['Node A', 'Node B', 'Node C'].map((label, i) => (
                  <div key={label} className="flex flex-col items-center gap-1.5">
                    <span className="text-xs text-zinc-500">{label}</span>
                    <div className="w-14 h-14 rounded-xl bg-zinc-900 border border-zinc-700 flex items-center justify-center font-mono text-sm font-bold text-zinc-300">
                      {shares[i]}
                    </div>
                  </div>
                ))}
              </div>

              {/* Combine button */}
              <div className="flex items-center gap-1 text-zinc-600">
                <div className="hidden sm:block w-8 h-px bg-zinc-700" />
                <ChevronDown className="sm:hidden w-4 h-4" />
                <div className="sm:hidden w-px h-6 bg-zinc-700" />
              </div>
              <button
                onClick={() => setRevealed(true)}
                className={`px-4 py-2 rounded-xl text-sm font-semibold transition-all cursor-pointer ${
                  revealed
                    ? 'bg-emerald-500/20 border border-emerald-500/40 text-emerald-300'
                    : 'bg-zinc-800 border border-zinc-700 text-zinc-300 hover:bg-zinc-700'
                }`}
              >
                {revealed ? `= ${combined}` : 'Combine →'}
              </button>
            </div>

            <div className="text-xs text-zinc-500 text-center">
              Each node sees only its fragment. Only the combined result equals your secret.{' '}
              {combined === secret ? (
                <span className="text-emerald-400 font-semibold">✓ {combined} = {secret} — Match!</span>
              ) : null}
            </div>

            {/* Insight */}
            <div className="p-3 bg-zinc-900/50 rounded-xl border border-zinc-800 text-xs text-zinc-400">
              <strong className="text-zinc-300">Key insight:</strong> Node A cannot reconstruct the secret alone, even though it holds a real number. Only when all 3 shares are combined does the original secret emerge. That&apos;s the power of additive secret sharing.
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}

// ─── Stakeholder Card ─────────────────────────────────────────────────────────
function StakeholderCard({ icon: Icon, title, role, color }: {
  icon: React.ElementType; title: string; role: string; color: string
}) {
  const [flipped, setFlipped] = useState(false);
  return (
    <button
      onClick={() => setFlipped(f => !f)}
      className={`relative w-full text-left p-6 rounded-2xl border bg-zinc-950 transition-all cursor-pointer ${
        flipped ? `border-${color}-500/40 bg-${color}-500/5` : 'border-zinc-800 hover:border-zinc-700'
      }`}
    >
      <div className={`w-12 h-12 rounded-xl flex items-center justify-center mb-4 ${flipped ? `bg-${color}-500/20 text-${color}-400` : 'bg-zinc-900 text-zinc-400'}`}>
        <Icon className="w-6 h-6" />
      </div>
      <h4 className="font-bold text-white mb-2">{title}</h4>
      <AnimatePresence mode="wait">
        {!flipped ? (
          <motion.p key="tap" initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }} className="text-xs text-zinc-600">
            Tap to learn more →
          </motion.p>
        ) : (
          <motion.p key="role" initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }} className="text-sm text-zinc-400">
            {role}
          </motion.p>
        )}
      </AnimatePresence>
    </button>
  );
}

// ─── Main Page ────────────────────────────────────────────────────────────────
export default function LessonPage() {
  const [activeChapter, setActiveChapter] = useState('problem');

  // Intersection observer to update active chapter
  useEffect(() => {
    const obs = new IntersectionObserver(
      entries => {
        entries.forEach(e => { if (e.isIntersecting) setActiveChapter(e.target.id); });
      },
      { rootMargin: '-30% 0px -60% 0px' }
    );
    CHAPTERS.forEach(ch => {
      const el = document.getElementById(ch.id);
      if (el) obs.observe(el);
    });
    return () => obs.disconnect();
  }, []);

  return (
    <div className="min-h-screen bg-black text-white selection:bg-indigo-500/30">
      <div className="max-w-6xl mx-auto px-6 pt-24 pb-32">

        {/* Hero */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.7 }}
          className="text-center mb-20"
        >
          <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-zinc-900 border border-zinc-800 mb-6 text-xs font-bold uppercase tracking-widest text-indigo-400">
            <BookOpen className="w-3 h-3" /> Interactive Lesson
          </div>
          <h1 className="text-5xl md:text-7xl font-extrabold tracking-tight mb-6 bg-gradient-to-b from-white to-zinc-500 bg-clip-text text-transparent">
            Understanding Arcium
          </h1>
          <p className="text-xl text-zinc-400 max-w-2xl mx-auto leading-relaxed">
            A guided, interactive lesson on encrypted computation. Read, interact with the demos, and answer questions to lock in your understanding.
          </p>
          <div className="flex flex-wrap items-center justify-center gap-6 mt-8 text-sm text-zinc-500">
            <span className="flex items-center gap-2"><BookOpen className="w-4 h-4" /> 5 chapters</span>
            <span className="flex items-center gap-2"><BrainCircuit className="w-4 h-4" /> 2 knowledge checks</span>
            <span className="flex items-center gap-2"><Activity className="w-4 h-4" /> 1 interactive demo</span>
          </div>
        </motion.div>

        {/* Content + sidebar */}
        <div className="flex gap-16">
          <ChapterNav activeChapter={activeChapter} />

          <div className="flex-1 min-w-0 space-y-28">

            {/* ── Chapter 1: The Problem ── */}
            <section id="problem">
              <Reveal>
                <div className="flex items-center gap-3 mb-8">
                  <div className="w-8 h-8 rounded-full bg-red-500/20 border border-red-500/30 text-red-400 text-sm font-bold flex items-center justify-center">1</div>
                  <h2 className="text-3xl font-bold text-white">The Problem</h2>
                </div>
              </Reveal>

              <Reveal delay={0.1}>
                <p className="text-lg text-zinc-400 leading-relaxed mb-6">
                  Every time you use a cloud service or blockchain application, someone else must see your raw data to process it. This is the fundamental trust problem of computation:
                </p>
              </Reveal>

              <Reveal delay={0.15}>
                <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 mb-8">
                  {[
                    { icon: Database, label: 'Data at Rest', status: 'Encrypted ✓', ok: true },
                    { icon: Activity, label: 'Data in Transit', status: 'Encrypted ✓', ok: true },
                    { icon: Cpu, label: 'Data in Use', status: 'Exposed ✗', ok: false },
                  ].map(({ icon: Icon, label, status, ok }) => (
                    <div key={label} className={`flex flex-col items-center gap-3 p-5 rounded-2xl border ${ok ? 'border-emerald-500/30 bg-emerald-500/5 text-emerald-400' : 'border-red-500/40 bg-red-500/10 text-red-400'}`}>
                      <Icon className="w-8 h-8" />
                      <div className="text-center">
                        <div className="text-sm font-semibold text-white">{label}</div>
                        <div className="text-xs mt-1 font-medium">{status}</div>
                      </div>
                    </div>
                  ))}
                </div>
              </Reveal>

              <Reveal delay={0.2}>
                <p className="text-zinc-400 leading-relaxed">
                  Web3&apos;s transparency makes this worse: blockchains are <em>designed</em> to be public, making it near-impossible to handle sensitive data—medical records, financial positions, private keys—without trusting a third party with full access.
                </p>
              </Reveal>

              <Reveal delay={0.25}>
                <Quiz
                  question="When is data MOST vulnerable to exposure during traditional computation?"
                  options={[
                    { label: 'When stored in a database at rest', correct: false },
                    { label: 'When actively being processed/computed on', correct: true },
                    { label: 'When transmitted over HTTPS', correct: false },
                  ]}
                  explanation="Encryption protects data at rest and in transit, but computation requires decrypting the data first — exposing it to the machine (and its operator) doing the work."
                />
              </Reveal>
            </section>

            {/* ── Chapter 2: The Solution ── */}
            <section id="solution">
              <Reveal>
                <div className="flex items-center gap-3 mb-8">
                  <div className="w-8 h-8 rounded-full bg-emerald-500/20 border border-emerald-500/30 text-emerald-400 text-sm font-bold flex items-center justify-center">2</div>
                  <h2 className="text-3xl font-bold text-white">The Solution: Arcium</h2>
                </div>
              </Reveal>

              <Reveal delay={0.1}>
                <p className="text-lg text-zinc-400 leading-relaxed mb-6">
                  Arcium is an <strong className="text-white">encrypted supercomputer</strong> — a network of nodes that can compute over data <em>without ever seeing it</em>. It uses Multi-Party Computation (MPC) as its core cryptographic primitive.
                </p>
              </Reveal>

              <Reveal delay={0.15}>
                <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
                  {[
                    { icon: Lock, label: 'Full Privacy', desc: 'Data stays encrypted throughout computation', color: 'emerald' },
                    { icon: ShieldCheck, label: 'Trustless', desc: 'No single party needs to be trusted', color: 'blue' },
                    { icon: Zap, label: 'Powerful', desc: 'Run any program over encrypted inputs', color: 'indigo' },
                  ].map(({ icon: Icon, label, desc, color }) => (
                    <div key={label} className={`p-5 rounded-2xl border border-zinc-800 bg-zinc-950 hover:border-${color}-500/30 transition-colors`}>
                      <Icon className={`w-6 h-6 text-${color}-400 mb-3`} />
                      <div className="font-semibold text-white mb-1">{label}</div>
                      <p className="text-xs text-zinc-400">{desc}</p>
                    </div>
                  ))}
                </div>
              </Reveal>
            </section>

            {/* ── Chapter 3: How MPC Works ── */}
            <section id="how">
              <Reveal>
                <div className="flex items-center gap-3 mb-8">
                  <div className="w-8 h-8 rounded-full bg-blue-500/20 border border-blue-500/30 text-blue-400 text-sm font-bold flex items-center justify-center">3</div>
                  <h2 className="text-3xl font-bold text-white">How MPC Works</h2>
                </div>
              </Reveal>

              <Reveal delay={0.1}>
                <p className="text-zinc-400 leading-relaxed mb-4">
                  Multi-Party Computation (MPC) allows multiple parties to jointly compute a function over their inputs while keeping those inputs private. The key technique is called <strong className="text-white">secret sharing</strong>.
                </p>
                <p className="text-zinc-400 leading-relaxed">
                  Rather than sending data to a single server, your secret number is mathematically split into <em>shares</em>. No single share reveals the original value. Each share goes to a different node, and the nodes compute together, recombining only the final result.
                </p>
              </Reveal>

              <Reveal delay={0.15}>
                <SecretShareDemo />
              </Reveal>

              <Reveal delay={0.2}>
                <Quiz
                  question="In secret sharing, what does Node A learn when it receives its share?"
                  options={[
                    { label: 'The original secret value', correct: false },
                    { label: 'A random-looking number that reveals nothing alone', correct: true },
                    { label: 'The shares held by the other nodes', correct: false },
                  ]}
                  explanation="Each share is designed to be indistinguishable from a random number without the other shares. This is the core privacy guarantee of additive secret sharing."
                />
              </Reveal>
            </section>

            {/* ── Chapter 4: Infrastructure ── */}
            <section id="infra">
              <Reveal>
                <div className="flex items-center gap-3 mb-8">
                  <div className="w-8 h-8 rounded-full bg-indigo-500/20 border border-indigo-500/30 text-indigo-400 text-sm font-bold flex items-center justify-center">4</div>
                  <h2 className="text-3xl font-bold text-white">Core Infrastructure</h2>
                </div>
              </Reveal>

              <Reveal delay={0.1}>
                <p className="text-zinc-400 leading-relaxed mb-8">
                  Arcium&apos;s hardware is organized in layers — think of it like a computer: individual processors, their groupings, and the software defining what they run.
                </p>
              </Reveal>

              <div className="space-y-4">
                {[
                  {
                    icon: Server, accent: 'indigo', number: '01',
                    title: 'Arx Nodes',
                    desc: 'The physical processors of the encrypted supercomputer. Each Arx Node contributes computational power to the network. They handle encrypted data fragments and are rewarded for correct computation.',
                    delay: 0.1,
                  },
                  {
                    icon: Network, accent: 'blue', number: '02',
                    title: 'Clusters',
                    desc: 'Groups of Arx Nodes that collaborate to run MPC. A Cluster is assembled for a specific MXE and collectively processes tasks — no single node holds a complete picture of the data.',
                    delay: 0.2,
                  },
                  {
                    icon: Cpu, accent: 'purple', number: '03',
                    title: 'MXEs (MPC eXecution Environments)',
                    desc: 'The virtual environments where computation is defined. Like app-chains for encrypted compute — developers define logic, Clusters execute it securely. Multiple MXEs can exist per Cluster.',
                    delay: 0.3,
                  },
                ].map(({ icon: Icon, accent, number, title, desc, delay: d }) => (
                  <Reveal key={title} delay={d}>
                    <div className={`flex gap-5 p-6 rounded-2xl border border-zinc-800 bg-zinc-950 hover:border-${accent}-500/30 transition-colors group`}>
                      <div className={`text-3xl font-black text-zinc-800 group-hover:text-${accent}-900 transition-colors shrink-0 w-12 text-center hidden sm:block`}>{number}</div>
                      <div>
                        <div className="flex items-center gap-3 mb-2">
                          <Icon className={`w-5 h-5 text-${accent}-400`} />
                          <h3 className="font-bold text-white">{title}</h3>
                        </div>
                        <p className="text-sm text-zinc-400 leading-relaxed">{desc}</p>
                      </div>
                    </div>
                  </Reveal>
                ))}
              </div>
            </section>

            {/* ── Chapter 5: Stakeholders ── */}
            <section id="people">
              <Reveal>
                <div className="flex items-center gap-3 mb-8">
                  <div className="w-8 h-8 rounded-full bg-amber-500/20 border border-amber-500/30 text-amber-400 text-sm font-bold flex items-center justify-center">5</div>
                  <h2 className="text-3xl font-bold text-white">Network Stakeholders</h2>
                </div>
              </Reveal>

              <Reveal delay={0.1}>
                <p className="text-zinc-400 leading-relaxed mb-8">
                  Three distinct groups of participants power the Arcium economy. Click each card to learn their role.
                </p>
              </Reveal>

              <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
                {[
                  {
                    icon: Cpu, color: 'indigo', title: 'Computation Customers',
                    role: 'Developers and businesses who create MXEs to run secure, encrypted computations. They pay fees and set the requirements for the Clusters that will process their jobs.'
                  },
                  {
                    icon: Server, color: 'emerald', title: 'Arx Operators',
                    role: 'Infrastructure providers who run Arx Nodes and earn rewards for completing computation tasks. They must self-stake to activate and can receive delegated stake to expand capacity.'
                  },
                  {
                    icon: Users, color: 'amber', title: '3rd-Party Delegators',
                    role: 'Token holders who delegate stake to Arx Operators to boost their computational capacity. They share in the rewards proportionally, helping align incentives across the network.'
                  },
                ].map(props => (
                  <Reveal key={props.title} delay={0.1}>
                    <StakeholderCard {...props} />
                  </Reveal>
                ))}
              </div>
            </section>

            {/* ── Handoff ── */}
            <Reveal>
              <div className="p-10 text-center bg-indigo-600/10 border border-indigo-500/30 rounded-3xl relative overflow-hidden">
                <div className="absolute inset-0 bg-[radial-gradient(ellipse_at_center,rgba(99,102,241,0.15),transparent_70%)]" />
                <div className="relative z-10">
                  <div className="flex items-center justify-center mb-4">
                    <CheckCircle2 className="w-10 h-10 text-indigo-400" />
                  </div>
                  <h2 className="text-3xl font-bold mb-4">Lesson Complete.</h2>
                  <p className="text-zinc-400 mb-8 max-w-xl mx-auto">
                    You now understand the problem, the solution, and the layers of Arcium&apos;s architecture. Time to explore with the interactive simulators.
                  </p>
                  <div className="flex flex-col sm:flex-row items-center justify-center gap-4">
                    <Link href="/visualizer" className="px-8 py-3.5 bg-indigo-500 text-white font-bold rounded-full hover:bg-indigo-400 transition-colors flex items-center gap-2">
                      <BrainCircuit className="w-5 h-5" /> MPC Visualizer
                    </Link>
                    <Link href="/architecture" className="px-8 py-3.5 bg-zinc-900 border border-zinc-700 text-zinc-300 font-bold rounded-full hover:bg-zinc-800 transition-colors flex items-center gap-2">
                      <Pickaxe className="w-5 h-5" /> Architecture Sim
                    </Link>
                    <Link href="/staking" className="px-8 py-3.5 bg-zinc-900 border border-zinc-700 text-zinc-300 font-bold rounded-full hover:bg-zinc-800 transition-colors flex items-center gap-2">
                      <Activity className="w-5 h-5" /> All Simulators
                    </Link>
                  </div>
                </div>
              </div>
            </Reveal>

          </div>
        </div>
      </div>
    </div>
  );
}
