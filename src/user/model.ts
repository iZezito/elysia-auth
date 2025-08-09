import type { Static } from "elysia";
import type {
  UserInputUpdate,
  UserPlain,
  UserPlainInputCreate,
} from "../../generated/prismabox/User";

export type UserCreate = Static<typeof UserPlainInputCreate>;
export type UserUpdate = Static<typeof UserInputUpdate>;
export type User = Static<typeof UserPlain>;
