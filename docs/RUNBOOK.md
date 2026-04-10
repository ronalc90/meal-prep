# Runbook - MealPrep

Autor: Ronald

## Contactos

| Rol | Contacto |
|---|---|
| Desarrollador principal | Ronald |
| On-call | Definir segun equipo |

## Procedimientos de Emergencia

### 1. Backend no responde

**Sintomas:** Health check falla, errores 502/503 en el ALB.

**Diagnostico:**

```bash
# Verificar estado de contenedores
docker compose ps
docker compose logs backend --tail=100

# En Kubernetes
kubectl get pods -n mealprep -l app=mealprep-backend
kubectl logs -n mealprep deployment/mealprep-backend --tail=100

# En AWS ECS
aws ecs describe-services --cluster mealprep-cluster --services mealprep-backend
```

**Acciones:**

1. Verificar conectividad a la base de datos
2. Revisar logs en busca de excepciones
3. Verificar uso de recursos (CPU/memoria)
4. Reiniciar el servicio si es necesario:
   ```bash
   # Docker
   docker compose restart backend

   # Kubernetes
   kubectl rollout restart deployment/mealprep-backend -n mealprep

   # ECS
   aws ecs update-service --cluster mealprep-cluster --service mealprep-backend --force-new-deployment
   ```

### 2. Base de datos no disponible

**Sintomas:** Errores de conexion `ECONNREFUSED` o `timeout` en los logs del backend.

**Diagnostico:**

```bash
# Docker local
docker compose ps postgres
docker compose logs postgres --tail=50

# RDS
aws rds describe-db-instances --db-instance-identifier mealprep-db
```

**Acciones:**

1. Verificar que PostgreSQL esta corriendo
2. Verificar que las credenciales en `DATABASE_URL` son correctas
3. Verificar security groups / red
4. Si es RDS, verificar el estado en la consola de AWS
5. Restaurar desde backup si hay corrupcion de datos:
   ```bash
   aws rds restore-db-instance-to-point-in-time \
     --source-db-instance-identifier mealprep-db \
     --target-db-instance-identifier mealprep-db-restored \
     --restore-time "2024-01-15T10:00:00Z"
   ```

### 3. Frontend no carga

**Sintomas:** Pagina en blanco, errores 404, assets no encontrados.

**Diagnostico:**

```bash
# Verificar contenedor
docker compose ps frontend
docker compose logs frontend --tail=50

# Verificar Nginx
docker compose exec frontend nginx -t

# Kubernetes
kubectl logs -n mealprep deployment/mealprep-frontend --tail=50
```

**Acciones:**

1. Verificar que la build del frontend fue exitosa
2. Verificar configuracion de Nginx
3. Verificar que el proxy al backend funciona
4. Rebuild si es necesario:
   ```bash
   docker compose build frontend
   docker compose up -d frontend
   ```

### 4. Uso alto de CPU/Memoria

**Sintomas:** Alertas de Prometheus, respuestas lentas, pods en estado OOMKilled.

**Diagnostico:**

```bash
# Docker
docker stats

# Kubernetes
kubectl top pods -n mealprep
kubectl top nodes

# Prometheus
# Consultar: container_memory_usage_bytes{namespace="mealprep"}
```

**Acciones:**

1. Identificar el servicio con mayor consumo
2. Verificar si hay memory leaks en los logs
3. Escalar horizontalmente si es necesario:
   ```bash
   kubectl scale deployment mealprep-backend -n mealprep --replicas=4
   ```
4. Revisar limites de recursos en los deployments

### 5. Errores de autenticacion (JWT)

**Sintomas:** Usuarios reportan errores 401, tokens expirados prematuramente.

**Diagnostico:**

```bash
# Verificar que JWT_SECRET esta configurado
docker compose exec backend env | grep JWT

# Revisar logs de autenticacion
docker compose logs backend | grep -i "jwt\|auth\|token"
```

**Acciones:**

1. Verificar que `JWT_SECRET` es consistente entre todas las instancias
2. Verificar que `JWT_EXPIRES_IN` tiene un valor razonable
3. Si se rotaron secretos, los tokens existentes se invalidaran (esto es esperado)

## Procedimientos de Mantenimiento

### Actualizar imagen del backend

```bash
# Construir nueva imagen
docker build -t ghcr.io/ronalc90/meal-prep/backend:v1.x.x ./backend

# Push al registry
docker push ghcr.io/ronalc90/meal-prep/backend:v1.x.x

# Actualizar despliegue
kubectl set image deployment/mealprep-backend \
  backend=ghcr.io/ronalc90/meal-prep/backend:v1.x.x \
  -n mealprep
```

### Ejecutar migraciones de base de datos

```bash
# En el contenedor del backend
docker compose exec backend npx prisma migrate deploy

# O via kubectl
kubectl exec -it deployment/mealprep-backend -n mealprep -- npx prisma migrate deploy
```

### Backup manual de base de datos

```bash
# Docker local
docker compose exec postgres pg_dump -U mealprep mealprep > backup_$(date +%Y%m%d).sql

# Restaurar
docker compose exec -T postgres psql -U mealprep mealprep < backup_20240115.sql
```

### Rotacion de secretos

1. Generar nuevo `JWT_SECRET`
2. Actualizar el secret en Kubernetes:
   ```bash
   kubectl create secret generic mealprep-secrets \
     --namespace=mealprep \
     --from-literal=jwt-secret='nuevo-secret' \
     --dry-run=client -o yaml | kubectl apply -f -
   ```
3. Reiniciar el deployment:
   ```bash
   kubectl rollout restart deployment/mealprep-backend -n mealprep
   ```
4. Los usuarios con sesiones activas deberan re-autenticarse

## Monitorizacion

### Dashboards

| Dashboard | URL | Proposito |
|---|---|---|
| Prometheus | http://localhost:9090 | Metricas raw y queries |
| Grafana | http://localhost:3000 | Dashboards visuales |

### Alertas clave a configurar

- Backend health check fallando > 2 min
- Uso de CPU > 80% por > 5 min
- Uso de memoria > 85%
- Tasa de errores HTTP 5xx > 5% del trafico
- Latencia P95 > 2 segundos
- Espacio en disco de PostgreSQL > 80%

### Queries utiles de Prometheus

```promql
# Tasa de peticiones por segundo
rate(http_requests_total[5m])

# Latencia P95
histogram_quantile(0.95, rate(http_request_duration_seconds_bucket[5m]))

# Tasa de errores
sum(rate(http_requests_total{status_code=~"5.."}[5m])) / sum(rate(http_requests_total[5m]))

# Peticiones activas
http_active_requests
```
