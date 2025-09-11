import { Elysia } from "elysia";
import { userController } from "@/modules/user";
import swagger from "@elysiajs/swagger";
import cors from "@elysiajs/cors";
import { authController } from "@/auth";

const app = new Elysia()
  .use(
    cors({
      origin: "http://localhost:5173",
      methods: ["GET", "POST", "PUT", "DELETE", "OPTIONS", "PATCH"],
      allowedHeaders: ["Content-Type", "Authorization"],
      credentials: true,
    })
  )
  .use(swagger())
  .use(userController)
  .use(authController)
  .listen(3000);

console.log(
  `🦊 Elysia is running at ${app.server?.hostname}:${app.server?.port}`
);
