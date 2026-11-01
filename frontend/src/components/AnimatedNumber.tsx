import React, { useEffect } from "react";
import { animate, motion, useMotionValue, useTransform } from "framer-motion";

/** Counts smoothly from its previous value to `value`. */
const AnimatedNumber: React.FC<{ value: number }> = ({ value }) => {
  const motionValue = useMotionValue(0);
  const rounded = useTransform(motionValue, (v) => Math.round(v));

  useEffect(() => {
    const controls = animate(motionValue, value, { duration: 0.7, ease: "easeOut" });
    return () => controls.stop();
  }, [motionValue, value]);

  return <motion.span>{rounded}</motion.span>;
};

export default AnimatedNumber;
