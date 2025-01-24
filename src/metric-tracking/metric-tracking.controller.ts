import {Body, Controller, Delete, Get, HttpStatus, Param, Post, Put, Query} from '@nestjs/common';
import {ApiOperation, ApiResponse, ApiTags} from '@nestjs/swagger';
import {MetricTrackingService} from './metric-tracking.service';
import {CreateMetricTrackingInputDto, GetAllMetricTrackingInputDto} from './dtos/metric-tracking-input.dto';
import {PaginationParamDecorator} from 'src/common/decorators/pagination.decorator';

@ApiTags('Metric Tracking')
@Controller('metric-tracking')
export class MetricTrackingController {
  constructor(private service: MetricTrackingService) {}

  @Post()
  @ApiOperation({
    operationId: 'createMetricTracking',
    description: 'Create Metric Tracking',
  })
  @ApiResponse({
    status: HttpStatus.OK,
    description: 'Created!',
  })
  async create(@Body() data: CreateMetricTrackingInputDto) {
    return this.service.create(data);
  }

  @Get()
  @ApiOperation({
    operationId: 'getAllMetricTracking',
    description: 'Get All Metric Tracking',
  })
  @ApiResponse({
    status: HttpStatus.OK,
    description: 'Success',
  })
  async getAll(@Query() query: GetAllMetricTrackingInputDto, @PaginationParamDecorator() pagination: any) {
    return this.service.getAll(query, pagination);
  }
}
