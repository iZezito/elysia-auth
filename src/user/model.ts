import type { Static } from "elysia";
import type { UserPlainInputCreate } from "../../generated/prismabox/User";

export type UserCreate = Static<typeof UserPlainInputCreate>;
