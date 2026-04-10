# MealPrep - Wiki

Bienvenido a la wiki de MealPrep, el planificador de comidas semanal con lista de compras automatica.

## Indice

- [Guia Rapida](Guia-Rapida.md) - Primeros pasos para correr el proyecto
- [Arquitectura](Arquitectura.md) - Estructura del proyecto y decisiones de diseno
- [API Reference](API-Reference.md) - Documentacion completa de endpoints
- [Algoritmo Shopping List](Algoritmo-Shopping-List.md) - Como funciona la generacion de listas de compras
- [Modelo de Datos](Modelo-de-Datos.md) - Esquema de la base de datos y relaciones

## Descripcion General

MealPrep permite:

1. **Crear recetas** con ingredientes, cantidades y unidades
2. **Planificar la semana** asignando recetas a cada dia y comida
3. **Generar una lista de compras** automatica que agrega ingredientes iguales, convierte unidades y agrupa por pasillo del supermercado
4. **Marcar items** como comprados en la lista
5. **Ver estadisticas** del dashboard con calorias, progreso y recetas populares

## Stack

| Backend | Frontend |
|---------|----------|
| Express 4 | React 18 |
| Prisma 5 | Vite 6 |
| SQLite/PostgreSQL | TailwindCSS 3 |
| Zod 3 | React Router 6 |
| JWT | Context API |
| Jest + Supertest | TypeScript 5 |

## Autor

Ronald - [@ronalc90](https://github.com/ronalc90)
