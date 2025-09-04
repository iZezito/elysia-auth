import { t } from "elysia";

import { __transformDate__ } from "./__transformDate__";

import { __nullable__ } from "./__nullable__";

export const UserPlain = t.Object(
  {
    id: t.String(),
    name: t.String(),
    email: t.String(),
    role: t.Union([t.Literal("DEFAULT"), t.Literal("ADMIN")], {
      additionalProperties: false,
    }),
    password: t.Optional(t.String()),
    oauth2Provider: __nullable__(t.String()),
    emailVerified: __nullable__(t.Boolean()),
    twoFactorAuthenticationEnabled: __nullable__(t.Boolean()),
  },
  { additionalProperties: false }
);

export const UserRelations = t.Object(
  {
    posts: t.Array(
      t.Object(
        {
          id: t.Integer(),
          title: __nullable__(t.String()),
          authorId: t.String(),
        },
        { additionalProperties: false }
      ),
      { additionalProperties: false }
    ),
    emailVerification: __nullable__(
      t.Object(
        {
          id: t.Integer(),
          verificationToken: t.String(),
          expiryDate: t.Date(),
          userId: t.String(),
        },
        { additionalProperties: false }
      )
    ),
    passwordResetToken: __nullable__(
      t.Object(
        {
          id: t.Integer(),
          token: t.String(),
          expiryDate: t.Date(),
          userId: __nullable__(t.String()),
        },
        { additionalProperties: false }
      )
    ),
    twoFactorAuthentication: __nullable__(
      t.Object(
        {
          id: t.Integer(),
          code: t.String(),
          expiryDate: t.Date(),
          userId: t.String(),
        },
        { additionalProperties: false }
      )
    ),
  },
  { additionalProperties: false }
);

export const UserPlainInputCreate = t.Object(
  {
    name: t.String(),
    email: t.String({
      format: "email",
    }),
    role: t.Optional(
      t.Union([t.Literal("DEFAULT"), t.Literal("ADMIN")], {
        additionalProperties: false,
      })
    ),
    password: t.String({
      minLength: 6,
    }),
    oauth2Provider: t.Optional(__nullable__(t.String())),
    emailVerified: t.Optional(__nullable__(t.Boolean())),
    twoFactorAuthenticationEnabled: t.Optional(__nullable__(t.Boolean())),
  },
  { additionalProperties: false }
);

export const UserPlainInputUpdate = t.Object(
  {
    name: t.Optional(t.String()),
    email: t.Optional(t.String()),
    role: t.Optional(
      t.Union([t.Literal("DEFAULT"), t.Literal("ADMIN")], {
        additionalProperties: false,
      })
    ),
    password: t.Optional(t.String()),
    oauth2Provider: t.Optional(__nullable__(t.String())),
    emailVerified: t.Optional(__nullable__(t.Boolean())),
    twoFactorAuthenticationEnabled: t.Optional(__nullable__(t.Boolean())),
  },
  { additionalProperties: false }
);

export const UserRelationsInputCreate = t.Object(
  {
    posts: t.Optional(
      t.Object(
        {
          connect: t.Array(
            t.Object(
              {
                id: t.Integer({ additionalProperties: false }),
              },
              { additionalProperties: false }
            ),
            { additionalProperties: false }
          ),
        },
        { additionalProperties: false }
      )
    ),
    emailVerification: t.Optional(
      t.Object(
        {
          connect: t.Object(
            {
              id: t.Integer({ additionalProperties: false }),
            },
            { additionalProperties: false }
          ),
        },
        { additionalProperties: false }
      )
    ),
    passwordResetToken: t.Optional(
      t.Object(
        {
          connect: t.Object(
            {
              id: t.Integer({ additionalProperties: false }),
            },
            { additionalProperties: false }
          ),
        },
        { additionalProperties: false }
      )
    ),
    twoFactorAuthentication: t.Optional(
      t.Object(
        {
          connect: t.Object(
            {
              id: t.Integer({ additionalProperties: false }),
            },
            { additionalProperties: false }
          ),
        },
        { additionalProperties: false }
      )
    ),
  },
  { additionalProperties: false }
);

export const UserRelationsInputUpdate = t.Partial(
  t.Object(
    {
      posts: t.Partial(
        t.Object(
          {
            connect: t.Array(
              t.Object(
                {
                  id: t.Integer({ additionalProperties: false }),
                },
                { additionalProperties: false }
              ),
              { additionalProperties: false }
            ),
            disconnect: t.Array(
              t.Object(
                {
                  id: t.Integer({ additionalProperties: false }),
                },
                { additionalProperties: false }
              ),
              { additionalProperties: false }
            ),
          },
          { additionalProperties: false }
        )
      ),
      emailVerification: t.Partial(
        t.Object(
          {
            connect: t.Object(
              {
                id: t.Integer({ additionalProperties: false }),
              },
              { additionalProperties: false }
            ),
            disconnect: t.Boolean(),
          },
          { additionalProperties: false }
        )
      ),
      passwordResetToken: t.Partial(
        t.Object(
          {
            connect: t.Object(
              {
                id: t.Integer({ additionalProperties: false }),
              },
              { additionalProperties: false }
            ),
            disconnect: t.Boolean(),
          },
          { additionalProperties: false }
        )
      ),
      twoFactorAuthentication: t.Partial(
        t.Object(
          {
            connect: t.Object(
              {
                id: t.Integer({ additionalProperties: false }),
              },
              { additionalProperties: false }
            ),
            disconnect: t.Boolean(),
          },
          { additionalProperties: false }
        )
      ),
    },
    { additionalProperties: false }
  )
);

export const UserWhere = t.Partial(
  t.Recursive(
    (Self) =>
      t.Object(
        {
          AND: t.Union([Self, t.Array(Self, { additionalProperties: false })]),
          NOT: t.Union([Self, t.Array(Self, { additionalProperties: false })]),
          OR: t.Array(Self, { additionalProperties: false }),
          id: t.String(),
          name: t.String(),
          email: t.String(),
          role: t.Union([t.Literal("DEFAULT"), t.Literal("ADMIN")], {
            additionalProperties: false,
          }),
          password: t.String(),
          oauth2Provider: t.String(),
          emailVerified: t.Boolean(),
          twoFactorAuthenticationEnabled: t.Boolean(),
        },
        { additionalProperties: false }
      ),
    { $id: "User" }
  )
);

export const UserWhereUnique = t.Recursive(
  (Self) =>
    t.Intersect(
      [
        t.Partial(
          t.Object(
            { id: t.String(), email: t.String() },
            { additionalProperties: false }
          ),
          { additionalProperties: false }
        ),
        t.Union(
          [t.Object({ id: t.String() }), t.Object({ email: t.String() })],
          { additionalProperties: false }
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
          { additionalProperties: false }
        ),
        t.Partial(
          t.Object(
            {
              id: t.String(),
              name: t.String(),
              email: t.String(),
              role: t.Union([t.Literal("DEFAULT"), t.Literal("ADMIN")], {
                additionalProperties: false,
              }),
              password: t.String(),
              oauth2Provider: t.String(),
              emailVerified: t.Boolean(),
              twoFactorAuthenticationEnabled: t.Boolean(),
            },
            { additionalProperties: false }
          )
        ),
      ],
      { additionalProperties: false }
    ),
  { $id: "User" }
);

export const UserSelect = t.Partial(
  t.Object(
    {
      id: t.Boolean(),
      name: t.Boolean(),
      email: t.Boolean(),
      role: t.Boolean(),
      password: t.Boolean(),
      oauth2Provider: t.Boolean(),
      emailVerified: t.Boolean(),
      twoFactorAuthenticationEnabled: t.Boolean(),
      posts: t.Boolean(),
      emailVerification: t.Boolean(),
      passwordResetToken: t.Boolean(),
      twoFactorAuthentication: t.Boolean(),
      _count: t.Boolean(),
    },
    { additionalProperties: false }
  )
);

export const UserInclude = t.Partial(
  t.Object(
    {
      role: t.Boolean(),
      posts: t.Boolean(),
      emailVerification: t.Boolean(),
      passwordResetToken: t.Boolean(),
      twoFactorAuthentication: t.Boolean(),
      _count: t.Boolean(),
    },
    { additionalProperties: false }
  )
);

export const UserOrderBy = t.Partial(
  t.Object(
    {
      id: t.Union([t.Literal("asc"), t.Literal("desc")], {
        additionalProperties: false,
      }),
      name: t.Union([t.Literal("asc"), t.Literal("desc")], {
        additionalProperties: false,
      }),
      email: t.Union([t.Literal("asc"), t.Literal("desc")], {
        additionalProperties: false,
      }),
      password: t.Union([t.Literal("asc"), t.Literal("desc")], {
        additionalProperties: false,
      }),
      oauth2Provider: t.Union([t.Literal("asc"), t.Literal("desc")], {
        additionalProperties: false,
      }),
      emailVerified: t.Union([t.Literal("asc"), t.Literal("desc")], {
        additionalProperties: false,
      }),
      twoFactorAuthenticationEnabled: t.Union(
        [t.Literal("asc"), t.Literal("desc")],
        { additionalProperties: false }
      ),
    },
    { additionalProperties: false }
  )
);

export const User = t.Composite([UserPlain, UserRelations], {
  additionalProperties: false,
});

export const UserInputCreate = t.Composite(
  [UserPlainInputCreate, UserRelationsInputCreate],
  { additionalProperties: false }
);

export const UserInputUpdate = t.Composite(
  [UserPlainInputUpdate, UserRelationsInputUpdate],
  { additionalProperties: false }
);
