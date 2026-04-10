# Decisiones Tecnicas (ADR)

Registro de decisiones de arquitectura para MealPrep.

---

## ADR-001: Express sobre Fastify

**Estado**: Aceptado  
**Fecha**: 2024-10

### Contexto

Se necesita un framework HTTP para el backend de la API REST. Las principales opciones son Express y Fastify.

### Decision

Usar **Express 4.x**.

### Justificacion

- Ecosistema mas maduro con mayor cantidad de middleware disponible
- Documentacion exhaustiva y comunidad activa
- Familiaridad del equipo: menor curva de aprendizaje
- Para un MVP, la diferencia de rendimiento con Fastify no es significativa
- Amplia compatibilidad con herramientas de testing (Supertest)

### Alternativa rechazada

Fastify ofrece mejor rendimiento en benchmarks y un sistema de plugins mas estructurado, pero agrega complejidad innecesaria para el alcance actual del proyecto.

---

## ADR-002: Prisma sobre TypeORM

**Estado**: Aceptado  
**Fecha**: 2024-10

### Contexto

Se necesita un ORM para interactuar con la base de datos relacional. Las opciones principales son Prisma, TypeORM y Drizzle.

### Decision

Usar **Prisma 5.x**.

### Justificacion

- **Type-safety nativo**: El cliente generado ofrece autocompletado completo basado en el schema
- **Schema declarativo**: `schema.prisma` es una fuente de verdad clara para el modelo de datos
- **Migraciones automaticas**: `prisma migrate dev` genera migraciones SQL a partir de cambios en el schema
- **Studio visual**: `npx prisma studio` permite inspeccionar datos durante desarrollo
- **Multi-database**: Cambiar de SQLite a PostgreSQL solo requiere modificar el provider en el schema

### Alternativas rechazadas

- **TypeORM**: Decoradores pesados, menor type-safety, configuracion mas compleja
- **Drizzle**: Mas cercano a SQL puro, buena opcion pero ecosistema menos maduro que Prisma

---

## ADR-003: Vite sobre Create React App

**Estado**: Aceptado  
**Fecha**: 2024-10

### Contexto

Se necesita un bundler y dev server para la aplicacion React del frontend.

### Decision

Usar **Vite 6.x**.

### Justificacion

- **Build drasticamente mas rapido**: Vite usa esbuild para pre-bundling, resultando en builds 10-100x mas rapidos que Webpack
- **HMR instantaneo**: Hot Module Replacement sub-segundo independientemente del tamano de la app
- **Configuracion minima**: Funciona out-of-the-box con React + TypeScript
- **Proxy integrado**: Configuracion simple de proxy para redirigir `/api` al backend
- **CRA esta deprecado**: Create React App ya no recibe mantenimiento activo

### Alternativa rechazada

Create React App (CRA) fue el estandar por anos, pero esta oficialmente deprecado. Webpack puro es una opcion pero requiere configuracion manual significativa.

---

## ADR-004: Monorepo sin herramientas de monorepo

**Estado**: Aceptado  
**Fecha**: 2024-10

### Contexto

La aplicacion tiene dos partes (backend y frontend) que necesitan coexistir en un repositorio.

### Decision

Usar una estructura de **monorepo simple** con directorios separados, cada uno con su propio `package.json`. Sin Turborepo, Nx, Lerna ni workspaces de npm.

### Justificacion

- **Simplicidad**: Para un MVP con dos aplicaciones, las herramientas de monorepo agregan complejidad innecesaria
- **Independencia**: Cada app se instala, compila y despliega de forma independiente
- **CI simple**: GitHub Actions ejecuta jobs separados para backend y frontend
- **Zero config**: No hay archivos de configuracion adicionales ni learning curve

### Cuando reconsiderar

Si el proyecto crece a 3+ aplicaciones o se necesita compartir codigo entre ellas (ej: tipos compartidos), evaluar migrar a npm workspaces o Turborepo.

---

## ADR-005: SQLite en desarrollo, PostgreSQL en produccion

**Estado**: Aceptado  
**Fecha**: 2024-10

### Contexto

Se necesita una base de datos relacional. En desarrollo se prioriza la simplicidad; en produccion, la robustez.

### Decision

Usar **SQLite** durante desarrollo y **PostgreSQL** en produccion. Prisma abstrae las diferencias entre ambos motores.

### Justificacion

- **SQLite en desarrollo**:
  - Zero-config: un archivo `.db` sin instalar nada
  - Portable: se puede borrar y recrear al instante
  - Ideal para desarrollo local y tests

- **PostgreSQL en produccion**:
  - Concurrencia robusta para multiples usuarios
  - Soporte completo de tipos, indices y constraints
  - Disponible como servicio gestionado en Railway, Supabase, Neon, etc.

### Cambiar de motor

Solo requiere modificar `provider` en `schema.prisma` y regenerar migraciones:

```prisma
datasource db {
  provider = "postgresql"  // Cambiar de "sqlite" a "postgresql"
  url      = env("DATABASE_URL")
}
```

---

## ADR-006: Sistema de conversion de unidades

**Estado**: Aceptado  
**Fecha**: 2024-10

### Contexto

La generacion de listas de compras necesita agregar cantidades de ingredientes que pueden estar en distintas unidades (cups, tbsp, g, kg, etc.).

### Decision

Implementar un **sistema de conversion basado en unidades base** (ml para volumen, g para peso) con tablas de factores de conversion.

### Justificacion

- **Normalizacion**: Convertir todo a una base comun permite sumar cantidades directamente
- **Extensibilidad**: Agregar nuevas unidades solo requiere agregar una entrada a la tabla
- **Precision**: Los factores de conversion son constantes estandarizadas
- **Formato legible**: La re-conversion a unidades practicas (kg, cups) hace la lista util para el usuario

### Diseno

El sistema tiene tres funciones principales:

1. `normalizeUnit(quantity, unit)`: Convierte a unidad base
2. `areUnitsCompatible(unit1, unit2)`: Verifica si dos unidades pueden sumarse
3. `formatForDisplay(quantity, baseUnit)`: Convierte de base a unidad practica

### Limitaciones conocidas

- No maneja conversiones entre peso y volumen (ej: cups de harina a gramos)
- Las unidades personalizadas (bunch, slices) no se convierten entre si
- No considera densidades de ingredientes

---

## ADR-007: Context API sobre Redux

**Estado**: Aceptado  
**Fecha**: 2024-10

### Contexto

El frontend necesita gestion de estado global para autenticacion y el plan de comidas.

### Decision

Usar **React Context API** con hooks personalizados.

### Justificacion

- **Dos contexts son suficientes**: `AuthContext` y `MealPlanContext` cubren todo el estado global
- **Sin boilerplate**: No se necesita store, reducers, actions ni middleware
- **Colocation**: El estado vive cerca de donde se usa
- **Hooks nativos**: `useAuth()` y `useMealPlan()` son claros y composables

### Cuando reconsiderar

Si el estado global crece significativamente (ej: cache de recetas, preferencias del usuario, estado de formularios complejos), evaluar Zustand o TanStack Query.

---

## ADR-008: Zod sobre Joi

**Estado**: Aceptado  
**Fecha**: 2024-10

### Contexto

Se necesita validacion de entrada para los endpoints del API.

### Decision

Usar **Zod 3.x** para validacion y definicion de tipos.

### Justificacion

- **Inferencia de tipos**: `z.infer<typeof schema>` genera tipos TypeScript automaticamente, evitando duplicacion
- **TypeScript-first**: Diseñado desde cero para TypeScript
- **Menor bundle**: Mas ligero que Joi
- **API composable**: Los schemas se combinan facilmente con `.partial()`, `.extend()`, `.omit()`
- **Mismo uso en backend y frontend**: Potencial para compartir schemas

### Alternativa rechazada

Joi es mas maduro y tiene mayor cantidad de validaciones built-in, pero no ofrece inferencia de tipos nativa y su API esta diseñada para JavaScript, no TypeScript.

---

## Autor

Ronald
