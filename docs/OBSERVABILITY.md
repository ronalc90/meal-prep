# Observabilidad - MealPrep

Autor: Ronald

## Resumen

El sistema de observabilidad de MealPrep se basa en tres pilares: metricas, logs y trazas. Esta configuracion permite identificar problemas de rendimiento, detectar errores y entender el comportamiento del sistema en produccion.

## Arquitectura de Monitoreo

```
┌───────────────┐     scrape      ┌──────────────┐     datasource    ┌──────────────┐
│   Backend     │ ◄─────────────► │  Prometheus  │ ◄───────────────► │   Grafana    │
│   :3004       │    /api/metrics │  :9090       │                   │   :3000      │
│   (prom-client│                 │              │                   │              │
│    middleware) │                 │  15s interval│                   │  Dashboards  │
└───────────────┘                 └──────────────┘                   └──────────────┘
```

## Metricas Disponibles

### Metricas de la aplicacion

| Metrica | Tipo | Descripcion |
|---|---|---|
| `http_requests_total` | Counter | Total de peticiones HTTP (method, route, status_code) |
| `http_request_duration_seconds` | Histogram | Duracion de peticiones en segundos |
| `http_active_requests` | Gauge | Numero de peticiones activas en el momento |

### Metricas del proceso (automaticas)

| Metrica | Tipo | Descripcion |
|---|---|---|
| `process_cpu_user_seconds_total` | Counter | Tiempo de CPU en modo usuario |
| `process_resident_memory_bytes` | Gauge | Memoria residente del proceso |
| `nodejs_heap_size_total_bytes` | Gauge | Tamano total del heap de Node.js |
| `nodejs_active_handles_total` | Gauge | Handles activos de Node.js |
| `nodejs_eventloop_lag_seconds` | Gauge | Latencia del event loop |

## Configuracion

### Integrar metricas en el backend

Agregar `prom-client` como dependencia:

```bash
cd backend
npm install prom-client
```

Registrar el middleware en `src/app.ts`:

```typescript
import { metricsMiddleware, metricsHandler } from '../monitoring/metrics';

// Antes de las rutas
app.use(metricsMiddleware);

// Endpoint de metricas
app.get('/api/metrics', metricsHandler);
```

### Prometheus

La configuracion se encuentra en `monitoring/prometheus.yml`.

- **Intervalo de scrape:** 15 segundos
- **Target:** `backend:3004` en `/api/metrics`

### Grafana

- **URL:** http://localhost:3000
- **Credenciales por defecto:** admin / admin
- **Datasource:** Configurar Prometheus apuntando a `http://prometheus:9090`

## Dashboards Recomendados

### Dashboard: Vista General de la API

Paneles sugeridos:

1. **Peticiones por segundo** (rate)
   ```promql
   sum(rate(http_requests_total[5m])) by (method)
   ```

2. **Latencia P50 / P95 / P99**
   ```promql
   histogram_quantile(0.50, sum(rate(http_request_duration_seconds_bucket[5m])) by (le))
   histogram_quantile(0.95, sum(rate(http_request_duration_seconds_bucket[5m])) by (le))
   histogram_quantile(0.99, sum(rate(http_request_duration_seconds_bucket[5m])) by (le))
   ```

3. **Tasa de errores**
   ```promql
   sum(rate(http_requests_total{status_code=~"5.."}[5m])) /
   sum(rate(http_requests_total[5m])) * 100
   ```

4. **Peticiones activas**
   ```promql
   http_active_requests
   ```

### Dashboard: Salud de Node.js

Paneles sugeridos:

1. **Uso de memoria (heap)**
   ```promql
   nodejs_heap_size_used_bytes / nodejs_heap_size_total_bytes * 100
   ```

2. **Event loop lag**
   ```promql
   nodejs_eventloop_lag_seconds
   ```

3. **Handles activos**
   ```promql
   nodejs_active_handles_total
   ```

## Alertas

### Configuracion de alertas en Prometheus

Crear reglas de alertas en `monitoring/alerts.yml` (opcional, futuro):

```yaml
groups:
  - name: mealprep
    rules:
      - alert: HighErrorRate
        expr: sum(rate(http_requests_total{status_code=~"5.."}[5m])) / sum(rate(http_requests_total[5m])) > 0.05
        for: 5m
        labels:
          severity: critical
        annotations:
          summary: "Tasa de errores alta (> 5%)"

      - alert: HighLatency
        expr: histogram_quantile(0.95, sum(rate(http_request_duration_seconds_bucket[5m])) by (le)) > 2
        for: 5m
        labels:
          severity: warning
        annotations:
          summary: "Latencia P95 superior a 2 segundos"

      - alert: HighMemoryUsage
        expr: process_resident_memory_bytes > 500 * 1024 * 1024
        for: 10m
        labels:
          severity: warning
        annotations:
          summary: "Uso de memoria superior a 500MB"
```

## Logs

### Formato de logs

Los logs del backend siguen formato estructurado via `console.log`. En produccion se recomienda agregar un logger como `pino` o `winston` con formato JSON.

### Acceso a logs

```bash
# Docker local
docker compose logs backend -f --tail=100

# Kubernetes
kubectl logs -f deployment/mealprep-backend -n mealprep

# AWS CloudWatch
aws logs tail /ecs/mealprep/backend --follow
```

## Verificacion rapida

```bash
# Levantar stack de monitoreo
docker compose up -d prometheus grafana

# Verificar que el endpoint de metricas responde
curl http://localhost:3004/api/metrics

# Verificar targets en Prometheus
curl http://localhost:9090/api/v1/targets
```
