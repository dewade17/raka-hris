/*
  Warnings:

  - The values [INACTIVE] on the enum `memberships_status` will be removed. If these variants are still used in the database, this will fail.
  - You are about to alter the column `terminationType` on the `memberships` table. The data in that column could be lost. The data in that column will be cast from `Enum(EnumId(4))` to `VarChar(50)`.
  - The values [EXPIRED] on the enum `user_sessions_status` will be removed. If these variants are still used in the database, this will fail.

*/
-- AlterTable
ALTER TABLE `memberships` MODIFY `status` ENUM('ACTIVE', 'SUSPENDED', 'TERMINATED') NOT NULL DEFAULT 'ACTIVE',
    MODIFY `terminationType` VARCHAR(50) NULL;

-- AlterTable
ALTER TABLE `user_sessions` ADD COLUMN `renewedAt` DATETIME(3) NULL,
    MODIFY `status` ENUM('ACTIVE', 'REVOKED') NOT NULL DEFAULT 'ACTIVE';

-- AlterTable
ALTER TABLE `users` ADD COLUMN `passwordLoginEnabled` BOOLEAN NOT NULL DEFAULT true;

-- CreateTable
CREATE TABLE `user_auth_providers` (
    `userAuthProviderId` VARCHAR(191) NOT NULL,
    `userId` VARCHAR(191) NOT NULL,
    `provider` ENUM('GOOGLE') NOT NULL,
    `providerAccountId` VARCHAR(191) NOT NULL,
    `email` VARCHAR(191) NULL,
    `emailVerified` BOOLEAN NOT NULL DEFAULT false,
    `displayName` VARCHAR(191) NULL,
    `avatarUrl` VARCHAR(500) NULL,
    `lastLoginAt` DATETIME(3) NULL,
    `createdAt` DATETIME(3) NOT NULL DEFAULT CURRENT_TIMESTAMP(3),
    `updatedAt` DATETIME(3) NOT NULL,

    INDEX `user_auth_providers_userId_idx`(`userId`),
    INDEX `user_auth_providers_provider_email_idx`(`provider`, `email`),
    UNIQUE INDEX `user_auth_providers_provider_providerAccountId_key`(`provider`, `providerAccountId`),
    PRIMARY KEY (`userAuthProviderId`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

-- CreateIndex
CREATE INDEX `user_sessions_status_expiresAt_idx` ON `user_sessions`(`status`, `expiresAt`);

-- AddForeignKey
ALTER TABLE `user_auth_providers` ADD CONSTRAINT `user_auth_providers_userId_fkey` FOREIGN KEY (`userId`) REFERENCES `users`(`userId`) ON DELETE CASCADE ON UPDATE CASCADE;
