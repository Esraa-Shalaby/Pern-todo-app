import express from "express";
import cors from "cors";
import { json, urlencoded } from "body-parser";
import knex from "./db/knex";
import { Model } from "objection";
import todos from "./routes/todo";
import * as path from "path";
import { join } from "path";

Model.knex(knex); //this pass knex config into the model instance

const app = express();
const port = process.env.PORT || 4000;

app.use(cors());
app.use(json());
app.use(urlencoded({ extended: true }));

if (process.env.NODE_ENV === "production") {
  app.use(express.static(path.join(__dirname, "frontend/build")));
}

app.listen(port, () => {
  console.log(`Server ready and running at http://localhost:${port}`);
});

app.get("/", (_, res) => {
  res.send("Everything is good!");
});

// to serve static files from anywhere else
/* app.get("*", (req, res) => {
  res.sendFile(path.join(__dirname, "frontend/build"));
}); */

const router = express.Router();

app.use("/todos", todos);

export default app;
