import { useCallback } from "react";

export type HapticType =
  | "success"
  | "warning"
  | "failure"
  | "light"
  | "medium"
  | "heavy"
  | "selection";

export const useHapticFeedback = () => {
  const vibrate = useCallback((type: HapticType) => {
    if (import.meta.env.PROD) {
      window.top.document.querySelector("home-assistant").dispatchEvent(
        new CustomEvent("haptic", {
          detail: type,
          bubbles: true,
          composed: true,
        }),
      );
    }
  }, []);

  return { vibrate };
};
