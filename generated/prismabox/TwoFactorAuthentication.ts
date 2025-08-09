import { t } from "elysia";

import { __transformDate__ } from "./__transformDate__";

import { __nullable__ } from "./__nullable__";

export const TwoFactorAuthenticationPlain = t.Object(
  {
    id: t.Integer(),
    code: t.String(),
    expiryDate: t.Date(),
    userId: t.Integer(),
  },
  { additionalProperties: false },
);

export const TwoFactorAuthenticationRelations = t.Object(
  {
    user: t.Object(
      {
        id: t.Integer(),
        name: t.String(),
        email: t.String(),
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

export const TwoFactorAuthenticationPlainInputCreate = t.Object(
  { code: t.String(), expiryDate: t.Date() },
  { additionalProperties: false },
);

export const TwoFactorAuthenticationPlainInputUpdate = t.Object(
  { code: t.Optional(t.String()), expiryDate: t.Optional(t.Date()) },
  { additionalProperties: false },
);

export const TwoFactorAuthenticationRelationsInputCreate = t.Object(
  {
    user: t.Object(
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
  },
  { additionalProperties: false },
);

export const TwoFactorAuthenticationRelationsInputUpdate = t.Partial(
  t.Object(
    {
      user: t.Object(
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
    },
    { additionalProperties: false },
  ),
);

export const TwoFactorAuthenticationWhere = t.Partial(
  t.Recursive(
    (Self) =>
      t.Object(
        {
          AND: t.Union([Self, t.Array(Self, { additionalProperties: false })]),
          NOT: t.Union([Self, t.Array(Self, { additionalProperties: false })]),
          OR: t.Array(Self, { additionalProperties: false }),
          id: t.Integer(),
          code: t.String(),
          expiryDate: t.Date(),
          userId: t.Integer(),
        },
        { additionalProperties: false },
      ),
    { $id: "TwoFactorAuthentication" },
  ),
);

export const TwoFactorAuthenticationWhereUnique = t.Recursive(
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
              code: t.String(),
              expiryDate: t.Date(),
              userId: t.Integer(),
            },
            { additionalProperties: false },
          ),
        ),
      ],
      { additionalProperties: false },
    ),
  { $id: "TwoFactorAuthentication" },
);

export const TwoFactorAuthenticationSelect = t.Partial(
  t.Object(
    {
      id: t.Boolean(),
      code: t.Boolean(),
      expiryDate: t.Boolean(),
      userId: t.Boolean(),
      user: t.Boolean(),
      _count: t.Boolean(),
    },
    { additionalProperties: false },
  ),
);

export const TwoFactorAuthenticationInclude = t.Partial(
  t.Object(
    { user: t.Boolean(), _count: t.Boolean() },
    { additionalProperties: false },
  ),
);

export const TwoFactorAuthenticationOrderBy = t.Partial(
  t.Object(
    {
      id: t.Union([t.Literal("asc"), t.Literal("desc")], {
        additionalProperties: false,
      }),
      code: t.Union([t.Literal("asc"), t.Literal("desc")], {
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

export const TwoFactorAuthentication = t.Composite(
  [TwoFactorAuthenticationPlain, TwoFactorAuthenticationRelations],
  { additionalProperties: false },
);

export const TwoFactorAuthenticationInputCreate = t.Composite(
  [
    TwoFactorAuthenticationPlainInputCreate,
    TwoFactorAuthenticationRelationsInputCreate,
  ],
  { additionalProperties: false },
);

export const TwoFactorAuthenticationInputUpdate = t.Composite(
  [
    TwoFactorAuthenticationPlainInputUpdate,
    TwoFactorAuthenticationRelationsInputUpdate,
  ],
  { additionalProperties: false },
);
