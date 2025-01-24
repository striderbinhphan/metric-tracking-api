import {PrismaModule} from '../prisma/prisma.module';
import {MetricReportController} from './metric-report.controller';
import {MetricReportService} from './metric-report.service';
import {Module} from '@nestjs/common';
import {MetricModule} from '../metric/metric.module';

@Module({
  imports: [PrismaModule, MetricModule],
  controllers: [MetricReportController],
  providers: [MetricReportService],
  exports: [MetricReportService],
})
export class MetricReportModule {}
