/*
  Warnings:

  - You are about to drop the column `style_id` on the `Product` table. All the data in the column will be lost.

*/
-- DropIndex
DROP INDEX "Product_style_id_idx";

-- AlterTable
ALTER TABLE "Product" DROP COLUMN "style_id";
