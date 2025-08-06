import { Elysia, status, t } from "elysia";

import { PrismaClient } from "../../generated/prisma";
import {
  UserInputUpdate,
  UserPlain,
  UserPlainInputCreate,
} from "../../generated/prismabox/User";
import { UserService } from "./service";
import { authenticated } from "../auth/plugin/middleware";

const prisma = new PrismaClient();

export const userController = new Elysia({ prefix: "/users" })
  .use(authenticated)
  .post("", async ({ body }) => UserService.save(body), {
    body: UserPlainInputCreate,
    response: UserPlain,
  })
  .put(
    "/:id",
    async ({ body, user, params: { id } }) => {
      if (id !== user.userId) return status(401);

      return UserService.update(body, user.userId);
    },
    {
      requireAuth: true,
      body: UserInputUpdate,
      params: t.Object({
        id: t.Number(),
      }),
    }
  )
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
