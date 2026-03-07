'use client';

import { ReactNode } from 'react';

interface VisualizationCanvasProps {
  children: ReactNode;
  width?: number;
  height?: number;
}

export function VisualizationCanvas({ children, width = 800, height = 600 }: VisualizationCanvasProps) {
  return (
    <div 
      className="relative overflow-hidden bg-zinc-950 border border-zinc-800 rounded-xl"
      style={{ width: '100%', height: height }}
    >
      {/* 
        The canvas acts as a coordinate system (0,0 at top left).
        Nodes and clusters are positioned absolutely within this container.
      */}
      {children}
    </div>
  );
}
