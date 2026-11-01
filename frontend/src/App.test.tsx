import React from "react";
import { render, screen } from "@testing-library/react";
import { QueryClient, QueryClientProvider } from "react-query";
import App from "./components/App";
import { client } from "./utils/client";

jest.mock("./utils/client", () => ({
  client: { get: jest.fn(), post: jest.fn(), patch: jest.fn(), delete: jest.fn() },
}));

test("renders the empty state when there are no tasks", async () => {
  (client.get as jest.Mock).mockResolvedValue({ data: { todos: [] } });

  render(
    <QueryClientProvider client={new QueryClient({ defaultOptions: { queries: { retry: false } } })}>
      <App />
    </QueryClientProvider>
  );

  expect(await screen.findByText(/nothing to do yet/i)).toBeInTheDocument();
  expect(screen.getByLabelText(/task description/i)).toBeInTheDocument();
});
