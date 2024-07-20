/*
  Warnings:

  - You are about to drop the column `referee_id` on the `refer` table. All the data in the column will be lost.

*/
-- DropIndex
DROP INDEX `Refer_referee_id_fkey` ON `refer`;

-- DropIndex
DROP INDEX `Refer_referrer_id_fkey` ON `refer`;

-- AlterTable
ALTER TABLE `refer` DROP COLUMN `referee_id`,
    ADD COLUMN `referee_email` VARCHAR(191) NULL,
    ADD COLUMN `referee_name` VARCHAR(191) NULL;
