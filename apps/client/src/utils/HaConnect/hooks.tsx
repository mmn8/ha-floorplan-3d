import {
  HassEntities,
  callService,
  Connection,
} from "home-assistant-js-websocket";
import { create } from "zustand";

interface ConnectionStore {
  connection: Connection;
  entities: HassEntities;
  setEntities: (ent) => void;
  setConnection: (con) => void;
}

export const useStore = create<ConnectionStore>((set) => ({
  connection: undefined,
  data: [],
  entities: undefined,
  setEntities: (ent) => set(() => ({ entities: ent })),
  setConnection: (con) => set(() => ({ connection: con })),
}));

export function useEntity(id: string) {
  return useStore((state) => state.entities[id]);
}

export function useHass() {
  const { connection, entities } = useStore();
  return {
    connection: connection,
    callService: (domain, service, target) => {
      callService(connection, domain, service, target);
    },
    entities: entities,
  };
}
