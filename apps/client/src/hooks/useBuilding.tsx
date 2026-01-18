import { useMemo } from "react";
import { useHomeStore } from "@/store";
import type { IBuildingData, IRoom } from "@/types";

export function useBuilding(building: number): IBuildingData | undefined {
  const { home } = useHomeStore();
  return home.buildings[building];
}

export function useRooms(): IRoom[] {
  const { home } = useHomeStore();
  const buildings = home.buildings;

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
