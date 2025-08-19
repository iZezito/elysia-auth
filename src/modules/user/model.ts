import type { Static } from "elysia";
import type {
  UserInputUpdate,
  UserPlain,
  UserPlainInputCreate,
} from "@/generated/prismabox/User";

export type UserCreate = typeof UserPlainInputCreate.static;
export type UserUpdate = typeof UserInputUpdate.static;
export type User = typeof UserPlain.static;
