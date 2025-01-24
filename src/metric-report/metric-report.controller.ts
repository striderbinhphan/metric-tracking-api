import {Body, Controller, Delete, Get, HttpStatus, Param, Post, Put, Query} from '@nestjs/common';
import {ApiOperation, ApiResponse, ApiTags} from '@nestjs/swagger';
import {MetricReportService} from './metric-report.service';
import {GetAllMetricReportInputDto} from './dtos/metric-report-input.dto';

@ApiTags('Metric Report')
@Controller('metric-report')
export class MetricReportController {
  constructor(private service: MetricReportService) {}

  @Get()
  @ApiOperation({summary: 'Get all metric report'})
  @ApiResponse({status: HttpStatus.OK, description: 'Success'})
  async getAll(@Query() query: GetAllMetricReportInputDto) {
    return this.service.getMetricReport(query);
  }
}
