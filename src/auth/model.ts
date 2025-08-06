import { t, type Static } from "elysia";

export const authSchema = t.Object({
  email: t.String({
    format: "email",
  }),
  password: t.String({
    minLength: 6,
  }),
  codeOTP: t.Optional(t.String()),
});

export type AuthBody = Static<typeof authSchema>;
