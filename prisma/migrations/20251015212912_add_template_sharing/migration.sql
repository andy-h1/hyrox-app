/*
  Warnings:

  - Added the required column `updated_at` to the `workout_templates` table without a default value. This is not possible if the table is not empty.

*/
-- AlterTable
ALTER TABLE "public"."workout_templates" ADD COLUMN     "created_at" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
ADD COLUMN     "is_public" BOOLEAN NOT NULL DEFAULT false,
ADD COLUMN     "updated_at" TIMESTAMP(3) NOT NULL;

-- CreateTable
CREATE TABLE "public"."template_shares" (
    "id" SERIAL NOT NULL,
    "template_id" INTEGER NOT NULL,
    "user_id" INTEGER NOT NULL,
    "shared_at" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "template_shares_pkey" PRIMARY KEY ("id")
);

-- CreateIndex
CREATE INDEX "template_shares_user_id_idx" ON "public"."template_shares"("user_id");

-- CreateIndex
CREATE INDEX "template_shares_template_id_idx" ON "public"."template_shares"("template_id");

-- CreateIndex
CREATE UNIQUE INDEX "template_shares_template_id_user_id_key" ON "public"."template_shares"("template_id", "user_id");

-- AddForeignKey
ALTER TABLE "public"."workout_templates" ADD CONSTRAINT "workout_templates_created_by_fkey" FOREIGN KEY ("created_by") REFERENCES "public"."users"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "public"."template_shares" ADD CONSTRAINT "template_shares_template_id_fkey" FOREIGN KEY ("template_id") REFERENCES "public"."workout_templates"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "public"."template_shares" ADD CONSTRAINT "template_shares_user_id_fkey" FOREIGN KEY ("user_id") REFERENCES "public"."users"("id") ON DELETE CASCADE ON UPDATE CASCADE;
