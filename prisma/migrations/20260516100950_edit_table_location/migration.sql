/*
  Warnings:

  - You are about to drop the column `addressLine1` on the `locations` table. All the data in the column will be lost.
  - You are about to drop the column `city` on the `locations` table. All the data in the column will be lost.
  - You are about to drop the column `province` on the `locations` table. All the data in the column will be lost.
  - You are about to drop the column `timezone` on the `locations` table. All the data in the column will be lost.

*/
-- AlterTable
ALTER TABLE `locations` DROP COLUMN `addressLine1`,
    DROP COLUMN `city`,
    DROP COLUMN `province`,
    DROP COLUMN `timezone`;
