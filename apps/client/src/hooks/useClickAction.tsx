import { useRef, useCallback, useEffect } from "react";
import { IAction } from "@/types";

export const DefaultAction = (entity_id: string) => {
  return {
    action: "call-service",
    service: `${entity_id.split(".")[0] || "light"}.toggle`,
    target: {
      entity_id: entity_id,
    },
  } as IAction;
};

/* eslint-disable react-refresh/only-export-components */
export const useClickAction = ({
  onSingleClick,
  onDoubleClick,
  onHold,
  doubleTapMs = 300,
  holdMs = 600,
  moveThreshold = 10,
}) => {
  const lastTap = useRef(0);
  const singleTimer = useRef(null);
  const holdTimer = useRef(null);
  const didHold = useRef(false);

  const touchStartPosition = useRef({ x: 0, y: 0 });
  const isScrolling = useRef(false);

  const clearTimers = () => {
    if (singleTimer.current) clearTimeout(singleTimer.current);
    if (holdTimer.current) clearTimeout(holdTimer.current);
  };

  useEffect(() => {
    return clearTimers;
  }, []);

  const onPointerDown = useCallback(
    (e) => {
      e.stopPropagation();

      didHold.current = false;
      isScrolling.current = false;

      touchStartPosition.current = {
        x: e.clientX,
        y: e.clientY,
      };

      holdTimer.current = setTimeout(() => {
        if (!isScrolling.current) {
          didHold.current = true;
          onHold?.();
        }
      }, holdMs);
    },
    [onHold, holdMs],
  );

  const onPointerMove = useCallback(
    (e) => {
      const current = { x: e.clientX, y: e.clientY };
      const dx = Math.abs(current.x - touchStartPosition.current.x);
      const dy = Math.abs(current.y - touchStartPosition.current.y);

      if (dx > moveThreshold || dy > moveThreshold) {
        isScrolling.current = true;
        clearTimeout(holdTimer.current);
      }
    },
    [moveThreshold],
  );

  const onPointerUp = useCallback(
    (e) => {
      e.stopPropagation();
      clearTimeout(holdTimer.current);
      if (didHold.current || isScrolling.current) return;

      const now = Date.now();
      const sinceLastTap = now - lastTap.current;

      if (sinceLastTap > 0 && sinceLastTap < doubleTapMs) {
        clearTimeout(singleTimer.current);
        lastTap.current = 0;
        onDoubleClick?.();
      } else {
        lastTap.current = now;
        singleTimer.current = setTimeout(() => {
          onSingleClick?.();
        }, doubleTapMs);
      }
    },
    [onSingleClick, onDoubleClick, doubleTapMs],
  );

  const cancelAction = useCallback(() => {
    if (holdTimer.current) clearTimeout(holdTimer.current);
  }, []);

  return {
    onPointerDown,
    onPointerMove,
    onPointerUp,
    onPointerCancel: cancelAction,
    onPointerLeave: cancelAction,
    onClick: (e) => e.stopPropagation(),
  };
};
