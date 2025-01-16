import {
  animate,
  motion,
  PanInfo,
  useMotionValue,
  useTransform,
} from 'framer-motion';
import { useRef, useState } from 'react';

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
  // const startPosition = useRef<{ x: number; y: number }>({ x: 0, y: 0 });
  // const [pendingDelete, setPendingDelete] = useState(false);

  // // beyond this threshold, the box will be deleted
  // const DELETION_THRESHOLD = 100;

  // const handleDragStart = (event: PointerEvent, info: PanInfo) => {
  //   setDragging(true);
  //   // Capture the initial pointer location
  //   startPosition.current = { x: info.point.x, y: info.point.y };
  // };

  // const handleDrag = (event: PointerEvent, info: PanInfo) => {
  //   // current dragged location
  //   const { x, y } = info.point;
  //   const startX = startPosition.current.x;
  //   const startY = startPosition.current.y;

  //   // calc distance from start position
  //   const dist = Math.sqrt((x - startX) ** 2 + (y - startY) ** 2);
  //   if (dist > DELETION_THRESHOLD) {
  //     // change deletion state
  //     setPendingDelete(true);
  //   } else {
  //     // dont delete
  //     setPendingDelete(false);
  //   }
  // };

  // const handleDragEnd = () => {
  //   setDragging(false);
  //   if (pendingDelete) {
  //     incrementBox(left, false);
  //   }
  // };

  const x = useMotionValue(0);
  const y = useMotionValue(0);

  const [isPastThreshold, setIsPastThreshold] = useState(false);
  const THRESHOLD = 100;

  const handleDrag = (_: PointerEvent, info: PanInfo) => {
    // info.offset = how far the pointer has moved *relative to the drag start*
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
    } else {
      // Animate the box back to (0, 0)
      animate(x, 0, { type: 'spring', stiffness: 50 });
      animate(y, 0, { type: 'spring', stiffness: 50 });
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
    ></motion.div>
  );
}

export default Box;
