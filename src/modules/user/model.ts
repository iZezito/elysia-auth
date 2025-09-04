import type { Static } from "elysia";
import type {
  UserInputUpdate,
  UserPlain,
  UserPlainInputCreate,
} from "@/generated/prismabox/User";

export type UserCreate = typeof UserPlainInputCreate.static;
export type UserUpdate = typeof UserInputUpdate.static;
export type User = typeof UserPlain.static;

export class BadCredentials extends Error {
  status = 401;

  constructor(public message: string) {
    super(message);
  }

  toResponse() {
    return Response.json(
      {
        error: this.message,
        code: this.status,
      },
      {
        status: this.status,
      }
    );
  }
}
