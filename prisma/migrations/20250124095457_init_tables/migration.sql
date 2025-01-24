-- CreateEnum
CREATE TYPE "MetricType" AS ENUM ('Distance', 'Temperature');

-- CreateTable
CREATE TABLE "Metric" (
    "id" SERIAL NOT NULL,
    "symbol" VARCHAR(20) NOT NULL,
    "displayName" VARCHAR(200) NOT NULL,
    "type" "MetricType" NOT NULL,
    "conversionRate" DOUBLE PRECISION NOT NULL,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "Metric_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "MetricTracking" (
    "id" SERIAL NOT NULL,
    "value" DOUBLE PRECISION NOT NULL,
    "metricId" INTEGER NOT NULL,
    "trackedAt" TIMESTAMP(3) NOT NULL,
    "userId" INTEGER NOT NULL,

    CONSTRAINT "MetricTracking_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "MetricReport" (
    "id" SERIAL NOT NULL,
    "reportedDate" VARCHAR(10) NOT NULL,
    "type" "MetricType" NOT NULL,
    "metricTrackingId" INTEGER NOT NULL,
    "userId" INTEGER NOT NULL,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "MetricReport_pkey" PRIMARY KEY ("id")
);

-- CreateIndex
CREATE UNIQUE INDEX "Metric_symbol_type_key" ON "Metric"("symbol", "type");

-- CreateIndex
CREATE UNIQUE INDEX "MetricReport_userId_reportedDate_type_key" ON "MetricReport"("userId", "reportedDate", "type");

-- AddForeignKey
ALTER TABLE "MetricTracking" ADD CONSTRAINT "MetricTracking_metricId_fkey" FOREIGN KEY ("metricId") REFERENCES "Metric"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "MetricReport" ADD CONSTRAINT "MetricReport_metricTrackingId_fkey" FOREIGN KEY ("metricTrackingId") REFERENCES "MetricTracking"("id") ON DELETE RESTRICT ON UPDATE CASCADE;
