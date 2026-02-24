import z from "zod";
import {
  updateUserSchema,
  createUserSchema,
  listUsersResponseSchema,
  listUsersQuerySchema,
  userPublicSchema,
  usersListFiltersSchema,
} from "./schema";

export type CreateUser = z.infer<typeof createUserSchema>;

export type User = z.infer<typeof userPublicSchema>;

export type UpdateUser = z.infer<typeof updateUserSchema>;

export type ListUsersQuery = z.infer<typeof listUsersQuerySchema>;

export type ListUsersResponse = z.infer<typeof listUsersResponseSchema>;

export type UsersListFilters = z.infer<typeof usersListFiltersSchema>;
