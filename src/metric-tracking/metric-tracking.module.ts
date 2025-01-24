import {Module} from '@nestjs/common';
import {PrismaModule} from 'src/prisma/prisma.module';
import {MetricTrackingController} from './metric-tracking.controller';
import {MetricTrackingService} from './metric-tracking.service';
import {MetricModule} from 'src/metric/metric.module';

@Module({
  imports: [PrismaModule, MetricModule],
  controllers: [MetricTrackingController],
  providers: [MetricTrackingService],
  exports: [MetricTrackingService],
})
export class MetricTrackingModule {}
