import { t } from "elysia";

import { __transformDate__ } from "./__transformDate__";

import { __nullable__ } from "./__nullable__";

export const PasswordResetTokenPlain = t.Object(
  {
    id: t.Integer(),
    token: t.String(),
    expiryDate: t.Date(),
    userId: __nullable__(t.Integer()),
  },
  { additionalProperties: false },
);

export const PasswordResetTokenRelations = t.Object(
  {
    user: __nullable__(
      t.Object(
        {
          id: t.Integer(),
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
    ),
  },
  { additionalProperties: false },
);

export const PasswordResetTokenPlainInputCreate = t.Object(
  { token: t.String(), expiryDate: t.Date() },
  { additionalProperties: false },
);

export const PasswordResetTokenPlainInputUpdate = t.Object(
  { token: t.Optional(t.String()), expiryDate: t.Optional(t.Date()) },
  { additionalProperties: false },
);

export const PasswordResetTokenRelationsInputCreate = t.Object(
  {
    user: t.Optional(
      t.Object(
        {
          connect: t.Object(
            {
              id: t.Integer({ additionalProperties: false }),
            },
            { additionalProperties: false },
          ),
        },
        { additionalProperties: false },
      ),
    ),
  },
  { additionalProperties: false },
);

export const PasswordResetTokenRelationsInputUpdate = t.Partial(
  t.Object(
    {
      user: t.Partial(
        t.Object(
          {
            connect: t.Object(
              {
                id: t.Integer({ additionalProperties: false }),
              },
              { additionalProperties: false },
            ),
            disconnect: t.Boolean(),
          },
          { additionalProperties: false },
        ),
      ),
    },
    { additionalProperties: false },
  ),
);

export const PasswordResetTokenWhere = t.Partial(
  t.Recursive(
    (Self) =>
      t.Object(
        {
          AND: t.Union([Self, t.Array(Self, { additionalProperties: false })]),
          NOT: t.Union([Self, t.Array(Self, { additionalProperties: false })]),
          OR: t.Array(Self, { additionalProperties: false }),
          id: t.Integer(),
          token: t.String(),
          expiryDate: t.Date(),
          userId: t.Integer(),
        },
        { additionalProperties: false },
      ),
    { $id: "PasswordResetToken" },
  ),
);

export const PasswordResetTokenWhereUnique = t.Recursive(
  (Self) =>
    t.Intersect(
      [
        t.Partial(
          t.Object(
            { id: t.Integer(), userId: t.Integer() },
            { additionalProperties: false },
          ),
          { additionalProperties: false },
        ),
        t.Union(
          [t.Object({ id: t.Integer() }), t.Object({ userId: t.Integer() })],
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
              token: t.String(),
              expiryDate: t.Date(),
              userId: t.Integer(),
            },
            { additionalProperties: false },
          ),
        ),
      ],
      { additionalProperties: false },
    ),
  { $id: "PasswordResetToken" },
);

export const PasswordResetTokenSelect = t.Partial(
  t.Object(
    {
      id: t.Boolean(),
      token: t.Boolean(),
      expiryDate: t.Boolean(),
      userId: t.Boolean(),
      user: t.Boolean(),
      _count: t.Boolean(),
    },
    { additionalProperties: false },
  ),
);

export const PasswordResetTokenInclude = t.Partial(
  t.Object(
    { user: t.Boolean(), _count: t.Boolean() },
    { additionalProperties: false },
  ),
);

export const PasswordResetTokenOrderBy = t.Partial(
  t.Object(
    {
      id: t.Union([t.Literal("asc"), t.Literal("desc")], {
        additionalProperties: false,
      }),
      token: t.Union([t.Literal("asc"), t.Literal("desc")], {
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

export const PasswordResetToken = t.Composite(
  [PasswordResetTokenPlain, PasswordResetTokenRelations],
  { additionalProperties: false },
);

export const PasswordResetTokenInputCreate = t.Composite(
  [PasswordResetTokenPlainInputCreate, PasswordResetTokenRelationsInputCreate],
  { additionalProperties: false },
);

export const PasswordResetTokenInputUpdate = t.Composite(
  [PasswordResetTokenPlainInputUpdate, PasswordResetTokenRelationsInputUpdate],
  { additionalProperties: false },
);
