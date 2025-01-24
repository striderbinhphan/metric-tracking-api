import {Injectable} from '@nestjs/common';
import {PrismaService} from '../prisma/prisma.service';
import {CreateMetricTrackingInputDto, GetAllMetricTrackingInputDto} from './dtos/metric-tracking-input.dto';
import moment from 'moment';
import {MetricService} from 'src/metric/metric.service';
import {PaginatedResponseDto, PaginationQueryDto} from 'src/common/dtos/pagination.dto';
import {Metric, MetricTracking} from '@prisma/client';
import {calculateTakeAndSkip, formatPaginatedResponse} from 'src/common/helper/paginate.helper';
import {convertMetric} from 'src/metric/metric.helper';
import {MetricTrackingResponseDto} from './dtos/metric-tracking-response.dto';

@Injectable()
export class MetricTrackingService {
  constructor(
    private prismaService: PrismaService,
    private metricService: MetricService,
  ) {}

  async create(data: CreateMetricTrackingInputDto) {
    const metric = await this.metricService.getById(data.metricId);

    return this.prismaService.$transaction(async (trx) => {
      // create metric tracking
      const metricTrackingCreated = await trx.metricTracking.create({
        data,
      });

      // calculate latest report to optimize query later
      const reportedDate = moment(data.trackedAt).format('YYYY-MM-DD');
      const existedMetricReport = await trx.metricReport.findFirst({
        where: {
          userId: data.userId,
          type: metric.type,
          reportedDate,
        },
      });
      if (!existedMetricReport) {
        await trx.metricReport.create({
          data: {
            userId: data.userId,
            type: metric.type,
            reportedDate,
            metricTrackingId: metricTrackingCreated.id,
            createdAt: new Date(data.trackedAt),
            updatedAt: new Date(data.trackedAt),
          } as any,
        });
      } else {
        if (existedMetricReport.updatedAt < new Date(data.trackedAt)) {
          await trx.metricReport.update({
            where: {
              id: existedMetricReport.id,
            },
            data: {
              metricTrackingId: metricTrackingCreated.id,
              updatedAt: new Date(data.trackedAt),
            },
          });
        }
      }
      return metricTrackingCreated;
    });
  }

  private getSelectFields() {
    return {
      id: true,
      value: true,
      metric: {
        select: {
          id: true,
          symbol: true,
          displayName: true,
          type: true,
          conversionRate: true,
        },
      },
      trackedAt: true,
    };
  }

  private formatMetricTrackingToResponse(
    row: MetricTracking & {metric: Metric},
    destinationMetric: Metric,
  ): MetricTrackingResponseDto {
    return {
      ...row,
      ...(destinationMetric && {
        value: convertMetric(row.value, row.metric, destinationMetric),
        metric: destinationMetric,
      }),
    };
  }

  async getAll(
    query: GetAllMetricTrackingInputDto,
    pagination: PaginationQueryDto,
  ): Promise<PaginatedResponseDto<MetricTrackingResponseDto>> {
    const conditions = {
      AND: [{userId: +query.userId}, {metric: {type: query.type}}],
    } as any;

    if (query?.metricId) {
      conditions.AND.push({metricId: +query.metricId});
    }

    // if destination metric id is provided, then validate and use for convert metric
    let destinationMetric = undefined;
    if (query?.destinationMetricId) {
      destinationMetric = await this.metricService.getById(+query.destinationMetricId);
      if (destinationMetric.type !== query.type) {
        throw new Error('Destination metric type must be same with source metric type');
      }
    }

    const orderBy = {} as any;
    if (query?.sort) {
      const sorts = query.sort.split(',');
      for (const sort of sorts) {
        const sortDirection = sort.startsWith('-') ? 'desc' : 'asc';
        orderBy[sort.replace('-', '')] = sortDirection;
      }
    }
    const count = await this.prismaService.metricTracking.count({
      where: conditions,
    });

    if (!count) {
      return formatPaginatedResponse({
        items: [],
        page: pagination.page,
        limit: pagination.limit,
        count,
      });
    }

    const items = await this.prismaService.metricTracking.findMany({
      select: this.getSelectFields(),
      where: conditions,
      orderBy,
      ...calculateTakeAndSkip(pagination),
    });
    return formatPaginatedResponse({
      items: items.map((item) =>
        this.formatMetricTrackingToResponse(item as MetricTracking & {metric: Metric}, destinationMetric),
      ),
      page: pagination.page,
      limit: pagination.limit,
      count,
    });
  }
}
