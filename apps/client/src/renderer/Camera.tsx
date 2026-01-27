import { useSpring, animated } from "@react-spring/three";
import { useEffect, useRef, useCallback, useEffectEvent } from "react";
import { PerspectiveCamera } from "@react-three/drei";
import * as THREE from "three";
import { useHomeData } from "@/hooks";
import { useCurrentRoom } from "@/hooks";
import type { Point, FRoom } from "@/types";
import { XYCameraControls } from "./XYCameraControls";

const AnimatedCamera = animated(PerspectiveCamera);

const getRoomCenterAndZoom = (points: THREE.Vector3[], cameraFov = 45) => {
  const box = new THREE.Box3();
  points.forEach((point) => box.expandByPoint(point));

  const center = box.getCenter(new THREE.Vector3());
  const size = box.getSize(new THREE.Vector3());
  const maxDim = Math.max(size.x, size.y, size.z);

  const fov = cameraFov * (Math.PI / 180);
  const offset = 1.25;
  const cameraZ = Math.abs(maxDim / 2 / Math.tan(fov / 2)) * offset;

  return { x: center.x, z: cameraZ, y: center.y };
};

export default function Camera() {
  const { currentRoom, isPreview } = useCurrentRoom();
  const { data } = useHomeData();
  const camera = useRef<THREE.PerspectiveCamera>(null);

  const currentlyFocusedRoomPoints = () => {
    for (const index in data.buildings) {
      const room = data.buildings[index].floorplan.room.find(
        (room) => room.id === currentRoom,
      );

      return room.point.map(
        (p: Point) => new THREE.Vector3(p.x / 100, p.y / 100, 0),
      );
    }
  };

  const center = () => {
    const center = getRoomCenterAndZoom(currentlyFocusedRoomPoints());
    return [center.x, center.z + 5, center.y];
  };

  const [springs, api] = useSpring(() => ({
    position: undefined,
    config: {
      mass: 1,
      tension: 170,
      friction: 26,
    },
  }));

  const moveCamera = useCallback(
    (points: THREE.Vector3[]) => {
      const center = getRoomCenterAndZoom(points);

      camera.current.rotation.set(-Math.PI / 2, 0, 0);
      api.start({
        to: { position: [center.x, center.z + 5, center.y] },
      });
    },
    [api],
  );

  const onFocusChange = useEffectEvent(
    (currentRoom: string, isPreview: boolean) => {
      if (isPreview) {
        const floorplan = data?.buildings?.[0].floorplan;
        const points = floorplan.room.flatMap((d: FRoom) =>
          d.point.map((p: Point) => new THREE.Vector3(p.x / 100, p.y / 100, 0)),
        );

        moveCamera(points);
        return;
      }

      moveCamera(currentlyFocusedRoomPoints());
    },
  );

  useEffect(() => {
    onFocusChange(currentRoom, isPreview);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [currentRoom, isPreview]);

  return (
    <>
      <AnimatedCamera
        position={springs.position ?? center()}
        ref={camera}
        makeDefault
      />
      {isPreview && <XYCameraControls />}
    </>
  );
}
