import { motion } from 'framer-motion';

interface ClusterBoundaryProps {
  x: number;
  y: number;
  width: number;
  height: number;
  label: string;
}

export function ClusterBoundary({ x, y, width, height, label }: ClusterBoundaryProps) {
  return (
    <motion.div
      className="absolute border border-indigo-500/30 bg-indigo-500/5 rounded-3xl"
      initial={{ x, y, width, height, opacity: 0 }}
      animate={{ x, y, width, height, opacity: 1 }}
      style={{ zIndex: -2 }}
    >
      <div className="absolute -top-6 left-4 text-xs font-semibold text-indigo-400">
        {label}
      </div>
    </motion.div>
  );
}
