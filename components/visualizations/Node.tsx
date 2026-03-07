import { motion } from 'framer-motion';

interface NodeProps {
  id: string;
  x: number;
  y: number;
  status: 'idle' | 'computing' | 'offline';
  label: string;
}

export function Node({ id, x, y, status, label }: NodeProps) {
  const statusColors = {
    idle: 'bg-zinc-700',
    computing: 'bg-indigo-500',
    offline: 'bg-red-500/50',
  };

  return (
    <motion.div
      className={`absolute rounded-full flex items-center justify-center w-12 h-12 text-xs font-medium text-white shadow-lg ${statusColors[status]}`}
      initial={{ x, y, scale: 0 }}
      animate={{ x, y, scale: 1 }}
      transition={{ type: 'spring', stiffness: 300, damping: 20 }}
      aria-label={`Node ${label}`}
    >
      {label}
    </motion.div>
  );
}
