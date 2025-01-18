import { LOKI_URL } from "./env";
import type { Logger } from "pino";
import { Registry, collectDefaultMetrics } from "prom-client";

declare global {
  // var usage is required for global declaration
  // eslint-disable-next-line no-var
  var logger: Logger;

  // eslint-disable-next-line no-var
  var metrics: {
    registry: Registry
  } | undefined;
}

export async function register() {
  console.log("Registering instrumentation");

  if (process.env.NEXT_RUNTIME === "nodejs") {
    const pino = (await import("pino")).default;
    const pinoLoki = (await import("pino-loki")).default;

    const lokiTransport = pinoLoki({
      host: LOKI_URL, // loki server address
      batching: true, // enable batching of logs for better performance
      interval: 5,    // send logs every 5 seconds when batching
      labels: {       // add app labels to logs
        app: 'brewsuite-admin-portal'
      }
    });

    const logger = pino(lokiTransport);
    globalThis.logger = logger;

    const prometheusRegistry = new Registry();
    collectDefaultMetrics({ register: prometheusRegistry });
    globalThis.metrics = { registry: prometheusRegistry };
  }
}