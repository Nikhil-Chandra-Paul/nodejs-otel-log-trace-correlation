'use strict';

const process = require('process');
const { NodeSDK } = require('@opentelemetry/sdk-node');
const { OTLPTraceExporter } = require('@opentelemetry/exporter-trace-otlp-http');
const { OTLPLogExporter } = require('@opentelemetry/exporter-logs-otlp-http');
const { BatchLogRecordProcessor } = require('@opentelemetry/sdk-logs');
const { HttpInstrumentation } = require('@opentelemetry/instrumentation-http');
const { ExpressInstrumentation } = require('@opentelemetry/instrumentation-express');

// OTLP exporters
const traceExporter = new OTLPTraceExporter();
const logExporter = new OTLPLogExporter();

// Configure OpenTelemetry SDK
const sdk = new NodeSDK({
  traceExporter,
  logRecordProcessors: [new BatchLogRecordProcessor(logExporter)],
  instrumentations: [
    new HttpInstrumentation(),
    new ExpressInstrumentation(),
  ],
});

// Start SDK
sdk.start();
console.log('✅ OpenTelemetry SDK started (Traces + Logs)');

// Graceful shutdown
['SIGTERM', 'SIGINT'].forEach((sig) =>
  process.on(sig, () => {
    sdk
      .shutdown()
      .then(() => console.log('✅ OpenTelemetry SDK terminated'))
      .catch((err) => console.error('❌ Error terminating SDK', err))
      .finally(() => process.exit(0));
  })
);
