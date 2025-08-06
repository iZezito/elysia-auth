import { Elysia, t } from "elysia";

import { PrismaClient } from "../../generated/prisma";
import {
  UserPlain,
  UserPlainInputCreate,
} from "../../generated/prismabox/User";
import { UserService } from "./service";
import { authenticated } from "../auth/plugin/protected-routes";

const prisma = new PrismaClient();

export const userController = new Elysia({ prefix: "/users" })
  .use(authenticated)
  .post("", async ({ body }) => UserService.save(body), {
    body: UserPlainInputCreate,
    response: UserPlain,
  })
  .get(
    "",
    async ({ status, user }) => {
      console.log(user);
      const usuario = await UserService.findById(7);

      if (!usuario) return status(404, "User not found");

      return usuario;
    },
    {
      requireAuth: true,
      response: {
        200: UserPlain,
        404: t.String(),
      },
    }
  );
