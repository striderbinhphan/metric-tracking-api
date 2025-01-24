import { ApiProperty } from '@nestjs/swagger';
import { Metric } from '@prisma/client';

export class MetricTrackingResponseDto {
  @ApiProperty()
  id: number;

  @ApiProperty()
  value: number;

  @ApiProperty()
  metric: Pick<Metric, 'id' | 'symbol' | 'displayName' | 'type' | 'conversionRate'>;

  @ApiProperty()
  trackedAt: Date;
}
