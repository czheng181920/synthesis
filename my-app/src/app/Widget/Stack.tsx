import { useState } from 'react';
import Box from './Box';
import { motion } from 'framer-motion';

interface StackProps {
  left: boolean;
  gap: number;
  numBoxes: number;
  boxHeight: number;
  incrementBox: (
    left: boolean,
    increment: boolean,
    isDragging: boolean
  ) => void;
}

export default function Stack({
  left,
  gap,
  numBoxes,
  boxHeight,
  incrementBox,
}: StackProps) {
  const [isDragging, setIsDragging] = useState(false);

  return (
    <motion.div
      className={`relative flex flex-col p-1 items-center justify-center w-full h-full bg-gray-500`}
      style={{ gap: `${gap}px`, transition: 'all 1s ease' }}
      onClick={() => incrementBox(left, true, isDragging)}
    >
      {Array.from({ length: numBoxes }).map((_, i) => (
        <Box
          key={i}
          left={left}
          boxHeight={boxHeight}
          setDragging={setIsDragging}
          incrementBox={incrementBox}
        />
      ))}
    </motion.div>
  );
}
