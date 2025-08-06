import { PrismaClient } from "../../generated/prisma";
import { password } from "bun";
import { Static } from "elysia";
import type {
  UserInputCreate,
  UserPlain,
  UserPlainInputCreate,
} from "../../generated/prismabox/User";
import type { UserCreate } from "./model";

const prisma = new PrismaClient();

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
}
