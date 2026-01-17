import { create } from "zustand";
import { IHomeConfig, IBuilding, Floorplan, IMoreInfoAction } from "@/types/";

export interface HomeState {
  home: IHomeConfig | null;
  buildings: IBuilding[];
  floorplans: Floorplan[];
  setHome: (_home: IHomeConfig, _buildings: IBuilding[], _floorplans) => void;
  reload: () => void;
  setReloadFunction: (_func: () => void) => void;
}

export const useHomeStore = create<HomeState>((set) => ({
  home: null,
  buildings: [],
  floorplans: [],
  setHome: (_home, _buildings, _floorplans) => {
    set({
      home: _home,
      buildings: _buildings,
      floorplans: _floorplans,
    });
  },
  reload: null,
  setReloadFunction: (_func) => {
    set({
      reload: _func,
    });
  },
}));

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
