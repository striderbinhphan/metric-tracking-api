import {MetricType, PrismaClient} from '@prisma/client';
import {BASE_METRICS} from './data/base-metric';

const prisma = new PrismaClient();

async function seedMetrics() {
  console.log('Seeding metrics starting...');
  const isSeeded = await prisma.metricTracking.findMany();
  if (isSeeded.length > 0) {
    console.log('Metrics already seeded.');
    return;
  }

  await prisma.metric.createMany({
    data: BASE_METRICS.map((metric) => ({
      type: metric.type as MetricType,
      displayName: metric.displayName,
      symbol: metric.symbol,
      conversionRate: metric.conversionRate,
    })),
  });
  console.log('Seeding metrics done.');
}

const load = async () => {
  try {
    await seedMetrics()
  } catch (e) {
    console.error(e);
    process.exit(1);
  } finally {
    await prisma.$disconnect();
  }
};

load();
