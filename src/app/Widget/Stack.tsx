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
  interactiveMode: string;
}

export default function Stack({
  left,
  gap,
  numBoxes,
  boxHeight,
  incrementBox,
  interactiveMode,
}: StackProps) {
  const [isDragging, setIsDragging] = useState(false);

  const onClick = (e: React.MouseEvent<HTMLDivElement>) => {
    if (isDragging) {
      e.stopPropagation();
    }
    if (interactiveMode === 'addRemove') {
      incrementBox(left, true, isDragging);
    }
  };

  return (
    <motion.div
      className={`relative flex flex-col p-1 items-center justify-center w-full`}
      style={{
        gap: `${gap}px`,
        transition: interactiveMode === 'compare' ? '0s' : 'all 2s ease',
      }}
      onClick={onClick}
    >
      {Array.from({ length: numBoxes }).map((_, i) => (
        <Box
          key={i}
          left={left}
          boxHeight={boxHeight}
          setDragging={setIsDragging}
          incrementBox={incrementBox}
          interactiveMode={interactiveMode}
          index={i}
        />
      ))}
    </motion.div>
  );
}
