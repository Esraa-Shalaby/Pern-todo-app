import React from "react";
import { render, screen, fireEvent, waitFor } from "@testing-library/react";
import { ChakraProvider } from "@chakra-ui/react";
import NewTodo from "./components/NewTodo";

const renderComposer = (onAdd = jest.fn().mockResolvedValue(undefined)) => {
  render(
    <ChakraProvider>
      <NewTodo onAdd={onAdd} />
    </ChakraProvider>
  );
  return onAdd;
};

test("submits the description with default priority and no due date", async () => {
  const onAdd = renderComposer();
  const input = screen.getByLabelText(/task description/i);

  fireEvent.change(input, { target: { value: "  New Task  " } });
  fireEvent.click(screen.getByRole("button", { name: /add task/i }));

  await waitFor(() =>
    expect(onAdd).toHaveBeenCalledWith({ description: "New Task", priority: "medium", dueDate: null })
  );
  await waitFor(() => expect(input).toHaveValue(""));
});

test("lets the user pick a priority and a due date", async () => {
  const onAdd = renderComposer();

  fireEvent.change(screen.getByLabelText(/task description/i), { target: { value: "Ship it" } });
  fireEvent.click(screen.getByRole("button", { name: "High" }));
  fireEvent.change(screen.getByLabelText(/due/i), { target: { value: "2026-12-24" } });
  fireEvent.click(screen.getByRole("button", { name: /add task/i }));

  await waitFor(() =>
    expect(onAdd).toHaveBeenCalledWith({ description: "Ship it", priority: "high", dueDate: "2026-12-24" })
  );
});

test("does not submit an empty task", () => {
  const onAdd = renderComposer();

  expect(screen.getByRole("button", { name: /add task/i })).toBeDisabled();
  expect(onAdd).not.toHaveBeenCalled();
});
