/*
  Warnings:

  - A unique constraint covering the columns `[building,floor,room]` on the table `locations` will be added. If there are existing duplicate values, this will fail.

*/
-- CreateIndex
CREATE INDEX "cleaning_records_userId_idx" ON "public"."cleaning_records"("userId");

-- CreateIndex
CREATE INDEX "cleaning_records_locationId_idx" ON "public"."cleaning_records"("locationId");

-- CreateIndex
CREATE INDEX "cleaning_records_createdAt_idx" ON "public"."cleaning_records"("createdAt");

-- CreateIndex
CREATE UNIQUE INDEX "locations_building_floor_room_key" ON "public"."locations"("building", "floor", "room");
