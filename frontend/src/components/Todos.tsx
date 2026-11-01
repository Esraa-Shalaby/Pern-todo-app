import React, { useCallback, useEffect, useMemo, useRef, useState } from "react";
import { Box, Button, Container, Flex, Heading, Skeleton, Text, useToast } from "@chakra-ui/react";
import { AnimatePresence, useReducedMotion } from "framer-motion";
import { useMutation, useQuery, useQueryClient } from "react-query";
import { client } from "../utils/client";
import { MotionBox } from "../utils/motion";
import { usePersistedState } from "../utils/usePersistedState";
import {
  Filter,
  NewTodoInput,
  SortKey,
  Todo,
  TodoPatch,
  filterAndSort,
  getStats,
  greeting,
} from "../utils/todos";
import ColorModeToggle from "./ColorModeToggle";
import Confetti from "./Confetti";
import EmptyState from "./EmptyState";
import NewTodo from "./NewTodo";
import ProgressCard from "./ProgressCard";
import TodoItem from "./TodoItem";
import Toolbar from "./Toolbar";

const FILTER_VALUES = ["all", "active", "completed"] as const;
const SORT_VALUES = ["newest", "due", "priority"] as const;
const EMPTY: Todo[] = [];

type Ctx = { previous?: Todo[] };

const Todos: React.FC = () => {
  const queryClient = useQueryClient();
  const toast = useToast();
  const reduceMotion = useReducedMotion();

  const [filter, setFilter] = usePersistedState<Filter>("todo:filter", "all", FILTER_VALUES);
  const [sort, setSort] = usePersistedState<SortKey>("todo:sort", "newest", SORT_VALUES);
  const [search, setSearch] = useState("");
  const [celebrate, setCelebrate] = useState(false);

  const newTaskRef = useRef<HTMLInputElement>(null);
  const searchRef = useRef<HTMLInputElement>(null);

  const { isLoading, isError, refetch, data } = useQuery<Todo[]>("todos", () =>
    client.get("todos").then((res) => res.data.todos)
  );
  const todos = data ?? EMPTY;

  const showError = useCallback(
    (title: string): void => {
      toast({ title, status: "error", duration: 3500, isClosable: true, position: "bottom" });
    },
    [toast]
  );

  // ---- optimistic cache helpers ------------------------------------------
  const snapshotAnd = async (apply: (old: Todo[]) => Todo[]): Promise<Ctx> => {
    await queryClient.cancelQueries("todos");
    const previous = queryClient.getQueryData<Todo[]>("todos");
    queryClient.setQueryData<Todo[]>("todos", (old) => apply(old ?? []));
    return { previous };
  };
  const rollback = (ctx?: Ctx) => {
    if (ctx?.previous) queryClient.setQueryData("todos", ctx.previous);
  };
  const refresh = () => queryClient.invalidateQueries("todos");

  // ---- mutations ----------------------------------------------------------
  const addMutation = useMutation(
    (input: NewTodoInput) => client.post("todos", { todo: input }),
    { onSuccess: refresh, onError: () => showError("Couldn't add the task. Please try again.") }
  );

  const updateMutation = useMutation<unknown, unknown, { id: string; patch: TodoPatch }, Ctx>(
    ({ id, patch }) => client.patch(`/todos/${id}`, { todo: patch }),
    {
      onMutate: ({ id, patch }) =>
        snapshotAnd((old) => old.map((t) => (t.id === id ? { ...t, ...patch } : t))),
      onError: (_err, _vars, ctx) => {
        rollback(ctx);
        showError("Couldn't update the task.");
      },
      onSettled: refresh,
    }
  );

  const deleteMutation = useMutation<unknown, unknown, Todo, Ctx>(
    (todo) => client.delete(`/todos/${todo.id}`),
    {
      onMutate: (todo) => snapshotAnd((old) => old.filter((t) => t.id !== todo.id)),
      onError: (_err, _vars, ctx) => {
        rollback(ctx);
        showError("Couldn't delete the task.");
      },
      onSettled: refresh,
    }
  );

  const clearMutation = useMutation<unknown, unknown, void, Ctx>(
    () => client.delete("/todos/completed"),
    {
      onMutate: () => snapshotAnd((old) => old.filter((t) => !t.done)),
      onError: (_err, _vars, ctx) => {
        rollback(ctx);
        showError("Couldn't clear completed tasks.");
      },
      onSuccess: () => {
        toast({ title: "Completed tasks cleared", status: "success", duration: 2000, position: "bottom" });
      },
      onSettled: refresh,
    }
  );

  // ---- derived data -------------------------------------------------------
  const stats = useMemo(() => getStats(todos), [todos]);
  const visible = useMemo(() => filterAndSort(todos, filter, sort, search), [todos, filter, sort, search]);
  const counts: Record<Filter, number> = {
    all: stats.total,
    active: stats.active,
    completed: stats.completed,
  };

  // ---- celebrate when the last open task gets completed -------------------
  const initialised = useRef(false);
  const wasAllDone = useRef(false);
  useEffect(() => {
    if (!data) return;
    const { total, completed } = getStats(data);
    const allDone = total > 0 && completed === total;
    if (initialised.current && allDone && !wasAllDone.current && !reduceMotion) {
      setCelebrate(true);
    }
    wasAllDone.current = allDone;
    initialised.current = true;
  }, [data, reduceMotion]);

  // ---- keyboard shortcuts: "n" = new task, "/" = search -------------------
  useEffect(() => {
    const onKey = (e: KeyboardEvent) => {
      const target = e.target as HTMLElement | null;
      const tag = target?.tagName;
      if (tag === "INPUT" || tag === "TEXTAREA" || tag === "SELECT" || target?.isContentEditable) return;
      if (e.metaKey || e.ctrlKey || e.altKey) return;

      if (e.key === "n") {
        e.preventDefault();
        newTaskRef.current?.focus();
      } else if (e.key === "/") {
        e.preventDefault();
        searchRef.current?.focus();
      }
    };
    window.addEventListener("keydown", onKey);
    return () => window.removeEventListener("keydown", onKey);
  }, []);

  const today = new Date().toLocaleDateString(undefined, {
    weekday: "long",
    month: "long",
    day: "numeric",
  });

  return (
    <Box minH="100vh" py={{ base: 6, md: 12 }} px={4}>
      <Container maxW="2xl" p={0}>
        <MotionBox
          initial={{ opacity: 0, y: -14 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.4 }}
        >
          <Flex align="center" justify="space-between" mb={6}>
            <Box>
              <Text fontSize="sm" color="app.muted">
                {today}
              </Text>
              <Heading size="lg">{greeting()}</Heading>
            </Box>
            <ColorModeToggle />
          </Flex>
        </MotionBox>

        <MotionBox
          initial={{ opacity: 0, y: 16 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.4, delay: 0.08 }}
        >
          <ProgressCard stats={stats} />
        </MotionBox>

        <MotionBox
          mt={4}
          initial={{ opacity: 0, y: 16 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.4, delay: 0.16 }}
        >
          <NewTodo
            inputRef={newTaskRef}
            isAdding={addMutation.isLoading}
            onAdd={(input) => addMutation.mutateAsync(input)}
          />
        </MotionBox>

        <MotionBox
          mt={6}
          initial={{ opacity: 0, y: 16 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.4, delay: 0.24 }}
        >
          <Toolbar
            filter={filter}
            onFilterChange={setFilter}
            sort={sort}
            onSortChange={setSort}
            search={search}
            onSearchChange={setSearch}
            counts={counts}
            onClearCompleted={() => clearMutation.mutate()}
            searchRef={searchRef}
          />
        </MotionBox>

        <Box mt={5}>
          {isLoading ? (
            <Flex direction="column" gap={3} aria-busy="true" aria-label="Loading tasks">
              {[0, 1, 2].map((i) => (
                <Skeleton key={i} h="64px" rounded="14px" />
              ))}
            </Flex>
          ) : isError ? (
            <Box textAlign="center" py={10}>
              <Text fontWeight="bold">We couldn't load your tasks.</Text>
              <Text color="app.muted" fontSize="sm" mb={4}>
                Check that the server is running and try again.
              </Text>
              <Button onClick={() => refetch()}>Try again</Button>
            </Box>
          ) : visible.length === 0 ? (
            <EmptyState variant={todos.length === 0 ? "empty" : "no-results"} />
          ) : (
            <Box as="ul" display="flex" flexDirection="column" gap={3} pos="relative" p={0} m={0}>
              <AnimatePresence initial={false} mode="popLayout">
                {visible.map((todo) => (
                  <TodoItem
                    key={todo.id}
                    todo={todo}
                    onToggle={(t) => updateMutation.mutate({ id: t.id, patch: { done: !t.done } })}
                    onDelete={(t) => deleteMutation.mutate(t)}
                    onUpdate={(id, patch) => updateMutation.mutate({ id, patch })}
                  />
                ))}
              </AnimatePresence>
            </Box>
          )}
        </Box>

        <Text mt={8} fontSize="xs" color="app.muted" textAlign="center" display={{ base: "none", md: "block" }}>
          
        </Text>
      </Container>

      {celebrate && <Confetti onDone={() => setCelebrate(false)} />}
    </Box>
  );
};

export default Todos;
