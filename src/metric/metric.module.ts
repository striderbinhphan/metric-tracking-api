import {Module} from '@nestjs/common';
import {PrismaModule} from 'src/prisma/prisma.module';
import {MetricController} from './metric.controller';
import {MetricService} from './metric.service';

@Module({
  imports: [PrismaModule],
  controllers: [MetricController],
  providers: [MetricService],
  exports: [MetricService],
})
export class MetricModule {}
