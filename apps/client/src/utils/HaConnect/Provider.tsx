import {
  createConnection,
  subscribeEntities,
  createLongLivedTokenAuth,
  HassEntities,
  getStates,
  Connection,
} from "home-assistant-js-websocket";
import React from "react";
import { useStore } from "./hooks";

async function getConnection(websocket, auth_token) {
  if (import.meta.env.PROD) {
    const { auth, conn } = await window.top.hassConnection;
    return { connection: conn, auth: auth };
  }

  const auth = createLongLivedTokenAuth(websocket, auth_token);
  const connection = await createConnection({ auth });

  return {
    connection: connection,
    auth: auth,
  };
}

async function connect(websocket, auth_token) {
  const { connection } = await getConnection(websocket, auth_token);

  subscribeEntities(connection, (ent) => useStore.getState().setEntities(ent));
  const states = await getStates(connection);
  const initialEntities: HassEntities = {};
  states.forEach((state) => {
    initialEntities[state.entity_id] = state;
  });

  useStore.getState().setEntities(initialEntities);

  return connection;
}

let sharedConnection: Connection | undefined;

interface HomeAssistantProviderProps {
  websocket: string;
  token: string;
  children: React.ReactNode;
}

export function HomeAssistantProvider({
  websocket,
  token,
  children,
}: HomeAssistantProviderProps) {
  const { entities } = useStore();

  React.useEffect(() => {
    let canceled = false;
    const { setConnection } = useStore.getState();

    setConnection(undefined);

    if (sharedConnection) {
      setConnection(sharedConnection);
      return;
    }

    connect(websocket, token).then((conn) => {
      if (canceled) {
        conn.close();
        return conn;
      }

      sharedConnection = conn;
      useStore.getState().setConnection(conn);

      return conn;
    });

    return () => {
      canceled = true;
    };
  }, [websocket, token]);

  return <>{entities && children}</>;
}
