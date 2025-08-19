import { PrismaClient } from "@/generated/prisma";
import { password, randomUUIDv7 } from "bun";
import { status } from "elysia";
import type { UserCreate, UserUpdate } from "./model";
import { addDays, addHours, isAfter } from "date-fns";

const prisma = new PrismaClient({
  omit: {
    user: {
      password: true,
    },
  },
});

export abstract class UserService {
  static async save(user: UserCreate) {
    const bcryptHash = await password.hash(user.password, {
      algorithm: "bcrypt",
      cost: 10,
    });
    return prisma.user.create({
      data: {
        ...user,
        emailVerified: false,
        password: bcryptHash,
      },
    });
  }

  static async updatePassword(userId: number, newPassword: string) {
    const bcryptHash = await password.hash(newPassword, {
      algorithm: "bcrypt",
      cost: 10,
    });
    await prisma.user.update({
      where: { id: userId },
      data: {
        password: bcryptHash,
      },
    });
  }

  static async findById(id: number) {
    return prisma.user
      .findUniqueOrThrow({
        where: { id },
      })
      .catch(() => {
        throw status(404, "User not found!");
      });
  }

  static async update(body: UserUpdate, userId: number) {
    const userEntity = await prisma.user
      .findUniqueOrThrow({
        where: { id: userId },
      })
      .catch(() => {
        throw status(404, "User not found!");
      });

    return await prisma.user.update({
      where: {
        id: userEntity.id,
      },
      data: {
        name: body.name,
        twoFactorAuthenticationEnabled: body.twoFactorAuthenticationEnabled,
      },
    });
  }

  static async createVerificatioEmailToken(userId: number) {
    const verificationToken = randomUUIDv7();
    await prisma.emailVerification.create({
      data: {
        verificationToken,
        userId,
        expiryDate: addDays(new Date(), 1),
      },
    });
    return verificationToken;
  }

  static async createPasswordResetToken(userId: number) {
    const token = randomUUIDv7();
    await prisma.passwordResetToken.create({
      data: {
        token,
        userId,
        expiryDate: addHours(new Date(), 1),
      },
    });
    return token;
  }

  static async findByEmail(email: string) {
    return await prisma.user.findUnique({ where: { email } });
  }

  static async validateEmail(token: string) {
    const emailVerification = await prisma.emailVerification
      .findUniqueOrThrow({
        where: {
          verificationToken: token,
        },
      })
      .catch(() => {
        throw status(404, "Email verification not found for this token");
      });

    if (
      emailVerification !== null &&
      isAfter(emailVerification.expiryDate, new Date())
    ) {
      await prisma.user.update({
        where: { id: emailVerification.userId },
        data: {
          emailVerified: true,
        },
      });
      await prisma.emailVerification.delete({
        where: { id: emailVerification.id },
      });
      return true;
    }
    return false;
  }

  static async findByToken(token: string) {
    return await prisma.passwordResetToken
      .findFirstOrThrow({
        where: {
          token,
        },
      })
      .catch(() => {
        throw status(404, "Password Reset not found for this token");
      });
  }
}
