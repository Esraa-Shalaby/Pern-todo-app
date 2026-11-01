import { Todo, dueStatus, filterAndSort, formatDue, getStats } from "./todos";

const NOW = new Date(2026, 10, 1, 12, 0, 0); // 1 Nov 2026, local time

const make = (over: Partial<Todo>): Todo => ({
  id: Math.random().toString(),
  description: "task",
  done: false,
  priority: "medium",
  dueDate: null,
  createdAt: "2026-10-01T00:00:00.000Z",
  updatedAt: "2026-10-01T00:00:00.000Z",
  ...over,
});

describe("dueStatus", () => {
  test("classifies dates relative to today", () => {
    expect(dueStatus(make({ dueDate: "2026-10-30" }), NOW)).toBe("overdue");
    expect(dueStatus(make({ dueDate: "2026-11-01" }), NOW)).toBe("today");
    expect(dueStatus(make({ dueDate: "2026-11-05" }), NOW)).toBe("upcoming");
    expect(dueStatus(make({ dueDate: null }), NOW)).toBeNull();
  });

  test("a completed task is never overdue", () => {
    expect(dueStatus(make({ dueDate: "2026-10-30", done: true }), NOW)).toBeNull();
  });
});

describe("formatDue", () => {
  test("uses friendly names for nearby days", () => {
    expect(formatDue("2026-11-01", NOW)).toBe("Today");
    expect(formatDue("2026-11-02", NOW)).toBe("Tomorrow");
    expect(formatDue("2026-10-31", NOW)).toBe("Yesterday");
  });
});

describe("filterAndSort", () => {
  const todos = [
    make({ id: "a", description: "Buy milk", createdAt: "2026-10-01T00:00:00.000Z" }),
    make({ id: "b", description: "Write report", priority: "high", createdAt: "2026-10-02T00:00:00.000Z" }),
    make({ id: "c", description: "Call mum", done: true, createdAt: "2026-10-03T00:00:00.000Z" }),
  ];

  test("filters by status and search text", () => {
    expect(filterAndSort(todos, "active", "newest", "").map((t) => t.id)).toEqual(["b", "a"]);
    expect(filterAndSort(todos, "completed", "newest", "").map((t) => t.id)).toEqual(["c"]);
    expect(filterAndSort(todos, "all", "newest", "REPORT").map((t) => t.id)).toEqual(["b"]);
  });

  test("keeps open tasks above completed ones and sorts by priority", () => {
    expect(filterAndSort(todos, "all", "priority", "").map((t) => t.id)).toEqual(["b", "a", "c"]);
  });
});

describe("getStats", () => {
  test("counts totals, overdue and due today", () => {
    const stats = getStats(
      [
        make({ done: true }),
        make({ dueDate: "2026-10-30" }),
        make({ dueDate: "2026-11-01" }),
        make({}),
      ],
      NOW
    );
    expect(stats).toMatchObject({ total: 4, completed: 1, active: 3, overdue: 1, dueToday: 1, percent: 25 });
  });

  test("handles an empty list", () => {
    expect(getStats([], NOW).percent).toBe(0);
  });
});
