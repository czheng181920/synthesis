import { motion } from 'framer-motion';
import { useEffect, useState } from 'react';

interface Coordinates {
  x1: number;
  y1: number;
  x2: number;
  y2: number;
}

const Line = ({
  div1Ref,
  div2Ref,
  interactiveMode,
  visible,
}: {
  div1Ref: React.RefObject<HTMLDivElement | null>;
  div2Ref: React.RefObject<HTMLDivElement | null>;
  interactiveMode: string;
  visible: boolean;
}) => {
  const [lineCoords, setLineCoords] = useState<Coordinates>({
    x1: 0,
    y1: 0,
    x2: 0,
    y2: 0,
  });

  const updateLineCoordinates = () => {
    if (div1Ref.current && div2Ref.current) {
      const rect1 = div1Ref.current.getBoundingClientRect();
      const rect2 = div2Ref.current.getBoundingClientRect();

      const x1 = rect1.left + rect1.width / 2;
      const y1 = rect1.top + rect1.height / 2;
      const x2 = rect2.left + rect2.width / 2;
      const y2 = rect2.top + rect2.height / 2;

      setLineCoords({ x1, y1, x2, y2 });
    }
  };

  useEffect(() => {
    updateLineCoordinates();
    // Update line positions on window resize.
    window.addEventListener('resize', updateLineCoordinates);
    return () => {
      window.removeEventListener('resize', updateLineCoordinates);
    };
  }, []);
  const variants = {
    hidden: { opacity: 0 },
    active: { opacity: 1 },
  };
  return (
    <motion.div
      className="absolute inset-0 pointer-events-none w-full h-full"
      initial="hidden"
      animate={visible ? 'active' : 'hidden'}
      exit="hidden"
      variants={variants}
      transition={{ duration: 0.5 }}
    >
      <svg className="absolute inset-0 pointer-events-none w-full h-full">
        <line
          x1={lineCoords.x1}
          y1={lineCoords.y1}
          x2={lineCoords.x2}
          y2={lineCoords.y2}
          stroke="black"
          strokeWidth={2}
        />
      </svg>
    </motion.div>
  );
};
export default Line;
