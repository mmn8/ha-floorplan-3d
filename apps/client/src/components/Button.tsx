import { motion } from "framer-motion";
import React from "react";

function Spinner() {
  return (
    <div className="w-screen h-screen flex items-center justify-center flex-col">
      <motion.div
        className="spinner  w-10 h-10 rounded-full border-b-text border-2 border-light"
        animate={{ rotate: 360 }}
        transition={{
          duration: 0.9,
          repeat: Infinity,
          ease: "linear",
        }}
      />
    </div>
  );
}

interface ProgressButtonProps {
  onClick: React.MouseEventHandler<HTMLButtonElement>;
  children?: React.ReactNode;
  loading: boolean;
  containerVariants?;
}

export const ProgressButton = ({
  onClick,
  children = "click",
  loading,
  containerVariants,
}: ProgressButtonProps) => {
  return (
    <motion.button
      onClick={onClick}
      disabled={loading}
      variants={containerVariants}
      animate={loading ? "loading" : "button"}
      initial="button"
      className="bg-normal items-center flex justify-center overflow-hidden border-1 border-border"
    >
      <motion.span
        animate={loading ? "loading" : "button"}
        style={{ position: "relative", zIndex: 10 }}
      >
        {loading ? <Spinner /> : children}
      </motion.span>
    </motion.button>
  );
};
