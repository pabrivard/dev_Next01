-- AlterTable
ALTER TABLE "n01_users" ADD COLUMN     "user_B_acceptPrivacy" BOOLEAN NOT NULL DEFAULT false,
ADD COLUMN     "user_B_acceptTerms" BOOLEAN NOT NULL DEFAULT false,
ADD COLUMN     "user_DT_acceptPrivacyAt" TIMESTAMP(3),
ADD COLUMN     "user_DT_acceptTermsAt" TIMESTAMP(3);

-- CreateTable
CREATE TABLE "n01_users_profile" (
    "profile_ID" TEXT NOT NULL,
    "user_ID" TEXT NOT NULL,
    "profile_T_gender" TEXT,
    "profile_T_lastName" TEXT,
    "profile_T_firstName" TEXT,
    "profile_T_phoneCode" TEXT,
    "profile_T_phoneNumber" TEXT,
    "profile_DT_createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "profile_DT_updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "n01_users_profile_pkey" PRIMARY KEY ("profile_ID")
);

-- CreateTable
CREATE TABLE "n01_registration_pins" (
    "pin_ID" TEXT NOT NULL,
    "pin_T_email" TEXT NOT NULL,
    "pin_T_code" TEXT NOT NULL,
    "pin_N_attempts" INTEGER NOT NULL DEFAULT 0,
    "pin_B_blocked" BOOLEAN NOT NULL DEFAULT false,
    "pin_DT_expires" TIMESTAMP(3) NOT NULL,
    "pin_DT_createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "n01_registration_pins_pkey" PRIMARY KEY ("pin_ID")
);

-- CreateIndex
CREATE UNIQUE INDEX "n01_users_profile_user_ID_key" ON "n01_users_profile"("user_ID");

-- AddForeignKey
ALTER TABLE "n01_users_profile" ADD CONSTRAINT "n01_users_profile_user_ID_fkey" FOREIGN KEY ("user_ID") REFERENCES "n01_users"("user_ID") ON DELETE CASCADE ON UPDATE CASCADE;
