# Contribuir a MealPrep

Gracias por tu interes en contribuir a MealPrep. Esta guia explica como participar en el proyecto.

## Flujo de Trabajo

1. Hacer fork del repositorio
2. Crear una rama desde `main`:
   ```bash
   git checkout -b feature/nombre-descriptivo
   ```
3. Realizar los cambios
4. Asegurarse de que los tests pasan:
   ```bash
   cd backend && npm test
   cd frontend && npm run build
   ```
5. Hacer commit con un mensaje descriptivo
6. Abrir un Pull Request hacia `main`

## Convenciones de Commits

Seguimos la convencion de [Conventional Commits](https://www.conventionalcommits.org/):

```
tipo(alcance): descripcion corta

feat: nueva funcionalidad
fix: correccion de bug
docs: cambios en documentacion
style: formato, punto y coma, etc. (sin cambios de logica)
refactor: reestructuracion sin cambiar comportamiento
test: agregar o modificar tests
chore: tareas de mantenimiento
```

## Estructura del Codigo

- **Backend**: Seguir la arquitectura en capas (routes -> services -> prisma)
- **Frontend**: Componentes en `components/`, paginas en `pages/`, estado en `context/`
- **Validacion**: Usar esquemas Zod para toda entrada del API
- **Tipos**: Nunca usar `any`. Preferir tipos inferidos de Zod

## Guia de Estilo

- TypeScript estricto (`strict: true`)
- Preferir `const` sobre `let`
- Preferir interfaces `readonly`
- Funciones puras cuando sea posible
- Nombres descriptivos en ingles para codigo, español para documentacion

## Tests

- Agregar tests para cada nueva funcionalidad
- Los tests deben cubrir el caso feliz y los casos de error
- Usar `supertest` para tests de endpoints
- Ejecutar `npm test` antes de cada commit

## Reportar Bugs

Abrir un issue con:
- Descripcion clara del problema
- Pasos para reproducir
- Comportamiento esperado vs actual
- Version de Node.js y sistema operativo

## Solicitar Funcionalidades

Abrir un issue con la etiqueta `enhancement` describiendo:
- El problema que resuelve
- La solucion propuesta
- Alternativas consideradas

---

## Autor

Ronald
