-- CreateIndex
CREATE INDEX "MetricReport_userId_type_idx" ON "MetricReport"("userId", "type");

-- CreateIndex
CREATE INDEX "MetricTracking_userId_idx" ON "MetricTracking"("userId");
