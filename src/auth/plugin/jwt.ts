import { jwt } from "@elysiajs/jwt";
import Elysia from "elysia";

export const jwtService = new Elysia({ name: "jwt-plugin" }).use(
  jwt({
    name: "jwt",
    secret: "12345678",
    exp: "4d",
  })
);
