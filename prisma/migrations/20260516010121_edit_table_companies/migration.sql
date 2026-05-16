/*
  Warnings:

  - You are about to drop the column `slug` on the `companies` table. All the data in the column will be lost.
  - You are about to alter the column `refreshTokenHash` on the `user_sessions` table. The data in that column could be lost. The data in that column will be cast from `VarChar(255)` to `Char(64)`.

*/
-- DropIndex
DROP INDEX `companies_slug_key` ON `companies`;

-- AlterTable
ALTER TABLE `companies` DROP COLUMN `slug`;

-- AlterTable
ALTER TABLE `user_sessions` MODIFY `refreshTokenHash` CHAR(64) NOT NULL;
