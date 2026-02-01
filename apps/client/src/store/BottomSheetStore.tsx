import { create } from "zustand";
import { IMoreInfoAction } from "@/types/";

interface BottomSheetState {
  isOpen: boolean;
  setIsOpen: (open: boolean) => void;
  maxHeight: number;
  setMaxHeight: (height: number) => void;
  openBottomSheet: (data: IMoreInfoAction) => void;
}

export const useBottomSheetStore = create<BottomSheetState>((set) => ({
  cardsNode: undefined,
  isOpen: false,
  maxHeight: 0.2 * window.innerHeight,
  openBottomSheet: () => {
    set({
      isOpen: true,
      maxHeight: 0.2 * window.innerHeight,
    });
  },
  setMaxHeight: (height) => {
    set({
      maxHeight: height * window.innerHeight,
    });
  },
  setIsOpen: (open) => {
    set({
      isOpen: open,
    });
  },
}));
