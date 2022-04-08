-- CreateTable
CREATE TABLE "DeliveryLog" (
    "id" SERIAL NOT NULL,
    "date" TIMESTAMP(3) NOT NULL,
    "userId" INTEGER NOT NULL,
    "cohortId" INTEGER NOT NULL,

    CONSTRAINT "DeliveryLog_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "DeliveryLogLine" (
    "id" SERIAL NOT NULL,
    "content" TEXT NOT NULL,
    "logId" INTEGER NOT NULL,

    CONSTRAINT "DeliveryLogLine_pkey" PRIMARY KEY ("id")
);

-- AddForeignKey
ALTER TABLE "DeliveryLog" ADD CONSTRAINT "DeliveryLog_userId_fkey" FOREIGN KEY ("userId") REFERENCES "User"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "DeliveryLog" ADD CONSTRAINT "DeliveryLog_cohortId_fkey" FOREIGN KEY ("cohortId") REFERENCES "Cohort"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "DeliveryLogLine" ADD CONSTRAINT "DeliveryLogLine_logId_fkey" FOREIGN KEY ("logId") REFERENCES "DeliveryLog"("id") ON DELETE RESTRICT ON UPDATE CASCADE;
