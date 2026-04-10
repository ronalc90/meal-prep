# MealPrep - Modelo de Negocio y Monetizacion

**Autor:** Ronald

---

## Modelo Freemium

MealPrep utiliza un modelo freemium donde la version gratuita ofrece valor suficiente para generar traccion y retencion, mientras que la version Pro desbloquea funcionalidades avanzadas que justifican una suscripcion mensual o anual.

---

## Plan Gratuito (Free)

### Incluido
- Planificacion de **1 semana activa** (la semana actual)
- Acceso a la base de datos de recetas de Spoonacular
- Busqueda y filtros basicos de recetas
- Lista de compras automatica para la semana activa
- Agrupacion de items por seccion del supermercado
- Hasta **20 recetas en favoritos**
- Preferencias alimentarias basicas (vegetariano, vegano, sin gluten)
- Registro de hasta 3 alergias
- Soporte offline para la semana activa
- Notificaciones basicas (1 recordatorio diario)

### Limitaciones
- Solo 1 semana activa (no planificar a futuro)
- No puede crear recetas personalizadas
- Sin informacion nutricional detallada
- Sin control de costos ni presupuesto
- Porciones fijas (no escalables para familia)
- Sin historial de listas de compras (solo la actual)
- Sin exportar ni compartir lista
- Anuncios discretos (banner inferior, no intrusivos)

---

## Plan Pro

### Todo lo del plan Free, mas:
- **Planificacion ilimitada:** Semanas futuras, planificacion hasta 1 mes adelante
- **Recetas personalizadas:** Crear recetas propias con fotos, instrucciones y valores nutricionales
- **Informacion nutricional completa:** Calorias, proteinas, carbohidratos, grasas por comida y por dia
- **Porciones familiares escalables:** Ajustar porciones de 1 a 10 personas
- **Control de costos:** Presupuesto semanal, costo por receta, historial de gastos, graficos
- **Favoritos ilimitados**
- **Historial completo de listas de compras**
- **Exportar lista de compras** (compartir por WhatsApp, texto, email)
- **Plantillas de semana ilimitadas** (guardar y reutilizar planes)
- **Gestion de sobrantes:** Sugerencias de recetas con lo que ya tienes
- **Notificaciones avanzadas:** Multiples recordatorios, recordatorio de compras personalizable
- **Sin anuncios**
- **Alergias e ingredientes excluidos ilimitados**
- **Soporte prioritario**

---

## Precios

| Plan | Precio Mensual | Precio Anual | Ahorro Anual |
|------|---------------|-------------|-------------|
| **Free** | $0 | $0 | -- |
| **Pro Mensual** | $3.99 USD/mes | -- | -- |
| **Pro Anual** | -- | $29.99 USD/ano | 37% vs mensual |

### Justificacion del Precio
- **$3.99/mes** esta por debajo del precio de un solo pedido de delivery (~$8-15 USD), lo que facilita el argumento de valor: "Si esta app te evita 1 delivery al mes, ya se pago sola".
- **$29.99/ano** ($2.50/mes efectivo) incentiva el compromiso anual con un descuento significativo del 37%.
- Ambos precios estan alineados con el mercado de apps de productividad y bienestar (Todoist, Headspace, etc.).

### Prueba Gratuita
- **7 dias de prueba gratuita** de Pro al registrarse.
- Sin necesidad de tarjeta de credito para iniciar la prueba.
- Al finalizar la prueba, el usuario baja automaticamente al plan Free.
- Notificacion amigable el dia 5: "Te quedan 2 dias de Pro. Mira todo lo que has logrado esta semana."

---

## Fuentes de Ingreso Adicionales

### 1. Ingresos por Afiliados de Supermercados y Delivery

**Modelo:** Comision por referencia cuando un usuario compra a traves de un enlace de afiliado.

| Socio Potencial | Tipo | Comision Estimada |
|----------------|------|------------------|
| Cornershop/Uber Eats (groceries) | Delivery supermercado | 3-5% del pedido |
| Rappi (supermercado) | Delivery supermercado | 3-5% del pedido |
| PedidosYa Market | Delivery supermercado | 2-4% del pedido |
| Amazon Fresh | Delivery supermercado | 4-8% del pedido |
| Walmart Connect | Compra online | 2-3% del pedido |

**Implementacion:**
- Boton "Comprar ingredientes" en la lista de compras
- Abrir app del socio con la lista pre-cargada (deep linking)
- Tracking de conversiones via SDK del partner
- Disponible para usuarios Free y Pro

**Ingreso estimado:** $0.50-$2.00 por conversion. Con 5% de usuarios convirtiendo, ~$0.05/usuario/mes en etapa temprana.

### 2. Recetas Patrocinadas por Marcas

**Modelo:** Marcas de alimentos pagan por colocar recetas que usan sus productos en posiciones destacadas.

| Formato | Precio Estimado | Frecuencia |
|---------|----------------|-----------|
| Receta destacada en "Explorar" | $500-$1,500/semana | 1-2 por semana |
| Coleccion patrocinada ("Semana Knorr") | $2,000-$5,000/mes | 1-2 por mes |
| Banner en resultado de busqueda | $200-$800/semana | 2-3 por semana |

**Reglas para patrocinios:**
- Maximo 1 receta patrocinada por cada 20 organicas
- Etiqueta clara "Patrocinado" visible
- Solo recetas que cumplan con las preferencias del usuario (no mostrar receta con lacteos a un intolerante)
- Calidad de receta revisada antes de publicar

**Ingreso estimado:** Disponible a partir de 10,000+ MAU. $1,000-$3,000/mes iniciales.

### 3. Datos Anonimizados y Tendencias (Fase 3)

**Modelo:** Vender insights agregados y anonimizados sobre tendencias de consumo a marcas de alimentos e investigadores de mercado.

- Recetas mas populares por region
- Ingredientes trending por temporada
- Patrones de compra semanales
- Tendencias dietarias (crecimiento vegano, sin gluten, etc.)

**Nota:** Solo datos completamente anonimizados y agregados. Cumplimiento estricto de GDPR/regulaciones locales. Requiere consentimiento explicito del usuario.

**Ingreso estimado:** $2,000-$10,000/mes con base de usuarios significativa (+50,000 MAU).

---

## Proyecciones de Ingreso - 12 Meses

### Supuestos
- Descargas mensuales creciendo de 1,000 (mes 1) a 8,000 (mes 12)
- Retencion D30: 15% inicial, mejorando a 30%
- Conversion Free a Pro: 0% (meses 1-3), 3% (mes 4-6), 5% (mes 7-12)
- ARPU Pro: $3.50/mes (mix mensual/anual)
- Afiliados desde mes 6: $0.05/MAU/mes
- Patrocinios desde mes 9: $1,500/mes, creciendo a $3,000

### Proyeccion Mensual

| Mes | Descargas | MAU | Usuarios Pro | Ingreso Suscripciones | Ingreso Afiliados | Ingreso Patrocinios | Total |
|-----|-----------|-----|-------------|----------------------|-------------------|--------------------|----|
| 1 | 1,000 | 400 | 0 | $0 | $0 | $0 | $0 |
| 2 | 1,500 | 800 | 0 | $0 | $0 | $0 | $0 |
| 3 | 2,000 | 1,500 | 0 | $0 | $0 | $0 | $0 |
| 4 | 2,500 | 2,500 | 75 | $263 | $0 | $0 | $263 |
| 5 | 3,000 | 4,000 | 120 | $420 | $0 | $0 | $420 |
| 6 | 3,500 | 6,000 | 180 | $630 | $300 | $0 | $930 |
| 7 | 4,000 | 8,000 | 400 | $1,400 | $400 | $0 | $1,800 |
| 8 | 5,000 | 11,000 | 550 | $1,925 | $550 | $0 | $2,475 |
| 9 | 6,000 | 15,000 | 750 | $2,625 | $750 | $1,500 | $4,875 |
| 10 | 7,000 | 20,000 | 1,000 | $3,500 | $1,000 | $2,000 | $6,500 |
| 11 | 7,500 | 25,000 | 1,250 | $4,375 | $1,250 | $2,500 | $8,125 |
| 12 | 8,000 | 30,000 | 1,500 | $5,250 | $1,500 | $3,000 | $9,750 |

### Resumen Anual

| Concepto | Total Ano 1 |
|----------|------------|
| **Ingresos por Suscripciones** | $20,388 |
| **Ingresos por Afiliados** | $5,750 |
| **Ingresos por Patrocinios** | $9,000 |
| **Ingreso Total** | $35,138 |

---

## Estructura de Costos

### Costos Fijos Mensuales

| Concepto | Costo Mensual | Notas |
|----------|-------------|-------|
| Supabase (plan Pro) | $25 | Incluye 8GB DB, 250GB storage, 500K edge invocations |
| Spoonacular API | $29 | Plan profesional, 1500 requests/dia |
| Apple Developer Program | $8.33 | $99/ano prorrateado |
| Google Play Developer | $2.08 | $25 unico prorrateado |
| Firebase (FCM + analytics) | $0 | Free tier suficiente para MVP |
| Dominio + email | $5 | Dominio .com + email profesional |
| GitHub Teams | $4 | Repositorios privados + Actions |
| **Total fijo mensual** | **$73.41** | |

### Costos Variables

| Concepto | Costo Estimado | Trigger |
|----------|---------------|---------|
| Supabase overages (DB) | $0.125/GB | Si supera 8GB |
| Supabase overages (storage) | $0.021/GB | Si supera 250GB |
| Spoonacular API adicional | $0.01/request | Si supera 1500/dia |
| Firebase Cloud Messaging | $0 | Gratis ilimitado |
| Bandwidth adicional | Variable | Con escala de usuarios |

### Costos de Desarrollo (One-time, MVP)

| Concepto | Horas Estimadas | Costo Referencial |
|----------|----------------|-------------------|
| Desarrollo MVP (10 sprints) | 400-500 horas | Desarrollo propio |
| Diseno UI/UX | 40-60 horas | $800-$1,500 (freelance) |
| Ilustraciones y assets | 20-30 horas | $400-$800 (freelance) |
| QA y testing | 40-60 horas | Desarrollo propio |
| **Total estimado** | | **$1,200-$2,300** |

### Comisiones de Plataforma

| Plataforma | Comision | Aplicable a |
|-----------|---------|-------------|
| Apple App Store | 15% (primer millon) / 30% | Suscripciones in-app |
| Google Play Store | 15% (primer millon) / 30% | Suscripciones in-app |

**Nota:** Ambas plataformas cobran 15% para desarrolladores que ganan menos de $1M anuales (Small Business Program). Esto aplica durante todo el primer ano.

---

## Punto de Equilibrio

### Costos mensuales en operacion estable: ~$100/mes

Para cubrir costos fijos con suscripciones Pro:

- Ingreso neto por suscripcion (despues de comision 15%): $3.39/mes
- Usuarios Pro necesarios para break-even: **30 usuarios Pro**
- Con 3% de conversion: se necesitan **1,000 MAU** para break-even

**Conclusion:** El break-even operativo se alcanza en el mes 3-4 con un crecimiento modesto. Los costos de infraestructura son extremadamente bajos gracias a Supabase y el modelo serverless.

---

## Estrategia de Conversion Free a Pro

### Triggers de Conversion (Momentos Clave)
1. **Quiere planificar la proxima semana:** "Desbloquea planificacion ilimitada con Pro"
2. **Intenta guardar mas de 20 favoritos:** "Favoritos ilimitados con Pro"
3. **Quiere crear receta propia:** "Recetas personalizadas disponibles en Pro"
4. **Busca info nutricional:** "Informacion nutricional detallada con Pro"
5. **Quiere compartir lista:** "Comparte tu lista de compras con Pro"
6. **Despues de 4 semanas usando la app:** "Has ahorrado X horas planificando. Imagina lo que podrias lograr con Pro."

### Tacticas de Conversion
- Paywall soft: mostrar la funcionalidad bloqueada, no ocultarla completamente
- Prueba gratuita de 7 dias al registrarse
- Oferta de aniversario: descuento del 50% en el primer mes al cumplir 30 dias usando la app
- Notificacion en el mes 1: resumen de lo logrado + CTA a Pro
- Referral: "Invita a un amigo, ambos reciben 1 mes de Pro gratis"

---

## Metricas de Monetizacion a Seguir

| Metrica | Definicion | Objetivo Ano 1 |
|---------|-----------|---------------|
| MRR | Monthly Recurring Revenue | $5,250 al mes 12 |
| ARPU | Average Revenue Per User (total) | $0.30/MAU |
| ARPPU | Average Revenue Per Paying User | $3.50/mes |
| Conversion Rate | Free a Pro | 5% al mes 12 |
| Churn Rate (Pro) | Cancelaciones Pro mensuales | Menor a 8% |
| LTV | Lifetime Value de usuario Pro | $35-$45 |
| CAC | Customer Acquisition Cost | Menor a $2 |
| LTV/CAC Ratio | Rentabilidad de adquisicion | Mayor a 3:1 |
| Trial-to-Paid | Conversion de prueba a pago | 15-20% |
| Payback Period | Meses para recuperar CAC | Menor a 2 meses |
