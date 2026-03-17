-- CreateTable
CREATE TABLE "n01_users" (
    "user_ID" TEXT NOT NULL,
    "user_T_name" TEXT,
    "user_T_email" TEXT,
    "user_DT_emailVerifiedAt" TIMESTAMP(3),
    "user_T_image" TEXT,

    CONSTRAINT "n01_users_pkey" PRIMARY KEY ("user_ID")
);

-- CreateTable
CREATE TABLE "n01_accounts" (
    "account_ID" TEXT NOT NULL,
    "user_ID" TEXT NOT NULL,
    "account_T_type" TEXT NOT NULL,
    "account_T_provider" TEXT NOT NULL,
    "account_T_providerAccountId" TEXT NOT NULL,
    "account_T_refreshToken" TEXT,
    "account_T_accessToken" TEXT,
    "account_N_tokenExpiresAt" INTEGER,

    CONSTRAINT "n01_accounts_pkey" PRIMARY KEY ("account_ID")
);

-- CreateTable
CREATE TABLE "n01_sessions" (
    "session_ID" TEXT NOT NULL,
    "session_T_sessionToken" TEXT NOT NULL,
    "user_ID" TEXT NOT NULL,
    "session_DT_expires" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "n01_sessions_pkey" PRIMARY KEY ("session_ID")
);

-- CreateTable
CREATE TABLE "n01_verification_tokens" (
    "verification_T_identifier" TEXT NOT NULL,
    "verification_T_token" TEXT NOT NULL,
    "verification_DT_expires" TIMESTAMP(3) NOT NULL
);

-- CreateIndex
CREATE UNIQUE INDEX "n01_users_user_T_email_key" ON "n01_users"("user_T_email");

-- CreateIndex
CREATE UNIQUE INDEX "n01_accounts_account_T_provider_account_T_providerAccountId_key" ON "n01_accounts"("account_T_provider", "account_T_providerAccountId");

-- CreateIndex
CREATE UNIQUE INDEX "n01_sessions_session_T_sessionToken_key" ON "n01_sessions"("session_T_sessionToken");

-- CreateIndex
CREATE UNIQUE INDEX "n01_verification_tokens_verification_T_token_key" ON "n01_verification_tokens"("verification_T_token");

-- CreateIndex
CREATE UNIQUE INDEX "n01_verification_tokens_verification_T_identifier_verificat_key" ON "n01_verification_tokens"("verification_T_identifier", "verification_T_token");

-- AddForeignKey
ALTER TABLE "n01_accounts" ADD CONSTRAINT "n01_accounts_user_ID_fkey" FOREIGN KEY ("user_ID") REFERENCES "n01_users"("user_ID") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "n01_sessions" ADD CONSTRAINT "n01_sessions_user_ID_fkey" FOREIGN KEY ("user_ID") REFERENCES "n01_users"("user_ID") ON DELETE CASCADE ON UPDATE CASCADE;
