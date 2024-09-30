-- DropForeignKey
ALTER TABLE "attachments" DROP CONSTRAINT "attachments_question_id_fkey";

-- AlterTable
ALTER TABLE "attachments" ALTER COLUMN "question_id" DROP NOT NULL;

-- AddForeignKey
ALTER TABLE "attachments" ADD CONSTRAINT "attachments_question_id_fkey" FOREIGN KEY ("question_id") REFERENCES "questions"("id") ON DELETE SET NULL ON UPDATE CASCADE;
