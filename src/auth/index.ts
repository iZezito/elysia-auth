import { Elysia } from "elysia";
import { authSchema } from "./model";
import { AuthService } from "./service";
import jwt from "@elysiajs/jwt";

export const authController = new Elysia({ prefix: "/auth" })
  .use(
    jwt({
      name: "jwt",
      secret: "12345678",
      exp: "7d",
    })
  )
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
