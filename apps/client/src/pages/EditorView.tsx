import { Canvas } from "@react-three/fiber";
import { OrbitControls, PerspectiveCamera, Grid } from "@react-three/drei";
import React, { useEffect, useMemo } from "react";
import { useState } from "react";
import Scene from "@/renderer/Scene";
import { useConfigStore } from "@/store";
import Toolbar from "@/components/Toolbar";
import ErrorList from "@/components/ErrorList";
import { useLoadHome } from "@/hooks/useLoadHome";
import { useHomeStore } from "@/store";
import { useErrorStore, ErrorType } from "@/store/ErrorStore";
import * as THREE from "three";
import { Point, FRoom } from "@/types";

const getRoomCenterAndZoom = (points: THREE.Vector3[], cameraFov = 45) => {
  const box = new THREE.Box3();
  points.forEach((point) => box.expandByPoint(point));

  const center = box.getCenter(new THREE.Vector3());
  const size = box.getSize(new THREE.Vector3());
  const maxDim = Math.max(size.x, size.y, size.z);

  const fov = cameraFov * (Math.PI / 180);
  const offset = 1.25;
  const cameraZ = Math.abs(maxDim / 2 / Math.tan(fov / 2)) * offset;

  return new THREE.Vector3(center.x, cameraZ, center.y);
};

export default function EditorView() {
  // const { reload } = useHomeStore();
  const { setEditorMode } = useConfigStore();
  const [lastRefreshed, setLastRefreshed] = useState(Date.now());
  const [elapsedSeconds, setElapsedSeconds] = useState(0);
  const { errors } = useErrorStore();
  const { home } = useHomeStore();

  const fetchHomeData = useLoadHome(
    () => {},
    () => {},
  );

  useEffect(() => {
    setEditorMode(true);
    fetchHomeData();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  const reload = React.useCallback(() => {
    fetchHomeData();
    setLastRefreshed(Date.now());
  }, [fetchHomeData]);

  useEffect(() => {
    let intervalId = null;

    if (setLastRefreshed) {
      intervalId = setInterval(() => {
        const now = Date.now();
        const differenceMs = now - lastRefreshed;

        const differenceSeconds = Math.floor(differenceMs / 1000);

        setElapsedSeconds(differenceSeconds);
      }, 1000);
    }

    return () => {
      if (intervalId) {
        clearInterval(intervalId);
      }
    };
  }, [lastRefreshed]);

  useEffect(() => {
    const loc = window.location;
    const wsProtocol = loc.protocol === "https:" ? "wss" : "ws";

    let wsUrl = `${wsProtocol}://${loc.host}/api/events`;
    if (import.meta.env.PROD) {
      const parts = window.location.pathname.split("/");
      wsUrl =
        (location.protocol === "https:" ? "wss://" : "ws://") +
        loc.host +
        "/api/hassio_ingress/" +
        parts[3] +
        "/api/events";
    }

    const ws = new WebSocket(wsUrl);

    ws.onmessage = (event) => {
      reload();
      console.log("Received:", event.data);
    };

    return () => {
      ws.close();
    };
  }, []);

  const center = useMemo(() => {
    const floorplan = home.buildings[0].floorplan;

    const points = floorplan.room.flatMap((d: FRoom) =>
      d.point.map((p: Point) => new THREE.Vector3(p.x / 100, p.y / 100, 0)),
    );

    return getRoomCenterAndZoom(points);
  }, [home.buildings]);

  if (errors.filter((e) => e.type === ErrorType.FATAL).length != 0) {
    return <ErrorList isOpen={true} closeModal={undefined} />;
  }

  //TODO: Some way to view what the is the room id
  return (
    <>
      <Toolbar date={elapsedSeconds} manualReload={reload} />
      <div className="bg-black   h-screen w-screen">
        <Canvas
          shadows
          dpr={[1, 2]}
          camera={{
            fov: 45,
            near: 0.1,
            far: 1000000,
            position: [10, 15, 20],
          }}
        >
          {/* <Stats /> */}
          <Grid
            renderOrder={-1}
            position={[0, 0.1, 0]}
            infiniteGrid
            cellSize={1}
            cellColor="white"
            sectionColor="white"
          />

          <PerspectiveCamera position={center} makeDefault />
          <OrbitControls
          // target={new THREE.Vector3(center.x, 0, center.z - 3)}
          />
          <ambientLight intensity={3} color="#f4fffa" />
          <Scene />
        </Canvas>
      </div>
    </>
  );
}
