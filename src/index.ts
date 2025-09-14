import { Elysia } from "elysia";
import { userController } from "@/modules/user";
import swagger from "@elysiajs/swagger";
import cors from "@elysiajs/cors";
import { authController } from "@/auth";
import { CustomizedError, UnauthorizedError } from "./error";

const app = new Elysia()
  .use(
    cors({
      origin: process.env.CLIENT_URL! || "http://localhost:5173",
      methods: ["GET", "POST", "PUT", "DELETE", "OPTIONS", "PATCH"],
      allowedHeaders: ["Content-Type", "Authorization"],
      credentials: true,
    })
  )
  .onError(({ error }) => {
    if (error instanceof CustomizedError) {
      return {
        message: error.message,
        code: error.status,
        timestamp: new Date().toISOString(),
      };
    }
  })
  .use(swagger())
  .use(userController)
  .use(authController)
  .listen(3000);

console.log(
  `🦊 Elysia is running at ${app.server?.hostname}:${app.server?.port}`
);
