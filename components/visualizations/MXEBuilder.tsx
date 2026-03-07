'use client';

import { useState } from 'react';
import { useProgressStore } from '@/state/progressStore';
import { Shield, Server, Globe, Cpu, CheckCircle2, AlertCircle } from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';

export function MXEBuilder() {
  const { markActivityCompleted } = useProgressStore();
  const [isDeployed, setIsDeployed] = useState(false);
  const [config, setConfig] = useState({
    protocol: 'shamir',
    clusterSize: 3,
    threshold: 2,
    hardware: 'standard',
    region: 'global'
  });

  const handleDeploy = () => {
    setIsDeployed(true);
    markActivityCompleted('mxe-builder');
  };

  const handleReset = () => {
    setIsDeployed(false);
  };

  return (
    <div className="w-full max-w-5xl mx-auto grid grid-cols-1 lg:grid-cols-12 gap-8">
      
      {/* Configuration Panel */}
      <div className="lg:col-span-5 flex flex-col gap-6 bg-zinc-900 border border-zinc-800 rounded-2xl p-6">
        <h2 className="text-xl font-bold flex items-center gap-2">
          <Server className="text-indigo-400" />
          MXE Configuration
        </h2>

        <div className="space-y-4">
          <div>
            <label className="text-sm font-medium text-zinc-400 mb-1.5 block">Cryptographic Protocol</label>
            <div className="grid grid-cols-2 gap-2">
              <button 
                disabled={isDeployed}
                onClick={() => setConfig({...config, protocol: 'shamir'})}
                className={`p-3 rounded-lg border text-sm text-left transition-all ${config.protocol === 'shamir' ? 'bg-indigo-500/10 border-indigo-500 text-indigo-300' : 'bg-zinc-950 border-zinc-800 text-zinc-500 hover:border-zinc-700 disabled:opacity-50'}`}
              >
                <div className="font-bold mb-1">Shamir Secret Sharing</div>
                <div className="text-xs opacity-70">Best for general purpose MPC</div>
              </button>
              <button 
                disabled={isDeployed}
                onClick={() => setConfig({...config, protocol: 'garbled'})}
                className={`p-3 rounded-lg border text-sm text-left transition-all ${config.protocol === 'garbled' ? 'bg-indigo-500/10 border-indigo-500 text-indigo-300' : 'bg-zinc-950 border-zinc-800 text-zinc-500 hover:border-zinc-700 disabled:opacity-50'}`}
              >
                <div className="font-bold mb-1">Garbled Circuits</div>
                <div className="text-xs opacity-70">Optimized for boolean logic</div>
              </button>
            </div>
          </div>

          <div>
             <div className="flex justify-between items-center mb-1.5">
               <label className="text-sm font-medium text-zinc-400">Cluster Size & Threshold</label>
               <span className="text-xs text-indigo-400 font-mono">{config.threshold} of {config.clusterSize} Nodes</span>
             </div>
             <input 
               type="range" 
               min={3} 
               max={15} 
               disabled={isDeployed}
               value={config.clusterSize}
               onChange={(e) => {
                 const size = Number(e.target.value);
                 setConfig({...config, clusterSize: size, threshold: Math.ceil(size * 0.66)});
               }}
               className="w-full accent-indigo-500 disabled:opacity-50"
             />
             <p className="text-xs text-zinc-500 mt-2">
               A {config.clusterSize}-node cluster forming. At least {config.threshold} nodes must participate honestly to maintain security.
             </p>
          </div>

          <div>
            <label className="text-sm font-medium text-zinc-400 mb-1.5 block">Hardware Requirements</label>
            <div className="flex gap-2">
              {['standard', 'high-compute', 'tee'].map((hw) => (
                <button
                  key={hw}
                  disabled={isDeployed}
                  onClick={() => setConfig({...config, hardware: hw})}
                  className={`flex-1 py-2 px-3 rounded-lg border text-xs font-semibold capitalize transition-all ${config.hardware === hw ? 'bg-indigo-500/10 border-indigo-500 text-indigo-300' : 'bg-zinc-950 border-zinc-800 text-zinc-500 hover:border-zinc-700 disabled:opacity-50'}`}
                >
                  {hw === 'tee' ? 'TEE Enabled' : hw.replace('-', ' ')}
                </button>
              ))}
            </div>
          </div>

          <div>
            <label className="text-sm font-medium text-zinc-400 mb-1.5 block">Jurisdiction / Region</label>
            <div className="flex gap-2">
              {['global', 'eu', 'us'].map((reg) => (
                <button
                  key={reg}
                  disabled={isDeployed}
                  onClick={() => setConfig({...config, region: reg})}
                  className={`flex w-fit items-center gap-2 py-2 px-4 rounded-lg border text-xs font-semibold uppercase transition-all ${config.region === reg ? 'bg-indigo-500/10 border-indigo-500 text-indigo-300' : 'bg-zinc-950 border-zinc-800 text-zinc-500 hover:border-zinc-700 disabled:opacity-50'}`}
                >
                  <Globe size={14} />
                  {reg}
                </button>
              ))}
            </div>
          </div>
        </div>

        <div className="mt-4 pt-6 border-t border-zinc-800">
          {!isDeployed ? (
            <button 
              onClick={handleDeploy}
              className="w-full py-3 bg-indigo-600 hover:bg-indigo-500 text-white font-bold rounded-xl transition-colors shadow-[0_0_20px_rgba(79,70,229,0.3)] hover:shadow-[0_0_25px_rgba(79,70,229,0.5)] flex justify-center items-center gap-2"
            >
              <Cpu size={18} /> Deploy MXE to Network
            </button>
          ) : (
             <div className="flex gap-3">
                <button 
                  onClick={handleReset}
                  className="flex-1 py-3 bg-zinc-800 hover:bg-zinc-700 text-white font-bold rounded-xl transition-colors"
                >
                  Edit Configuration
                </button>
                <div className="flex-1 py-3 bg-green-500/10 border border-green-500/30 text-green-400 font-bold rounded-xl flex justify-center items-center gap-2">
                  <CheckCircle2 size={18} /> Deployed (+100 XP)
                </div>
             </div>
          )}
        </div>
      </div>

      {/* Network Preview Canvas */}
      <div className="lg:col-span-7 bg-[#0a0a0c] border border-zinc-800 rounded-2xl overflow-hidden relative flex flex-col">
        <div className="absolute top-4 left-4 z-10">
           <span className="bg-zinc-900 border border-zinc-700 text-zinc-300 text-xs font-bold px-3 py-1.5 rounded-full shadow-lg">
             Network Admission Preview
           </span>
        </div>
        
        <div className="flex-1 relative flex items-center justify-center p-8">
           {/* Global Node Pool (Background) */}
           <div className="absolute inset-0 opacity-20 pointer-events-none">
              {Array.from({ length: 40 }).map((_, i) => (
                <div 
                  key={`bg-node-${i}`} 
                  className="absolute w-2 h-2 rounded-full bg-slate-500"
                  style={{
                    left: `${Math.random() * 100}%`,
                    top: `${Math.random() * 100}%`,
                  }}
                />
              ))}
           </div>

           {/* The MXE Cluster rendering */}
           <div 
             className={`relative w-full aspect-square max-w-[400px] border-2 border-dashed rounded-full transition-all duration-1000 flex items-center justify-center ${isDeployed ? 'border-indigo-500/50 bg-indigo-500/5 shadow-[0_0_50px_rgba(79,70,229,0.1)]' : 'border-zinc-800 bg-transparent'}`}
           >
              {isDeployed && (
                <motion.div 
                  initial={{ opacity: 0, scale: 0.8 }}
                  animate={{ opacity: 1, scale: 1 }}
                  className="absolute inset-0 flex items-center justify-center pointer-events-none"
                >
                  <h3 className="text-xl font-bold text-indigo-500/20 uppercase tracking-[0.5em] text-center w-full">
                    Active<br/>MXE Cluster
                  </h3>
                </motion.div>
              )}

              <AnimatePresence>
                {Array.from({ length: config.clusterSize }).map((_, i) => {
                  const angle = (i / config.clusterSize) * Math.PI * 2 - Math.PI / 2;
                  const radius = isDeployed ? 160 : 250; // Pull nodes in when deployed
                  
                  return (
                    <motion.div
                      key={`mxe-node-${i}`}
                      initial={{ scale: 0, opacity: 0 }}
                      animate={{ 
                        scale: 1, 
                        opacity: isDeployed ? 1 : 0.4,
                        x: Math.cos(angle) * radius,
                        y: Math.sin(angle) * radius,
                        backgroundColor: isDeployed ? '#4f46e5' : '#3f3f46' // indigo-600 vs zinc-700
                      }}
                      transition={{ 
                        type: "spring", 
                        stiffness: 60, 
                        damping: 15,
                        delay: isDeployed ? i * 0.1 : 0 
                      }}
                      className="absolute w-12 h-12 rounded-full border-2 border-zinc-950 flex shadow-lg items-center justify-center z-20"
                    >
                      {isDeployed && <Shield size={16} className="text-white" />}
                    </motion.div>
                  )
                })}
              </AnimatePresence>

              {/* Connections forming between nodes when deployed */}
              {isDeployed && Array.from({ length: config.clusterSize }).map((_, i) => (
                Array.from({ length: config.clusterSize }).slice(i + 1).map((_, j) => {
                  if (j > 2) return null; // Don't draw too many lines, just a web
                  return (
                    <motion.div 
                      key={`line-${i}-${j}`}
                      initial={{ opacity: 0 }}
                      animate={{ opacity: 0.2 }}
                      transition={{ delay: 1 + i * 0.1 }}
                      className="absolute inset-0 pointer-events-none"
                    >
                      <svg width="100%" height="100%" className="absolute inset-0">
                         <line 
                           x1="50%" y1="50%" 
                           x2={`${50 + Math.cos((i / config.clusterSize) * Math.PI * 2 - Math.PI / 2) * 40}%`} 
                           y2={`${50 + Math.sin((i / config.clusterSize) * Math.PI * 2 - Math.PI / 2) * 40}%`} 
                           stroke="#4f46e5" strokeWidth="1"
                         />
                      </svg>
                    </motion.div>
                  )
                })
              ))}
           </div>
        </div>

        {/* Footer Info Box */}
        <div className="p-4 bg-zinc-900/80 border-t border-zinc-800 backdrop-blur">
          <div className="flex items-start gap-3">
            <AlertCircle className="text-indigo-400 mt-0.5 shrink-0" size={18} />
            <div className="text-sm text-zinc-400">
              {isDeployed ? (
                <span><strong>MXE Admitted!</strong> Smart contracts deployed to Solana. The network has matched your requirements and <strong>{config.clusterSize} Arx nodes</strong> in the <strong>{config.region.toUpperCase()} region</strong> have opted in to execute tasks for this MXE.</span>
              ) : (
                <span>Configure the <strong>rules</strong> of your computing environment. Arx Nodes constantly scan the network for MXEs; they will automatically join your cluster if they meet your hardware requirements.</span>
              )}
            </div>
          </div>
        </div>
      </div>
      
    </div>
  );
}
