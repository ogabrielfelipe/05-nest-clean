/*
  Warnings:

  - You are about to drop the column `slug` on the `answers` table. All the data in the column will be lost.

*/
-- DropIndex
DROP INDEX "answers_slug_key";

-- AlterTable
ALTER TABLE "answers" DROP COLUMN "slug";
