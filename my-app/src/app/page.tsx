// for the purposes of this assignment, we don't need to use server-side rendering. this will let us use framer-motion asap
'use client';

import { motion } from 'framer-motion';
import { useRef } from 'react';

export default function Home() {
  const constraintsRef = useRef(null);

  return (
    <motion.div ref={constraintsRef} className="w-48 h-48 bg-gray-300">
      <motion.div
        drag
        dragConstraints={constraintsRef}
        dragMomentum={false}
        className="w-4 h-4 bg-white"
      />
    </motion.div>
  );
}
