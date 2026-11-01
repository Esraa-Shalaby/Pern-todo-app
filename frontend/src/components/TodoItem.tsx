import React, { useState } from "react";
import { Badge, Box, Button, Flex, IconButton, Input, Select, Spacer, Text } from "@chakra-ui/react";
import { FiCalendar, FiEdit2, FiTrash2 } from "react-icons/fi";
import { motion } from "framer-motion";
import { MotionButton, MotionListItem } from "../utils/motion";
import { PRIORITY_META, Priority, Todo, TodoPatch, dueStatus, formatDue } from "../utils/todos";

type Props = {
  todo: Todo;
  onToggle: (todo: Todo) => void;
  onDelete: (todo: Todo) => void;
  onUpdate: (id: string, patch: TodoPatch) => void;
};

const AnimatedCheck: React.FC<{ todo: Todo; onToggle: () => void }> = ({ todo, onToggle }) => (
  <MotionButton
    as="button"
    type="button"
    role="checkbox"
    aria-checked={todo.done}
    aria-label={`Mark "${todo.description}" as ${todo.done ? "not done" : "done"}`}
    onClick={onToggle}
    whileHover={{ scale: 1.12 }}
    whileTap={{ scale: 0.8 }}
    animate={{
      backgroundColor: todo.done ? "rgba(255,211,105,1)" : "rgba(255,211,105,0)",
      borderColor: todo.done ? "#FFD369" : "#838a96",
    }}
    transition={{ duration: 0.2 }}
    w={6}
    h={6}
    flexShrink={0}
    rounded="full"
    borderWidth="2px"
    display="flex"
    alignItems="center"
    justifyContent="center"
  >
    <svg viewBox="0 0 24 24" width="14" height="14" aria-hidden>
      <motion.path
        d="M5 13l4 4L19 7"
        fill="none"
        stroke="#222831"
        strokeWidth={3.5}
        strokeLinecap="round"
        strokeLinejoin="round"
        initial={false}
        animate={{ pathLength: todo.done ? 1 : 0, opacity: todo.done ? 1 : 0 }}
        transition={{ duration: 0.25, delay: todo.done ? 0.05 : 0 }}
      />
    </svg>
  </MotionButton>
);

// forwardRef: AnimatePresence (mode="popLayout") measures the exiting item through its ref
const TodoItem = React.forwardRef<HTMLLIElement, Props>(({ todo, onToggle, onDelete, onUpdate }, ref) => {
  const [editing, setEditing] = useState(false);
  const [draft, setDraft] = useState(todo.description);
  const [priority, setPriority] = useState<Priority>(todo.priority);
  const [dueDate, setDueDate] = useState(todo.dueDate ?? "");

  const meta = PRIORITY_META[todo.priority];
  const status = dueStatus(todo);

  const startEdit = () => {
    setDraft(todo.description);
    setPriority(todo.priority);
    setDueDate(todo.dueDate ?? "");
    setEditing(true);
  };

  const save = () => {
    const description = draft.trim();
    if (!description) return;

    const patch: TodoPatch = {};
    if (description !== todo.description) patch.description = description;
    if (priority !== todo.priority) patch.priority = priority;
    if ((dueDate || null) !== todo.dueDate) patch.dueDate = dueDate || null;
    if (Object.keys(patch).length > 0) onUpdate(todo.id, patch);
    setEditing(false);
  };

  return (
    <MotionListItem
      ref={ref}
      as="li"
      layout
      listStyleType="none"
      initial={{ opacity: 0, y: -16, scale: 0.96 }}
      animate={{ opacity: 1, y: 0, scale: 1 }}
      exit={{ opacity: 0, x: 80, scale: 0.92 }}
      transition={{ type: "spring", stiffness: 420, damping: 34 }}
    >
      <Flex
        role="group"
        align={editing ? "flex-start" : "center"}
        gap={3}
        p={3.5}
        bg="app.surface"
        borderWidth="1px"
        borderColor="app.border"
        borderLeftWidth="4px"
        borderLeftColor={`${meta.color}.400`}
        rounded="14px"
        shadow="sm"
        transition="box-shadow .2s, background-color .2s, opacity .3s"
        opacity={todo.done && !editing ? 0.75 : 1}
        _hover={{ shadow: "md", bg: "app.surfaceHover" }}
      >
        <AnimatedCheck todo={todo} onToggle={() => onToggle(todo)} />

        {editing ? (
          <Box flex={1} minW={0}>
            <Input
              autoFocus
              size="sm"
              value={draft}
              maxLength={255}
              aria-label="Edit task description"
              onChange={(e) => setDraft(e.target.value)}
              onKeyDown={(e) => {
                if (e.key === "Enter") save();
                if (e.key === "Escape") setEditing(false);
              }}
            />
            <Flex mt={2} gap={2} wrap="wrap" align="center">
              <Select
                size="sm"
                w="auto"
                aria-label="Priority"
                value={priority}
                onChange={(e) => setPriority(e.target.value as Priority)}
              >
                {(Object.keys(PRIORITY_META) as Priority[]).map((p) => (
                  <option key={p} value={p}>
                    {PRIORITY_META[p].label}
                  </option>
                ))}
              </Select>
              <Input
                type="date"
                size="sm"
                w="auto"
                aria-label="Due date"
                value={dueDate}
                onChange={(e) => setDueDate(e.target.value)}
              />
              <Spacer />
              <Button size="sm" variant="ghost" onClick={() => setEditing(false)}>
                Cancel
              </Button>
              <Button
                size="sm"
                bg="app.accent"
                color="app.accentText"
                _hover={{ bg: "yellow.dark" }}
                isDisabled={!draft.trim()}
                onClick={save}
              >
                Save
              </Button>
            </Flex>
          </Box>
        ) : (
          <>
            <Box flex={1} minW={0} onDoubleClick={startEdit}>
              <Text
                fontWeight="medium"
                wordBreak="break-word"
                color={todo.done ? "app.muted" : "app.text"}
                textDecoration="line-through"
                textDecorationColor={todo.done ? "currentColor" : "transparent"}
                transition="color .3s, text-decoration-color .3s"
              >
                {todo.description}
              </Text>
              <Flex mt={1} gap={2} align="center" wrap="wrap">
                <Badge colorScheme={meta.color} rounded="full" px={2} textTransform="none">
                  {meta.label}
                </Badge>
                {todo.dueDate && (
                  <Flex
                    align="center"
                    gap={1}
                    fontSize="xs"
                    fontWeight={status === "overdue" || status === "today" ? "semibold" : "normal"}
                    color={
                      status === "overdue" ? "red.400" : status === "today" ? "orange.400" : "app.muted"
                    }
                  >
                    <FiCalendar />
                    <span>
                      {formatDue(todo.dueDate)}
                      {status === "overdue" ? " · Overdue" : ""}
                    </span>
                  </Flex>
                )}
              </Flex>
            </Box>

            <Flex
              gap={1}
              opacity={{ base: 1, md: 0.35 }}
              transition="opacity .2s"
              _groupHover={{ opacity: 1 }}
              _groupFocusWithin={{ opacity: 1 }}
            >
              <IconButton
                aria-label={`Edit "${todo.description}"`}
                icon={<FiEdit2 />}
                size="sm"
                variant="ghost"
                rounded="full"
                onClick={startEdit}
              />
              <IconButton
                aria-label={`Delete "${todo.description}"`}
                icon={<FiTrash2 />}
                size="sm"
                variant="ghost"
                rounded="full"
                colorScheme="red"
                onClick={() => onDelete(todo)}
              />
            </Flex>
          </>
        )}
      </Flex>
    </MotionListItem>
  );
});

TodoItem.displayName = "TodoItem";

export default TodoItem;
