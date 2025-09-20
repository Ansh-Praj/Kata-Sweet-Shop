/*
  Warnings:

  - Added the required column `imageUrl` to the `Sweet` table without a default value. This is not possible if the table is not empty.

*/
-- AlterTable
ALTER TABLE "public"."Sweet" ADD COLUMN     "imageUrl" TEXT NOT NULL;
