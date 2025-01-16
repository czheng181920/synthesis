// for the purposes of this assignment, we don't need to use server-side rendering. this will let us use framer-motion asap
'use client';

import { useEffect, useRef, useState } from 'react';
import ControlPanel from './ControlPanel/ControlPanel';
import Stack from './Widget/Stack';
import Label from './Widget/Label';

export default function Home() {
  const divRef = useRef<HTMLDivElement>(null);
  const [gap, setGap] = useState(1);
  const [numLeftBoxes, setNumLeftBoxes] = useState(5);
  const [numRightBoxes, setNumRightBoxes] = useState(10);
  const [boxHeight, setBoxHeight] = useState(30);
  const [widgetHeight, setWidgetHeight] = useState(0);
  const [interactiveMode, setInteractiveMode] = useState('addRemove'); // addRemove, compare modes
  const [isInputMode, setIsInputMode] = useState(false); //false when it is just a label, true when it is an input

  // Create a ResizeObserver to recalculate the gap based off of the height of the widget
  useEffect(() => {
    const widget = divRef.current;
    if (!widget) return;

    const observer = new ResizeObserver((entries) => {
      for (const entry of entries) {
        setWidgetHeight(entry.contentRect.height);
      }
    });

    observer.observe(widget);

    return () => {
      observer.unobserve(widget);
    };
  }, [divRef]);

  // Recalculate the gap and box height when the widget height changes
  useEffect(() => {
    const boxHeight = Math.min((widgetHeight - 100) / 12, 80);
    setBoxHeight(boxHeight);
    setGap(
      Math.floor(widgetHeight / Math.max(numLeftBoxes, numRightBoxes)) -
        boxHeight
    );
  }, [widgetHeight, numLeftBoxes, numRightBoxes]);

  // increment the number of boxes in the stack. can specify if its the
  // left or right stack. also can specify if you wan tto increment or decrement
  function incrementBox(
    left: boolean,
    increment: boolean,
    isDragging: boolean = false
  ) {
    if (increment && isDragging) return;
    if (left) {
      if (increment && numLeftBoxes === 10) return;
      if (!increment && numLeftBoxes === 0) return;
      setNumLeftBoxes((prev) => (increment ? prev + 1 : prev - 1));
    } else {
      if (increment && numRightBoxes === 10) return;
      if (!increment && numRightBoxes === 0) return;
      setNumRightBoxes((prev) => (increment ? prev + 1 : prev - 1));
    }
  }

  return (
    <div
      className=" grid 
                  h-screen w-screen

                  /* Vertical layout on small screens */
                  grid-rows-[2fr_1fr]

                  /* Horizontal layout on medium+ screens */
                  md:grid-cols-[2fr_1fr] md:grid-rows-none
                "
    >
      {/* Widget */}
      <div
        className="relative w-full h-full bg-gray-100"
        ref={divRef}
        style={{ paddingTop: boxHeight, paddingBottom: boxHeight }}
      >
        <div className="absolute top-1/2 left-1/3 -translate-x-1/2 -translate-y-1/2 bg-gray-300 h-full">
          <div className="w-full" style={{ height: '95%' }}>
            <Stack
              left={true}
              gap={gap}
              numBoxes={numLeftBoxes}
              boxHeight={boxHeight}
              incrementBox={incrementBox}
            />
          </div>
          <div className="w-full" style={{ height: '5%' }}>
            <Label
              text={numLeftBoxes}
              input={setNumLeftBoxes}
              inputMode={isInputMode}
            />
          </div>
        </div>
        <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 bg-gray-300 flex  items-center justify-center">
          =
        </div>
        <div className="absolute top-1/2 right-1/3 translate-x-1/2 -translate-y-1/2 bg-gray-300 h-full ">
          <div className="w-full" style={{ height: '95%' }}>
            <Stack
              left={false}
              gap={gap}
              numBoxes={numRightBoxes}
              boxHeight={boxHeight}
              incrementBox={incrementBox}
            />
          </div>
          <div className="w-full" style={{ height: '5%' }}>
            <Label
              text={numRightBoxes}
              input={setNumRightBoxes}
              inputMode={isInputMode}
            />
          </div>
        </div>
      </div>

      {/* Control Panel */}
      <ControlPanel />
    </div>
  );
}
