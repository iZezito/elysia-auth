import { Elysia } from "elysia";
import { jwt } from "@elysiajs/jwt";
import { bearer } from "@elysiajs/bearer";

export const authenticated = new Elysia({ name: "auth-plugin" })
  .use(
    jwt({
      name: "jwt",
      secret: "12345678",
      exp: "7d",
    })
  )
  .use(bearer())
  .macro({
    requireAuth: {
      async resolve({ bearer, jwt, status }) {
        if (!bearer) {
          return status(401, {
            error: "Token de autenticação não fornecido",
            message:
              "É necessário fornecer um token Bearer no header Authorization",
          });
        }

        try {
          const payload = await jwt.verify(bearer);

          if (!payload) {
            return status(401, {
              error: "Token inválido",
              message: "O token fornecido é inválido ou expirou",
            });
          }

          return {
            user: payload,
          };
        } catch (error) {
          return status(401, {
            error: "Erro na verificação do token",
            message: "Falha ao verificar o token de autenticação",
          });
        }
      },
    },
  })
  .get("/sign/:name", async ({ jwt, params: { name } }) => {
    return jwt.sign({ name });
  });
