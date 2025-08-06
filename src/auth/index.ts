import { Elysia } from "elysia";
import { authSchema } from "./model";
import { AuthService } from "./service";
import jwt from "@elysiajs/jwt";
import { jwtService } from "./plugin/jwt";

export const authController = new Elysia({ prefix: "/auth" })
  .use(jwtService)
  .post(
    "/login",
    async ({ body, jwt }) => {
      const user = await AuthService.login(body);
      const token = await jwt.sign({ userId: user.id });
      return {
        token,
      };
    },
    {
      body: authSchema,
    }
  );
