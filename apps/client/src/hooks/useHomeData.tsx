import { useMemo } from "react";
import { useQuery, useQueries } from "@tanstack/react-query";
import { z } from "zod";
import YAML from "yaml";
import type {
  IHomeConfig,
  IBuilding,
  IHomeData,
  IBuildingData,
  IRoom,
} from "@/types";
import { XMLParser } from "fast-xml-parser";

// Reason for "building id" field is for future support for multiple buildings
export function useBuilding(building: number): IBuildingData | undefined {
  const { data } = useHomeData();
  return data?.buildings?.[building];
}

export function useRooms(): IRoom[] {
  const { data } = useHomeData();
  const buildings = data?.buildings;

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
interface AppConfig {
  configured: boolean;
}

async function fetchResource<T>(url: string, parser?): Promise<T> {
  const response = await fetch(url, { cache: "reload" });
  if (!response.ok) throw new Error(`HTTP error! status: ${response.status}`);
  const text = await response.text();
  return parser ? parser(text) : (JSON.parse(text) as T);
}

export function useAppConfig() {
  const appConfigQuery = useQuery({
    queryKey: ["config"],
    queryFn: () => fetchResource<AppConfig>("./api/configuration"),
  });

  return { ...appConfigQuery };
}

export function useHomeData() {
  const baseHomeConfigQuery = useQuery({
    queryKey: ["home"],
    queryFn: () => fetchResource<IHomeConfig>("./config/home.yml", YAML.parse),
  });

  const buildingList = baseHomeConfigQuery?.data?.buildings;
  const buildingFile = buildingList?.[0];

  const buildingQuery = useQuery({
    queryKey: ["building", buildingFile],
    queryFn: () =>
      fetchResource<IBuilding>(`./config/${buildingFile}`, YAML.parse),
    enabled: !!buildingList,
  });

  const floorplanName = buildingQuery?.data?.floorplan_name;

  const floorplanQuery = useQuery({
    queryKey: ["floorplan", floorplanName],
    queryFn: () =>
      fetchResource(`./config/${floorplanName}`, (text) => {
        const parser = new XMLParser({
          ignoreAttributes: false,
          attributeNamePrefix: "",
        });
        return parser.parse(text)?.home;
      }),
    enabled: !!floorplanName,
  });

  const isLoading =
    baseHomeConfigQuery.isLoading ||
    buildingQuery.isLoading ||
    floorplanQuery.isLoading;

  const isError =
    baseHomeConfigQuery.isError ||
    buildingQuery.isError ||
    floorplanQuery.isError;

  const buildingData = {
    title: buildingQuery?.data?.title,
    floorplan_name: buildingQuery?.data?.floorplan_name,
    floorplan: floorplanQuery?.data,
    rooms: buildingQuery?.data?.rooms,
    default_rooms: buildingQuery?.data?.default_rooms,
  } as IBuildingData;

  const homeData = {
    title: baseHomeConfigQuery?.data?.name,
    buildings: [buildingData],
  } as IHomeData;

  return {
    data: homeData,
    isLoading: isLoading,
    isError: isError,
    error:
      baseHomeConfigQuery.error || buildingQuery.error || floorplanQuery.error,
  };
}
