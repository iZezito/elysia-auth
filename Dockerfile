FROM oven/bun AS build

WORKDIR /app

COPY package.json bun.lock ./

RUN bun install

COPY ./src ./src
COPY ./prisma ./prisma

COPY tsconfig.json tsconfig.json

RUN bunx prisma generate


COPY ./generated/prismabox ./generated/prismabox

ENV NODE_ENV=production

RUN bun build \
    --compile \
    --minify-whitespace \
    --minify-syntax \
    --outfile server \
    src/index.ts


# FROM oven/bun:alpine
FROM gcr.io/distroless/base

WORKDIR /app

COPY --from=build /app/server server
COPY --from=build /app/node_modules/.prisma /app/node_modules/.prisma
COPY --from=build /app/node_modules/@prisma /app/node_modules/@prisma

COPY --from=build /app/prisma /app/prisma
COPY --from=build /app/generated /app/generated

ENV NODE_ENV=production

CMD ["./server"]

EXPOSE 3000



# FROM oven/bun:alpine AS build

# WORKDIR /app

# COPY package.json package.json
# COPY bun.lock bun.lock

# RUN bun install

# COPY ./src ./src
# COPY ./prisma ./prisma

# COPY tsconfig.json tsconfig.json
# COPY .env.prod .env

# RUN bunx prisma generate

# COPY ./generated/prismabox ./generated/prismabox


# ENV NODE_ENV=production

# RUN bun build \
#     --compile \
#     --minify-whitespace \
#     --minify-syntax \
#     --outfile server \
#     src/index.ts


# FROM build

# WORKDIR /app

# COPY --from=build /app/server server
# COPY --from=build /app/node_modules/.prisma /app/node_modules/.prisma
# COPY --from=build /app/node_modules/@prisma /app/node_modules/@prisma

# COPY --from=build /app/prisma /app/prisma
# COPY --from=build /app/generated /app/generated

# ENV NODE_ENV=production

# CMD ["./server"]

# EXPOSE 3000






