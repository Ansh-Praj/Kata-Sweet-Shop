/*
  Warnings:

  - You are about to drop the column `cateogry` on the `Sweet` table. All the data in the column will be lost.
  - Added the required column `category` to the `Sweet` table without a default value. This is not possible if the table is not empty.

*/
-- AlterTable
ALTER TABLE "public"."Sweet" DROP COLUMN "cateogry",
ADD COLUMN     "category" TEXT NOT NULL;
