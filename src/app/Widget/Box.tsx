import { motion, PanInfo, useMotionValue } from 'framer-motion';
import { useState } from 'react';
// import IceCube from './ice-cube.svg'; // SVG file
import Image from 'next/image';
function Box({
  left,
  boxHeight,
  setDragging,
  incrementBox,
  interactiveMode,
  index,
}: {
  left: boolean;
  boxHeight: number;
  setDragging: (drag: boolean) => void;
  incrementBox: (left: boolean, increment: boolean, isDragging: false) => void;
  interactiveMode: string;
  index: number;
}) {
  const x = useMotionValue(0);
  const y = useMotionValue(0);

  const [isPastThreshold, setIsPastThreshold] = useState(false);
  const THRESHOLD = boxHeight;

  const handleDrag = (_: PointerEvent, info: PanInfo) => {
    const { x: dx, y: dy } = info.offset;
    const distance = Math.sqrt(dx * dx + dy * dy);
    setIsPastThreshold(distance > THRESHOLD);
  };

  const handleDragStart = () => {
    setDragging(true);
  };

  const handleDragEnd = () => {
    setDragging(false);
    if (isPastThreshold) {
      console.log('incrementing box');
      incrementBox(left, false, false);
      x.stop();
      y.stop();
      x.set(0);
      y.set(0);
    }

    // Reset threshold check once it snaps back
    setIsPastThreshold(false);
  };

  return (
    <motion.div
      className="block relative"
      style={{
        height: `${boxHeight}px`,
        width: `${boxHeight}px`,
      }}
    >
      <motion.div
        className="absolute"
        style={{
          top: '50%',
          left: '50%',
          transform: 'translate(-50%, -50%)',
          zIndex: 10 - index,
          width: `${boxHeight * 1.75}px`,
          height: `${boxHeight * 1.75}px`,
          userSelect: 'none',
          cursor: interactiveMode === 'addRemove' ? 'grab' : 'auto',
          opacity: isPastThreshold ? 0.5 : 1,
        }}
      >
        <motion.div
          style={{
            width: `${boxHeight * 1.5}px`,
            height: `${boxHeight * 1.5}px`,
            x,
            y,
          }}
          drag={interactiveMode === 'addRemove' ? true : false}
          onDrag={handleDrag}
          onDragStart={handleDragStart}
          onDragEnd={handleDragEnd}
          dragSnapToOrigin={true}
        >
          <Image
            src={'/ice-cube.svg'}
            alt="Ice Cube"
            fill
            style={{ pointerEvents: 'none' }}
          />
        </motion.div>
      </motion.div>
    </motion.div>
  );
}

export default Box;
