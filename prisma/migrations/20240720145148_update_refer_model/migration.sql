-- DropForeignKey
ALTER TABLE `refer` DROP FOREIGN KEY `Refer_referee_id_fkey`;

-- AlterTable
ALTER TABLE `refer` MODIFY `referee_id` INTEGER NULL;

-- AddForeignKey
ALTER TABLE `Refer` ADD CONSTRAINT `Refer_referee_id_fkey` FOREIGN KEY (`referee_id`) REFERENCES `User`(`userid`) ON DELETE SET NULL ON UPDATE CASCADE;
