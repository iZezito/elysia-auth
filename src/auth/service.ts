import type { AuthBody } from "./model";
import { PrismaClient } from "@/generated/prisma";
import { password } from "bun";
import { renderOtpEmail } from "@/emails/render";
import { sendMail } from "@/lib/mail";
import { type User } from "@/modules/user/model";
import { addHours, isAfter } from "date-fns";
import { BadCredentialsError } from "@/error";

const prisma = new PrismaClient();

export abstract class AuthService {
  static async login(body: AuthBody) {
    const userEntity = await prisma.user
      .findUniqueOrThrow({
        where: { email: body.email },
      })
      .catch(() => {
        throw new BadCredentialsError();
      });

    const verifySenha = await password.verify(
      body.password,
      userEntity.password
    );

    if (!verifySenha) {
      throw new BadCredentialsError();
    }

    return userEntity;
  }

  static async send2FACode(user: User) {
    const twoFactorAuthentication =
      await prisma.twoFactorAuthentication.findUnique({
        where: { userId: user.id },
      });
    if (twoFactorAuthentication !== null)
      await prisma.twoFactorAuthentication.delete({
        where: { id: twoFactorAuthentication.id },
      });
    const code = Math.floor(100000 + Math.random() * 900000).toString();
    await prisma.twoFactorAuthentication.create({
      data: {
        userId: user.id,
        code,
        expiryDate: addHours(new Date(), 2),
      },
    });
    const html = renderOtpEmail(code);
    sendMail(user.email, "Two-Factor Authentication Code", html);
  }

  static async validate2FACode(userId: string, code: string) {
    const twoFactorAuth = await prisma.twoFactorAuthentication.findUnique({
      where: { userId },
    });

    const isValid =
      twoFactorAuth &&
      twoFactorAuth.code === code &&
      isAfter(twoFactorAuth.expiryDate, new Date());

    if (isValid)
      prisma.twoFactorAuthentication.delete({
        where: { id: twoFactorAuth.id },
      });
    return isValid;
  }
}
