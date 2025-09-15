const Transport = require('winston-transport');
const fetch = require('node-fetch');
const { context } = require('@opentelemetry/api');
const { suppressTracing } = require('@opentelemetry/core');

class OTLPTransport extends Transport {
  constructor() {
    super();
    this.url = process.env.OTEL_EXPORTER_OTLP_LOGS_ENDPOINT;
    this.headers = {
      'Content-Type': 'application/json',
      'signoz-ingestion-key': (process.env.OTEL_EXPORTER_OTLP_HEADERS || '').split('=').pop(),
    };
    this.serviceName = process.env.OTEL_SERVICE_NAME || 'node-service';
  }

  log(info, callback) {
    setImmediate(() => this.emit('logged', info));

    const payload = {
      resourceLogs: [{
        resource: {
          attributes: [{ key: 'service.name', value: { stringValue: this.serviceName } }],
        },
        scopeLogs: [{
          scope: { name: 'winston-logger' },
          logRecords: [{
            timeUnixNano: Date.now() * 1e6,
            severityText: info.level,
            body: { stringValue: info.message },
            attributes: Object.entries(info).map(([k, v]) => ({
              key: k,
              value: { stringValue: String(v) },
            })),
          }],
        }],
      }],
    };

    // Suppress tracing for log export
    context.with(suppressTracing(context.active()), () => {
      fetch(this.url, { method: 'POST', headers: this.headers, body: JSON.stringify(payload) })
        .catch(err => console.error('❌ Failed to export log:', err));
    });

    callback();
  }
}

module.exports = OTLPTransport;
