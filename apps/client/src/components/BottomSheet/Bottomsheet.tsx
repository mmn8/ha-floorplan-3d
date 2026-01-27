import React, { useRef, useEffect, useState, useEffectEvent } from "react";
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
import { useUI } from "@/hooks/useUI";
import { renderCard } from "@/renderer/Components";
import { ErrorList } from "@/components/ErrorList";
import ErrorBoundary from "@/utils/3DErrorBoundary";
import { useErrorStore, ErrorType } from "@/store/ErrorStore";
import { IUISchema, ISceneIcon } from "@/types";
import { DynamicIcon } from "lucide-react/dynamic";

function calculateConstraints(targetRef) {
  const rect = targetRef.current.getBoundingClientRect();
  return {
    top: 0.25 * window.innerHeight,
    bottom: window.innerHeight - (rect.bottom - rect.top) - 48,
  };
}
export const BottomSheetContainer = () => {
  const { isOpen, setIsOpen } = useBottomSheetStore();
  const { currentRoom } = useCurrentRoom();
  const { addError } = useErrorStore();
  const room = useRoom(currentRoom);
  const cardsData = useUI(room?.ui?.path);

  const y = useMotionValue(0);
  const targetRef = useRef<HTMLDivElement>(null);
  const [constraints, setConstraints] = React.useState({
    top: 0.25 * window.innerHeight,
    bottom: 0,
  });

  const onOpen = useEffectEvent(() => {
    if (constraints.bottom === 0) return;
    animate(y, isOpen ? constraints.top : constraints.bottom, {
      type: "spring",
      stiffness: 380,
      damping: 50,
      mass: 0.9,
    });
  });

  useEffect(() => {
    if (!targetRef.current) return;

    const newConstraints = calculateConstraints(targetRef);
    setConstraints(newConstraints);
    y.set(newConstraints.bottom);
  }, [y]);

  useEffect(() => {
    onOpen();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [isOpen]);

  const handleDragEnd = (_, info: PanInfo) => {
    const isOpening = info.delta.y < 0;
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
        sceneData={cardsData?.data?.cards?.[0].scenes ?? []}
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
          {cardsData?.data &&
            cardsData?.data?.cards?.map((card, index) => {
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
  sceneData: ISceneIcon[];
  children?: React.ReactNode;
}

interface SceneSelectProps {
  scenes: ISceneIcon[];
}

function Icon() {
  return (
    <div className="w-12 h-12 rounded-full items-center flex justify-center border-border border-1">
      <div className="flex text-text flex-col items-center text-xs">
        <div className="w-10  h-10 rounded-full flex justify-center items-center text-text border-[hsl(0,0%,30%)] border-0">
          <DynamicIcon name="tv-minimal-play" size={26} className="stroke-1 " />
        </div>

        {/* <p className="mt-[-4px]">TV</p> */}
      </div>
    </div>
  );
}

function SceneSelect({ scenes }: SceneSelectProps) {
  return (
    <>
      <div className="h-14 w-screen flex justify-center gap-20 pl-4 pr-4 mt-2">
        {scenes.map((scene, index) => {
          return <Icon key={index} {...scene} />;
        })}
      </div>
    </>
  );
}

const BottomSheetView = ({
  y,
  constraints,
  onDragEnd,
  targetRef,
  sceneData,
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
            className={`h-28 bottom-0  w-screen absolute z-10  rounded-t-xl   text-text flex items-center justify-center bg-dark  pointer-events-auto flex-col `}
          >
            <SceneSelect scenes={sceneData} />
            <RoomSelector />
          </div>
        </div>
      </div>
    </>
  );
};
