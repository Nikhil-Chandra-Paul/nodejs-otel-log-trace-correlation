'use strict';

const winston = require('winston');
const { context, trace } = require('@opentelemetry/api');
const { OpenTelemetryTransportV3 } = require('@opentelemetry/winston-transport');

// Add trace_id and span_id to log entries if available
const traceFormat = winston.format((info) => {
  const span = trace.getSpan(context.active());
  if (span) {
    const spanContext = span.spanContext();
    if (spanContext && spanContext.traceId) {
      info.trace_id = spanContext.traceId;
      info.span_id = spanContext.spanId;
    }
  }
  return info;
});

const logger = winston.createLogger({
  level: process.env.LOG_LEVEL || 'info',
  format: winston.format.combine(
    traceFormat(),
    winston.format.timestamp(),
    winston.format.json()
  ),
  defaultMeta: {
    service: process.env.OTEL_SERVICE_NAME || 'node-service',
  },
  transports: [
    new winston.transports.Console(),   // logs to console
    new OpenTelemetryTransportV3(),    // exports logs via OTLP
  ],
});

module.exports = logger;
