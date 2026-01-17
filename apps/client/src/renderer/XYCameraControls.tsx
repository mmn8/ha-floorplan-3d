import { useEffect, useRef } from "react";
import { useThree } from "@react-three/fiber";
import * as THREE from "three";

const getPinchDistance = (touch1, touch2) => {
  const dx = touch1.clientX - touch2.clientX;
  const dy = touch1.clientY - touch2.clientY;
  return Math.sqrt(dx * dx + dy * dy);
};

export function XYCameraControls() {
  const { camera } = useThree();
  const isDragging = useRef(false);
  const isPinching = useRef(false);
  const lastTouch = useRef(new THREE.Vector2());
  const lastPinchDist = useRef(0);

  const PAN_SPEED = 0.03;
  const ZOOM_SPEED = 0.05;
  const MIN_ZOOM = 2;
  const MAX_ZOOM = 50;

  useEffect(() => {
    const handleTouchStart = (event) => {
      if (!event.touches) return;

      if (event.touches.length === 1) {
        isDragging.current = true;
        isPinching.current = false;
        const touch = event.touches[0];
        lastTouch.current.set(touch.clientX, touch.clientY);
      }

      if (event.touches.length === 2) {
        isDragging.current = false;
        isPinching.current = true;

        lastPinchDist.current = getPinchDistance(
          event.touches[0],
          event.touches[1],
        );
      }
    };

    const handleTouchMove = (event) => {
      if (!event.touches) return;

      if (event.touches.length === 1 && isDragging.current) {
        const touch = event.touches[0];
        const deltaX = touch.clientX - lastTouch.current.x;
        const deltaY = touch.clientY - lastTouch.current.y;

        camera.position.x -= deltaX * PAN_SPEED;
        camera.position.z -= deltaY * PAN_SPEED;

        lastTouch.current.set(touch.clientX, touch.clientY);
      }

      if (event.touches.length === 2 && isPinching.current) {
        const currentDist = getPinchDistance(
          event.touches[0],
          event.touches[1],
        );

        const deltaDist = currentDist - lastPinchDist.current;

        const newY = camera.position.y - deltaDist * ZOOM_SPEED;

        camera.position.y = Math.max(MIN_ZOOM, Math.min(MAX_ZOOM, newY));

        lastPinchDist.current = currentDist;
      }

      if (isDragging.current || isPinching.current) {
        event.preventDefault();
      }
    };

    const handleTouchEnd = (event) => {
      if (event.touches.length === 0) {
        isDragging.current = false;
        isPinching.current = false;
      }

      if (event.touches.length === 1) {
        isPinching.current = false;
        isDragging.current = true;
        lastTouch.current.set(
          event.touches[0].clientX,
          event.touches[0].clientY,
        );
      }
    };

    window.addEventListener("touchstart", handleTouchStart, { passive: false });
    window.addEventListener("touchmove", handleTouchMove, { passive: false });
    window.addEventListener("touchend", handleTouchEnd);

    return () => {
      window.removeEventListener("touchstart", handleTouchStart);
      window.removeEventListener("touchmove", handleTouchMove);
      window.removeEventListener("touchend", handleTouchEnd);
    };
  }, [camera]);

  return null;
}
