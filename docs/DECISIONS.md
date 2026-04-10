# Decisiones Tecnicas (ADR)

Registro de decisiones arquitectonicas para MealPrep.

---

## ADR-001: Express sobre Fastify

**Estado**: Aceptada

**Contexto**: Se necesitaba un framework HTTP para construir la API REST del backend.

**Opciones consideradas**:
- Express 4.x
- Fastify 4.x
- Koa 2.x

**Decision**: Express

**Justificacion**:
- Ecosistema mas maduro con la mayor cantidad de middleware disponible
- Documentacion extensa y comunidad activa
- Curva de aprendizaje minima para cualquier desarrollador Node.js
- Compatibilidad garantizada con todas las librerias del stack (Prisma, Zod, etc.)
- Para un MVP, la diferencia de rendimiento con Fastify es irrelevante
- Mayor facilidad para encontrar soluciones a problemas comunes

**Consecuencias**: Rendimiento ligeramente menor en benchmarks sinteticos comparado con Fastify, pero irrelevante para la escala actual.

---

## ADR-002: Prisma sobre TypeORM

**Estado**: Aceptada

**Contexto**: Se necesitaba un ORM para interactuar con la base de datos desde TypeScript.

**Opciones consideradas**:
- Prisma 5.x
- TypeORM 0.3.x
- Drizzle ORM
- Knex.js (query builder)

**Decision**: Prisma

**Justificacion**:
- Cliente generado con autocompletado completo en el IDE
- Type-safety nativo: las queries retornan tipos exactos segun los includes/selects
- Esquema declarativo (`schema.prisma`) como fuente unica de verdad del modelo de datos
- Sistema de migraciones integrado y predecible
- Soporte nativo para SQLite (desarrollo) y PostgreSQL (produccion) con el mismo esquema
- Transacciones interactivas con `$transaction()`
- El pattern `upsert` simplifica la gestion de ingredientes compartidos

**Consecuencias**: 
- Dependencia del CLI de Prisma para generar el cliente
- El esquema Prisma es un DSL propio que no es SQL estandar
- Algunas consultas complejas requieren `$queryRaw`

---

## ADR-003: Vite sobre Create React App

**Estado**: Aceptada

**Contexto**: Se necesitaba un bundler/dev server para la aplicacion React del frontend.

**Opciones consideradas**:
- Vite 6.x
- Create React App (react-scripts)
- Next.js
- Remix

**Decision**: Vite

**Justificacion**:
- Build de produccion significativamente mas rapido que CRA (Rollup vs Webpack)
- Hot Module Replacement (HMR) instantaneo en desarrollo
- Configuracion minima out-of-the-box
- Proxy de desarrollo integrado para redirigir `/api` al backend
- CRA esta oficialmente deprecado
- No se necesita SSR ni file-based routing (descarta Next.js/Remix)
- Soporte nativo para TypeScript y path aliases

**Consecuencias**: Sin SSR ni generacion estatica. Si en el futuro se necesita SEO, habria que migrar a Next.js.

---

## ADR-004: Monorepo Simple sin Herramientas

**Estado**: Aceptada

**Contexto**: Backend y frontend son dos aplicaciones Node.js que comparten repositorio.

**Opciones consideradas**:
- Monorepo simple (directorios independientes)
- Turborepo
- Nx
- npm/yarn/pnpm workspaces

**Decision**: Monorepo simple con directorios `backend/` y `frontend/`, cada uno con su propio `package.json`.

**Justificacion**:
- Para un MVP con dos aplicaciones, la complejidad de Turborepo/Nx no se justifica
- Cada aplicacion puede instalarse, buildear y desplegarse de forma independiente
- Sin dependencias compartidas que gestionar (los tipos se duplican intencionalmente)
- CI/CD simple: cada job trabaja en su directorio
- Facilidad para separar en dos repos en el futuro si fuera necesario

**Consecuencias**: 
- Tipos duplicados entre frontend y backend (se mantienen sincronizados manualmente)
- Sin cache compartido de builds entre aplicaciones
- Posible deriva entre las interfaces si no se actualizan ambos lados

---

## ADR-005: SQLite en Desarrollo, PostgreSQL en Produccion

**Estado**: Aceptada

**Contexto**: Se necesitaba una base de datos para desarrollo local y otra para produccion.

**Decision**: SQLite para desarrollo, PostgreSQL para produccion.

**Justificacion**:
- SQLite no requiere instalacion ni configuracion (zero-config)
- Base de datos como archivo, facil de borrar y recrear
- Prisma abstrae las diferencias entre engines con el mismo esquema
- PostgreSQL en produccion via Railway con conexion automatica
- Sin necesidad de Docker para desarrollo local

**Consecuencias**:
- Algunas funcionalidades de PostgreSQL (JSONB, arrays, full-text search) no estan disponibles en SQLite
- Las migraciones pueden comportarse ligeramente diferente entre engines
- Para queries complejas, hay que verificar compatibilidad con ambos engines

---

## ADR-006: Context API sobre Redux

**Estado**: Aceptada

**Contexto**: Se necesitaba gestion de estado global en el frontend React.

**Opciones consideradas**:
- React Context API
- Redux Toolkit
- Zustand
- Jotai

**Decision**: Context API con dos providers: `AuthContext` y `MealPlanContext`.

**Justificacion**:
- Escala adecuada para la aplicacion: dos dominios de estado (auth + meal planning)
- Sin boilerplate adicional: hooks nativos de React
- Sin dependencias externas
- Patron simple de entender y mantener
- Si la aplicacion crece, migrar a Zustand es trivial

**Consecuencias**:
- Re-renders innecesarios si no se segmenta bien el estado
- Sin middleware de side-effects (se maneja con async/await en los handlers)
- Sin devtools de estado integradas (Redux DevTools)

---

## ADR-007: Zod sobre Joi para Validacion

**Estado**: Aceptada

**Contexto**: Se necesitaba una libreria de validacion para el body de los requests.

**Opciones consideradas**:
- Zod 3.x
- Joi
- Yup
- class-validator

**Decision**: Zod

**Justificacion**:
- Inferencia de tipos TypeScript nativa con `z.infer<typeof schema>`
- Los esquemas son la fuente unica de verdad para tipos y validacion
- API mas moderna y composable que Joi
- Menor bundle size
- Sin necesidad de definir tipos e interfaces por separado
- Validacion sincrona por defecto (mas predecible)

**Consecuencias**: Los mensajes de error de Zod son menos legibles out-of-the-box que los de Joi, pero se transforman en el error handler.

---

## ADR-008: Sistema de Conversion de Unidades

**Estado**: Aceptada

**Contexto**: El algoritmo de lista de compras necesita combinar ingredientes con diferentes unidades de medida.

**Decision**: Sistema basado en tablas de conversion con dos familias (volumen y peso) y unidades base (ml y g respectivamente).

**Justificacion**:
- Enfoque simple y extensible: agregar una unidad nueva es agregar una linea a la tabla
- Solo dos familias de conversion (volumen y peso) cubren la mayoria de ingredientes de cocina
- Las unidades sin conversion (unit, bunch, slices) se manejan como pass-through
- El formateo inverso (de base a legible) usa umbrales para elegir la unidad mas practica
- Inmutable: las tablas son `readonly` y las funciones son puras

**Alternativas descartadas**:
- Libreria externa como `convert-units`: demasiado generica, incluye unidades irrelevantes (temperatura, distancia)
- API de conversion externa: dependencia de red innecesaria para una operacion local

**Consecuencias**:
- Las conversiones entre volumen y peso no son posibles (ej: 1 cup de harina no se puede convertir a gramos sin densidad)
- Los factores de conversion son aproximaciones estandar (1 cup = 236.588 ml)
- Si un ingrediente aparece con unidades incompatibles en diferentes recetas, se suman sin conversion

---

## Autor

Ronald
