import { Task } from "./Task";
import { z } from "zod";
import { createInsertSchema } from "drizzle-zod";

const baseSchema = createInsertSchema();
type Category = {
  id: string;
  name: string;
  description: string;
  tasks: Task[];
  createdAt: Date;
  updatedAt: Date;
};

export type { Category };
