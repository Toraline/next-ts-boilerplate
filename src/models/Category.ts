import { Task } from "./Task";

type Category = {
  id: string;
  name: string;
  description: string;
  tasks: Task[];
  createdAt: Date;
  updatedAt: Date;
};

export type { Category };
