import type { AuthBody } from "./model";
import { PrismaClient } from "../../generated/prisma";
import { BadCredentials } from "../exceptions/bad-credentials";
import { password } from "bun";

const prisma = new PrismaClient();

export abstract class AuthService {
  static async login(body: AuthBody) {
    const userEntity = await prisma.user
      .findUniqueOrThrow({
        where: { email: body.email },
      })
      .catch(() => {
        throw new BadCredentials();
      });

    const verifySenha = await password.verify(
      body.password,
      userEntity.password
    );

    if (!verifySenha) {
      throw new BadCredentials();
    }

    return userEntity;
  }
}
