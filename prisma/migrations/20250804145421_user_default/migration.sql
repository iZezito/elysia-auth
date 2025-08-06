-- AlterTable
ALTER TABLE "public"."User" ALTER COLUMN "emailVerified" DROP NOT NULL,
ALTER COLUMN "twoFactorAuthenticationEnabled" DROP NOT NULL;
