import React, { useRef, useEffect, useState } from "react";
import { RoomSelector } from "@/components/RoomSelector";
import {
  motion,
  useMotionValue,
  animate,
  MotionValue,
  PanInfo,
} from "framer-motion";
import { useBottomSheetStore } from "@/store";
import { useCurrentRoom, useRoom } from "@/hooks";
import { loadUI } from "@/hooks/useUI";
import { renderCard } from "@/renderer/Components";
import { ErrorList } from "@/components/ErrorList";
import ErrorBoundary from "@/utils/3DErrorBoundary";
import { useErrorStore, ErrorType } from "@/store/ErrorStore";
import { IUISchema } from "@/types";

function calculateConstraints(targetRef) {
  const rect = targetRef.current.getBoundingClientRect();
  return {
    top: 0.25 * window.innerHeight,
    bottom: window.innerHeight - (rect.bottom - rect.top) - 40,
  };
}
export const BottomSheetContainer = () => {
  const { isOpen, setIsOpen, maxHeight } = useBottomSheetStore();
  const { currentRoom } = useCurrentRoom();
  const { addError } = useErrorStore();
  const room = useRoom(currentRoom);

  const y = useMotionValue(0);
  const targetRef = useRef<HTMLDivElement>(null);
  const [cardsData, setCardsData] = useState<IUISchema>(null);
  const [constraints, setConstraints] = React.useState({ top: 0, bottom: 0 });

  useEffect(() => {
    let isMounted = true;
    console.log(room);

    const load = async () => {
      if (!room?.ui?.path) {
        setCardsData(null);
        return;
      }
      const ui = await loadUI(room?.ui?.path);
      console.log("async running");
      if (isMounted && ui?.cards) setCardsData(ui);
    };

    load();

    return () => {
      isMounted = false;
    };
  }, [currentRoom]);

  useEffect(() => {
    if (!targetRef.current) return;

    const newConstraints = calculateConstraints(targetRef);
    setConstraints(newConstraints);
    y.set(newConstraints.bottom);
  }, [maxHeight, y]);

  useEffect(() => {
    animate(y, isOpen ? maxHeight : constraints.bottom, {
      type: "spring",
      stiffness: 300,
      damping: 30,
    });
  }, [isOpen, constraints, maxHeight, y]);

  const handleDragEnd = (_, info: PanInfo) => {
    const isOpening = info.point.y < maxHeight;
    setIsOpen(isOpening);
  };

  function onError(err) {
    addError({
      type: ErrorType.FATAL,
      title: "Error rendering card",
      description: String(err),
    });
  }

  return (
    <>
      <BottomSheetView
        y={y}
        constraints={constraints}
        onDragEnd={handleDragEnd}
        targetRef={targetRef}
      >
        <ErrorBoundary
          onError={onError}
          fallback={
            <div className="pl-5 mr-5">
              <ErrorList />
            </div>
          }
        >
          {cardsData &&
            cardsData.cards.map((card, index) => {
              const Comp = renderCard(card?.type);
              return Comp && <Comp key={`${card.type}-${index}`} {...card} />;
            })}
        </ErrorBoundary>
      </BottomSheetView>
    </>
  );
};

interface BottomSheetViewProps {
  y: MotionValue<number>;
  constraints: { top: number; bottom: number };
  onDragEnd: (_, info: PanInfo) => void;
  targetRef: React.Ref<HTMLDivElement>;
  children?: React.ReactNode;
}

const BottomSheetView = ({
  y,
  constraints,
  onDragEnd,
  targetRef,
  children,
}: BottomSheetViewProps) => {
  return (
    <>
      <div className="fixed bottom-0  flex items-center justify-center pointer-events-none inset-x-1">
        <div className="relative w-screen  h-screen overflow-hidden border-b rounded-xl pointer-events-none">
          <motion.div
            drag="y"
            dragDirectionLock
            dragConstraints={constraints}
            dragTransition={{ bounceStiffness: 500, bounceDamping: 15 }}
            dragElastic={0.2}
            onDragEnd={onDragEnd}
            style={{ y }}
            whileDrag={{ cursor: "grabbing" }}
            className="absolute inset-x-0  bg-dark h-screen rounded-xl shadow-2xl p-6 touch-none select-none cursor-grab active:cursor-grabbing pointer-events-auto "
          >
            <div className="w-full flex justify-center">
              <div className="w-16 h-1.5 bg-border mt-1 rounded-full cursor-grab" />
            </div>
            {children}
          </motion.div>
          <div
            ref={targetRef}
            className={`h-16 bottom-0  w-screen absolute z-10   text-text flex items-center justify-center bg-dark  pointer-events-auto  `}
          >
            <RoomSelector />
          </div>
        </div>
      </div>
    </>
  );
};
