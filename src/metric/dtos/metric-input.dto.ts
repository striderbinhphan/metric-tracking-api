import {ApiProperty, ApiPropertyOptional} from '@nestjs/swagger';
import {MetricType} from '@prisma/client';
import {Type} from 'class-transformer';
import {IsEnum, IsNotEmpty, IsNumber, IsOptional, IsString} from 'class-validator';
import {PaginationQueryDto} from 'src/common/dtos/pagination.dto';

export class GetMetricsInputDto extends PaginationQueryDto {
  @ApiPropertyOptional({
    required: false,
    description: 'search keyword',
  })
  @IsOptional()
  @IsString()
  searchKeyword: string;

  @ApiPropertyOptional({
    type: 'enum',
    enum: MetricType,
    required: false,
    description: 'The type of the metric',
  })
  @IsOptional()
  @IsEnum(MetricType)
  type: MetricType;
}

export class CreateMetricInputDto {
  @ApiProperty({
    type: 'enum',
    enum: MetricType,
    description: 'The type of the metric',
    required: true,
  })
  @IsNotEmpty()
  @IsEnum(MetricType)
  type: MetricType;

  @ApiProperty({
    type: String,
    required: true,
    description: 'The symbol of metric',
  })
  @IsString()
  @IsNotEmpty()
  @Type(() => String)
  symbol: string;

  @ApiProperty({
    type: String,
    required: true,
    description: 'The display name of metric',
  })
  @IsString()
  @IsNotEmpty()
  @Type(() => String)
  displayName: string;

  @ApiProperty({
    type: Number,
    required: false,
    description: 'The conversion rate of metric',
  })
  @IsOptional()
  @IsNumber()
  @Type(() => Number)
  conversionRate: number;
}

export class UpdateMetricInputDto {
  @ApiProperty({
    type: String,
    required: false,
    description: 'The symbol of metric',
  })
  @IsString()
  @IsOptional()
  @Type(() => String)
  symbol: string;

  @ApiProperty({
    type: String,
    required: false,
    description: 'The display name of metric',
  })
  @IsString()
  @IsOptional()
  @Type(() => String)
  displayName: string;

  @ApiProperty({
    type: Number,
    required: false,
    description: 'The conversion rate of metric',
  })
  @IsOptional()
  @IsNumber()
  @Type(() => Number)
  conversionRate: number;
}
