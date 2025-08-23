/*
  Warnings:

  - The values [BAÑO,AULA,OFICINA,PASILLO,AREA_COMUN,OTRO] on the enum `LocationType` will be removed. If these variants are still used in the database, this will fail.
  - Added the required column `updatedAt` to the `cleaning_records` table without a default value. This is not possible if the table is not empty.

*/
-- AlterEnum
BEGIN;
CREATE TYPE "LocationType_new" AS ENUM ('BATHROOM', 'CLASSROOM', 'OFFICE', 'HALLWAY', 'COMMON_AREA', 'OTHER');
ALTER TABLE "locations" ALTER COLUMN "type" TYPE "LocationType_new" USING ("type"::text::"LocationType_new");
ALTER TYPE "LocationType" RENAME TO "LocationType_old";
ALTER TYPE "LocationType_new" RENAME TO "LocationType";
DROP TYPE "LocationType_old";
COMMIT;

-- AlterTable
ALTER TABLE "cleaning_records" ADD COLUMN     "updatedAt" TIMESTAMP(3) NOT NULL;
