import {BadRequestException, HttpException, Injectable} from '@nestjs/common';
import {PaginationQueryDto, PaginatedResponseDto} from '../common/dtos/pagination.dto';
import {formatPaginatedResponse, calculateTakeAndSkip} from '../common/helper/paginate.helper';
import {PrismaService} from '../prisma/prisma.service';
import {Metric, MetricType} from '@prisma/client';
import {CreateMetricInputDto, GetMetricsInputDto, UpdateMetricInputDto} from './dtos/metric-input.dto';

@Injectable()
export class MetricService {
  constructor(private prismaService: PrismaService) {}

  private getSelectFields() {
    return {
      id: true,
      symbol: true,
      displayName: true,
      type: true,
      conversionRate: true,
      createdAt: true,
      updatedAt: true,
    };
  }

  private transformMetricConditions(query: GetMetricsInputDto) {
    const conditions = {
      AND: [],
    } as any;

    if (query?.searchKeyword) {
      conditions.AND.push({
        OR: [
          {
            symbol: {
              contains: query.searchKeyword,
              mode: 'insensitive',
            },
          },
          {
            displayName: {
              contains: query.searchKeyword,
              mode: 'insensitive',
            },
          },
        ],
      });
    }

    if (query?.type) {
      conditions.AND.push({type: query.type});
    }

    const orderBy = {} as any;
    if (query?.sort) {
      const sorts = query.sort.split(',');
      for (const sort of sorts) {
        const sortDirection = sort.startsWith('-') ? 'desc' : 'asc';
        orderBy[sort.replace('-', '')] = sortDirection;
      }
    }

    return {conditions, orderBy};
  }
  private async genericGetAll(
    conditions: any,
    pagination: PaginationQueryDto,
    orderBy: any,
  ): Promise<PaginatedResponseDto<Metric>> {
    const count = await this.prismaService.metric.count({
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

    const items = await this.prismaService.metric.findMany({
      select: this.getSelectFields(),
      where: conditions,
      orderBy,
      ...calculateTakeAndSkip(pagination),
    });
    return formatPaginatedResponse({
      items,
      page: pagination.page,
      limit: pagination.limit,
      count,
    });
  }

  async getAll(query: GetMetricsInputDto, pagination: PaginationQueryDto) {
    const {conditions, orderBy} = this.transformMetricConditions(query);
    return this.genericGetAll(conditions, pagination, orderBy);
  }

  async getById(metricId: number) {
    return this.prismaService.metric.findUnique({
      where: {
        id: metricId,
      },
    });
  }

  async delete(metricId: number) {
    return this.prismaService.metric.delete({
      where: {
        id: metricId,
      },
    });
  }

  private async validateMetricDuplicated(
    data: {symbol: string; displayName: string; type: MetricType},
    excludeId?: number,
  ) {
    const conditions = {
      AND: [
        {
          OR: [
            {
              symbol: {
                mode: 'insensitive',
                equals: data.symbol,
              },
            },
            {
              displayName: {
                mode: 'insensitive',
                equals: data.displayName,
              },
            },
          ],
        },
        {
          type: data.type,
        },
      ],
    } as any;

    if (excludeId) {
      conditions.AND.push({
        id: {not: excludeId},
      });
    }

    const isMetricDuplicated = await this.prismaService.metric.findFirst({
      where: conditions,
    });

    if (isMetricDuplicated) {
      throw new BadRequestException('Metric is duplicated!');
    }
  }
  async create(data: CreateMetricInputDto) {
    await this.validateMetricDuplicated(data);

    return this.prismaService.metric.create({
      data,
    });
  }

  async update(metricId: number, data: UpdateMetricInputDto) {
    const metric = await this.getById(metricId);
    const dataToUpdate = {} as any;

    if (data?.symbol) {
      dataToUpdate.symbol = data.symbol;
    }

    if (data?.displayName) {
      dataToUpdate.displayName = data.displayName;
    }

    if (data?.conversionRate) {
      dataToUpdate.conversionRate = data.conversionRate;
    }

    await this.validateMetricDuplicated(
      {
        ...metric,
        ...dataToUpdate,
      },
      metricId,
    );

    return this.prismaService.metric.update({
      where: {
        id: metricId,
      },
      data,
    });
  }
}
