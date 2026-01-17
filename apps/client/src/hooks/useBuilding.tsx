import { useMemo } from "react";
import { useHomeStore } from "@/store";
import type { IBuilding, IRoom, Floorplan } from "@/types";

export function useBuilding(building: number): IBuilding | undefined {
  const { buildings } = useHomeStore();
  return buildings[building];
}

export function useFloorplan({
  floorplan_name,
}: IBuilding): Floorplan | undefined {
  const { floorplans } = useHomeStore();
  return floorplans[floorplan_name];
}
export function useRooms(): IRoom[] {
  const { buildings } = useHomeStore();
  return useMemo(() => {
    if (!buildings) return [];
    return buildings.flatMap((b) => {
      return b.rooms ?? [];
    });
  }, [buildings]);
}

export function useRoom(id: string): IRoom | undefined {
  const rooms = useRooms();

  const room = useMemo(() => rooms.find((r) => r.id === id), [rooms, id]);
  if (!room) return undefined;
  return { ...room };
}
