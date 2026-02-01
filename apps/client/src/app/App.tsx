import React from "react";
import { Routes, Route } from "react-router";
import Home from "./Home";
import ErrorBoundary from "@/utils/3DErrorBoundary";

import Editor from "@/pages/EditorView";
import HomeView from "@/pages/HomeView";
import { HomeAssistantProvider } from "@/utils/HaConnect";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import Test from "@/pages/TestPage";
import { useEffect } from "react";

function calculateBaseIngress() {
  const parts = window.location.pathname.split("/");
  if (parts.length <= 4) return "";
  return "/api/hassio_ingress/" + parts[3] + "/";
}

function resolveWebsocketParams() {
  let websocket = "";
  let auth_token = "";
  if (import.meta.env.DEV) {
    websocket = import.meta.env.VITE_HA_API;
    auth_token = import.meta.env.VITE_HA_TOKEN;
  }

  if (import.meta.env.PROD) {
    websocket = "http://" + location.host;
  }

  return { websocket, auth_token };
}
const queryClient = new QueryClient();

const App: React.FC = () => {
  const basename = calculateBaseIngress();
  console.log(basename);

  const { websocket, auth_token } = resolveWebsocketParams();

  const addOverscrollTag = () => {
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    const targetWindow = window.top as any;

    targetWindow.document.documentElement.style.setProperty(
      "overscroll-behavior-y",
      "none",
      "important",
    );
  };

  const removeOverscrollTag = () => {
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    const targetWindow = window.top as any;

    targetWindow.document.documentElement.style.removeProperty(
      "overscroll-behavior-y",
    );
  };

  useEffect(() => {
    console.log("app use effect constructor running");
    addOverscrollTag();

    const visibilitChange = () => {
      console.log("Visibility change: ", document.visibilityState);
      if (document.visibilityState === "visible") {
        addOverscrollTag();
      } else if (document.visibilityState === "hidden") {
        removeOverscrollTag();
      }
    };

    document.addEventListener("visibilitychange", visibilitChange);

    //TODO: Remove listener
    return () => {
      console.log("App use effect deconsturctor running");
      removeOverscrollTag();
      document.removeEventListener("visibilitychange", visibilitChange);
    };
  }, []);

  return (
    <>
      <QueryClientProvider client={queryClient}>
        <ErrorBoundary
          onError={() => {}}
          fallback={
            <p>
              A fatal and unkown error has occured. Please check your
              configuration. There is also a good chance that the fault is not
              yours.
            </p>
          }
        >
          <Home>
            <HomeAssistantProvider websocket={websocket} token={auth_token}>
              <Routes>
                <Route path="/*" element={<HomeView />} />
                <Route path="/editor" element={<Editor />} />
                <Route path="/test" element={<Test />} />
              </Routes>
            </HomeAssistantProvider>
          </Home>
        </ErrorBoundary>
      </QueryClientProvider>
    </>
  );
};

export default App;
