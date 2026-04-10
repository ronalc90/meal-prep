# Changelog

Todos los cambios relevantes de este proyecto se documentan aqui.

El formato esta basado en [Keep a Changelog](https://keepachangelog.com/es/1.0.0/).

---

## [1.0.0] - 2026-04-10

### Agregado

- **Backend API REST** con Express 4 y TypeScript
  - Autenticacion JWT (registro, login, perfil)
  - CRUD completo de recetas con busqueda, filtrado y paginacion
  - Gestion de planes de comida semanales
  - Auto-generacion de comidas sugeridas
  - Generacion de listas de compras con algoritmo de agregacion inteligente
  - Dashboard con estadisticas del usuario
  - Exportacion de lista de compras en texto plano
  - Validacion de entrada con Zod
  - Manejo centralizado de errores
  - Health check endpoint

- **Sistema de conversion de unidades**
  - Conversion de volumen (tsp, tbsp, cup, fl oz, ml, L)
  - Conversion de peso (oz, lb, g, kg)
  - Normalizacion a unidad base y formato legible

- **Frontend SPA** con React 18 y Vite
  - Paginas: Login, Registro, Dashboard, Recetas, Detalle de Receta, Planificador, Lista de Compras
  - Componentes: Navbar, RecipeCard, RecipeForm, WeeklyCalendar, ShoppingListView
  - Estado global con Context API (AuthContext, MealPlanContext)
  - Cliente API centralizado con autenticacion automatica
  - Estilos con TailwindCSS
  - Routing con React Router v6

- **Modelo de datos** con Prisma
  - 8 modelos: User, Recipe, Ingredient, RecipeIngredient, MealPlan, MealPlanItem, ShoppingList, ShoppingListItem
  - 16 recetas de ejemplo en el seed
  - SQLite para desarrollo, PostgreSQL para produccion

- **Tests** con Jest y Supertest
  - Tests de autenticacion
  - Tests de CRUD de recetas
  - Tests de planes de comida
  - Tests de listas de compras
  - Tests de dashboard
  - Tests de integracion end-to-end

- **CI/CD** con GitHub Actions
  - Pipeline de backend: install, migrate, test, build
  - Pipeline de frontend: install, build

- **Documentacion completa**
  - README en espanol
  - Documentacion de API con ejemplos curl
  - Documentacion de arquitectura
  - Explicacion del algoritmo de lista de compras
  - Guia de despliegue
  - Decisiones tecnicas (ADR)
  - Guia de contribucion
  - Wiki del proyecto
