import { Model } from "objection";

export const PRIORITIES = ["low", "medium", "high"] as const;
export type Priority = (typeof PRIORITIES)[number];

export class Todo extends Model {
  static get tableName() {
    return "todos";
  }

  //properties definitions
  id!: string;
  description!: string;
  done!: boolean;
  priority!: Priority;
  dueDate!: string | null;
  createdAt!: string;
  updatedAt!: string;

  //timestamp at the point of insertion
  $beforeInsert() {
    this.createdAt = new Date().toISOString();
    this.updatedAt = new Date().toISOString();
  }

  //timestamp at the point of update
  $beforeUpdate() {
    this.updatedAt = new Date().toISOString();
  }
}
