import {Metric} from '@prisma/client';

export function convertMetric(value: number, originMetric: Metric, destinationMetric?: Metric) {
  if (!destinationMetric) {
    return value;
  }

  if (originMetric.symbol === destinationMetric.symbol) {
    return value;
  }
  return (value * originMetric.conversionRate) / destinationMetric.conversionRate;
}
