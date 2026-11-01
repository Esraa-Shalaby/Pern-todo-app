import React from "react";
import { render, screen, fireEvent, waitFor } from "@testing-library/react";
import { BrowserRouter as Router } from "react-router-dom";
import { ChakraProvider } from "@chakra-ui/react";
import { QueryClient, QueryClientProvider } from "react-query";
import Todos from "./components/Todos";
import { client } from "./utils/client";

jest.mock("./utils/client", () => ({
  client: { get: jest.fn(), post: jest.fn(), patch: jest.fn(), delete: jest.fn() },
}));

const mocked = client as jest.Mocked<typeof client>;

const todos = [
  {
    id: "1",
    description: "First Dump",
    done: true,
    priority: "high",
    dueDate: null,
    createdAt: "2022-01-01T00:00:00.000Z",
    updatedAt: "2022-01-01T00:00:00.000Z",
  },
  {
    id: "2",
    description: "Second Dump",
    done: false,
    priority: "low",
    dueDate: "2020-01-01",
    createdAt: "2022-01-02T00:00:00.000Z",
    updatedAt: "2022-01-02T00:00:00.000Z",
  },
];

const renderTodos = () =>
  render(
    <Router>
      <QueryClientProvider client={new QueryClient({ defaultOptions: { queries: { retry: false } } })}>
        <ChakraProvider>
          <Todos />
        </ChakraProvider>
      </QueryClientProvider>
    </Router>
  );

beforeEach(() => {
  jest.resetAllMocks();
  mocked.get.mockResolvedValue({ data: { todos } });
  mocked.patch.mockResolvedValue({ data: {} });
  mocked.delete.mockResolvedValue({ data: {} });
});

test("renders the tasks with their status", async () => {
  renderTodos();

  expect(await screen.findByText("First Dump")).toBeInTheDocument();
  expect(screen.getByText("Second Dump")).toBeInTheDocument();
  // the summary badge and the task's own due-date label both flag the overdue task
  expect(screen.getByText("1 overdue")).toBeInTheDocument();
  expect(screen.getByText(/· Overdue/)).toBeInTheDocument();
});

test("toggling a task sends only the changed field", async () => {
  renderTodos();

  fireEvent.click(await screen.findByRole("checkbox", { name: /second dump/i }));

  await waitFor(() =>
    expect(mocked.patch).toHaveBeenCalledWith("/todos/2", { todo: { done: true } })
  );
});

test("deleting a task calls the API", async () => {
  renderTodos();

  fireEvent.click(await screen.findByRole("button", { name: /delete "first dump"/i }));

  await waitFor(() => expect(mocked.delete).toHaveBeenCalledWith("/todos/1"));
});

test("the search box filters the list", async () => {
  renderTodos();
  await screen.findByText("First Dump");

  fireEvent.change(screen.getByLabelText(/search tasks/i), { target: { value: "second" } });

  await waitFor(() => expect(screen.queryByText("First Dump")).not.toBeInTheDocument());
  expect(screen.getByText("Second Dump")).toBeInTheDocument();
});
