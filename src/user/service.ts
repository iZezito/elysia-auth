import { PrismaClient } from "../../generated/prisma";
import { password } from "bun";
import { NotFoundError, Static } from "elysia";
import type {
  UserInputCreate,
  UserPlain,
  UserPlainInputCreate,
} from "../../generated/prismabox/User";
import type { UserCreate, UserUpdate } from "./model";

const prisma = new PrismaClient({
  omit: {
    user: {
      password: true,
    },
  },
});

export abstract class UserService {
  static async save(user: UserCreate) {
    const bcryptHash = await Bun.password.hash(user.password, {
      algorithm: "bcrypt",
      cost: 10,
    });
    const entity = { ...user, password: bcryptHash };
    return prisma.user.create({
      data: entity,
    });
  }

  static async findById(id: number) {
    return prisma.user.findUnique({
      where: { id },
    });
  }

  static async update(body: UserUpdate, userId: number) {
    const userEntity = await prisma.user
      .findUniqueOrThrow({
        where: { id: userId },
      })
      .catch(() => {
        throw new NotFoundError();
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
}
