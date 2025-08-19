import { Elysia, t } from "elysia";
import { PrismaClient } from "../../generated/prisma";
import {
  UserInputUpdate,
  UserPlain,
  UserPlainInputCreate,
  UserPlainInputUpdate,
} from "../../generated/prismabox/User";
import { UserService } from "./service";
import { auth, authenticated } from "../auth/plugin/middleware";
import { sendMail } from "../lib/mail";
import { renderResetPasswordEmail, renderVerifyEmail } from "../emails/render";
import { isBefore } from "date-fns";

const prisma = new PrismaClient();

export const userController = new Elysia({ prefix: "/users" })
  .post(
    "",
    async ({ body, status }) => {
      const userEntity = await UserService.save(body);
      const token = await UserService.createVerificatioEmailToken(
        userEntity.id
      );
      const html = renderVerifyEmail(
        `${process.env.CLIENT_URL}/validate-email?token=${token}`
      );
      sendMail(userEntity.email, "Account Verify", html);

      return status(201, userEntity);
    },
    {
      body: UserPlainInputCreate,
      response: { 201: UserPlain },
    }
  )
  .use(authenticated)
  .get(
    "/:id",
    async ({ params: { id } }) => {
      return await UserService.findById(id);
    },
    {
      requireRole: "ADMIN",
      params: t.Object({
        id: t.Number(),
      }),
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
    "/email-verification",
    async ({ query: { token } }) => {
      const validated = await UserService.validateEmail(token);
      if (validated) {
        return "Email verified successfully!";
      }
      return "Invalid or expired verification token.";
    },
    {
      query: t.Object({
        token: t.String(),
      }),
    }
  )
  .post(
    "/password-reset-requests",
    async ({ body: { email } }) => {
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
      body: t.Object({
        email: t.String({
          format: "email",
        }),
      }),
    }
  )
  .put(
    "/password-reset",
    async ({ status, body: { token, newPassword } }) => {
      const resetToken = await UserService.findByToken(token);

      if (isBefore(resetToken.expiryDate, new Date())) {
        return status(410, "Token expired.");
      }

      if (resetToken.userId !== null) {
        await UserService.updatePassword(resetToken.userId, newPassword);
      }

      return "Password changed successfully.";
    },
    {
      body: t.Object({
        newPassword: t.String({
          minLength: 6,
        }),
        token: t.String(),
      }),
    }
  )
  .use(auth)
  .put(
    "/:id",
    async ({ status, body, user, params: { id } }) => {
      if (id !== user.userId) return status(401);

      return await UserService.update(body, user.userId);
    },
    {
      body: UserPlainInputUpdate,
      params: t.Object({
        id: t.Number(),
      }),
    }
  )
  .get(
    "",
    async ({ status, user }) => {
      const usuario = await UserService.findById(+user.userId);

      if (!usuario) return status(404, "User not found");

      return usuario;
    },
    {
      response: {
        200: UserPlain,
        404: t.String(),
      },
    }
  );
