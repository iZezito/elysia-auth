import { t } from "elysia";

import { __transformDate__ } from "./__transformDate__";

import { __nullable__ } from "./__nullable__";

export const EmailVerificationPlain = t.Object(
  {
    id: t.Integer(),
    verificationToken: t.String(),
    expiryDate: t.Date(),
    userId: t.String(),
  },
  { additionalProperties: false },
);

export const EmailVerificationRelations = t.Object(
  {
    user: t.Object(
      {
        id: t.String(),
        name: t.String(),
        email: t.String(),
        role: t.Union([t.Literal("DEFAULT"), t.Literal("ADMIN")], {
          additionalProperties: false,
        }),
        password: t.String(),
        oauth2Provider: __nullable__(t.String()),
        emailVerified: __nullable__(t.Boolean()),
        twoFactorAuthenticationEnabled: __nullable__(t.Boolean()),
      },
      { additionalProperties: false },
    ),
  },
  { additionalProperties: false },
);

export const EmailVerificationPlainInputCreate = t.Object(
  { verificationToken: t.String(), expiryDate: t.Date() },
  { additionalProperties: false },
);

export const EmailVerificationPlainInputUpdate = t.Object(
  {
    verificationToken: t.Optional(t.String()),
    expiryDate: t.Optional(t.Date()),
  },
  { additionalProperties: false },
);

export const EmailVerificationRelationsInputCreate = t.Object(
  {
    user: t.Object(
      {
        connect: t.Object(
          {
            id: t.String({ additionalProperties: false }),
          },
          { additionalProperties: false },
        ),
      },
      { additionalProperties: false },
    ),
  },
  { additionalProperties: false },
);

export const EmailVerificationRelationsInputUpdate = t.Partial(
  t.Object(
    {
      user: t.Object(
        {
          connect: t.Object(
            {
              id: t.String({ additionalProperties: false }),
            },
            { additionalProperties: false },
          ),
        },
        { additionalProperties: false },
      ),
    },
    { additionalProperties: false },
  ),
);

export const EmailVerificationWhere = t.Partial(
  t.Recursive(
    (Self) =>
      t.Object(
        {
          AND: t.Union([Self, t.Array(Self, { additionalProperties: false })]),
          NOT: t.Union([Self, t.Array(Self, { additionalProperties: false })]),
          OR: t.Array(Self, { additionalProperties: false }),
          id: t.Integer(),
          verificationToken: t.String(),
          expiryDate: t.Date(),
          userId: t.String(),
        },
        { additionalProperties: false },
      ),
    { $id: "EmailVerification" },
  ),
);

export const EmailVerificationWhereUnique = t.Recursive(
  (Self) =>
    t.Intersect(
      [
        t.Partial(
          t.Object(
            {
              id: t.Integer(),
              verificationToken: t.String(),
              userId: t.String(),
            },
            { additionalProperties: false },
          ),
          { additionalProperties: false },
        ),
        t.Union(
          [
            t.Object({ id: t.Integer() }),
            t.Object({ verificationToken: t.String() }),
            t.Object({ userId: t.String() }),
          ],
          { additionalProperties: false },
        ),
        t.Partial(
          t.Object({
            AND: t.Union([
              Self,
              t.Array(Self, { additionalProperties: false }),
            ]),
            NOT: t.Union([
              Self,
              t.Array(Self, { additionalProperties: false }),
            ]),
            OR: t.Array(Self, { additionalProperties: false }),
          }),
          { additionalProperties: false },
        ),
        t.Partial(
          t.Object(
            {
              id: t.Integer(),
              verificationToken: t.String(),
              expiryDate: t.Date(),
              userId: t.String(),
            },
            { additionalProperties: false },
          ),
        ),
      ],
      { additionalProperties: false },
    ),
  { $id: "EmailVerification" },
);

export const EmailVerificationSelect = t.Partial(
  t.Object(
    {
      id: t.Boolean(),
      verificationToken: t.Boolean(),
      expiryDate: t.Boolean(),
      userId: t.Boolean(),
      user: t.Boolean(),
      _count: t.Boolean(),
    },
    { additionalProperties: false },
  ),
);

export const EmailVerificationInclude = t.Partial(
  t.Object(
    { user: t.Boolean(), _count: t.Boolean() },
    { additionalProperties: false },
  ),
);

export const EmailVerificationOrderBy = t.Partial(
  t.Object(
    {
      id: t.Union([t.Literal("asc"), t.Literal("desc")], {
        additionalProperties: false,
      }),
      verificationToken: t.Union([t.Literal("asc"), t.Literal("desc")], {
        additionalProperties: false,
      }),
      expiryDate: t.Union([t.Literal("asc"), t.Literal("desc")], {
        additionalProperties: false,
      }),
      userId: t.Union([t.Literal("asc"), t.Literal("desc")], {
        additionalProperties: false,
      }),
    },
    { additionalProperties: false },
  ),
);

export const EmailVerification = t.Composite(
  [EmailVerificationPlain, EmailVerificationRelations],
  { additionalProperties: false },
);

export const EmailVerificationInputCreate = t.Composite(
  [EmailVerificationPlainInputCreate, EmailVerificationRelationsInputCreate],
  { additionalProperties: false },
);

export const EmailVerificationInputUpdate = t.Composite(
  [EmailVerificationPlainInputUpdate, EmailVerificationRelationsInputUpdate],
  { additionalProperties: false },
);
