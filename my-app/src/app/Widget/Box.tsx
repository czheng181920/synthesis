import {
  motion,
  PanInfo,
  useMotionValue,
} from 'framer-motion';
import { useState } from 'react';

function Box({
  left,
  boxHeight,
  setDragging,
  incrementBox,
}: {
  left: boolean;
  boxHeight: number;
  setDragging: (drag: boolean) => void;
  incrementBox: (left: boolean, increment: boolean, isDragging: false) => void;
}) {
  const x = useMotionValue(0);
  const y = useMotionValue(0);

  const [isPastThreshold, setIsPastThreshold] = useState(false);
  const THRESHOLD = boxHeight * 2;

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
      className="block bg-blue-300"
      style={{
        height: `${boxHeight}px`,
        width: `${boxHeight}px`,
        x,
        y,
        opacity: isPastThreshold ? 0.5 : 1,
        cursor: 'grab',
        userSelect: 'none',
      }}
      drag
      onDrag={handleDrag}
      onDragStart={handleDragStart}
      onDragEnd={handleDragEnd}
      dragSnapToOrigin={true}
    ></motion.div>
  );
}

export default Box;
