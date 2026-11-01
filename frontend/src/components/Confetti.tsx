import React, { useEffect, useMemo } from "react";
import { Box } from "@chakra-ui/react";
import { MotionBox } from "../utils/motion";

const COLORS = ["#FFD369", "#FF6B6B", "#4ECDC4", "#5B8DEF", "#A66CFF"];

/** A short burst of confetti, shown when every task is completed. */
const Confetti: React.FC<{ onDone: () => void }> = ({ onDone }) => {
  const pieces = useMemo(
    () =>
      Array.from({ length: 36 }, (_, i) => ({
        id: i,
        x: (Math.random() - 0.5) * 560,
        peak: -(140 + Math.random() * 260),
        rotate: Math.random() * 720 - 360,
        size: 6 + Math.random() * 7,
        delay: Math.random() * 0.12,
        color: COLORS[i % COLORS.length],
        round: i % 3 === 0,
      })),
    []
  );

  useEffect(() => {
    const timer = setTimeout(onDone, 2200);
    return () => clearTimeout(timer);
  }, [onDone]);

  return (
    <Box
      aria-hidden
      pos="fixed"
      inset={0}
      pointerEvents="none"
      zIndex="toast"
      display="flex"
      alignItems="center"
      justifyContent="center"
    >
      {pieces.map((p) => (
        <MotionBox
          key={p.id}
          pos="absolute"
          w={`${p.size}px`}
          h={`${p.size * (p.round ? 1 : 1.6)}px`}
          rounded={p.round ? "full" : "2px"}
          bg={p.color}
          initial={{ x: 0, y: 0, opacity: 1, rotate: 0 }}
          animate={{
            x: p.x,
            y: [0, p.peak, p.peak + 460],
            opacity: [1, 1, 0],
            rotate: p.rotate,
          }}
          transition={{ duration: 1.7, ease: "easeOut", delay: p.delay }}
        />
      ))}
    </Box>
  );
};

export default Confetti;
