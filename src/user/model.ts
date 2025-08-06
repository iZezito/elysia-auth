import type { Static } from "elysia";
import type {
  UserInputUpdate,
  UserPlainInputCreate,
} from "../../generated/prismabox/User";

export type UserCreate = Static<typeof UserPlainInputCreate>;
export type UserUpdate = Static<typeof UserInputUpdate>;
