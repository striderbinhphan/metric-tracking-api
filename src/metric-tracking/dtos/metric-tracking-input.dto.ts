import {ApiProperty} from '@nestjs/swagger';
import {MetricType} from '@prisma/client';
import {Type} from 'class-transformer';
import {IsDate, IsEnum, IsNotEmpty, IsNumber, IsOptional} from 'class-validator';
import {PaginationQueryDto} from 'src/common/dtos/pagination.dto';

export class CreateMetricTrackingInputDto {
  @ApiProperty({
    type: Number,
    required: true,
    description: 'The id of the user',
  })
  @IsNotEmpty()
  @IsNumber()
  userId: number;

  @ApiProperty({
    type: Number,
    required: true,
    description: 'The id of the metric',
  })
  @IsNotEmpty()
  @IsNumber()
  metricId: number;

  @ApiProperty({
    type: Number,
    required: true,
    description: 'The value of the metric',
  })
  @IsNotEmpty()
  @IsNumber()
  value: number;

  @ApiProperty({
    type: String,
    example: '2025-01-01T00:00:00.000Z',
    required: true,
    description: 'The date of the metric',
  })
  @IsNotEmpty()
  @IsDate()
  @Type(() => Date)
  trackedAt: Date;
}

export class GetAllMetricTrackingInputDto extends PaginationQueryDto {
  @ApiProperty({
    type: Number,
    required: true,
    description: 'The id of the user',
  })
  @IsNotEmpty()
  @IsNumber()
  @Type(() => Number)
  userId: number;

  @ApiProperty({
    type: Number,
    required: false,
    description: 'The id of the metric',
  })
  @IsOptional()
  @IsNumber()
  @Type(() => Number)
  metricId: number;

  @ApiProperty({
    type: Number,
    required: false,
    description: 'The id of the metric for converted',
  })
  @IsOptional()
  @IsNumber()
  @Type(() => Number)
  destinationMetricId: number;

  @ApiProperty({
    type: 'enum',
    enum: MetricType,
    description: 'The type of the metric',
    required: true,
  })
  @IsNotEmpty()
  @IsEnum(MetricType)
  type: MetricType;
}
