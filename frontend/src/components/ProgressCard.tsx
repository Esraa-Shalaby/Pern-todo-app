import React from "react";
import { Box, Flex, Text, Badge } from "@chakra-ui/react";
import { motion } from "framer-motion";
import AnimatedNumber from "./AnimatedNumber";
import { getStats } from "../utils/todos";

const SIZE = 88;
const STROKE = 9;
const RADIUS = (SIZE - STROKE) / 2;
const CIRCUMFERENCE = 2 * Math.PI * RADIUS;

type Props = { stats: ReturnType<typeof getStats> };

const ProgressCard: React.FC<Props> = ({ stats }) => {
  const { total, completed, percent, overdue, dueToday } = stats;

  return (
    <Flex
      align="center"
      gap={5}
      p={5}
      bg="app.surface"
      borderWidth="1px"
      borderColor="app.border"
      rounded="20px"
      shadow="sm"
    >
      <Box pos="relative" w={`${SIZE}px`} h={`${SIZE}px`} flexShrink={0}>
        <svg
          width={SIZE}
          height={SIZE}
          viewBox={`0 0 ${SIZE} ${SIZE}`}
          style={{ transform: "rotate(-90deg)" }}
          aria-hidden
        >
          <circle
            cx={SIZE / 2}
            cy={SIZE / 2}
            r={RADIUS}
            fill="none"
            strokeWidth={STROKE}
            stroke="var(--chakra-colors-app-border)"
          />
          <motion.circle
            cx={SIZE / 2}
            cy={SIZE / 2}
            r={RADIUS}
            fill="none"
            strokeWidth={STROKE}
            strokeLinecap="round"
            stroke="var(--chakra-colors-app-accent)"
            strokeDasharray={CIRCUMFERENCE}
            initial={{ strokeDashoffset: CIRCUMFERENCE }}
            animate={{ strokeDashoffset: CIRCUMFERENCE * (1 - percent / 100) }}
            transition={{ type: "spring", stiffness: 60, damping: 16 }}
          />
        </svg>
        <Flex pos="absolute" inset={0} align="center" justify="center" fontWeight="bold" fontSize="lg">
          <AnimatedNumber value={percent} />%
        </Flex>
      </Box>

      <Box minW={0}>
        <Text fontWeight="bold" fontSize="lg">
          {total === 0
            ? "No tasks yet"
            : completed === total
            ? "All done. Nice work!"
            : "Today's progress"}
        </Text>
        <Text color="app.muted" fontSize="sm">
          {total === 0
            ? "Add your first task to get started."
            : `${completed} of ${total} task${total === 1 ? "" : "s"} completed`}
        </Text>
        <Flex mt={2} gap={2} wrap="wrap">
          {overdue > 0 && (
            <Badge colorScheme="red" rounded="full" px={2}>
              {overdue} overdue
            </Badge>
          )}
          {dueToday > 0 && (
            <Badge colorScheme="orange" rounded="full" px={2}>
              {dueToday} due today
            </Badge>
          )}
        </Flex>
      </Box>
    </Flex>
  );
};

export default ProgressCard;
