/*
  Warnings:

  - You are about to drop the column `loginId` on the `memberships` table. All the data in the column will be lost.

*/

-- DropForeignKey
ALTER TABLE `memberships` DROP FOREIGN KEY `memberships_companyId_fkey`;

-- DropIndex
DROP INDEX `memberships_companyId_loginId_key` ON `memberships`;

-- AlterTable
ALTER TABLE `memberships` DROP COLUMN `loginId`;

-- AddForeignKey
ALTER TABLE `memberships` ADD CONSTRAINT `memberships_companyId_fkey`
FOREIGN KEY (`companyId`) REFERENCES `companies`(`companyId`)
ON DELETE CASCADE ON UPDATE CASCADE;