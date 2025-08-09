import { Elysia } from "elysia";
import { authSchema } from "./model";
import { AuthService } from "./service";
import jwt from "@elysiajs/jwt";
import { jwtService } from "./plugin/jwt";

export const authController = new Elysia({ prefix: "/auth" })
  .use(jwtService)
  .post(
    "/login",
    async ({ status, body, jwt }) => {
      const user = await AuthService.login(body);
      if (!user.emailVerified) {
        return status(403, "Email not validated, check your inbox!");
      }
      if (user.twoFactorAuthenticationEnabled) {
        if (!body.codeOTP) {
          AuthService.send2FACode(user);
          return status(202, "Authentication Code sent to email.");
        }

        const isCodeValid = await AuthService.validate2FACode(
          user.id,
          body.codeOTP
        );

        if (!isCodeValid) return status(400, "Invalid or expired 2FA code.");
      }
      const token = await jwt.sign({ userId: user.id });
      return {
        token,
      };
    },
    {
      body: authSchema,
    }
  );
