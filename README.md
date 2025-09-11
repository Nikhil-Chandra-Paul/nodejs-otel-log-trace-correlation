# Node.js OpenTelemetry + Winston + SigNoz Demo

This project shows how to **correlate logs with traces** in a Node.js application using:

- [OpenTelemetry](https://opentelemetry.io/) for **tracing and context propagation**
- [Winston](https://github.com/winstonjs/winston) for **structured logging**
- [SigNoz Cloud](https://signoz.io) for **centralized observability**

👉 Why does this matter?  
When something goes wrong in your app, you usually check **traces** (to see where it broke) and **logs** (to see what exactly happened). If these two are separate, debugging is painful. By injecting the **traceId** into your logs, SigNoz can show you **logs and traces side by side** — no more guesswork.

---

## ✨ Features
- Automatic tracing of HTTP requests and async operations with OpenTelemetry
- Winston logger enriched with `traceId` and `spanId`
- Direct export of logs and traces to SigNoz Cloud (no local Collector required)
- Minimal Express app with multiple demo endpoints

---

## ✅ Prerequisites
- [Node.js](https://nodejs.org/) **18+** installed  
  Check with:
  ```sh
  node -v
    ````

* A [SigNoz Cloud](https://signoz.io) account

  * Sign up [here](https://signoz.io/cloud) if you don’t have one
  * Copy your **ingestion key** from the SigNoz dashboard

---

## 🚀 Setup

### 1. Clone the repository

```sh
git clone <repo-url>
cd nodejs-otel-log-trace-correlation
```

### 2. Configure Environment

Edit the `otel.env` file in the project root. This file tells OpenTelemetry **where to send data** and which service name to use.

```env
# SigNoz Cloud OTLP endpoint
OTEL_LOGS_EXPORTER=otlp
OTEL_EXPORTER_OTLP_ENDPOINT=https://ingest.in.signoz.cloud:443
OTEL_EXPORTER_OTLP_LOGS_ENDPOINT=https://ingest.in.signoz.cloud:443/v1/logs

# Authentication header for SigNoz
OTEL_EXPORTER_OTLP_HEADERS=signoz-ingestion-key=xxx

# Service name
OTEL_SERVICE_NAME=nodejs-winston-otel-demo
```

* Replace `xxx` with your **SigNoz ingestion key**.
* `OTEL_SERVICE_NAME` will be how this app shows up in SigNoz dashboards.

---

### 3. Run the App

Load the environment variables and start the app:

```sh
export $(cat otel.env | xargs) && npm start
```

This will:

* Launch the Express demo app on port **3000**
* Automatically instrument requests with OpenTelemetry
* Enrich Winston logs with `traceId` and `spanId`
* Export both traces and logs to SigNoz Cloud

---

## 🧪 End-to-End Test

1. Start the app:

   ```sh
   export $(cat otel.env | xargs) && npm start
   ```

2. Hit some endpoints:

   ```sh
   curl http://localhost:3000/
   curl http://localhost:3000/work
   curl http://localhost:3000/db
   curl http://localhost:3000/error
   ```

3. Check your logs in the terminal — you should see JSON logs like this:

   ```json
   {
     "level": "info",
     "message": "Handling / request",
     "traceId": "a1b2c3d4e5f67890abcdef1234567890",
     "spanId": "1234abcd5678efgh",
     "timestamp": "2025-09-10T12:34:56.789Z",
     "service": "nodejs-winston-otel-demo"
   }
   ```

4. Open **SigNoz Cloud**:

   * Go to **Traces** → pick a trace
   * Switch to the **Related Logs** tab
   * You’ll see exactly the logs tied to that trace 🎉

---

## 🛠️ Troubleshooting

* **No traces in SigNoz?**

  * Check that your ingestion key in `otel.env` is correct.
  * Verify you replaced the `<region>` placeholder with your actual region.

* **Logs missing traceId?**

  * Ensure you are logging *inside a request handler or async span*.
  * Logs outside trace context (e.g., at startup) won’t have a traceId — this is expected.

* **App not starting?**

  * Run `npm install` again to ensure all deps are installed.
  * Use Node 18 or newer.

---

## 📝 Notes

* No local OpenTelemetry Collector is required when sending to **SigNoz Cloud**.
* All configuration lives in `otel.env`.

---

## 📚 References

* [SigNoz Documentation](https://signoz.io/docs/)
* [OpenTelemetry for Node.js](https://opentelemetry.io/docs/instrumentation/js/)
* [Winston Logger](https://github.com/winstonjs/winston)