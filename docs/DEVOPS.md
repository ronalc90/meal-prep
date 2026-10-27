# DevOps - MealPrep

Autor: Ronald

## Arquitectura de Infraestructura

```
                    ┌─────────────────┐
                    │   CloudFlare    │
                    │   (CDN + DNS)   │
                    └────────┬────────┘
                             │
                    ┌────────▼────────┐
                    │   AWS ALB       │
                    │   (HTTPS:443)   │
                    └────────┬────────┘
                             │
              ┌──────────────┴──────────────┐
              │                             │
     ┌────────▼────────┐          ┌────────▼────────┐
     │   Frontend       │          │   Backend        │
     │   (Nginx/S3)     │          │   (ECS Fargate)  │
     │   Puerto: 80     │          │   Puerto: 3004   │
     └─────────────────┘          └────────┬────────┘
                                           │
                                  ┌────────▼────────┐
                                  │   PostgreSQL     │
                                  │   (RDS)          │
                                  │   Puerto: 5432   │
                                  └─────────────────┘
```

## Stack Tecnologico

| Componente | Tecnologia |
|---|---|
| CI/CD | GitHub Actions |
| Contenedores | Docker (multi-stage builds) |
| Orquestacion | Kubernetes / AWS ECS Fargate |
| IaC | Terraform |
| Base de datos | PostgreSQL 16 (RDS) |
| Monitoreo | Prometheus + Grafana |
| Registry | GitHub Container Registry (ghcr.io) |

## Estructura de Archivos

```
.github/
  workflows/
    ci.yml              # Pipeline de CI (build, test, docker)
    security.yml        # Analisis de seguridad
docker-compose.yml      # Entorno completo local
monitoring/
  prometheus.yml        # Configuracion de Prometheus
  metrics.ts            # Middleware de metricas Express
infra/
  kubernetes/           # Manifiestos de Kubernetes
    namespace.yml
    backend-deployment.yml
    frontend-deployment.yml
    services.yml
    ingress.yml
    hpa.yml
  terraform/            # Infraestructura AWS con Terraform
    main.tf
    variables.tf
    outputs.tf
backend/
  Dockerfile            # Build multi-stage del backend
frontend/
  Dockerfile            # Build multi-stage + Nginx
  nginx.conf            # Configuracion de Nginx
```

## Desarrollo Local

### Prerrequisitos

- Docker y Docker Compose
- Node.js 22+
- npm

### Levantar el entorno completo

```bash
# Clonar el repositorio
git clone https://github.com/ronalc90/meal-prep.git
cd meal-prep

# Levantar todos los servicios
docker compose up -d

# Verificar estado
docker compose ps
```

### Servicios disponibles

| Servicio | URL |
|---|---|
| Frontend | http://localhost |
| Backend API | http://localhost:3004 |
| Prometheus | http://localhost:9090 |
| Grafana | http://localhost:3000 |

### Solo base de datos (desarrollo)

```bash
cd backend
docker compose up -d   # Solo PostgreSQL
npm run dev
```

## CI/CD Pipeline

### Pipeline CI (ci.yml)

Se ejecuta en push a `main`/`develop` y en Pull Requests a `main`.

**Jobs:**

1. **Backend**: npm ci, lint (tsc --noEmit), tests con Jest, build, audit
2. **Frontend**: npm ci, build con Vite, audit
3. **Docker**: Build y push de imagen al registry (solo en push a main)

### Pipeline de Seguridad (security.yml)

Se ejecuta semanalmente y en cambios a main.

**Jobs:**

1. **Audit**: npm audit para backend y frontend
2. **Docker Scan**: Analisis de vulnerabilidades con Trivy
3. **Secret Scan**: Deteccion de secretos con TruffleHog

## Docker

### Build manual de imagenes

```bash
# Backend
docker build -t mealprep-backend:local ./backend

# Frontend
docker build -t mealprep-frontend:local ./frontend
```

### Variables de entorno

Crear un archivo `.env` en la raiz del proyecto:

```env
POSTGRES_USER=mealprep
POSTGRES_PASSWORD=un-password-seguro
POSTGRES_DB=mealprep
JWT_SECRET=un-secret-seguro-para-jwt
GRAFANA_USER=admin
GRAFANA_PASSWORD=admin-password-seguro
```

## Kubernetes

### Despliegue

```bash
# Crear namespace
kubectl apply -f infra/kubernetes/namespace.yml

# Crear secretos (ajustar valores)
kubectl create secret generic mealprep-secrets \
  --namespace=mealprep \
  --from-literal=database-url='postgresql://user:pass@host:5432/mealprep' \
  --from-literal=jwt-secret='jwt-secret-prod'

# Aplicar manifiestos
kubectl apply -f infra/kubernetes/

# Verificar estado
kubectl get all -n mealprep
```

### Auto Scaling

El HPA esta configurado para escalar:
- **Backend**: 2-10 replicas (CPU > 70%, memoria > 80%)
- **Frontend**: 2-6 replicas (CPU > 75%)

## Terraform (AWS)

### Inicializar y aplicar

```bash
cd infra/terraform

# Inicializar
terraform init

# Plan
terraform plan \
  -var="db_username=mealprep" \
  -var="db_password=password-seguro" \
  -var="jwt_secret=jwt-secret-prod"

# Aplicar
terraform apply
```

### Recursos creados

- VPC con subnets publicas y privadas
- ECS Cluster con Fargate
- RDS PostgreSQL 16
- ALB con redirect HTTP -> HTTPS
- ECR para imagenes Docker
- Auto Scaling (CPU-based)
- CloudWatch Logs
