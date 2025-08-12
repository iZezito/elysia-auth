import { Elysia, t } from "elysia";
import { authSchema, google, type GoogleIdTokenClaims } from "./model";
import { AuthService } from "./service";
import jwt from "@elysiajs/jwt";
import { jwtService } from "./plugin/jwt";
import { auth } from "./plugin/middleware";
import * as arctic from "arctic";
import { UserService } from "../user/service";
import { User } from "../../generated/prismabox/User";

const pkceStore = new Map<string, { state: string; codeVerifier: string }>();

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
      const token = await jwt.sign({ userId: user.id });
      return {
        token,
      };
    },
    {
      body: authSchema,
    }
  )
  .get("/oauth/google", async ({ redirect }) => {
    console.log("Chama na poiva");
    const state = arctic.generateState();
    const codeVerifier = arctic.generateCodeVerifier();
    const scopes = ["openid", "profile", "email"];

    const url = google.createAuthorizationURL(state, codeVerifier, scopes);
    url.searchParams.set("access_type", "offline");

    pkceStore.set(state, { state, codeVerifier });
    console.log(url.toString());
    return redirect(url.toString());
  })
  .get("/oauth/google/callback", async ({ query, status, jwt }) => {
    const code = query.code as string;
    const state = query.state as string;

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

      const user = await UserService.save({
        password: "ttttttttttttt",
        oauth2Provider: "google",
        email: claims.email,
        name: claims.name,
      });

      const token = await jwt.sign({ userId: user.id });

      return { token, user };
    } catch (e) {
      if (e instanceof arctic.OAuth2RequestError) {
        return status(400, { error: "Invalid authorization code" });
      }
      if (e instanceof arctic.ArcticFetchError) {
        return status(500, { error: "Fetch error" });
      }
      return status(500, { error: "Unexpected error" });
    }
  });
