// there are four compare zones in the widget

import { motion } from 'framer-motion';
interface CompareZoneProps {
  x: number;
  y: number;
  active: boolean;
  boxHeight: number;
  lastClickedX: number;
  lastClickedY: number;
  setLastClicked: (lastClicked: number[]) => void;
  interactiveMode: string;
  ref: React.RefObject<HTMLDivElement | null>;
  dragStart: (e: React.MouseEvent<HTMLDivElement, MouseEvent>) => void;
  isDragging: boolean;
}
// [x,y] represents its position in the widget ([0,0] top left, [0,1] top right, [1,0] bottom left, [1,1] bottom right)
export default function CompareZone({
  x,
  y,
  active,
  boxHeight,
  lastClickedX,
  lastClickedY,
  setLastClicked,
  interactiveMode,
  ref,
  dragStart,
  isDragging,
}: CompareZoneProps) {
  const clicked: boolean = lastClickedX === x && lastClickedY === y;
  //opaque means that this compare zone is already connected to another compare zone
  const opaque = active || clicked;

  const handleClick = () => {
    if (opaque) {
      //opaque means that this compare zone is already connected to another compare zone
      setLastClicked([-1, -1]);
      return;
    }
    if (isDragging) {
      // dont do anything if we are dragging
      setLastClicked([-1, -1]);
      return;
    }
    setLastClicked([x, y]);
  };

  const variants = {
    hidden: { opacity: 0 },
    inactive: { opacity: 0.5 },
    active: { opacity: 1 },
  };

  return (
    <>
      {interactiveMode === 'compare' && (
        <motion.div
          initial="hidden"
          animate={opaque ? 'active' : 'inactive'}
          exit="hidden"
          variants={variants}
          transition={{ duration: 0.25 }}
          style={{
            height: `${boxHeight}px`,
            width: `${boxHeight}px`,
            background:
              'radial-gradient(circle, rgba(183,244,239,.9) 0%, rgba(183,244,239,0) 75%, rgba(183,244,239,1) 100%)',
            borderRadius: '50%',
          }}
          onClick={handleClick}
          ref={ref}
          onMouseDown={active ? undefined : dragStart}
        ></motion.div>
      )}
    </>
  );
}
