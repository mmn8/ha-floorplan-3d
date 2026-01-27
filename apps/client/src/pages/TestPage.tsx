import { useSwipeable } from "react-swipeable";
import { useState } from "react";
import { motion } from "framer-motion";

function SwipeBox() {
  const [open, setOpen] = useState(false);
  const [swiped, setSwiped] = useState("");

  const handlers = useSwipeable({
    onSwipedDown: () => setOpen(true),
    onSwipedUp: () => setOpen(false),
    trackMouse: true,
  });

  return (
    <>
      <div {...handlers}>
        {/* Phorming box */}
        <motion.div
          initial={false}
          animate={{
            height: open ? 220 : 100,
            scaleY: open ? 1 : 1,
            opacity: open ? 1 : 1,
            translateY: open ? ((220 - 100) / 2) * -1 : 0,
          }}
          transition={{
            height: { duration: 0.35, ease: "easeInOut" },
            translateY: { duration: 0.35, ease: "easeInOut" },
            scaleY: { type: "spring", stiffness: 140, damping: 18 },
            opacity: { duration: 0.2 },
          }}
          style={{
            transformOrigin: "top",
            overflow: "hidden",
            background: "#0f0f0f",
            borderRadius: 16,
          }}
          className="w-screen"
        >
          <div style={{ padding: 20, color: "#fff" }}>Phorming content 🌱</div>
        </motion.div>
      </div>
    </>
  );
}
export default function Test() {
  return (
    <>
      <div className="h-28 bottom-0  w-screen fixed z-10  rounded-t-xl   text-text flex items-center justify-center pointer-events-auto flex-col bg-yellow-500 ">
        <SwipeBox />
      </div>
    </>
  );
}
