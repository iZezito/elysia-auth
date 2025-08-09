import { Elysia, t } from "elysia";
import { PrismaClient } from "../../generated/prisma";
import {
  UserInputUpdate,
  UserPlain,
  UserPlainInputCreate,
} from "../../generated/prismabox/User";
import { UserService } from "./service";
import { authenticated } from "../auth/plugin/middleware";
import { sendMail } from "../lib/mail";
import { renderResetPasswordEmail, renderVerifyEmail } from "../emails/render";

const prisma = new PrismaClient();

export const userController = new Elysia({ prefix: "/users" })
  .use(authenticated)
  .post(
    "",
    async ({ body }) => {
      const userEntity = await UserService.save(body);
      const token = UserService.createVerificatioEmailToken(userEntity.id);
      const html = renderVerifyEmail(
        `${process.env.CLIENT_URL}/validate-email?token=${token}`
      );
      sendMail(userEntity.email, "Account Verify", html);

      return userEntity;
    },
    {
      body: UserPlainInputCreate,
      response: UserPlain,
    }
  )
  .put(
    "/:id",
    async ({ status, body, user, params: { id } }) => {
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
      const usuario = await UserService.findById(+user.userId);

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
  )
  .get(
    "/email/:email",
    async ({ params: { email } }) => {
      return (await UserService.findByEmail(email)) === null;
    },
    {
      params: t.Object({
        email: t.String({
          format: "email",
        }),
      }),
    }
  )
  .get(
    "validate-email",
    async ({ query: { token } }) => {
      const validated = await UserService.validateEmail(token);
      if (validated) {
        return "Email verified successfully!";
      }
      return "Invalid or expired verification token.";
    },
    {
      query: t.Object({
        token: t.String({
          format: "email",
        }),
      }),
    }
  )
  .post(
    "forgot-password",
    async ({ query: { email } }) => {
      const userEntity = await UserService.findByEmail(email);
      if (userEntity !== null) {
        const resetToken = await UserService.createPasswordResetToken(
          userEntity.id
        );
        const html = renderResetPasswordEmail(
          `${process.env.CLIENT_URL}/reset-password?token=${resetToken}`
        );
        sendMail(userEntity.email, "Password Reset", html);
      }
      return "If an account with that email address exists, it will receive an email with instructions for resetting its password.";
    },
    {
      query: t.Object({
        email: t.String({
          format: "email",
        }),
      }),
    }
  )
  .post(
    "password-reset",
    async ({ status, query: { token, newPassword } }) => {
      const resetToken = await UserService.findByToken(token);

      if (new Date() > resetToken.expiryDate) {
        status(410, "Token expired.");
      }

      if (resetToken.userId !== null) {
        UserService.updatePassword()
      }
    },
    {
      query: t.Object({
        newPassword: t.String({
          minLength: 6,
        }),
        token: t.String(),
      }),
    }
  );
