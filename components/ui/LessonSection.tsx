'use client';

import React, { ReactNode } from 'react';
import { LucideIcon } from 'lucide-react';

interface LessonSectionProps {
  number: number;
  title: string;
  children: ReactNode;
  icon?: LucideIcon;
  accentColor?: string;
}

export function LessonSection({ 
  number, 
  title, 
  children, 
  icon: Icon,
  accentColor = 'indigo' 
}: LessonSectionProps) {
  const colorMap: Record<string, { text: string; bg: string; border: string; num: string }> = {
    indigo: { text: 'text-indigo-400', bg: 'bg-indigo-500/10', border: 'border-indigo-500/20', num: 'text-indigo-500' },
    blue: { text: 'text-blue-400', bg: 'bg-blue-500/10', border: 'border-blue-500/20', num: 'text-blue-500' },
    emerald: { text: 'text-emerald-400', bg: 'bg-emerald-500/10', border: 'border-emerald-500/20', num: 'text-emerald-500' },
    amber: { text: 'text-amber-400', bg: 'bg-amber-500/10', border: 'border-amber-500/20', num: 'text-amber-500' },
    purple: { text: 'text-purple-400', bg: 'bg-purple-500/10', border: 'border-purple-500/20', num: 'text-purple-500' },
    rose: { text: 'text-rose-400', bg: 'bg-rose-500/10', border: 'border-rose-500/20', num: 'text-rose-500' },
  };

  const colors = colorMap[accentColor] || colorMap.indigo;

  return (
    <div className={`relative flex gap-6 md:gap-8`}>
      {/* Number Column */}
      <div className="flex flex-col items-center shrink-0">
        <div className={`w-10 h-10 rounded-full ${colors.bg} border ${colors.border} flex items-center justify-center font-bold text-sm ${colors.num}`}>
          {number}
        </div>
        <div className={`flex-1 w-px ${colors.bg} mt-3`} />
      </div>

      {/* Content Column */}
      <div className="pb-12 min-w-0">
        <div className="flex items-center gap-3 mb-4">
          {Icon && <Icon className={`w-5 h-5 ${colors.text}`} />}
          <h3 className="text-xl font-bold text-zinc-100">{title}</h3>
        </div>
        <div className="text-[15px] text-zinc-400 leading-relaxed space-y-4">
          {children}
        </div>
      </div>
    </div>
  );
}

interface LessonContainerProps {
  title: string;
  subtitle: string;
  accentColor?: string;
  icon?: LucideIcon;
  children: ReactNode;
}

export function LessonContainer({ title, subtitle, icon: Icon, accentColor = 'indigo', children }: LessonContainerProps) {
  const colorMap: Record<string, { text: string; bg: string; border: string; badge: string; glow: string }> = {
    indigo: { text: 'text-indigo-400', bg: 'bg-indigo-500/10', border: 'border-indigo-500/20', badge: 'text-indigo-400', glow: 'bg-indigo-500/10' },
    blue: { text: 'text-blue-400', bg: 'bg-blue-500/10', border: 'border-blue-500/20', badge: 'text-blue-400', glow: 'bg-blue-500/10' },
    emerald: { text: 'text-emerald-400', bg: 'bg-emerald-500/10', border: 'border-emerald-500/20', badge: 'text-emerald-400', glow: 'bg-emerald-500/10' },
    amber: { text: 'text-amber-400', bg: 'bg-amber-500/10', border: 'border-amber-500/20', badge: 'text-amber-400', glow: 'bg-amber-500/10' },
    purple: { text: 'text-purple-400', bg: 'bg-purple-500/10', border: 'border-purple-500/20', badge: 'text-purple-400', glow: 'bg-purple-500/10' },
    rose: { text: 'text-rose-400', bg: 'bg-rose-500/10', border: 'border-rose-500/20', badge: 'text-rose-400', glow: 'bg-rose-500/10' },
  };

  const colors = colorMap[accentColor] || colorMap.indigo;

  return (
    <div className="w-full relative mb-16">
      <div className={`absolute -top-20 left-1/2 -translate-x-1/2 w-80 h-80 ${colors.glow} blur-[120px] rounded-full pointer-events-none -z-10`} />

      {/* Header */}
      <div className="text-center mb-16">
        <div className={`inline-flex items-center gap-2 px-3 py-1 rounded-full bg-zinc-900 border border-zinc-800 mb-6 text-xs font-bold uppercase tracking-widest ${colors.badge}`}>
          {Icon && <Icon className="w-3 h-3" />}
          Lesson
        </div>
        <h1 className="text-4xl md:text-5xl font-extrabold tracking-tight mb-4 bg-gradient-to-b from-white to-zinc-500 bg-clip-text text-transparent">
          {title}
        </h1>
        <p className="text-lg text-zinc-400 max-w-2xl mx-auto leading-relaxed">
          {subtitle}
        </p>
      </div>

      {/* Lesson Sections */}
      <div className="max-w-3xl mx-auto">
        {children}
      </div>
    </div>
  );
}

interface SimulatorBridgeProps {
  accentColor?: string;
}

export function SimulatorBridge({ accentColor = 'indigo' }: SimulatorBridgeProps) {
  const colorMap: Record<string, { bg: string; border: string; text: string; glow: string }> = {
    indigo: { bg: 'bg-indigo-500/5', border: 'border-indigo-500/30', text: 'text-indigo-400', glow: 'from-indigo-500/20' },
    blue: { bg: 'bg-blue-500/5', border: 'border-blue-500/30', text: 'text-blue-400', glow: 'from-blue-500/20' },
    emerald: { bg: 'bg-emerald-500/5', border: 'border-emerald-500/30', text: 'text-emerald-400', glow: 'from-emerald-500/20' },
    amber: { bg: 'bg-amber-500/5', border: 'border-amber-500/30', text: 'text-amber-400', glow: 'from-amber-500/20' },
    purple: { bg: 'bg-purple-500/5', border: 'border-purple-500/30', text: 'text-purple-400', glow: 'from-purple-500/20' },
    rose: { bg: 'bg-rose-500/5', border: 'border-rose-500/30', text: 'text-rose-400', glow: 'from-rose-500/20' },
  };

  const colors = colorMap[accentColor] || colorMap.indigo;

  return (
    <div className={`w-full text-center py-10 mb-12 rounded-2xl ${colors.bg} border ${colors.border} relative overflow-hidden`}>
      <div className={`absolute inset-0 bg-gradient-to-br ${colors.glow} to-transparent opacity-50`} />
      <div className="relative z-10">
        <p className={`text-sm font-bold uppercase tracking-widest ${colors.text} mb-2`}>Lesson Complete</p>
        <h3 className="text-2xl font-bold text-white">Now try it yourself ↓</h3>
      </div>
    </div>
  );
}
