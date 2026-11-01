import React from "react";
import { Box, Text } from "@chakra-ui/react";
import { FiCheckCircle, FiSearch } from "react-icons/fi";
import { MotionBox } from "../utils/motion";

type Props = { variant: "empty" | "no-results" };

const EmptyState: React.FC<Props> = ({ variant }) => {
  const Icon = variant === "empty" ? FiCheckCircle : FiSearch;

  return (
    <MotionBox
      textAlign="center"
      py={12}
      initial={{ opacity: 0, y: 12 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.35 }}
    >
      <MotionBox
        display="inline-block"
        color="app.accent"
        animate={{ y: [0, -8, 0] }}
        transition={{ repeat: Infinity, duration: 3, ease: "easeInOut" }}
      >
        <Icon size={56} />
      </MotionBox>
      <Box mt={4}>
        <Text fontWeight="bold" fontSize="lg">
          {variant === "empty" ? "Nothing to do yet" : "No matching tasks"}
        </Text>
        <Text color="app.muted" fontSize="sm">
          {variant === "empty"
            ? "Add your first task above and it will show up here."
            : "Try a different search or filter."}
        </Text>
      </Box>
    </MotionBox>
  );
};

export default EmptyState;
