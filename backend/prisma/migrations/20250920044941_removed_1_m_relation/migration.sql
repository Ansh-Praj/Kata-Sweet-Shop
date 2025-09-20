/*
  Warnings:

  - You are about to drop the column `userId` on the `Sweet` table. All the data in the column will be lost.

*/
-- DropForeignKey
ALTER TABLE "public"."Sweet" DROP CONSTRAINT "Sweet_userId_fkey";

-- AlterTable
ALTER TABLE "public"."Sweet" DROP COLUMN "userId";
