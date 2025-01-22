import { motion } from 'framer-motion';
import { useEffect, useState } from 'react';

const Line = ({
  div1Ref,
  div2Ref,
  interactiveMode,
  visible,
  alignLines,
  alignShape,
  top,
  widgetRef,
}: {
  div1Ref: React.RefObject<HTMLDivElement | null>;
  div2Ref: React.RefObject<HTMLDivElement | null>;
  interactiveMode: string;
  visible: boolean;
  top: boolean; // true if the line is the top line
  alignLines?: boolean; // Optional flag to signal when to align the lines
  alignShape?: string; // Optional prop to align the endpoint of the line to a  < > or = shape
  widgetRef: React.RefObject<HTMLDivElement | null>;
}) => {
  const [x1, setX1] = useState(0);
  const [y1, setY1] = useState(0);
  const [x2, setX2] = useState(0);
  const [y2, setY2] = useState(0);

  const updateLineCoordinates = () => {
    if (div1Ref.current && div2Ref.current) {
      const rect1 = div1Ref.current.getBoundingClientRect();
      const rect2 = div2Ref.current.getBoundingClientRect();

      const x1 = rect1.left + rect1.width / 2;
      let y1 = rect1.top + rect1.height / 2;
      const x2 = rect2.left + rect2.width / 2;
      let y2 = rect2.top + rect2.height / 2;

      if (alignLines && widgetRef && widgetRef.current) {
        const widgetRect = widgetRef.current.getBoundingClientRect();

        if (top) {
          y1 = (widgetRect.height / 12) * 5;
          y2 = (widgetRect.height / 12) * 5;
        }
        if (!top) {
          y1 = (widgetRect.height / 12) * 7;
          y2 = (widgetRect.height / 12) * 7;
        }
        if (alignShape === '<') {
          y1 = widgetRect.height / 2;
        }
        if (alignShape === '>') {
          y2 = widgetRect.height / 2;
        }
      }
      setX1(x1);
      setY1(y1);
      setX2(x2);
      setY2(y2);
    }
  };

  useEffect(() => {
    updateLineCoordinates();
    // Update line positions on window resize.
    window.addEventListener('resize', updateLineCoordinates);
    return () => {
      window.removeEventListener('resize', updateLineCoordinates);
    };
  }, [alignLines, alignShape, visible, interactiveMode]);

  // need to change it back when not align lines

  return (
    <motion.div
      className="absolute inset-0 pointer-events-none w-full h-full"
      initial={{ opacity: 0 }}
      exit={{ opacity: 0 }}
      animate={
        visible && interactiveMode === 'compare'
          ? { opacity: 1 }
          : { opacity: 0 }
      }
      transition={{ duration: 0.5 }}
    >
      <svg className="absolute inset-0 pointer-events-none w-full h-full">
        <motion.line
          animate={{ x1, y1, x2, y2 }}
          stroke="rgba(183,244,239,255)"
          strokeWidth={20}
          transition={{ duration: 0.5 }}
          strokeLinecap="round"
        />
        <motion.line
          animate={{ x1, y1, x2, y2 }}
          stroke="white"
          strokeWidth={10}
          transition={{ duration: 0.5 }}
          strokeLinecap="round"
        />
      </svg>
    </motion.div>
  );
};
export default Line;
