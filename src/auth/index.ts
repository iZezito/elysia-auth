import { Elysia, t } from "elysia";
import { authSchema, google, type GoogleIdTokenClaims } from "./model";
import { AuthService } from "./service";
import jwt from "@elysiajs/jwt";
import { jwtService } from "./plugin/jwt";
import { auth } from "./plugin/middleware";
import * as arctic from "arctic";
import { UserService } from "@/modules/user/service";
import { User } from "@/generated/prismabox/User";

export const authController = new Elysia({ prefix: "/auth" })
  .use(jwtService)
  .post(
    "/login",
    async ({ status, body, jwt }) => {
      const user = await AuthService.login(body);
      if (!user.emailVerified) {
        return status(403, "Email not validated, check your inbox!");
      }
      if (user.twoFactorAuthenticationEnabled) {
        if (!body.codeOTP) {
          AuthService.send2FACode(user);
          return status(202, "Authentication Code sent to email.");
        }

        const isCodeValid = await AuthService.validate2FACode(
          user.id,
          body.codeOTP
        );

        if (!isCodeValid) return status(400, "Invalid or expired 2FA code.");
      }
      const token = await jwt.sign({ userId: user.id, role: user.role });
      return {
        token,
      };
    },
    {
      body: authSchema,
    }
  )
  .decorate(
    "pkceStore",
    new Map<string, { state: string; codeVerifier: string }>()
  )
  .get("/oauth/google", async ({ redirect, pkceStore }) => {
    const state = arctic.generateState();
    const codeVerifier = arctic.generateCodeVerifier();
    const scopes = ["openid", "profile", "email"];

    const url = google.createAuthorizationURL(state, codeVerifier, scopes);
    url.searchParams.set("access_type", "offline");
    pkceStore.set(state, { state, codeVerifier });

    console.log(url.toString());
    return redirect(url.toString());
  })
  .get(
    "/oauth/google/callback",
    async ({ query: { code, state }, status, jwt, pkceStore, redirect }) => {
      const sessionData = pkceStore.get(state);
      if (!sessionData) {
        return status(400, { error: "Invalid state" });
      }

      try {
        const tokens = await google.validateAuthorizationCode(
          code,
          sessionData.codeVerifier
        );

        const accessToken = tokens.accessToken();
        const idToken = tokens.idToken();
        const claims = arctic.decodeIdToken(idToken) as GoogleIdTokenClaims;

        let userEntity = await UserService.findByEmail(claims.email);
        if (!userEntity) {
          userEntity = await UserService.save({
            password: "ttttttttttttt",
            oauth2Provider: "google",
            email: claims.email,
            name: claims.name,
          });
        }

        const token = await jwt.sign({
          userId: userEntity.id,
          role: userEntity.role,
        });

        return redirect(
          `${process.env.CLIENT_URL}/oauth-success?token=${token}`
        );
      } catch (e) {
        if (e instanceof arctic.OAuth2RequestError) {
          return status(400, { error: "Invalid authorization code" });
        }
        if (e instanceof arctic.ArcticFetchError) {
          return status(500, { error: "Fetch error" });
        }
        return status(500, { error: "Unexpected error" });
      }
    },
    {
      query: t.Object({
        code: t.String(),
        state: t.String(),
      }),
    }
  );
