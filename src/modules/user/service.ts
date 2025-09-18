import { PrismaClient } from "@/generated/prisma";
import { password, randomUUIDv7 } from "bun";
import type { UserCreate, UserUpdate } from "./model";
import { addDays, addHours, isAfter } from "date-fns";
import { NotFoundError } from "@/error";
import { db } from "@/lib/db";

export abstract class UserService {
  static async save(user: UserCreate) {
    const bcryptHash = await password.hash(user.password, {
      algorithm: "bcrypt",
      cost: 10,
    });
    return db.user.create({
      data: {
        ...user,
        emailVerified: false,
        password: bcryptHash,
      },
    });
  }

  static async updatePassword(userId: string, newPassword: string) {
    const bcryptHash = await password.hash(newPassword, {
      algorithm: "bcrypt",
      cost: 10,
    });
    await db.user.update({
      where: { id: userId },
      data: {
        password: bcryptHash,
      },
    });
  }

  static async findById(id: string) {
    return db.user
      .findUniqueOrThrow({
        where: { id },
      })
      .catch(() => {
        throw new NotFoundError("User not found!");
      });
  }

  static async update(body: UserUpdate, userId: string) {
    const userEntity = await db.user
      .findUniqueOrThrow({
        where: { id: userId },
      })
      .catch(() => {
        throw new NotFoundError("User not found!");
      });

    return await db.user.update({
      where: {
        id: userEntity.id,
      },
      data: {
        name: body.name,
        twoFactorAuthenticationEnabled: body.twoFactorAuthenticationEnabled,
      },
    });
  }

  static async createVerificatioEmailToken(userId: string) {
    const verificationToken = randomUUIDv7();
    await db.emailVerification.create({
      data: {
        verificationToken,
        userId,
        expiryDate: addDays(new Date(), 1),
      },
    });
    return verificationToken;
  }

  static async createPasswordResetToken(userId: string) {
    const token = randomUUIDv7();

    await db.passwordResetToken.upsert({
      where: { userId },
      update: {
        token,
        expiryDate: addHours(new Date(), 1),
      },
      create: {
        token,
        userId,
        expiryDate: addHours(new Date(), 1),
      },
    });

    return token;
  }

  static async findByEmail(email: string) {
    return await db.user.findUnique({ where: { email } });
  }

  static async validateEmail(token: string) {
    const emailVerification = await db.emailVerification
      .findUniqueOrThrow({
        where: {
          verificationToken: token,
        },
      })
      .catch(() => {
        throw new NotFoundError("Email verification not found for this token");
      });

    if (
      emailVerification !== null &&
      isAfter(emailVerification.expiryDate, new Date())
    ) {
      await db.user.update({
        where: { id: emailVerification.userId },
        data: {
          emailVerified: true,
        },
      });
      await db.emailVerification.delete({
        where: { id: emailVerification.id },
      });
      return true;
    }
    return false;
  }

  static async findByToken(token: string) {
    return await db.passwordResetToken
      .findFirstOrThrow({
        where: {
          token,
        },
      })
      .catch(() => {
        throw new NotFoundError("Password Reset not found for this token");
      });
  }
}
