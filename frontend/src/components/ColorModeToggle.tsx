import React from "react";
import { IconButton, useColorMode } from "@chakra-ui/react";
import { AnimatePresence } from "framer-motion";
import { FiMoon, FiSun } from "react-icons/fi";
import { MotionBox } from "../utils/motion";

const ColorModeToggle: React.FC = () => {
  const { colorMode, toggleColorMode } = useColorMode();
  const isDark = colorMode === "dark";

  return (
    <IconButton
      aria-label={isDark ? "Switch to light mode" : "Switch to dark mode"}
      variant="ghost"
      rounded="full"
      onClick={toggleColorMode}
      icon={
        <AnimatePresence mode="wait" initial={false}>
          <MotionBox
            key={isDark ? "sun" : "moon"}
            display="flex"
            initial={{ rotate: -90, opacity: 0, scale: 0.5 }}
            animate={{ rotate: 0, opacity: 1, scale: 1 }}
            exit={{ rotate: 90, opacity: 0, scale: 0.5 }}
            transition={{ duration: 0.2 }}
          >
            {isDark ? <FiSun size={20} /> : <FiMoon size={20} />}
          </MotionBox>
        </AnimatePresence>
      }
    />
  );
};

export default ColorModeToggle;
