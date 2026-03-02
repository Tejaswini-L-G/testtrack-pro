-- AddForeignKey
ALTER TABLE "FilterPreset" ADD CONSTRAINT "FilterPreset_userId_fkey" FOREIGN KEY ("userId") REFERENCES "User"("id") ON DELETE CASCADE ON UPDATE CASCADE;
