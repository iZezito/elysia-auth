import { Elysia } from "elysia";
import { userController } from "./user";
import swagger from "@elysiajs/swagger";
import jwt from "@elysiajs/jwt";
import { authenticated } from "./auth/plugin/middleware";
import cors from "@elysiajs/cors";
import { authController } from "./auth";

const app = new Elysia()
  .use(
    cors({
      credentials: true,
      origin: "http://localhost:5173",
      methods: ["GET", "POST", "PUT", "DELETE", "OPTIONS", "PATCH"],
      allowedHeaders: ["Content-Type", "Authorization"],
    })
  )
  .use(swagger())
  .use(userController)
  .use(authController)
  .listen(3000);

console.log(
  `🦊 Elysia is running at ${app.server?.hostname}:${app.server?.port}`
);
