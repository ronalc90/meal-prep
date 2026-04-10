import { Request, Response, NextFunction } from 'express';
import client from 'prom-client';

// Registro de metricas
const register = new client.Registry();

// Metricas por defecto del proceso Node.js
client.collectDefaultMetrics({ register });

// Contador de peticiones HTTP
const httpRequestsTotal = new client.Counter({
  name: 'http_requests_total',
  help: 'Total de peticiones HTTP recibidas',
  labelNames: ['method', 'route', 'status_code'],
  registers: [register],
});

// Histograma de duracion de peticiones
const httpRequestDuration = new client.Histogram({
  name: 'http_request_duration_seconds',
  help: 'Duracion de peticiones HTTP en segundos',
  labelNames: ['method', 'route', 'status_code'],
  buckets: [0.01, 0.05, 0.1, 0.25, 0.5, 1, 2.5, 5, 10],
  registers: [register],
});

// Gauge de peticiones activas
const httpActiveRequests = new client.Gauge({
  name: 'http_active_requests',
  help: 'Numero de peticiones HTTP activas',
  registers: [register],
});

/**
 * Middleware para recolectar metricas de cada peticion HTTP.
 * Registra contador, duracion e histograma por ruta/metodo/status.
 */
export function metricsMiddleware(req: Request, res: Response, next: NextFunction): void {
  if (req.path === '/api/metrics') {
    next();
    return;
  }

  httpActiveRequests.inc();
  const end = httpRequestDuration.startTimer();

  res.on('finish', () => {
    const route = req.route?.path || req.path;
    const labels = {
      method: req.method,
      route,
      status_code: res.statusCode.toString(),
    };

    httpRequestsTotal.inc(labels);
    end(labels);
    httpActiveRequests.dec();
  });

  next();
}

/**
 * Handler para el endpoint /api/metrics.
 * Devuelve metricas en formato Prometheus.
 */
export async function metricsHandler(_req: Request, res: Response): Promise<void> {
  res.set('Content-Type', register.contentType);
  res.end(await register.metrics());
}
