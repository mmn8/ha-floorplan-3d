import React from "react";
import { Shape } from "three";
import * as THREE from "three";
import { useEvaluateAction } from "@/utils/EvaluateAction";
import { useRoom } from "@/hooks/";
import { useCurrentRoom } from "@/hooks";
import { useClickAction } from "@/hooks/useClickAction";
import { useHapticFeedback } from "@/hooks/useHapticFeedback";

export function RoomClickBox({ id, points }) {
  const { evaluateAction } = useEvaluateAction();
  const { vibrate } = useHapticFeedback();
  const roomConfig = useRoom(id);
  const { isPreview, setCurrentRoom } = useCurrentRoom();

  const randomColor = React.useMemo(() => {
    const colors = [
      "#e74c3c",
      "#3498db",
      "#2ecc71",
      "#9b59b6",
      "#f1c40f",
      "#1abc9c",
      "#e67e22",
      "#ecf0f1",
    ];

    const idx = Math.floor(Math.random() * colors.length);
    return colors[idx];
  }, []);

  const clickHandlers = useClickAction({
    onSingleClick: () => {
      console.log("clcking room");
      if (isPreview) {
        setCurrentRoom(id);
        vibrate("medium");
        return;
      }
      evaluateAction(roomConfig["tap_action"]);
    },
    onDoubleClick: () => {
      evaluateAction(roomConfig["double_tap_action"]);
    },
    onHold: () => {
      evaluateAction(roomConfig["hold_action"]);
    },
  });

  const geometry = React.useMemo(() => {
    const shape = new Shape();
    shape.moveTo(points[0].x / 100, points[0].y / 100);
    for (let i = 1; i < points.length; i++) {
      shape.lineTo(
        (points[i].x as number) / 100,
        (points[i].y as number) / 100,
      );
    }
    const extrudeSettings = {
      steps: 2,
      depth: -2.3,
      bevelEnabled: true,
      bevelThickness: 0.1,
      bevelSize: 0.1,
      bevelSegments: 1,
    };

    const geom = new THREE.ExtrudeGeometry(shape, extrudeSettings);
    geom.computeBoundingBox();
    geom.computeBoundingSphere();
    geom.computeVertexNormals();

    return geom;
  }, [points]);

  return (
    <>
      <mesh
        geometry={geometry}
        rotation={[Math.PI / 2, 0, 0]}
        {...clickHandlers}
      >
        <meshBasicMaterial
          color={randomColor}
          transparent={true}
          opacity={0}
          alphaTest={0}
          side={THREE.DoubleSide}
        />
      </mesh>
    </>
  );
}
