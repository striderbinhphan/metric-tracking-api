import {ApiProperty} from '@nestjs/swagger';
import {MetricType} from '@prisma/client';
import {Type} from 'class-transformer';
import {IsNotEmpty, IsNumber, IsOptional, IsEnum, IsDate} from 'class-validator';

export class GetAllMetricReportInputDto {
  @ApiProperty({
    type: Date,
    required: false,
    description: 'The start date of the report',
  })
  @IsDate()
  @Type(() => Date)
  @IsOptional()
  fromDate: Date;

  @ApiProperty({
    type: Date,
    required: false,
    description: 'The start date of the report',
  })
  @IsDate()
  @Type(() => Date)
  @IsOptional()
  toDate: Date;

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
