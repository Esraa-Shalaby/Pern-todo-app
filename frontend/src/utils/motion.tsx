import React from "react";
import { Box, BoxProps } from "@chakra-ui/react";
import { HTMLMotionProps, motion } from "framer-motion";

// Chakra style props + framer-motion props on one component. Both libraries
// define a `transition` prop, so the motion version wins (see Chakra's docs).
type Merge<P, T> = Omit<P, keyof T> & T;

export const MotionBox = motion(Box) as React.FC<Merge<BoxProps, HTMLMotionProps<"div">>>;

// `as` is just a render-element hint for Chakra; the refs are forwarded at runtime,
// which AnimatePresence (mode="popLayout") needs.
export const MotionListItem = motion(Box) as unknown as React.ForwardRefExoticComponent<
  Merge<BoxProps, HTMLMotionProps<"li">> & React.RefAttributes<HTMLLIElement>
>;

export const MotionButton = motion(Box) as unknown as React.FC<
  Merge<BoxProps, HTMLMotionProps<"button">> & React.ButtonHTMLAttributes<HTMLButtonElement>
>;
