// for the purposes of this assignment, we don't need to use server-side rendering. this will let us use framer-motion asap
'use client';

import { RefObject, useEffect, useRef, useState } from 'react';
import ControlPanel from './ControlPanel/ControlPanel';
import Stack from './Widget/Stack';
import Label from './Widget/Label';
import CompareZone from './Widget/CompareZone';
import Line from './Widget/Line';
import { source } from 'framer-motion/client';
interface Coordinates {
  x: number;
  y: number;
}

export default function Home() {
  const divRef = useRef<HTMLDivElement>(null);
  const topLeftRef = useRef<HTMLDivElement>(null);
  const topRightRef = useRef<HTMLDivElement>(null);
  const bottomLeftRef = useRef<HTMLDivElement>(null);
  const bottomRightRef = useRef<HTMLDivElement>(null);
  const [gap, setGap] = useState(1);
  const [numLeftBoxes, setNumLeftBoxes] = useState(5);
  const [numRightBoxes, setNumRightBoxes] = useState(10);
  const [boxHeight, setBoxHeight] = useState(30);
  const [widgetHeight, setWidgetHeight] = useState(0);
  const [interactiveMode, setInteractiveMode] = useState('addRemove'); // addRemove, compare modes
  const [isInputMode, setIsInputMode] = useState(false); //false when it is just a label, true when it is an input

  const [lastClickedX, setLastClickedX] = useState(-1); // [x,y] position of the active compare zone, [-1,-1] if none are active
  const [lastClickedY, setLastClickedY] = useState(-1);
  const [isTopVisible, setIsTopVisible] = useState(false);
  const [isBottomVisible, setIsBottomVisible] = useState(false);
  const [isDragging, setIsDragging] = useState(false);
  const [sourceDiv, setSourceDiv] =
    useState<RefObject<HTMLDivElement | null> | null>(null);
  const [targetDiv, setTargetDiv] =
    useState<RefObject<HTMLDivElement | null> | null>(null);
  const [sourceCenter, setSourceCenter] = useState<Coordinates>({ x: 0, y: 0 });
  const [mousePos, setMousePos] = useState<Coordinates>({ x: 0, y: 0 });

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
      Math.floor(widgetHeight / (Math.max(numLeftBoxes, numRightBoxes) + 2)) -
        boxHeight
    );
  }, [widgetHeight, numLeftBoxes, numRightBoxes]);

  useEffect(() => {
    // prevent clicking from interfering with dragging
    if (isDragging === true) {
      setLastClickedX(-1);
      setLastClickedY(-1);
    }
  }, [isDragging]);

  useEffect(() => {
    window.addEventListener('mousemove', handleDrag);
    window.addEventListener('mouseup', handleDragEnd);
    return () => {
      window.removeEventListener('mousemove', handleDrag);
      window.removeEventListener('mouseup', handleDragEnd);
    };
  });

  const setDestinationDiv = () => {
    if (sourceDiv == topLeftRef) setTargetDiv(topRightRef);
    else if (sourceDiv == topRightRef) setTargetDiv(topLeftRef);
    else if (sourceDiv == bottomLeftRef) setTargetDiv(bottomRightRef);
    else if (sourceDiv == bottomRightRef) setTargetDiv(bottomLeftRef);
    console.log('nothing happened', topRightRef, sourceDiv);
  };

  const handleDragStart = (
    e: React.MouseEvent,
    divRef: RefObject<HTMLDivElement | null> | null
  ) => {
    e.preventDefault();
    if (divRef && divRef.current) {
      console.log('drag start');
      const rect = divRef.current.getBoundingClientRect();
      // Calculate center of the source div.
      const center = {
        x: rect.left + rect.width / 2,
        y: rect.top + rect.height / 2,
      };
      setSourceDiv(divRef);
      setSourceCenter(center);
      setIsDragging(false); // reset dragging state
    }
  };

  const isInDiv = (
    e: MouseEvent,
    divRef: RefObject<HTMLDivElement | null> | null
  ) => {
    if (divRef && divRef.current) {
      const rect = divRef.current.getBoundingClientRect();
      if (
        e.clientX >= rect.left &&
        e.clientX <= rect.right &&
        e.clientY >= rect.top &&
        e.clientY <= rect.bottom
      ) {
        return true;
      }
    }
    return false;
  };

  const handleDrag = (e: MouseEvent) => {
    if (sourceDiv === null) return; //means we havent started a drag from one of the compare zones
    if (isInDiv(e, sourceDiv)) return; //dont do anything if we are still in the source div
    console.log('dragging past div ');
    if (!isDragging) {
      setMousePos({ x: e.clientX, y: e.clientY });
      setDestinationDiv();
      setIsDragging(true); //prevents onclick function from firing
    }
    if (isDragging) {
      console.log('dragging for realz');
      setMousePos({ x: e.clientX, y: e.clientY });
      console.log('sourcecenter', sourceCenter);
      console.log('mousePos', mousePos);
    }
  };

  const handleDragEnd = (e: MouseEvent) => {
    setIsDragging(false);
    console.log('drag end');
    console.log('targetDiv', targetDiv);
    console.log('isintargetdiv', isInDiv(e, targetDiv));
    console.log('logging source div', topRightRef, sourceDiv, targetDiv);

    if (isInDiv(e, targetDiv)) {
      if (
        (sourceDiv === topLeftRef && targetDiv === topRightRef) ||
        (sourceDiv === topRightRef && targetDiv === topLeftRef)
      ) {
        setIsTopVisible(true);
      } else if (
        (sourceDiv === bottomLeftRef && targetDiv === bottomRightRef) ||
        (sourceDiv === bottomRightRef && targetDiv === bottomLeftRef)
      ) {
        setIsBottomVisible(true);
      }
    }
    //reset all drag state
    setSourceDiv(null);
    setSourceCenter({ x: 0, y: 0 });
    setMousePos({ x: 0, y: 0 });
    setIsDragging(false);
  };

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

  function setLastClicked(lastClicked: number[]) {
    console.log('lastClicked', lastClicked);
    //check for valid connection (same row but different column)
    if (lastClicked[0] === lastClickedX && lastClicked[1] !== lastClickedY) {
      if (lastClickedX === 0) {
        setIsTopVisible(true);
      } else {
        setIsBottomVisible(true);
      }
    }
    setLastClickedX(lastClicked[0]);
    setLastClickedY(lastClicked[1]);
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
          <div
            className="w-full flex flex-col items-center justify-center"
            style={{ height: '95%' }}
          >
            <CompareZone
              x={0}
              y={0}
              lastClickedX={lastClickedX}
              lastClickedY={lastClickedY}
              setLastClicked={setLastClicked}
              active={isTopVisible}
              boxHeight={boxHeight}
              interactiveMode={interactiveMode}
              ref={topLeftRef}
              dragStart={(e) => handleDragStart(e, topLeftRef)}
              isDragging={isDragging}
            />
            <Stack
              left={true}
              gap={gap}
              numBoxes={numLeftBoxes}
              boxHeight={boxHeight}
              incrementBox={incrementBox}
              interactiveMode={interactiveMode}
            />
            <CompareZone
              x={1}
              y={0}
              lastClickedX={lastClickedX}
              lastClickedY={lastClickedY}
              setLastClicked={setLastClicked}
              active={isBottomVisible}
              boxHeight={boxHeight}
              interactiveMode={interactiveMode}
              ref={bottomLeftRef}
              dragStart={(e) => handleDragStart(e, bottomLeftRef)}
              isDragging={isDragging}
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
          <div
            className="w-full flex flex-col items-center justify-center"
            style={{ height: '95%' }}
          >
            <CompareZone
              x={0}
              y={1}
              lastClickedX={lastClickedX}
              lastClickedY={lastClickedY}
              setLastClicked={setLastClicked}
              active={isTopVisible}
              boxHeight={boxHeight}
              interactiveMode={interactiveMode}
              ref={topRightRef}
              dragStart={(e) => handleDragStart(e, topRightRef)}
              isDragging={isDragging}
            />
            <Stack
              left={false}
              gap={gap}
              numBoxes={numRightBoxes}
              boxHeight={boxHeight}
              incrementBox={incrementBox}
              interactiveMode={interactiveMode}
            />
            <CompareZone
              x={1}
              y={1}
              lastClickedX={lastClickedX}
              lastClickedY={lastClickedY}
              setLastClicked={setLastClicked}
              active={isBottomVisible}
              boxHeight={boxHeight}
              interactiveMode={interactiveMode}
              ref={bottomRightRef}
              dragStart={(e) => handleDragStart(e, bottomRightRef)}
              isDragging={isDragging}
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
      <ControlPanel
        interactiveMode={interactiveMode}
        setInteractiveMode={setInteractiveMode}
        inputMode={isInputMode}
        setInputMode={setIsInputMode}
      />
      {/* Compare Lines */}
      {interactiveMode === 'compare' && (
        <Line
          div1Ref={topLeftRef}
          div2Ref={topRightRef}
          interactiveMode={interactiveMode}
          visible={isTopVisible}
        />
      )}{' '}
      {interactiveMode === 'compare' && (
        <Line
          div1Ref={bottomLeftRef}
          div2Ref={bottomRightRef}
          interactiveMode={interactiveMode}
          visible={isBottomVisible}
        />
      )}
      {isDragging && (
        <svg className="absolute inset-0 pointer-events-none w-full h-full">
          {/* while dragging, show a line from source center to current mouse position */}
          <line
            x1={sourceCenter.x}
            y1={sourceCenter.y}
            x2={mousePos.x}
            y2={mousePos.y}
            stroke="black"
            strokeWidth={2}
          />
        </svg>
      )}
    </div>
  );
}
