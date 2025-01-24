# Metrics Tracking Backend

## Run service on localhost

- Default url [http://localhost:8002](http://localhost:8002)
- Swagger [http://localhost:8002/docs](http://localhost:8002/docs)

## Running the app locally on your OS

- You can run the app against your OS if you think it will be quicker development.

```bash
docker compose up -d
npm install
npm run dev
```

- Run DB migration by cmd:

```bash
npm run db:migrate
```

## Functionality overview

- This service is designed for metric tracking purposes. It supports different units, and we can easily add new metric units through the metric endpoint.

**Solutions**

- Use the Metric module to make metrics (units) more flexible. Here, the `conversionRate` value is used for unit conversion, with the default units being Celsius (°C) for temperature and meters (m) for distance. Endpoints are created to store metrics (units) at specific timestamps(MetricTracking). The MetricReport module is used to aggregate values in advance, instead of using `groupBy` in the MetricTracking module, to optimize performance.

**Terms**

- Metric: this is about units of each type, the `conversionRate` based on default unit for each type. The default unit of `Distance` is meter(m), the other hand, the default unit of `Temperature` is Celcius(°C).
- MetricTracking: the record responsible for track the metric in specific datetime.
- MetricReport: the record responsible for track latest metric by date

**General functionality:**

- User should be able to add new metricTracking with: Date, Value, Unit.

```bash
curl -X 'POST' \
  'http://localhost:8002/api/metric-tracking' \
  -H 'accept: */*' \
  -H 'Content-Type: application/json' \
  -d '{
  "userId": 1,
  "metricId": 2,
  "value": 1000,
  "trackedAt": "2025-01-24T07:00:00.000Z"
}'
```

- User should be able get a List of all MetricTrackings base on the type (Distance / Temperature)

```bash
  curl -X 'GET' \
  'http://localhost:8002/api/metric-tracking?userId=1&type=Distance' \
  -H 'accept: */*'
```

- User should be able to get data to draw a chart, which take the latest metric insert for a day, based on the type and specific time period.

```bash
  curl -X 'GET' \
  'http://localhost:8002/api/metric-report?fromDate=2025-01-01T09%3A54%3A58.917Z&toDate=2025-01-31T09%3A54%3A58.917Z&userId=1&type=Distance' \
  -H 'accept: */*'
```

**Main Modules:**

- MetricModule: Responsible for managing metrics (units).
- MetricTrackingModule: Responsible for saving and retrieving metric tracking records.
- MetricReportModule: Responsible for generating charts and reports based on daily data.
