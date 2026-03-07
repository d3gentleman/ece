import { motion } from 'framer-motion';

interface ConnectionProps {
  startX: number;
  startY: number;
  endX: number;
  endY: number;
  active?: boolean;
}

export function Connection({ startX, startY, endX, endY, active = false }: ConnectionProps) {
  return (
    <svg className="absolute inset-0 w-full h-full pointer-events-none" style={{ zIndex: -1 }}>
      <motion.line
        x1={startX}
        y1={startY}
        x2={endX}
        y2={endY}
        stroke={active ? '#6366f1' : '#3f3f46'} // indigo-500 : zinc-700
        strokeWidth={2}
        initial={{ pathLength: 0 }}
        animate={{ pathLength: 1 }}
        transition={{ duration: 0.5 }}
      />
    </svg>
  );
}
