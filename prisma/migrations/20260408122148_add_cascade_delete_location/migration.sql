-- DropForeignKey
ALTER TABLE "Location" DROP CONSTRAINT "Location_tripId_fkey";

-- AddForeignKey
ALTER TABLE "Location" ADD CONSTRAINT "Location_tripId_fkey" FOREIGN KEY ("tripId") REFERENCES "Trip"("id") ON DELETE CASCADE ON UPDATE CASCADE;
