'use client';

import { useState, useEffect } from 'react';
import { useProgressStore } from '@/state/progressStore';
import { motion, AnimatePresence } from 'framer-motion';
import { Play, Coins, Plus, CheckCircle2, Cpu } from 'lucide-react';

type Job = {
  id: string;
  fee: number;
  status: 'queued' | 'executing' | 'completed';
};

export function MempoolRace() {
  const { markActivityCompleted } = useProgressStore();
  const [feeInput, setFeeInput] = useState(10);
  const [jobs, setJobs] = useState<Job[]>([]);
  const [isPlaying, setIsPlaying] = useState(false);
  const [completedCount, setCompletedCount] = useState(0);

  // Add a new job to the mempool
  const handleAddJob = (e: React.FormEvent) => {
    e.preventDefault();
    const newJob: Job = {
      id: Math.random().toString(36).substring(7),
      fee: feeInput,
      status: 'queued'
    };
    
    setJobs(prev => [...prev, newJob].sort((a, b) => b.fee - a.fee)); // Keep sorted by fee high to low
  };

  // Simulating the cluster picking up jobs
  useEffect(() => {
    let interval: NodeJS.Timeout;
    
    if (isPlaying) {
      interval = setInterval(() => {
        setJobs(currentJobs => {
          const executingJob = currentJobs.find(j => j.status === 'executing');
          
          let nextJobs = [...currentJobs];

          // If a job just finished executing, mark it completed
          if (executingJob) {
            nextJobs = nextJobs.map(j => 
              j.id === executingJob.id ? { ...j, status: 'completed' } : j
            );
            setCompletedCount(c => c + 1);
          }

          // Pick the highest priority queued job
          const pendingJobs = nextJobs.filter(j => j.status === 'queued');
          if (pendingJobs.length > 0) {
             // Already sorted by fee, so take the first
             const nextToExecute = pendingJobs[0];
             return nextJobs.map(j => 
               j.id === nextToExecute.id ? { ...j, status: 'executing' } : j
             );
          } else {
             // Queue empty, stop playing
             setIsPlaying(false);
             return nextJobs;
          }
        });
      }, 1500); // 1.5 seconds per execution
    }

    return () => clearInterval(interval);
  }, [isPlaying]);

  // Gamification logic
  useEffect(() => {
    if (completedCount >= 5) {
      markActivityCompleted('mempool');
    }
  }, [completedCount, markActivityCompleted]);

  return (
    <div className="w-full max-w-5xl mx-auto grid grid-cols-1 lg:grid-cols-12 gap-8">
      
      {/* Configuration Panel */}
      <div className="lg:col-span-4 flex flex-col gap-6 bg-zinc-900 border border-zinc-800 rounded-2xl p-6">
        <h2 className="text-xl font-bold flex items-center gap-2">
          <Coins className="text-indigo-400" />
          Queue Computation
        </h2>
        
        <form onSubmit={handleAddJob} className="flex flex-col gap-4">
           <div>
             <label className="text-sm font-medium text-zinc-400 mb-1 block">Priority Fee (ARC)</label>
             <input 
               type="number" 
               min={1} 
               value={feeInput}
               onChange={(e) => setFeeInput(Number(e.target.value))}
               className="w-full px-4 py-3 bg-zinc-950 border border-zinc-700 rounded-xl text-lg font-bold focus:outline-none focus:border-indigo-500"
             />
             <p className="text-xs text-zinc-500 mt-2">Higher fees get prioritized by the cluster.</p>
           </div>
           
           <button 
             type="submit"
             disabled={isPlaying && jobs.filter(j => j.status === 'queued').length > 10}
             className="w-full py-3 bg-zinc-800 hover:bg-zinc-700 text-white font-bold rounded-xl transition-colors flex justify-center items-center gap-2 disabled:opacity-50"
           >
             <Plus size={18} /> Add to Mempool
           </button>
        </form>

        <div className="mt-8 pt-6 border-t border-zinc-800">
           <button 
             onClick={() => setIsPlaying(!isPlaying)}
             disabled={jobs.filter(j => j.status === 'queued').length === 0}
             className={`w-full py-4 text-white font-bold rounded-xl transition-colors shadow-lg flex justify-center items-center gap-2 ${isPlaying ? 'bg-orange-500 hover:bg-orange-400 shadow-[0_0_20px_rgba(249,115,22,0.3)]' : 'bg-indigo-600 hover:bg-indigo-500 shadow-[0_0_20px_rgba(79,70,229,0.3)]'} disabled:opacity-50 disabled:shadow-none`}
           >
             {isPlaying ? 'Processing Jobs...' : <><Play size={18} fill="currentColor" /> Start Cluster Network</>}
           </button>
        </div>

        {completedCount >= 5 && (
           <div className="mt-2 bg-green-500/10 border border-green-500/30 text-green-400 font-bold p-3 rounded-xl flex justify-center items-center gap-2">
             <CheckCircle2 size={18} /> Priority Markets Mastered (+100 XP)
           </div>
        )}
      </div>

      {/* Visualizer output */}
      <div className="lg:col-span-8 bg-[#0a0a0c] border border-zinc-800 rounded-2xl overflow-hidden relative grid grid-cols-2 p-6 gap-6">
        
        {/* Memory Pool */}
        <div className="bg-zinc-900/50 border border-zinc-800 rounded-xl p-4 flex flex-col h-[500px]">
           <div className="flex justify-between items-center mb-4">
             <h3 className="font-bold text-zinc-300 tracking-widest uppercase text-xs">Solana Mempool</h3>
             <span className="text-xs bg-zinc-800 px-2 py-1 rounded text-zinc-400 font-mono text-purple-400">Sorted by Fee</span>
           </div>

           <div className="flex-1 overflow-auto flex flex-col gap-2">
             <AnimatePresence>
                {jobs.filter(j => j.status === 'queued').map(job => (
                  <motion.div 
                    key={job.id}
                    layoutId={`job-${job.id}`}
                    initial={{ opacity: 0, x: -20 }}
                    animate={{ opacity: 1, x: 0 }}
                    exit={{ opacity: 0, scale: 0.9 }}
                    className="p-3 bg-zinc-950 border border-zinc-700 rounded-lg flex justify-between items-center"
                  >
                     <span className="text-xs font-mono text-zinc-500">#{job.id}</span>
                     <span className="text-sm font-bold text-emerald-400">{job.fee} ARC</span>
                  </motion.div>
                ))}
                {jobs.filter(j => j.status === 'queued').length === 0 && (
                   <div className="h-full flex items-center justify-center text-zinc-600 text-sm italic">
                     Mempool is empty.
                   </div>
                )}
             </AnimatePresence>
           </div>
        </div>

        {/* Execution Cluster */}
        <div className="bg-indigo-950/20 border border-indigo-500/20 rounded-xl p-4 flex flex-col h-[500px]">
           <div className="flex justify-between items-center mb-4">
             <h3 className="font-bold text-indigo-300 tracking-widest uppercase text-xs">Active MXE Cluster</h3>
           </div>
           
           <div className="flex-1 flex flex-col items-center justify-center relative border-2 border-dashed border-indigo-500/20 rounded-full w-full max-h-[350px] aspect-square mx-auto my-auto bg-indigo-500/5">
              
              {/* Nodes in cluster */}
              {[0, 1, 2].map((i) => (
                <div 
                  key={i} 
                  className={`absolute w-12 h-12 rounded-full border-2 flex items-center justify-center transition-colors ${isPlaying ? 'bg-indigo-600 border-indigo-400 shadow-[0_0_20px_rgba(79,70,229,0.5)]' : 'bg-zinc-800 border-zinc-700'}`}
                  style={{
                    left: `${50 + Math.cos(i * 2 + Math.PI/2) * 35}%`,
                    top: `${50 + Math.sin(i * 2 + Math.PI/2) * 35}%`,
                    transform: 'translate(-50%, -50%)' // center perfectly
                  }}
                >
                  <Cpu size={20} className={isPlaying ? 'animate-pulse text-white' : 'text-zinc-500'} />
                </div>
              ))}

              <div className="absolute inset-0 flex items-center justify-center z-10">
                 <AnimatePresence>
                    {jobs.filter(j => j.status === 'executing').map(job => (
                      <motion.div 
                        key={job.id}
                        layoutId={`job-${job.id}`}
                        initial={{ scale: 0.5, opacity: 0 }}
                        animate={{ scale: [1, 1.1, 1], opacity: 1 }}
                        exit={{ scale: 0, opacity: 0 }}
                        transition={{ duration: 0.5 }}
                        className="p-4 bg-indigo-600 border border-indigo-400 rounded-xl shadow-2xl flex flex-col items-center gap-1"
                      >
                         <span className="text-xs uppercase font-bold text-indigo-200">Processing</span>
                         <span className="text-lg font-bold text-white">{job.fee} ARC</span>
                      </motion.div>
                    ))}
                 </AnimatePresence>
                 {jobs.filter(j => j.status === 'executing').length === 0 && (
                   <span className="text-zinc-600 text-sm italic">Waiting for jobs...</span>
                 )}
              </div>
           </div>

           <div className="mt-4 text-center pb-2">
             <div className="text-3xl font-mono text-white font-bold">{completedCount}</div>
             <div className="text-xs text-indigo-400 uppercase tracking-widest">Jobs Completed</div>
           </div>
        </div>

      </div>
    </div>
  );
}
