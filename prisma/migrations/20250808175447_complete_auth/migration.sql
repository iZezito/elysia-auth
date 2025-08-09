-- CreateTable
CREATE TABLE "public"."email_verifications" (
    "id" SERIAL NOT NULL,
    "verificationToken" TEXT NOT NULL,
    "expiryDate" TIMESTAMP(3) NOT NULL,
    "userId" INTEGER NOT NULL,

    CONSTRAINT "email_verifications_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "public"."password_reset_tokens" (
    "id" SERIAL NOT NULL,
    "token" TEXT NOT NULL,
    "expiryDate" TIMESTAMP(3) NOT NULL,
    "userId" INTEGER,

    CONSTRAINT "password_reset_tokens_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "public"."two_factor_authentication" (
    "id" SERIAL NOT NULL,
    "code" TEXT NOT NULL,
    "expiryDate" TIMESTAMP(3) NOT NULL,
    "userId" INTEGER NOT NULL,

    CONSTRAINT "two_factor_authentication_pkey" PRIMARY KEY ("id")
);

-- CreateIndex
CREATE UNIQUE INDEX "email_verifications_verificationToken_key" ON "public"."email_verifications"("verificationToken");

-- CreateIndex
CREATE UNIQUE INDEX "email_verifications_userId_key" ON "public"."email_verifications"("userId");

-- CreateIndex
CREATE UNIQUE INDEX "password_reset_tokens_userId_key" ON "public"."password_reset_tokens"("userId");

-- CreateIndex
CREATE UNIQUE INDEX "two_factor_authentication_userId_key" ON "public"."two_factor_authentication"("userId");

-- AddForeignKey
ALTER TABLE "public"."email_verifications" ADD CONSTRAINT "email_verifications_userId_fkey" FOREIGN KEY ("userId") REFERENCES "public"."User"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "public"."password_reset_tokens" ADD CONSTRAINT "password_reset_tokens_userId_fkey" FOREIGN KEY ("userId") REFERENCES "public"."User"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "public"."two_factor_authentication" ADD CONSTRAINT "two_factor_authentication_userId_fkey" FOREIGN KEY ("userId") REFERENCES "public"."User"("id") ON DELETE CASCADE ON UPDATE CASCADE;
