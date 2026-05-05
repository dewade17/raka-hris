-- CreateTable
CREATE TABLE `users` (
    `userId` VARCHAR(191) NOT NULL,
    `email` VARCHAR(191) NULL,
    `name` VARCHAR(191) NOT NULL,
    `passwordHash` VARCHAR(255) NOT NULL,
    `mustChangePassword` BOOLEAN NOT NULL DEFAULT true,
    `passwordChangedAt` DATETIME(3) NULL,
    `platformRole` ENUM('USER', 'SUPERADMIN') NOT NULL DEFAULT 'USER',
    `isActive` BOOLEAN NOT NULL DEFAULT true,
    `createdAt` DATETIME(3) NOT NULL DEFAULT CURRENT_TIMESTAMP(3),
    `updatedAt` DATETIME(3) NOT NULL,

    UNIQUE INDEX `users_email_key`(`email`),
    PRIMARY KEY (`userId`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

-- CreateTable
CREATE TABLE `companies` (
    `companyId` VARCHAR(191) NOT NULL,
    `name` VARCHAR(191) NOT NULL,
    `slug` VARCHAR(100) NOT NULL,
    `email` VARCHAR(191) NULL,
    `phone` VARCHAR(50) NULL,
    `logoUrl` VARCHAR(500) NULL,
    `addressLine1` VARCHAR(255) NULL,
    `city` VARCHAR(100) NULL,
    `province` VARCHAR(100) NULL,
    `timezone` VARCHAR(50) NULL,
    `status` ENUM('ACTIVE', 'SUSPENDED', 'CANCELED') NOT NULL DEFAULT 'ACTIVE',
    `createdByUserId` VARCHAR(191) NULL,
    `createdAt` DATETIME(3) NOT NULL DEFAULT CURRENT_TIMESTAMP(3),
    `updatedAt` DATETIME(3) NOT NULL,
    `deletedAt` DATETIME(3) NULL,

    UNIQUE INDEX `companies_slug_key`(`slug`),
    INDEX `companies_status_idx`(`status`),
    INDEX `companies_deletedAt_idx`(`deletedAt`),
    PRIMARY KEY (`companyId`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

-- CreateTable
CREATE TABLE `memberships` (
    `membershipId` VARCHAR(191) NOT NULL,
    `companyId` VARCHAR(191) NOT NULL,
    `userId` VARCHAR(191) NOT NULL,
    `loginId` VARCHAR(100) NOT NULL,
    `status` ENUM('ACTIVE', 'INACTIVE', 'SUSPENDED', 'TERMINATED') NOT NULL DEFAULT 'ACTIVE',
    `isOwner` BOOLEAN NOT NULL DEFAULT false,
    `joinedAt` DATETIME(3) NOT NULL DEFAULT CURRENT_TIMESTAMP(3),
    `lastLoginAt` DATETIME(3) NULL,
    `employmentEndedAt` DATETIME(3) NULL,
    `terminationType` ENUM('RESIGNED', 'TERMINATED', 'CONTRACT_ENDED', 'RETIRED') NULL,
    `terminationReason` TEXT NULL,
    `terminatedByUserId` VARCHAR(191) NULL,
    `accessRevokedAt` DATETIME(3) NULL,
    `createdAt` DATETIME(3) NOT NULL DEFAULT CURRENT_TIMESTAMP(3),
    `updatedAt` DATETIME(3) NOT NULL,

    INDEX `memberships_companyId_status_idx`(`companyId`, `status`),
    INDEX `memberships_userId_status_idx`(`userId`, `status`),
    INDEX `memberships_terminatedByUserId_idx`(`terminatedByUserId`),
    UNIQUE INDEX `memberships_companyId_userId_key`(`companyId`, `userId`),
    UNIQUE INDEX `memberships_companyId_loginId_key`(`companyId`, `loginId`),
    PRIMARY KEY (`membershipId`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

-- CreateTable
CREATE TABLE `permissions` (
    `permissionId` VARCHAR(191) NOT NULL,
    `module` VARCHAR(100) NOT NULL,
    `action` VARCHAR(100) NOT NULL,
    `name` VARCHAR(191) NOT NULL,
    `description` TEXT NULL,
    `createdAt` DATETIME(3) NOT NULL DEFAULT CURRENT_TIMESTAMP(3),
    `updatedAt` DATETIME(3) NOT NULL,

    INDEX `permissions_module_idx`(`module`),
    UNIQUE INDEX `permissions_module_action_key`(`module`, `action`),
    PRIMARY KEY (`permissionId`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

-- CreateTable
CREATE TABLE `company_roles` (
    `companyRoleId` VARCHAR(191) NOT NULL,
    `companyId` VARCHAR(191) NOT NULL,
    `name` VARCHAR(191) NOT NULL,
    `description` TEXT NULL,
    `isSystem` BOOLEAN NOT NULL DEFAULT false,
    `isDefault` BOOLEAN NOT NULL DEFAULT false,
    `createdAt` DATETIME(3) NOT NULL DEFAULT CURRENT_TIMESTAMP(3),
    `updatedAt` DATETIME(3) NOT NULL,

    INDEX `company_roles_companyId_isDefault_idx`(`companyId`, `isDefault`),
    UNIQUE INDEX `company_roles_companyId_name_key`(`companyId`, `name`),
    PRIMARY KEY (`companyRoleId`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

-- CreateTable
CREATE TABLE `company_role_permissions` (
    `companyRolePermissionId` VARCHAR(191) NOT NULL,
    `roleId` VARCHAR(191) NOT NULL,
    `permissionId` VARCHAR(191) NOT NULL,
    `createdAt` DATETIME(3) NOT NULL DEFAULT CURRENT_TIMESTAMP(3),

    INDEX `company_role_permissions_permissionId_idx`(`permissionId`),
    UNIQUE INDEX `company_role_permissions_roleId_permissionId_key`(`roleId`, `permissionId`),
    PRIMARY KEY (`companyRolePermissionId`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

-- CreateTable
CREATE TABLE `membership_roles` (
    `membershipRoleId` VARCHAR(191) NOT NULL,
    `membershipId` VARCHAR(191) NOT NULL,
    `roleId` VARCHAR(191) NOT NULL,
    `createdAt` DATETIME(3) NOT NULL DEFAULT CURRENT_TIMESTAMP(3),

    INDEX `membership_roles_roleId_idx`(`roleId`),
    UNIQUE INDEX `membership_roles_membershipId_roleId_key`(`membershipId`, `roleId`),
    PRIMARY KEY (`membershipRoleId`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

-- CreateTable
CREATE TABLE `subscription_plans` (
    `subscriptionPlanId` VARCHAR(191) NOT NULL,
    `name` VARCHAR(191) NOT NULL,
    `description` TEXT NULL,
    `pricePerUser` DECIMAL(15, 2) NOT NULL,
    `currency` VARCHAR(10) NOT NULL DEFAULT 'IDR',
    `interval` ENUM('MONTHLY', 'YEARLY') NOT NULL,
    `isActive` BOOLEAN NOT NULL DEFAULT true,
    `createdAt` DATETIME(3) NOT NULL DEFAULT CURRENT_TIMESTAMP(3),
    `updatedAt` DATETIME(3) NOT NULL,

    UNIQUE INDEX `subscription_plans_name_interval_key`(`name`, `interval`),
    PRIMARY KEY (`subscriptionPlanId`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

-- CreateTable
CREATE TABLE `subscriptions` (
    `subscriptionId` VARCHAR(191) NOT NULL,
    `companyId` VARCHAR(191) NOT NULL,
    `planId` VARCHAR(191) NOT NULL,
    `status` ENUM('TRIALING', 'ACTIVE', 'PAST_DUE', 'CANCELED', 'EXPIRED') NOT NULL DEFAULT 'TRIALING',
    `seatLimit` INTEGER NOT NULL,
    `pricePerUserSnapshot` DECIMAL(15, 2) NOT NULL,
    `currencySnapshot` VARCHAR(10) NOT NULL DEFAULT 'IDR',
    `startsAt` DATETIME(3) NOT NULL DEFAULT CURRENT_TIMESTAMP(3),
    `trialEndsAt` DATETIME(3) NULL,
    `currentPeriodStart` DATETIME(3) NULL,
    `currentPeriodEnd` DATETIME(3) NULL,
    `canceledAt` DATETIME(3) NULL,
    `createdAt` DATETIME(3) NOT NULL DEFAULT CURRENT_TIMESTAMP(3),
    `updatedAt` DATETIME(3) NOT NULL,

    INDEX `subscriptions_companyId_status_idx`(`companyId`, `status`),
    INDEX `subscriptions_planId_idx`(`planId`),
    PRIMARY KEY (`subscriptionId`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

-- CreateTable
CREATE TABLE `user_sessions` (
    `userSessionId` VARCHAR(191) NOT NULL,
    `userId` VARCHAR(191) NOT NULL,
    `membershipId` VARCHAR(191) NULL,
    `refreshTokenHash` VARCHAR(255) NOT NULL,
    `deviceId` VARCHAR(191) NULL,
    `deviceName` VARCHAR(100) NULL,
    `platform` VARCHAR(50) NULL,
    `ipAddress` VARCHAR(64) NULL,
    `userAgent` VARCHAR(512) NULL,
    `status` ENUM('ACTIVE', 'REVOKED', 'EXPIRED') NOT NULL DEFAULT 'ACTIVE',
    `lastUsedAt` DATETIME(3) NULL,
    `expiresAt` DATETIME(3) NOT NULL,
    `revokedAt` DATETIME(3) NULL,
    `revokedReason` VARCHAR(255) NULL,
    `createdAt` DATETIME(3) NOT NULL DEFAULT CURRENT_TIMESTAMP(3),
    `updatedAt` DATETIME(3) NOT NULL,

    UNIQUE INDEX `user_sessions_refreshTokenHash_key`(`refreshTokenHash`),
    INDEX `user_sessions_userId_status_idx`(`userId`, `status`),
    INDEX `user_sessions_membershipId_status_idx`(`membershipId`, `status`),
    PRIMARY KEY (`userSessionId`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

-- CreateTable
CREATE TABLE `employee_profiles` (
    `employeeProfileId` VARCHAR(191) NOT NULL,
    `membershipId` VARCHAR(191) NOT NULL,
    `employeeNumber` VARCHAR(100) NULL,
    `phone` VARCHAR(50) NULL,
    `emergencyContactName` VARCHAR(191) NULL,
    `emergencyContactPhone` VARCHAR(50) NULL,
    `birthDate` DATE NULL,
    `birthPlace` VARCHAR(191) NULL,
    `gender` VARCHAR(20) NULL,
    `maritalStatus` VARCHAR(50) NULL,
    `addressLine1` VARCHAR(255) NULL,
    `city` VARCHAR(100) NULL,
    `province` VARCHAR(100) NULL,
    `employmentType` VARCHAR(50) NULL,
    `hireDate` DATE NULL,
    `probationEndDate` DATE NULL,
    `photoUrl` VARCHAR(500) NULL,
    `notes` TEXT NULL,
    `createdAt` DATETIME(3) NOT NULL DEFAULT CURRENT_TIMESTAMP(3),
    `updatedAt` DATETIME(3) NOT NULL,
    `deletedAt` DATETIME(3) NULL,

    UNIQUE INDEX `employee_profiles_membershipId_key`(`membershipId`),
    INDEX `employee_profiles_employeeNumber_idx`(`employeeNumber`),
    INDEX `employee_profiles_hireDate_idx`(`hireDate`),
    INDEX `employee_profiles_deletedAt_idx`(`deletedAt`),
    PRIMARY KEY (`employeeProfileId`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

-- CreateTable
CREATE TABLE `departments` (
    `departmentId` VARCHAR(191) NOT NULL,
    `companyId` VARCHAR(191) NOT NULL,
    `name` VARCHAR(191) NOT NULL,
    `isActive` BOOLEAN NOT NULL DEFAULT true,
    `createdAt` DATETIME(3) NOT NULL DEFAULT CURRENT_TIMESTAMP(3),
    `updatedAt` DATETIME(3) NOT NULL,
    `deletedAt` DATETIME(3) NULL,

    INDEX `departments_companyId_isActive_idx`(`companyId`, `isActive`),
    INDEX `departments_deletedAt_idx`(`deletedAt`),
    UNIQUE INDEX `departments_companyId_name_key`(`companyId`, `name`),
    PRIMARY KEY (`departmentId`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

-- CreateTable
CREATE TABLE `positions` (
    `positionId` VARCHAR(191) NOT NULL,
    `companyId` VARCHAR(191) NOT NULL,
    `name` VARCHAR(191) NOT NULL,
    `isActive` BOOLEAN NOT NULL DEFAULT true,
    `createdAt` DATETIME(3) NOT NULL DEFAULT CURRENT_TIMESTAMP(3),
    `updatedAt` DATETIME(3) NOT NULL,
    `deletedAt` DATETIME(3) NULL,

    INDEX `positions_companyId_isActive_idx`(`companyId`, `isActive`),
    INDEX `positions_deletedAt_idx`(`deletedAt`),
    UNIQUE INDEX `positions_companyId_name_key`(`companyId`, `name`),
    PRIMARY KEY (`positionId`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

-- CreateTable
CREATE TABLE `locations` (
    `locationId` VARCHAR(191) NOT NULL,
    `companyId` VARCHAR(191) NOT NULL,
    `name` VARCHAR(191) NOT NULL,
    `addressLine1` VARCHAR(255) NULL,
    `city` VARCHAR(100) NULL,
    `province` VARCHAR(100) NULL,
    `timezone` VARCHAR(50) NULL,
    `latitude` DECIMAL(10, 6) NULL,
    `longitude` DECIMAL(10, 6) NULL,
    `isActive` BOOLEAN NOT NULL DEFAULT true,
    `createdAt` DATETIME(3) NOT NULL DEFAULT CURRENT_TIMESTAMP(3),
    `updatedAt` DATETIME(3) NOT NULL,
    `deletedAt` DATETIME(3) NULL,

    INDEX `locations_companyId_isActive_idx`(`companyId`, `isActive`),
    INDEX `locations_deletedAt_idx`(`deletedAt`),
    UNIQUE INDEX `locations_companyId_name_key`(`companyId`, `name`),
    PRIMARY KEY (`locationId`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

-- CreateTable
CREATE TABLE `employee_departments` (
    `employeeDepartmentId` VARCHAR(191) NOT NULL,
    `membershipId` VARCHAR(191) NOT NULL,
    `departmentId` VARCHAR(191) NOT NULL,
    `isPrimary` BOOLEAN NOT NULL DEFAULT true,
    `createdAt` DATETIME(3) NOT NULL DEFAULT CURRENT_TIMESTAMP(3),

    INDEX `employee_departments_departmentId_idx`(`departmentId`),
    UNIQUE INDEX `employee_departments_membershipId_departmentId_key`(`membershipId`, `departmentId`),
    PRIMARY KEY (`employeeDepartmentId`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

-- CreateTable
CREATE TABLE `employee_positions` (
    `employeePositionId` VARCHAR(191) NOT NULL,
    `membershipId` VARCHAR(191) NOT NULL,
    `positionId` VARCHAR(191) NOT NULL,
    `isPrimary` BOOLEAN NOT NULL DEFAULT true,
    `createdAt` DATETIME(3) NOT NULL DEFAULT CURRENT_TIMESTAMP(3),

    INDEX `employee_positions_positionId_idx`(`positionId`),
    UNIQUE INDEX `employee_positions_membershipId_positionId_key`(`membershipId`, `positionId`),
    PRIMARY KEY (`employeePositionId`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

-- AddForeignKey
ALTER TABLE `companies` ADD CONSTRAINT `companies_createdByUserId_fkey` FOREIGN KEY (`createdByUserId`) REFERENCES `users`(`userId`) ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE `memberships` ADD CONSTRAINT `memberships_companyId_fkey` FOREIGN KEY (`companyId`) REFERENCES `companies`(`companyId`) ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE `memberships` ADD CONSTRAINT `memberships_userId_fkey` FOREIGN KEY (`userId`) REFERENCES `users`(`userId`) ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE `memberships` ADD CONSTRAINT `memberships_terminatedByUserId_fkey` FOREIGN KEY (`terminatedByUserId`) REFERENCES `users`(`userId`) ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE `company_roles` ADD CONSTRAINT `company_roles_companyId_fkey` FOREIGN KEY (`companyId`) REFERENCES `companies`(`companyId`) ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE `company_role_permissions` ADD CONSTRAINT `company_role_permissions_roleId_fkey` FOREIGN KEY (`roleId`) REFERENCES `company_roles`(`companyRoleId`) ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE `company_role_permissions` ADD CONSTRAINT `company_role_permissions_permissionId_fkey` FOREIGN KEY (`permissionId`) REFERENCES `permissions`(`permissionId`) ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE `membership_roles` ADD CONSTRAINT `membership_roles_membershipId_fkey` FOREIGN KEY (`membershipId`) REFERENCES `memberships`(`membershipId`) ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE `membership_roles` ADD CONSTRAINT `membership_roles_roleId_fkey` FOREIGN KEY (`roleId`) REFERENCES `company_roles`(`companyRoleId`) ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE `subscriptions` ADD CONSTRAINT `subscriptions_companyId_fkey` FOREIGN KEY (`companyId`) REFERENCES `companies`(`companyId`) ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE `subscriptions` ADD CONSTRAINT `subscriptions_planId_fkey` FOREIGN KEY (`planId`) REFERENCES `subscription_plans`(`subscriptionPlanId`) ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE `user_sessions` ADD CONSTRAINT `user_sessions_userId_fkey` FOREIGN KEY (`userId`) REFERENCES `users`(`userId`) ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE `user_sessions` ADD CONSTRAINT `user_sessions_membershipId_fkey` FOREIGN KEY (`membershipId`) REFERENCES `memberships`(`membershipId`) ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE `employee_profiles` ADD CONSTRAINT `employee_profiles_membershipId_fkey` FOREIGN KEY (`membershipId`) REFERENCES `memberships`(`membershipId`) ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE `departments` ADD CONSTRAINT `departments_companyId_fkey` FOREIGN KEY (`companyId`) REFERENCES `companies`(`companyId`) ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE `positions` ADD CONSTRAINT `positions_companyId_fkey` FOREIGN KEY (`companyId`) REFERENCES `companies`(`companyId`) ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE `locations` ADD CONSTRAINT `locations_companyId_fkey` FOREIGN KEY (`companyId`) REFERENCES `companies`(`companyId`) ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE `employee_departments` ADD CONSTRAINT `employee_departments_membershipId_fkey` FOREIGN KEY (`membershipId`) REFERENCES `memberships`(`membershipId`) ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE `employee_departments` ADD CONSTRAINT `employee_departments_departmentId_fkey` FOREIGN KEY (`departmentId`) REFERENCES `departments`(`departmentId`) ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE `employee_positions` ADD CONSTRAINT `employee_positions_membershipId_fkey` FOREIGN KEY (`membershipId`) REFERENCES `memberships`(`membershipId`) ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE `employee_positions` ADD CONSTRAINT `employee_positions_positionId_fkey` FOREIGN KEY (`positionId`) REFERENCES `positions`(`positionId`) ON DELETE CASCADE ON UPDATE CASCADE;
