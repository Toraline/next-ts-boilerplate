import { Category } from "./Category";

type Task = {
  id: string;
  title: string;
  description: string;
  status: "pending" | "in-progress" | "completed";
  type: "task" | "event" | "habit";
  startDate?: Date;
  endDate?: Date | null;
  repeatEvery?: "day" | "week" | "month" | "year" | null;
  category: Category;
  createdAt: Date;
  updatedAt: Date;
};

export type { Task };
