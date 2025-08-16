import { Elysia } from "elysia";
import { jwtService } from "./jwt";
import { bearer } from "@elysiajs/bearer";

export const authenticated = new Elysia({ name: "auth-plugin" })
  .use(jwtService)
  .use(bearer())
  .macro({
    requireAdmin: {
      async resolve({ bearer, jwt, status }) {
        if (!bearer) {
          return status(401, {
            error: "Authentication token not provided",
            message:
              "You must provide a Bearer token in the Authorization header.",
          });
        }

        try {
          const payload = await jwt.verify(bearer);

          if (!payload) {
            return status(401, {
              error: "Invalid token",
              message: "The token provided is invalid or expired",
            });
          }
          console.log("role: ", payload.role);

          if (payload.role !== "ADMIN") {
            return status(401, {
              error: "Unauthorized",
              message: "You do not have access to this feature",
            });
          }
          return {
            user: payload,
          };
        } catch (error) {
          return status(401, {
            error: "Error verifying token",
            message: "Failed to verify authentication token",
          });
        }
      },
    },
  });

export const auth = new Elysia()
  .use(jwtService)
  .use(bearer())
  .derive({ as: "scoped" }, async ({ bearer, jwt, status }) => {
    if (!bearer) {
      return status(401, {
        error: "Authentication token not provided",
        message: "You must provide a Bearer token in the Authorization header.",
      });
    }
    const payload = await jwt.verify(bearer);

    if (!payload) {
      return status(401, {
        error: "Invalid token",
        message: "The token provided is invalid or expired",
      });
    }

    return { user: payload };
  });
