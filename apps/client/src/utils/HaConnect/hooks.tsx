import {
  HassEntities,
  callService,
  Connection,
  HassUser,
} from "home-assistant-js-websocket";
import { create } from "zustand";

interface ConnectionStore {
  connection: Connection;
  entities: HassEntities;
  user: HassUser;
  setEntities: (ent) => void;
  setUser: (usr) => void;
  setConnection: (con) => void;
}

export const useStore = create<ConnectionStore>((set) => ({
  connection: undefined,
  data: [],
  entities: undefined,
  user: undefined,
  setEntities: (ent) => set(() => ({ entities: ent })),
  setUser: (usr) => set(() => ({ user: usr })),
  setConnection: (con) => set(() => ({ connection: con })),
}));

export function useEntity(id: string) {
  return useStore((state) => state.entities[id]);
}

export function useHassUser() {
  return useStore((state) => state.user);
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
