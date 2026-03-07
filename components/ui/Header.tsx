'use client';

import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { useProgressStore } from '@/state/progressStore';
import { Zap, Code, LayoutDashboard, BrainCircuit, Activity, Pickaxe } from 'lucide-react';
import clsx from 'clsx';

export function Header() {
  const pathname = usePathname();
  const { xp, level } = useProgressStore();

  const links = [
    { href: '/', label: 'Home', icon: LayoutDashboard },
    { href: '/visualizer', label: 'MPC', icon: BrainCircuit },
    { href: '/architecture', label: 'Architecture', icon: Activity },
    { href: '/mxe-builder', label: 'MXE Builder', icon: Code },
    { href: '/staking', label: 'Staking', icon: Pickaxe },
    { href: '/mempool', label: 'Mempool Race', icon: Zap },
  ];

  return (
    <header className="sticky top-0 z-50 w-full border-b border-zinc-800 bg-zinc-950/80 backdrop-blur-md">
      <div className="mx-auto flex h-16 max-w-7xl items-center justify-between px-4 sm:px-6 lg:px-8">
        <div className="flex items-center gap-8">
          <Link href="/" className="flex items-center gap-2">
            <span className="text-xl font-bold tracking-tight text-white">Arcium<span className="text-indigo-500">Edu</span></span>
          </Link>
          
          <nav className="hidden md:flex items-center gap-1">
            {links.map((link) => {
              const Icon = link.icon;
              const isActive = pathname === link.href || (link.href !== '/' && pathname.startsWith(link.href));
              
              return (
                <Link
                  key={link.href}
                  href={link.href}
                  className={clsx(
                    "flex items-center gap-2 rounded-md px-3 py-2 text-sm font-medium transition-colors",
                    isActive 
                      ? "bg-indigo-500/10 text-indigo-400" 
                      : "text-zinc-400 hover:bg-zinc-800/50 hover:text-white"
                  )}
                >
                  <Icon className="h-4 w-4" />
                  {link.label}
                </Link>
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
