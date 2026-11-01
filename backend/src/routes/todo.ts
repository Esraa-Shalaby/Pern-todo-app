import express, { Response } from "express";
import { Todo, PRIORITIES, Priority } from "../db/models/Todo";

const router = express.Router();

const UUID_RE =
  /^[0-9a-f]{8}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{12}$/i;
const DATE_RE = /^\d{4}-\d{2}-\d{2}$/;
const MAX_DESCRIPTION = 255;

type TodoInput = {
  description?: string;
  done?: boolean;
  priority?: Priority;
  dueDate?: string | null;
};

class BadRequest extends Error {}

// Validates the `todo` payload. With `partial` (PATCH) every field is optional,
// otherwise (POST) a description is required.
function parseTodo(body: any, partial: boolean): TodoInput {
  const raw = body?.todo;
  if (!raw || typeof raw !== "object") {
    throw new BadRequest("Request body must contain a `todo` object");
  }

  const out: TodoInput = {};

  if (raw.description !== undefined || !partial) {
    if (typeof raw.description !== "string" || !raw.description.trim()) {
      throw new BadRequest("`description` is required");
    }
    const description = raw.description.trim();
    if (description.length > MAX_DESCRIPTION) {
      throw new BadRequest(
        `\`description\` must be at most ${MAX_DESCRIPTION} characters`
      );
    }
    out.description = description;
  }

  if (raw.done !== undefined) {
    if (typeof raw.done !== "boolean") {
      throw new BadRequest("`done` must be a boolean");
    }
    out.done = raw.done;
  }

  if (raw.priority !== undefined) {
    if (!PRIORITIES.includes(raw.priority)) {
      throw new BadRequest(`\`priority\` must be one of: ${PRIORITIES.join(", ")}`);
    }
    out.priority = raw.priority;
  }

  if (raw.dueDate !== undefined) {
    if (raw.dueDate !== null && !DATE_RE.test(raw.dueDate)) {
      throw new BadRequest("`dueDate` must be null or formatted YYYY-MM-DD");
    }
    out.dueDate = raw.dueDate;
  }

  return out;
}

function handleError(res: Response, where: string, error: any) {
  if (error instanceof BadRequest) {
    return res.status(400).send({ error: error.message });
  }
  console.error(`Error in ${where}:`, error.message);
  res.status(500).send({ error: "Internal Server Error" });
}

// create a new todo router
router.post("/", async (req, res) => {
  try {
    const input = parseTodo(req.body, false);
    const newTodo = await Todo.query().insert(input).returning("*");

    res.status(201).send({ todo: newTodo });
  } catch (error: any) {
    handleError(res, "POST /", error);
  }
});

//get all todo router
router.get("/", async (req, res) => {
  try {
    const todos = await Todo.query().select().orderBy("created_at");

    res.send({ todos });
  } catch (error: any) {
    handleError(res, "GET /", error);
  }
});

// delete every completed todo (must be declared before "/:id")
router.delete("/completed", async (req, res) => {
  try {
    const deleted = await Todo.query().delete().where({ done: true });

    res.send({ deleted });
  } catch (error: any) {
    handleError(res, "DELETE /completed", error);
  }
});

//get a todo router
router.get("/:id", async (req, res) => {
  try {
    const id = req.params.id;
    const todo = UUID_RE.test(id) ? await Todo.query().findById(id) : undefined;
    if (!todo) return res.status(404).send({ error: "Todo not found" });

    res.send({ todo });
  } catch (error: any) {
    handleError(res, "GET /:id", error);
  }
});

//update an existing todo router (partial update)
router.patch("/:id", async (req, res) => {
  try {
    const id = req.params.id;
    const input = parseTodo(req.body, true);
    if (!UUID_RE.test(id)) {
      return res.status(404).send({ error: "Todo not found" });
    }

    const updatedTodo = await Todo.query().patchAndFetchById(id, input);
    if (!updatedTodo) return res.status(404).send({ error: "Todo not found" });

    res.send({ todo: updatedTodo });
  } catch (error: any) {
    handleError(res, "PATCH /:id", error);
  }
});

//delete an existing todo router
router.delete("/:id", async (req, res) => {
  try {
    const id = req.params.id;
    const deleted = UUID_RE.test(id) ? await Todo.query().deleteById(id) : 0;
    if (!deleted) return res.status(404).send({ error: "Todo not found" });

    res.send("Todo task deleted successfully");
  } catch (error: any) {
    handleError(res, "DELETE /:id", error);
  }
});

export default router;
