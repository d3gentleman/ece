'use client';

import { useState, useEffect } from 'react';
import { useProgressStore } from '@/state/progressStore';
import { CheckCircle2, TrendingUp, Cpu, Server, Lock, AlertTriangle } from 'lucide-react';
import { motion } from 'framer-motion';

const MIN_SELF_DELEGATION = 5000;
const STAKE_PER_CU = 100; // 100 tokens per 1 Compute Unit (CU) hardware claim

export function StakingSimulator() {
  const { markActivityCompleted } = useProgressStore();
  
  const [selfStake, setSelfStake] = useState(1000);
  const [thirdPartyStake, setThirdPartyStake] = useState(0);
  const [hardwareClaim, setHardwareClaim] = useState(100); // Compute Units

  const totalStake = selfStake + thirdPartyStake;
  const isActivated = selfStake >= MIN_SELF_DELEGATION;
  const requiredStakeForClaim = hardwareClaim * STAKE_PER_CU;
  
  // The actual utilized capacity is bounded by the hardware claim OR the total stake backing it
  const utilizedCapacity = isActivated 
    ? Math.min(hardwareClaim, Math.floor(totalStake / STAKE_PER_CU))
    : 0;

  const isFullyBacked = isActivated && totalStake >= requiredStakeForClaim;

  // Award XP when they successfully activate and fully back at least 150 CU
  useEffect(() => {
    if (isFullyBacked && hardwareClaim >= 150) {
      markActivityCompleted('staking');
    }
  }, [isFullyBacked, hardwareClaim, markActivityCompleted]);

  return (
    <div className="w-full max-w-5xl mx-auto grid grid-cols-1 lg:grid-cols-12 gap-8">
      
      {/* Configuration Panel */}
      <div className="lg:col-span-5 flex flex-col gap-8 bg-black border border-zinc-800 rounded-2xl p-6 shadow-xl">
        
        {/* Node Operations */}
        <div>
          <h2 className="text-xl font-bold flex items-center gap-2 mb-4 border-b border-zinc-800 pb-3">
            <Server className="text-indigo-400" />
            Node Operator
          </h2>

          <div className="space-y-6">
            <div>
              <div className="flex justify-between items-center mb-1">
                <label className="text-sm font-medium text-zinc-400">Self-Delegation Stake</label>
                <span className="text-xs font-mono text-indigo-400">{selfStake.toLocaleString()} ARC</span>
              </div>
              <input 
                type="range" 
                min={0} 
                max={20000} 
                step={500}
                value={selfStake}
                onChange={(e) => setSelfStake(Number(e.target.value))}
                className="w-full accent-indigo-500"
              />
              <div className="flex justify-between mt-1 text-[10px] text-zinc-500 font-mono">
                <span>0</span>
                <span className={selfStake >= MIN_SELF_DELEGATION ? 'text-green-500' : 'text-orange-500'}>Min: 5k</span>
                <span>20k</span>
              </div>
            </div>

            <div>
              <div className="flex justify-between items-center mb-1">
                <label className="text-sm font-medium text-zinc-400">Hardware Claim (Max Capacity)</label>
                <span className="text-xs font-mono text-blue-400">{hardwareClaim} CUs</span>
              </div>
              <input 
                type="range" 
                min={50} 
                max={300} 
                step={10}
                value={hardwareClaim}
                onChange={(e) => setHardwareClaim(Number(e.target.value))}
                className="w-full accent-blue-500"
              />
              <div className="text-[10px] text-zinc-500 mt-1">Requires {requiredStakeForClaim.toLocaleString()} ARC total stake to fully unlock.</div>
            </div>
          </div>
        </div>

        {/* Third Party Delegators */}
        <div>
          <h2 className="text-xl font-bold flex items-center gap-2 mb-4 border-b border-zinc-800 pb-3">
            <Globe className="text-emerald-400" />
            Third-Party Delegators
          </h2>

          <div>
            <div className="flex justify-between items-center mb-1">
              <label className="text-sm font-medium text-zinc-400">Public Stake Delegated to You</label>
              <span className="text-xs font-mono text-emerald-400">{thirdPartyStake.toLocaleString()} ARC</span>
            </div>
            <input 
              type="range" 
              min={0} 
              max={30000} 
              step={1000}
              value={thirdPartyStake}
              disabled={!isActivated} // Can't delegate to inactive nodes usually
              onChange={(e) => setThirdPartyStake(Number(e.target.value))}
              className="w-full accent-emerald-500 disabled:opacity-30"
            />
            {!isActivated && <div className="text-xs text-orange-400 mt-2 flex items-center gap-1"><AlertTriangle size={12}/> Activate node first to receive delegations.</div>}
          </div>
        </div>
      </div>

      {/* Visualizer output */}
      <div className="lg:col-span-7 bg-black border border-zinc-800 rounded-2xl overflow-hidden relative flex flex-col p-6 shadow-2xl">
        
        <div className="mb-6 flex justify-between items-center border-b border-zinc-800 pb-4">
           <div>
             <h3 className="text-lg font-bold">Node Status</h3>
             {isActivated ? (
               <div className="flex items-center gap-2 text-green-400 text-sm mt-1">
                 <CheckCircle2 size={16} /> Online & Active
               </div>
             ) : (
               <div className="flex items-center gap-2 text-zinc-500 text-sm mt-1">
                 <Lock size={16} /> Inactive (Insufficient Self-Stake)
               </div>
             )}
           </div>

           <div className="text-right">
             <div className="text-2xl font-bold font-mono text-white">{totalStake.toLocaleString()}</div>
             <div className="text-xs text-zinc-500 uppercase tracking-widest">Total Stake</div>
           </div>
        </div>

        <div className="flex-1 space-y-8">
           
           {/* Hardware vs Stake Bar Chart */}
           <div className="space-y-4 relative">
             <div className="flex justify-between text-sm">
                <span className="text-zinc-400 font-medium">Claimed Hardware Capacity</span>
                <span className="text-blue-400 font-bold">{hardwareClaim} CUs</span>
             </div>
             <div className="h-6 w-full bg-zinc-950 rounded-md overflow-hidden relative">
                <motion.div 
                  className="absolute left-0 top-0 bottom-0 bg-blue-500/20 border-r-2 border-blue-500"
                  initial={false}
                  animate={{ width: `${(hardwareClaim / 300) * 100}%` }}
                  transition={{ type: 'spring', stiffness: 100 }}
                />
             </div>

             <div className="flex justify-between text-sm mt-6">
                <span className="text-zinc-400 font-medium">Backed & Usable Capacity</span>
                <span className={isFullyBacked ? "text-green-400 font-bold" : "text-orange-400 font-bold"}>{utilizedCapacity} CUs</span>
             </div>
             <div className="h-6 w-full bg-zinc-950 rounded-md overflow-hidden relative flex">
                <motion.div 
                  className="h-full bg-indigo-500 relative z-10"
                  initial={false}
                  animate={{ width: `${(selfStake / (300 * STAKE_PER_CU)) * 100}%` }}
                  transition={{ type: 'spring', stiffness: 100 }}
                />
                <motion.div 
                  className="h-full bg-emerald-500 relative z-20"
                  initial={false}
                  animate={{ width: `${(thirdPartyStake / (300 * STAKE_PER_CU)) * 100}%` }}
                  transition={{ type: 'spring', stiffness: 100 }}
                />
             </div>

             {/* Stake Breakdown Tooltip */}
             <div className="flex justify-center gap-6 mt-3 text-xs">
                <div className="flex items-center gap-2"><div className="w-3 h-3 bg-indigo-500 rounded-sm"></div> Self Stake</div>
                <div className="flex items-center gap-2"><div className="w-3 h-3 bg-emerald-500 rounded-sm"></div> 3rd Party Stake</div>
             </div>
           </div>

           {/* Feedback Box */}
           <div className="p-4 rounded-xl border border-zinc-800 bg-black text-sm text-zinc-400">
             {!isActivated ? (
               <p>The Node Operator must self-delegate at least {MIN_SELF_DELEGATION.toLocaleString()} ARC to activate the node. Without this, the node cannot join clusters or perform computations.</p>
             ) : !isFullyBacked ? (
               <p>Your hardware claim is currently <strong>under-staked</strong>. You claimed {hardwareClaim} CUs of capacity, but only have enough total stake to back {utilizedCapacity} CUs. The network will only assign you jobs up to {utilizedCapacity} CUs. Attract more 3rd-party delegators or increase self-stake!</p>
             ) : (
               <div className="text-green-400 mb-2 font-semibold"> Fully Backed & Optimized!</div>
             )}
             {isFullyBacked && isActivated && (
               <p>Your hardware claim of {hardwareClaim} CUs is fully backed by {requiredStakeForClaim.toLocaleString()} ARC. Your node is operating at maximum claimed capacity, maximizing block rewards! Any surplus stake beyond this will have diminished returns.</p>
             )}
           </div>

           {/* Gamification Success State */}
           {isFullyBacked && hardwareClaim >= 150 && (
             <motion.div 
               initial={{ opacity: 0, y: 10 }}
               animate={{ opacity: 1, y: 0 }}
               className="bg-green-500/10 border border-green-500/30 text-green-400 font-bold p-3 rounded-xl flex justify-center items-center gap-2"
             >
               <TrendingUp size={18} /> High-Capacity Node Optimized (+100 XP)
             </motion.div>
           )}
        </div>
      </div>
    </div>
  );
}

// Just a tiny mocking component to fix the globe import missing earlier
function Globe(props: any) {
  return <svg {...props} xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><circle cx="12" cy="12" r="10"/><path d="M12 2a14.5 14.5 0 0 0 0 20 14.5 14.5 0 0 0 0-20"/><path d="M2 12h20"/></svg>
}
