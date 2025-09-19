import { PrismaPg } from "@prisma/adapter-pg";
import { PrismaClient } from "@/generated/prisma";

const adapter = new PrismaPg({ connectionString: process.env.DATABASE_URL });
export const db = new PrismaClient({ adapter });

// import { PrismaClient } from "@/generated/prisma";

// export const db = new PrismaClient({
//   omit: {
//     user: {
//       password: true,
//     },
//   },
// });
