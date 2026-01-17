import { useSpring, animated } from "@react-spring/three";
import { useEffect, useRef, useCallback } from "react";
import { PerspectiveCamera } from "@react-three/drei";
import * as THREE from "three";
import { useHomeStore } from "@/store";
import { useCurrentRoom } from "@/hooks";
import type { Point, FRoom } from "@/types";
import { XYCameraControls } from "./XYCameraControls";

const AnimatedCamera = animated(PerspectiveCamera);

export default function Camera() {
  const { currentRoom, isPreview } = useCurrentRoom();
  const { floorplans } = useHomeStore();
  const camera = useRef<THREE.PerspectiveCamera>(null);

  const [springs, api] = useSpring(
    () => ({
      position: undefined,
      config: { mass: 1, tension: 10000, friction: 1000, velocity: [0, 0, 0] },
    }),
    [],
  );

  const moveCamera = useCallback((points: THREE.Vector3[]) => {
    const center = getRoomCenterAndZoom(points);

    camera.current.rotation.set(-Math.PI / 2, 0, 0);
    api.start({
      to: { position: [center.x, center.z + 5, center.y] },
    });
  }, []);

  const getRoomCenterAndZoom = useCallback((points: THREE.Vector3[]) => {
    const box = new THREE.Box3();
    points.forEach((point) => box.expandByPoint(point));

    const center = box.getCenter(new THREE.Vector3());
    const size = box.getSize(new THREE.Vector3());
    const maxDim = Math.max(size.x, size.y, size.z);

    const fov = camera.current.fov * (Math.PI / 180);
    const offset = 1.25;
    const cameraZ = Math.abs(maxDim / 2 / Math.tan(fov / 2)) * offset;

    return { x: center.x, z: cameraZ, y: center.y };
  }, []);

  useEffect(() => {
    if (isPreview) {
      const floorplan = floorplans[Object.keys(floorplans)[0]];
      const points = floorplan.room.flatMap((d: FRoom) =>
        d.point.map((p: Point) => new THREE.Vector3(p.x / 100, p.y / 100, 0)),
      );

      moveCamera(points);
      return;
    }

    for (const floorplan in Object.keys(floorplans)) {
      const index = Object.keys(floorplans)[floorplan];
      const room = floorplans[index]?.room.find(
        (b: FRoom) => b.id === currentRoom,
      );

      const points = room.point.map(
        (p: Point) => new THREE.Vector3(p.x / 100, p.y / 100, 0),
      );

      moveCamera(points);
      break;
    }
  }, [currentRoom, isPreview]);

  return (
    <>
      <AnimatedCamera position={springs.position} ref={camera} makeDefault />
      {isPreview && <XYCameraControls />}
    </>
  );
}
