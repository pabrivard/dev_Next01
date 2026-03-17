-- CreateEnum
CREATE TYPE "Role" AS ENUM ('ADMIN', 'CLIENT', 'PROVIDER');

-- AlterTable
ALTER TABLE "n01_users" ADD COLUMN     "user_T_role" "Role" NOT NULL DEFAULT 'CLIENT';
