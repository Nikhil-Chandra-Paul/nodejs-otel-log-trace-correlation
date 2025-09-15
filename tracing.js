'use strict';

const process = require('process');
const { NodeSDK } = require('@opentelemetry/sdk-node');
const { OTLPTraceExporter } = require('@opentelemetry/exporter-trace-otlp-http');
const { HttpInstrumentation } = require('@opentelemetry/instrumentation-http');
const { ExpressInstrumentation } = require('@opentelemetry/instrumentation-express');

// OTLP exporters
const traceExporter = new OTLPTraceExporter();

// Configure OpenTelemetry SDK
const sdk = new NodeSDK({
  traceExporter,
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
