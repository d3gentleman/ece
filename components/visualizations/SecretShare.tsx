import { motion } from 'framer-motion';

interface SecretShareProps {
  startX: number;
  startY: number;
  endX: number;
  endY: number;
  delay?: number;
}

export function SecretShare({ startX, startY, endX, endY, delay = 0 }: SecretShareProps) {
  return (
    <motion.div
      className="absolute w-3 h-3 bg-white rounded-full shadow-[0_0_10px_white]"
      initial={{ x: startX, y: startY, opacity: 0 }}
      animate={{ x: endX, y: endY, opacity: 1 }}
      transition={{
        duration: 1.5,
        ease: 'easeInOut',
        delay
      }}
      style={{ zIndex: 10 }}
    />
  );
}
