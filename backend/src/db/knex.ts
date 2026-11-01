import knex from "knex";
import { knexSnakeCaseMappers } from "objection"; //to normalize varable names to snakeCase
require("dotenv").config();

// Return Postgres DATE columns as plain "YYYY-MM-DD" strings. By default `pg`
// converts them to a JS Date at local midnight, which shifts the day once it
// is serialised to JSON in a different timezone.
require("pg").types.setTypeParser(1082, (value: string) => value);

const config = require("./config");

const environment = process.env.NODE_ENV || "development";

export default knex({ ...config[environment], ...knexSnakeCaseMappers() });
