import { useSwipeable } from "react-swipeable";
import { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";

function SwipeBox() {
  const [open, setOpen] = useState(false);
  const [swiped, setSwiped] = useState("");

  const handlers = useSwipeable({
    onSwipedDown: () => setOpen(!open),
    trackMouse: true,
  });
  const slides = ["Slide One", "Slide Two", "Slide Three"];

  return (
    <>
      <div {...handlers}>
        {/* Phorming box */}
        <AnimatePresence mode="wait">
          <motion.div
            key={open ? 0 : 1}
            initial={{ y: -40, opacity: 0 }}
            animate={{ y: 0, opacity: 1 }}
            exit={{ y: 40, opacity: 0 }}
            transition={{ duration: 0.1, ease: "easeInOut" }}
          >
            {slides[open ? 0 : 1]}
          </motion.div>
        </AnimatePresence>
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
