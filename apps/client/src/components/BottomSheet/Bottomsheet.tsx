import React, { useRef, useEffect, useState, useEffectEvent } from "react";
import { useSwipeable } from "react-swipeable";
import { RoomSelector } from "@/components/RoomSelector";
import {
  motion,
  useMotionValue,
  animate,
  MotionValue,
  AnimatePresence,
  PanInfo,
} from "framer-motion";
import { useBottomSheetStore } from "@/store";
import { useCurrentRoom, useRoom } from "@/hooks";
import { useUI } from "@/hooks/useUI";
import { renderCard } from "@/renderer/Components";
import { ErrorList } from "@/components/ErrorList/ErrorList";
import ErrorBoundary from "@/utils/3DErrorBoundary";
import { useErrorStore, ErrorType } from "@/store/ErrorStore";
import { ISceneIcon } from "@/types";
import { DynamicIcon, IconName } from "lucide-react/dynamic";
import { useClickAction } from "@/hooks/useClickAction";
import { useEvaluateAction } from "@/utils/EvaluateAction";
import { useHapticFeedback } from "@/hooks/useHapticFeedback";

function calculateConstraints(targetRef) {
  const rect = targetRef.current.getBoundingClientRect();
  return {
    top: 0.25 * window.innerHeight,
    bottom: window.innerHeight - (rect.bottom - rect.top) - 40,
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
        sceneData={cardsData?.data?.scenes ?? []}
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

function Icon({
  icon,
  tap_action,
  double_tap_action,
  hold_action,
  title,
}: ISceneIcon) {
  const { evaluateAction } = useEvaluateAction();

  const clickHandlers = useClickAction({
    onSingleClick: () => {
      evaluateAction(tap_action);
    },
    onDoubleClick: () => {
      evaluateAction(double_tap_action);
    },
    onHold: () => evaluateAction(hold_action),
  });

  return (
    <div className="items-center flex flex-col text-text " {...clickHandlers}>
      <div className="w-12 h-12 rounded-full items-center flex justify-center border-border border-1 flex-shrink-0">
        <DynamicIcon name={icon as IconName} size={28} className="stroke-1 " />
      </div>
    </div>
  );
}

function SceneSelect({ scenes }: SceneSelectProps) {
  if (!(scenes.length > 0)) {
    return <p>No quick action scenes configured</p>;
  }

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

/// Store room selector state else where so it doesnt show loading anim
const BottomSheetView = ({
  y,
  constraints,
  onDragEnd,
  targetRef,
  sceneData,
  children,
}: BottomSheetViewProps) => {
  const [open, setOpen] = useState(false);

  const { vibrate } = useHapticFeedback();

  const handlers = useSwipeable({
    onSwipedDown: () => {
      setOpen(!open);
      vibrate("light");
    },
    onSwipedUp: () => {
      setOpen(!open);
      vibrate("light");
    },
    trackMouse: true,
  });

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
            className={`h-20 bottom-0  w-screen absolute z-10  rounded-t-xl   text-text flex items-center justify-center bg-dark  pointer-events-auto flex-col `}
          >
            <div {...handlers}>
              {/* <RoomSelector /> */}
              <AnimatePresence mode="wait">
                <motion.div
                  key={open ? 0 : 1}
                  initial={{ y: -40, opacity: 0 }}
                  animate={{ y: 0, opacity: 1 }}
                  exit={{ y: 40, opacity: 0 }}
                  transition={{ duration: 0.1, ease: "easeInOut" }}
                >
                  {!open ? (
                    <RoomSelector />
                  ) : (
                    <SceneSelect scenes={sceneData} />
                  )}
                </motion.div>
              </AnimatePresence>
            </div>
          </div>
        </div>
      </div>
    </>
  );
};
