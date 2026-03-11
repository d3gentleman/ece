'use client';

import React, { useState } from 'react';
import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { useProgressStore } from '@/state/progressStore';
import { Zap, Code, LayoutDashboard, BrainCircuit, Activity, Pickaxe, Book, ChevronDown, Rocket, Lightbulb, GraduationCap, Globe } from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';
import clsx from 'clsx';

const navItems = [
  { href: '/', label: 'Home', icon: LayoutDashboard },
  {
    label: 'Learn',
    icon: GraduationCap,
    sublinks: [
      { href: '/lesson', label: 'Interactive Lesson', description: 'Start here: Foundational concepts', icon: Book },
      { href: '/visualizer', label: 'MPC Visualizer', description: 'See how secret sharing works', icon: BrainCircuit },
      { href: '/architecture', label: 'Architecture Explorer', description: 'Nodes, clusters, and defenses', icon: Activity },
      { href: '/mxe-builder', label: 'MXE Builder', description: 'Configure custom execution environments', icon: Code },
      { href: '/staking', label: 'Staking Simulator', description: 'Node activation and rewards', icon: Pickaxe },
      { href: '/mempool', label: 'Mempool Race', description: 'Priority fees and execution', icon: Zap },
      { href: '/glossary', label: 'Glossary', description: 'Core definitions and terms', icon: Book },
    ]
  },
  {
    label: 'Ecosystem',
    icon: Globe,
    sublinks: [
      { href: '/ecosystem/projects', label: 'Projects', description: 'Real platforms building on Arcium', icon: Rocket },
      { href: '/ecosystem/use-cases', label: 'Use Cases', description: 'How encrypted compute transforms industries', icon: Lightbulb },
    ]
  }
];

export function Header() {
  const pathname = usePathname();
  const { xp, level } = useProgressStore();
  const [activeDropdown, setActiveDropdown] = useState<string | null>(null);

  return (
    <header className="sticky top-0 z-50 w-full border-b border-zinc-800 bg-black/80 backdrop-blur-md">
      <div className="mx-auto flex h-16 max-w-7xl items-center justify-between px-4 sm:px-6 lg:px-8">
        <div className="flex items-center gap-8">
          <Link href="/" className="flex items-center gap-2">
            <span className="text-xl font-bold tracking-tight text-white">Arcium<span className="text-indigo-500">Edu</span></span>
          </Link>
          
          <nav className="hidden md:flex items-center h-full">
            {navItems.map((item) => {
              if (item.sublinks) {
                const isActive = item.sublinks.some(sub => pathname.startsWith(sub.href));
                const isOpen = activeDropdown === item.label;

                return (
                  <div
                    key={item.label}
                    className="relative h-full flex items-center px-1"
                    onMouseEnter={() => setActiveDropdown(item.label)}
                    onMouseLeave={() => setActiveDropdown(null)}
                  >
                    <button
                      className={clsx(
                        "flex items-center gap-1.5 rounded-md px-3 py-2 text-sm font-medium transition-colors",
                        isActive || isOpen
                          ? "text-white"
                          : "text-zinc-400 hover:text-white"
                      )}
                    >
                      {item.label}
                      <ChevronDown className={clsx("h-3.5 w-3.5 transition-transform duration-200", isOpen && "rotate-180")} />
                    </button>

                    <AnimatePresence>
                      {isOpen && (
                        <motion.div
                          initial={{ opacity: 0, y: 10, scale: 0.95 }}
                          animate={{ opacity: 1, y: 0, scale: 1 }}
                          exit={{ opacity: 0, y: 5, scale: 0.95 }}
                          transition={{ duration: 0.2, ease: "easeOut" }}
                          className="absolute top-full left-0 mt-1 w-[400px] rounded-xl border border-zinc-800 bg-zinc-950/95 backdrop-blur-xl p-3 shadow-2xl"
                        >
                          <div className="grid grid-cols-1 gap-1">
                            {item.sublinks.map((sublink) => {
                              const SubIcon = sublink.icon;
                              const isSubActive = pathname === sublink.href;
                              return (
                                <Link
                                  key={sublink.href}
                                  href={sublink.href}
                                  onClick={() => setActiveDropdown(null)}
                                  className={clsx(
                                    "flex items-start gap-3 rounded-lg p-3 transition-colors",
                                    isSubActive
                                      ? "bg-indigo-500/10"
                                      : "hover:bg-zinc-800/50"
                                  )}
                                >
                                  <div className={clsx(
                                    "mt-0.5 flex h-8 w-8 shrink-0 items-center justify-center rounded-md border",
                                    isSubActive
                                      ? "border-indigo-500/30 bg-indigo-500/20 text-indigo-400"
                                      : "border-zinc-800 bg-zinc-900 text-zinc-400"
                                  )}>
                                    <SubIcon className="h-4 w-4" />
                                  </div>
                                  <div>
                                    <div className={clsx("font-medium text-sm", isSubActive ? "text-indigo-400" : "text-white")}>
                                      {sublink.label}
                                    </div>
                                    <div className="text-xs text-zinc-500 mt-0.5">
                                      {sublink.description}
                                    </div>
                                  </div>
                                </Link>
                              );
                            })}
                          </div>
                        </motion.div>
                      )}
                    </AnimatePresence>
                  </div>
                );
              }

              // Normal flat link
              const isFlatActive = pathname === item.href;
              return (
                <div key={item.href} className="px-1 h-full flex items-center">
                  <Link
                    href={item.href}
                    className={clsx(
                      "flex items-center gap-1.5 rounded-md px-3 py-2 text-sm font-medium transition-colors",
                      isFlatActive
                        ? "text-white"
                        : "text-zinc-400 hover:text-white"
                    )}
                  >
                    {item.label}
                  </Link>
                </div>
              );
            })}
          </nav>
        </div>

        <div className="flex items-center gap-4">
          <div className="flex flex-col items-end">
             <div className="flex items-center gap-2">
               <span className="text-xs font-semibold text-zinc-500 uppercase tracking-wider">Lvl {level}</span>
               <span className="text-sm font-bold text-indigo-400">{xp} XP</span>
             </div>
             <div className="h-1.5 w-24 bg-zinc-800 rounded-full overflow-hidden mt-1">
               <div 
                  className="h-full bg-indigo-500 transition-all duration-500 ease-out" 
                  style={{ width: `${(xp % 500) / 5}%` }} 
               />
             </div>
          </div>
        </div>
      </div>
    </header>
  );
}
