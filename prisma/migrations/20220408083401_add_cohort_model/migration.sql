-- AlterTable
ALTER TABLE "User" ADD COLUMN     "cohortId" INTEGER;

-- CreateTable
CREATE TABLE "Cohort" (
    "id" SERIAL NOT NULL,

    CONSTRAINT "Cohort_pkey" PRIMARY KEY ("id")
);

-- AddForeignKey
ALTER TABLE "User" ADD CONSTRAINT "User_cohortId_fkey" FOREIGN KEY ("cohortId") REFERENCES "Cohort"("id") ON DELETE SET NULL ON UPDATE CASCADE;
