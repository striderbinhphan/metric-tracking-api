import {MiddlewareConsumer, Module, NestModule, RequestMethod} from '@nestjs/common';
import {PrismaModule} from './prisma/prisma.module';
import {ConfigModule} from '@nestjs/config';
import configuration from './common/configuration';
import {JwtModule} from '@nestjs/jwt';
import {PassportModule} from '@nestjs/passport';
import {CacheModule} from '@nestjs/cache-manager';
import {AppController} from './app.controller';
import {HealthModule} from './health/health.module';
import {LoggerModule} from './logger/logger.module';
import {MetricModule} from './metric/metric.module';
import {MetricTrackingModule} from './metric-tracking/metric-tracking.module';
import {MetricReportModule} from './metric-report/metric-report.module';

@Module({
  imports: [
    LoggerModule,
    ConfigModule.forRoot({
      isGlobal: true,
      envFilePath: '.env',
      load: [configuration],
    }),
    PassportModule,
    JwtModule.register({}),
    CacheModule.register({
      max: 10,
      isGlobal: true,
    }),
    PrismaModule,
    HealthModule,
    MetricModule,
    MetricTrackingModule,
    MetricReportModule,
  ],
  controllers: [AppController],
})
export class AppModule {
  async onApplicationBootstrap() {
    const port = process.env.PORT || 8002;
    console.info(`Metric Tracking API started`);
    console.info(`Started on http://localhost:${port}`);
    console.info(`Docs available on http://localhost:${port}/docs`);
  }
}
