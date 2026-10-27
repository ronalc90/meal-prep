# Contribuir a MealPrep

Gracias por tu interes en contribuir a MealPrep. Esta guia te ayudara a comenzar.

## Requisitos Previos

- Node.js >= 22
- npm >= 9
- Git

## Configuracion del Entorno

1. **Fork y clonar el repositorio**

```bash
git clone https://github.com/ronalc90/meal-prep.git
cd meal-prep
```

2. **Instalar dependencias**

```bash
# Backend
cd backend
npm install
npx prisma generate
npx prisma migrate dev

# Frontend
cd ../frontend
npm install
```

3. **Configurar variables de entorno**

```bash
cp backend/.env.example backend/.env
# Editar backend/.env con tus valores
```

4. **Verificar que todo funciona**

```bash
# Backend
cd backend
npm test
npm run dev

# Frontend
cd ../frontend
npm run dev
```

## Flujo de Trabajo

1. Crear una rama desde `main`:
   ```bash
   git checkout -b feature/nombre-descriptivo
   ```

2. Realizar los cambios siguiendo las convenciones del proyecto

3. Escribir tests para la funcionalidad nueva o modificada

4. Asegurar que todos los tests pasan:
   ```bash
   cd backend && npm test
   ```

5. Hacer commit con un mensaje descriptivo:
   ```bash
   git commit -m "feat: agregar nueva funcionalidad X"
   ```

6. Push y crear Pull Request:
   ```bash
   git push origin feature/nombre-descriptivo
   ```

## Convenciones de Commits

Seguimos [Conventional Commits](https://www.conventionalcommits.org/):

| Prefijo | Uso |
|---------|-----|
| `feat:` | Nueva funcionalidad |
| `fix:` | Correccion de bug |
| `docs:` | Cambios en documentacion |
| `refactor:` | Refactorizacion sin cambio funcional |
| `test:` | Agregar o modificar tests |
| `chore:` | Tareas de mantenimiento |

## Estructura del Codigo

### Backend

- **Routes**: Solo reciben request y delegan al servicio
- **Services**: Toda la logica de negocio
- **Middleware**: Auth, validacion, manejo de errores
- **Utils**: Funciones puras y utilidades compartidas

### Frontend

- **Pages**: Componentes de pagina conectados al router
- **Components**: Componentes reutilizables
- **Context**: Estado global (AuthContext, MealPlanContext)
- **Services**: Cliente API centralizado

## Reglas de Codigo

- TypeScript estricto (`strict: true`)
- Funciones y variables con nombres descriptivos
- Sin abreviaturas oscuras
- Tests para casos felices y casos de error
- Separacion clara entre capas (no poner logica de negocio en routes)
- Validacion con Zod en la entrada del API
- Manejo de errores con la jerarquia de `AppError`

## Reportar Bugs

Crear un [issue](https://github.com/ronalc90/meal-prep/issues) con:

- Descripcion del problema
- Pasos para reproducir
- Comportamiento esperado vs actual
- Version de Node.js y sistema operativo

## Autor

Ronald
