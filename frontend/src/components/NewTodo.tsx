import React, { useState } from "react";
import { Box, Button, Flex, Input, Text } from "@chakra-ui/react";
import { AnimatePresence } from "framer-motion";
import { FiPlus } from "react-icons/fi";
import { MotionBox } from "../utils/motion";
import { NewTodoInput, PRIORITY_META, Priority } from "../utils/todos";

type Props = {
  onAdd: (input: NewTodoInput) => Promise<unknown> | void;
  isAdding?: boolean;
  inputRef?: React.Ref<HTMLInputElement>;
};

const PRIORITIES = Object.keys(PRIORITY_META) as Priority[];

const NewTodo: React.FC<Props> = ({ onAdd, isAdding = false, inputRef }) => {
  const [description, setDescription] = useState("");
  const [priority, setPriority] = useState<Priority>("medium");
  const [dueDate, setDueDate] = useState("");
  const [focused, setFocused] = useState(false);

  // Extra options (priority / due date) slide open while the form is in use
  const open = focused || description.length > 0;

  const submit = async (e: React.FormEvent) => {
    e.preventDefault();
    const text = description.trim();
    if (!text) return;

    try {
      await onAdd({ description: text, priority, dueDate: dueDate || null });
      setDescription("");
      setDueDate("");
      setPriority("medium");
    } catch {
      /* the parent shows an error toast; keep the text so nothing is lost */
    }
  };

  return (
    <Box
      as="form"
      onSubmit={submit}
      onFocus={() => setFocused(true)}
      onBlur={(e: React.FocusEvent<HTMLFormElement>) => {
        if (!e.currentTarget.contains(e.relatedTarget as Node | null)) setFocused(false);
      }}
      p={4}
      bg="app.surface"
      borderWidth="1px"
      borderColor={open ? "app.accent" : "app.border"}
      rounded="20px"
      shadow={open ? "md" : "sm"}
      transition="all .25s ease"
    >
      <Flex gap={3}>
        <Input
          ref={inputRef}
          value={description}
          onChange={(e) => setDescription(e.target.value)}
          placeholder="What's next?"
          aria-label="Task description"
          maxLength={255}
          variant="unstyled"
          fontSize="lg"
          px={1}
        />
        <MotionBox whileHover={{ scale: 1.05 }} whileTap={{ scale: 0.94 }}>
          <Button
            type="submit"
            bg="app.accent"
            color="app.accentText"
            _hover={{ bg: "yellow.dark" }}
            _active={{ bg: "yellow.light" }}
            leftIcon={<FiPlus />}
            isLoading={isAdding}
            isDisabled={!description.trim()}
          >
            Add task
          </Button>
        </MotionBox>
      </Flex>

      <AnimatePresence initial={false}>
        {open && (
          <MotionBox
            key="options"
            overflow="hidden"
            initial={{ height: 0, opacity: 0 }}
            animate={{ height: "auto", opacity: 1 }}
            exit={{ height: 0, opacity: 0 }}
            transition={{ duration: 0.2 }}
          >
            <Flex pt={4} gap={4} wrap="wrap" align="center">
              <Flex align="center" gap={2}>
                <Text fontSize="sm" color="app.muted">
                  Priority
                </Text>
                <Flex gap={1} role="group" aria-label="Priority">
                  {PRIORITIES.map((p) => (
                    <Button
                      key={p}
                      size="xs"
                      rounded="full"
                      colorScheme={PRIORITY_META[p].color}
                      variant={priority === p ? "solid" : "outline"}
                      aria-pressed={priority === p}
                      onClick={() => setPriority(p)}
                    >
                      {PRIORITY_META[p].label}
                    </Button>
                  ))}
                </Flex>
              </Flex>

              <Flex align="center" gap={2}>
                <Text as="label" htmlFor="new-task-due" fontSize="sm" color="app.muted">
                  Due
                </Text>
                <Input
                  id="new-task-due"
                  type="date"
                  size="sm"
                  w="auto"
                  rounded="md"
                  value={dueDate}
                  onChange={(e) => setDueDate(e.target.value)}
                  borderColor="app.border"
                />
              </Flex>
            </Flex>
          </MotionBox>
        )}
      </AnimatePresence>
    </Box>
  );
};

export default NewTodo;
