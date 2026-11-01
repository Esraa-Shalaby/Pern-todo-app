export type Priority = "low" | "medium" | "high";

export type Todo = {
  id: string;
  description: string;
  done: boolean;
  priority: Priority;
  dueDate: string | null; // "YYYY-MM-DD"
  createdAt: string;
  updatedAt: string;
};

export type NewTodoInput = {
  description: string;
  priority: Priority;
  dueDate: string | null;
};

export type TodoPatch = Partial<Pick<Todo, "description" | "done" | "priority" | "dueDate">>;

export type Filter = "all" | "active" | "completed";
export type SortKey = "newest" | "due" | "priority";

export const PRIORITY_META: Record<
  Priority,
  { label: string; color: string; weight: number }
> = {
  high: { label: "High", color: "red", weight: 3 },
  medium: { label: "Medium", color: "orange", weight: 2 },
  low: { label: "Low", color: "green", weight: 1 },
};

export const SORT_LABELS: Record<SortKey, string> = {
  newest: "Newest first",
  due: "Due date",
  priority: "Priority",
};

const pad = (n: number) => String(n).padStart(2, "0");

/** Local calendar date as "YYYY-MM-DD". */
export function toDateString(date: Date): string {
  return `${date.getFullYear()}-${pad(date.getMonth() + 1)}-${pad(date.getDate())}`;
}

/** Parses "YYYY-MM-DD" as a *local* date (new Date("YYYY-MM-DD") would be UTC). */
export function parseDateString(value: string): Date {
  const [y, m, d] = value.split("-").map(Number);
  return new Date(y, m - 1, d);
}

export type DueStatus = "overdue" | "today" | "upcoming" | null;

export function dueStatus(todo: Pick<Todo, "dueDate" | "done">, now = new Date()): DueStatus {
  if (!todo.dueDate) return null;
  const today = toDateString(now);
  if (todo.dueDate === today) return "today";
  // "YYYY-MM-DD" strings compare correctly as text
  if (todo.dueDate < today) return todo.done ? null : "overdue";
  return "upcoming";
}

export function formatDue(dueDate: string, now = new Date()): string {
  const target = parseDateString(dueDate);
  const startOfToday = new Date(now.getFullYear(), now.getMonth(), now.getDate());
  const diffDays = Math.round((target.getTime() - startOfToday.getTime()) / 86400000);

  if (diffDays === 0) return "Today";
  if (diffDays === 1) return "Tomorrow";
  if (diffDays === -1) return "Yesterday";
  return target.toLocaleDateString(undefined, {
    weekday: diffDays > 0 && diffDays < 7 ? "short" : undefined,
    month: "short",
    day: "numeric",
    year: target.getFullYear() !== now.getFullYear() ? "numeric" : undefined,
  });
}

export function filterAndSort(
  todos: Todo[],
  filter: Filter,
  sort: SortKey,
  search: string
): Todo[] {
  const query = search.trim().toLowerCase();

  const visible = todos.filter((t) => {
    if (filter === "active" && t.done) return false;
    if (filter === "completed" && !t.done) return false;
    return !query || t.description.toLowerCase().includes(query);
  });

  const byNewest = (a: Todo, b: Todo) => b.createdAt.localeCompare(a.createdAt);

  const compare: Record<SortKey, (a: Todo, b: Todo) => number> = {
    newest: byNewest,
    due: (a, b) => {
      if (a.dueDate && b.dueDate) return a.dueDate.localeCompare(b.dueDate) || byNewest(a, b);
      if (a.dueDate) return -1; // tasks with a date come first
      if (b.dueDate) return 1;
      return byNewest(a, b);
    },
    priority: (a, b) =>
      PRIORITY_META[b.priority].weight - PRIORITY_META[a.priority].weight || byNewest(a, b),
  };

  // Open tasks always come before completed ones
  return [...visible].sort((a, b) => Number(a.done) - Number(b.done) || compare[sort](a, b));
}

export function getStats(todos: Todo[], now = new Date()) {
  const total = todos.length;
  const completed = todos.filter((t) => t.done).length;
  const overdue = todos.filter((t) => dueStatus(t, now) === "overdue").length;
  const dueToday = todos.filter((t) => !t.done && dueStatus(t, now) === "today").length;
  return {
    total,
    completed,
    active: total - completed,
    overdue,
    dueToday,
    percent: total === 0 ? 0 : Math.round((completed / total) * 100),
  };
}

export function greeting(now = new Date()): string {
  const h = now.getHours();
  if (h < 12) return "Good morning";
  if (h < 18) return "Good afternoon";
  return "Good evening";
}
