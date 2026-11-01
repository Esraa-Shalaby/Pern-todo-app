import type { Knex } from "knex";

export async function up(knex: Knex): Promise<void> {
  return knex.schema.alterTable("todos", (table) => {
    table.string("priority", 10).notNullable().defaultTo("medium");
    table.date("due_date").nullable();
  });
}

export async function down(knex: Knex): Promise<void> {
  return knex.schema.alterTable("todos", (table) => {
    table.dropColumn("priority");
    table.dropColumn("due_date");
  });
}
