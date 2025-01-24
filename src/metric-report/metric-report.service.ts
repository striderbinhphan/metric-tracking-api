import {Injectable} from '@nestjs/common';
import {PrismaService} from '../prisma/prisma.service';
import {GetAllMetricReportInputDto} from './dtos/metric-report-input.dto';
import {MetricService} from '../metric/metric.service';
import {convertMetric} from '../metric/metric.helper';
import moment from 'moment';
import {formatYYYYMMDD} from 'src/common/helper/common.helper';

@Injectable()
export class MetricReportService {
  constructor(
    private prismaService: PrismaService,
    private metricService: MetricService,
  ) {}
  async getMetricReport(query: GetAllMetricReportInputDto) {
    const fromDate = query?.fromDate || moment().startOf('month').toDate();
    const toDate = query?.toDate || new Date();
    const conditions = {
      AND: [
        {userId: +query.userId},
        {type: query.type},
        {reportedDate: {gte: formatYYYYMMDD(fromDate), lte: formatYYYYMMDD(toDate)}},
      ],
    } as any;
    // if destination metric id is provided, then validate and use for convert metric
    let destinationMetric = undefined;
    if (query?.destinationMetricId) {
      destinationMetric = await this.metricService.getById(+query.destinationMetricId);
      if (destinationMetric.type !== query.type) {
        throw new Error('Destination metric type must be same with source metric type');
      }
    }

    const items = await this.prismaService.metricReport.findMany({
      select: {
        reportedDate: true,
        metricTracking: {
          select: {
            value: true,
            metric: true,
          },
        },
      },
      where: conditions,
      orderBy: {
        reportedDate: 'asc',
      },
    });
    return items.map((item) => {
      const metricValue = item.metricTracking.value;
      const metric = item.metricTracking.metric;
      return {
        reportedDate: item.reportedDate,
        value: metricValue,
        metric: metric,
        ...(destinationMetric && {
          value: convertMetric(metricValue, metric, destinationMetric),
          metric: destinationMetric,
        }),
      };
    });
  }
}
