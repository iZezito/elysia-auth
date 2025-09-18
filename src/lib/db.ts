import { PrismaClient } from "@/generated/prisma";

export const db = new PrismaClient({
  omit: {
    user: {
      password: true,
    },
  },
});
