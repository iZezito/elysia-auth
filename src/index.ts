import { Elysia } from "elysia";
import { userController } from "./user";
import swagger from "@elysiajs/swagger";
import jwt from "@elysiajs/jwt";
import { authenticated } from "./auth/plugin/protected-routes";
import cors from "@elysiajs/cors";
import { authController } from "./auth";

const app = new Elysia()
  .use(
    cors({
      origin: true,
      methods: ["GET", "POST", "PUT", "DELETE"],
      allowedHeaders: ["Content-Type", "Authorization"],
    })
  )
  .use(swagger())
  .use(userController)
  .use(authController)
  .get("/", () => "Hello Elysia")
  .listen(3000);

console.log(
  `🦊 Elysia is running at ${app.server?.hostname}:${app.server?.port}`
);
