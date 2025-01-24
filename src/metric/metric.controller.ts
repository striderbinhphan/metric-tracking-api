import {Body, Controller, Delete, Get, HttpStatus, Param, Post, Put, Query} from '@nestjs/common';
import {ApiOperation, ApiResponse, ApiTags} from '@nestjs/swagger';
import {PaginationParamDecorator} from 'src/common/decorators/pagination.decorator';
import {PaginationQueryDto} from 'src/common/dtos/pagination.dto';
import {CreateMetricInputDto, GetMetricsInputDto, UpdateMetricInputDto} from './dtos/metric-input.dto';
import {MetricService} from './metric.service';

@ApiTags('Metrics')
@Controller('metrics')
export class MetricController {
  constructor(private service: MetricService) {}

  @Get()
  @ApiOperation({
    operationId: 'getAllMetrics',
    description: 'Get all',
  })
  @ApiResponse({
    status: HttpStatus.OK,
    description: 'Get all',
  })
  async getAll(@Query() query: GetMetricsInputDto, @PaginationParamDecorator() pagination: PaginationQueryDto) {
    return this.service.getAll(query, pagination);
  }

  @Get(':metricId')
  @ApiOperation({
    operationId: 'getMetricById',
    description: 'Get by id',
  })
  @ApiResponse({
    status: HttpStatus.OK,
    description: 'Get by id',
  })
  async getById(@Param('metricId') metricId: number) {
    return this.service.getById(metricId);
  }

  @Post()
  @ApiOperation({
    operationId: 'createMetric',
    description: 'Create',
  })
  @ApiResponse({
    status: HttpStatus.OK,
    description: 'Create',
  })
  async create(@Body() data: CreateMetricInputDto) {
    return this.service.create(data);
  }

  @Put(':metricId')
  @ApiOperation({
    operationId: 'updateOrganization',
    description: 'Update',
  })
  @ApiResponse({
    status: HttpStatus.OK,
    description: 'Update',
  })
  async update(@Param('metricId') metricId: number, @Body() data: UpdateMetricInputDto) {
    return this.service.update(metricId, data);
  }

  @Delete('/:metricId')
  @ApiOperation({
    operationId: 'deleteMetric',
    description: 'deleteMetric',
  })
  @ApiResponse({
    status: HttpStatus.OK,
    description: 'Deleted',
  })
  async delete(@Param('metricId') metricId: number) {
    return this.service.delete(metricId);
  }
}
