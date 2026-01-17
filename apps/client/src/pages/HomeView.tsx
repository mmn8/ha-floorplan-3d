import { BottomSheetContainer } from "@/components/BottomSheet";

import { Canvas } from "@react-three/fiber";
import Scene from "@/renderer/Scene";
import useIsMobile from "@/hooks/useIsMobile";
import { NoMobile } from "@/components/NoMobile";
import { useCurrentRoom } from "@/hooks";
import Camera from "@/renderer/Camera";
import { ScanEye } from "lucide-react";

const Button = ({ onClick, children }) => {
  return (
    <button
      onClick={onClick}
      style={{
        zIndex: 10,
        top: 20,
        left: 20,
        padding: "0.5rem 1rem",
        fontSize: "1rem",
        color: "white",
      }}
    >
      {children}
    </button>
  );
};

export default function HomeView() {
  const isMobile = useIsMobile();
  const { setIsPreview, isPreview } = useCurrentRoom();

  if (!isMobile && !(import.meta.env.DEV ?? false)) {
    return <NoMobile />;
  }

  return (
    <>
      <div className="absolute z-10 right-0 flex">
        <Button
          onClick={() => {
            setIsPreview(!isPreview);
          }}
        >
          <ScanEye size={34} />
        </Button>
      </div>
      <div className="flex flex-col h-screen bg-gray-100 overscroll-none">
        <div className="flex-1 flex items-center justify-center  z-0">
          <div className="canvas-container  bg-[rgb(17,17,17)] w-screen h-screen touch-none">
            <Canvas
              gl={{ antialias: false }}
              dpr={[1, 1.5]}
              camera={{
                fov: 45,
                near: 0.1,
                far: 100,
                position: [10, 15, 20],
              }}
            >
              <Camera />
              <Scene />
            </Canvas>
          </div>
        </div>
        <BottomSheetContainer />
      </div>
    </>
  );
}
