/*
  Warnings:

  - You are about to drop the `ProductSize` table. If the table is not empty, all the data it contains will be lost.
  - You are about to drop the `Style` table. If the table is not empty, all the data it contains will be lost.
  - Added the required column `style` to the `Product` table without a default value. This is not possible if the table is not empty.

*/
-- DropForeignKey
ALTER TABLE "Product" DROP CONSTRAINT "Product_style_id_fkey";

-- DropForeignKey
ALTER TABLE "ProductSize" DROP CONSTRAINT "ProductSize_product_id_fkey";

-- DropForeignKey
ALTER TABLE "ProductSize" DROP CONSTRAINT "ProductSize_size_id_fkey";

-- DropForeignKey
ALTER TABLE "Style" DROP CONSTRAINT "Style_store_id_fkey";

-- DropForeignKey
ALTER TABLE "Style" DROP CONSTRAINT "Style_subcategory_id_fkey";

-- DropIndex
DROP INDEX "Product_subcategory_id_style_id_colour_id_name_key";

-- AlterTable
ALTER TABLE "Product" ADD COLUMN     "style" TEXT NOT NULL;

-- AlterTable
ALTER TABLE "SubCategory" ADD COLUMN     "styles" TEXT[];

-- DropTable
DROP TABLE "ProductSize";

-- DropTable
DROP TABLE "Style";
