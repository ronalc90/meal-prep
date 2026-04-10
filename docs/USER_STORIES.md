# MealPrep - Historias de Usuario

**Autor:** Ronald

---

## Convenciones

- **Formato:** Como [rol], quiero [accion], para [beneficio].
- **Prioridad:** P1 (critica/MVP), P2 (importante/post-MVP), P3 (deseable/futuro).
- **Estimacion:** S (1-2 horas), M (3-5 horas), L (1-2 dias), XL (3-5 dias).
- **Criterios de aceptacion:** Lista de condiciones verificables que deben cumplirse para considerar la historia como completada.

---

## Epic 1: Planificacion de Comidas

### US-1.1: Ver calendario semanal
**Prioridad:** P1 | **Estimacion:** L

Como usuario, quiero ver un calendario semanal con slots para cada comida del dia, para tener una vista clara de lo que voy a comer.

**Criterios de aceptacion:**
- El calendario muestra 7 dias (lunes a domingo) en scroll horizontal.
- Cada dia tiene 4 slots: desayuno, almuerzo, cena, snack.
- Los slots vacios muestran un icono "+" para agregar comida.
- Los slots con receta asignada muestran el nombre y una miniatura de la receta.
- Se muestra la semana actual por defecto al abrir la app.
- El header indica la fecha de inicio y fin de la semana visible.

---

### US-1.2: Navegar entre semanas
**Prioridad:** P1 | **Estimacion:** S

Como usuario, quiero navegar entre semanas anteriores y siguientes, para consultar o planificar con anticipacion.

**Criterios de aceptacion:**
- Existen flechas de navegacion (izquierda/derecha) en el header de la semana.
- Al presionar la flecha derecha, se muestra la semana siguiente.
- Al presionar la flecha izquierda, se muestra la semana anterior.
- Existe un boton "Hoy" para volver rapidamente a la semana actual.
- La transicion entre semanas tiene una animacion suave.
- En el plan Free, solo se puede navegar a la semana actual (las demas muestran un overlay Pro).

---

### US-1.3: Agregar comida a un slot
**Prioridad:** P1 | **Estimacion:** M

Como usuario, quiero agregar una receta a un slot del calendario, para planificar que voy a comer ese dia.

**Criterios de aceptacion:**
- Al tocar el "+" en un slot, se abre un buscador de recetas en un bottom sheet.
- El buscador muestra recetas sugeridas y un campo de busqueda.
- Las recetas sugeridas se filtran por el tipo de comida del slot (desayuno, almuerzo, etc.).
- Al seleccionar una receta, se asigna al slot y se cierra el bottom sheet.
- El slot se actualiza inmediatamente para mostrar la receta seleccionada.
- Se puede configurar el numero de porciones al agregar (default: porciones del usuario).
- El cambio se guarda automaticamente en la base de datos.

---

### US-1.4: Eliminar comida de un slot
**Prioridad:** P1 | **Estimacion:** S

Como usuario, quiero eliminar una comida asignada a un slot, para corregir mi plan o dejar un dia libre.

**Criterios de aceptacion:**
- Al tocar un slot con receta, se muestra un menu con opciones que incluye "Eliminar".
- Al confirmar la eliminacion, el slot vuelve a estado vacio con el icono "+".
- No se pide confirmacion adicional (la accion es facilmente reversible agregando otra receta).
- El cambio se guarda automaticamente en la base de datos.

---

### US-1.5: Mover comidas con drag-and-drop
**Prioridad:** P1 | **Estimacion:** L

Como usuario, quiero mover una comida de un slot a otro arrastrando, para reorganizar mi plan rapidamente.

**Criterios de aceptacion:**
- Al mantener presionado un slot con receta (long press ~500ms), se activa el modo drag.
- El item arrastrado se muestra semi-transparente siguiendo el dedo del usuario.
- Los slots disponibles se resaltan visualmente como destinos validos.
- Al soltar sobre un slot vacio, la comida se mueve a ese slot.
- Al soltar sobre un slot ocupado, se intercambian las comidas.
- Se puede mover entre diferentes dias (scroll horizontal durante el drag).
- El movimiento incluye una animacion de transicion.
- Los cambios se persisten automaticamente.

---

### US-1.6: Copiar comida a otro dia
**Prioridad:** P2 | **Estimacion:** S

Como usuario, quiero copiar una comida de un dia a otro, para repetir recetas que me gustaron sin quitarlas del dia original.

**Criterios de aceptacion:**
- Al tocar un slot con receta, el menu incluye la opcion "Copiar a otro dia".
- Se muestra un selector de dia y slot de destino.
- La receta se duplica en el slot de destino manteniendo la original en su lugar.
- Si el slot destino esta ocupado, se pregunta si desea reemplazar.

---

### US-1.7: Sugerencias rapidas de comida
**Prioridad:** P2 | **Estimacion:** M

Como usuario, quiero recibir sugerencias de recetas al agregar comida, para no tener que buscar cada vez.

**Criterios de aceptacion:**
- Al abrir el selector de recetas, se muestran hasta 6 sugerencias antes del buscador.
- Las sugerencias incluyen recetas de favoritos, recetas recientes y recetas populares.
- Las sugerencias respetan las preferencias alimentarias del usuario.
- Las sugerencias evitan repetir recetas ya asignadas en la misma semana.
- Al tocar una sugerencia, se asigna directamente al slot.

---

### US-1.8: Rellenar semana automaticamente
**Prioridad:** P2 | **Estimacion:** L

Como usuario, quiero que la app rellene automaticamente los slots vacios de mi semana, para ahorrar tiempo cuando no tengo preferencia especifica.

**Criterios de aceptacion:**
- Existe un boton "Auto-completar" en la vista del calendario.
- Solo rellena los slots que estan vacios (no sobreescribe los ya asignados).
- Las recetas asignadas respetan las preferencias alimentarias.
- No repite la misma receta en la misma semana (si hay suficientes opciones).
- Asigna recetas apropiadas por tipo de comida (desayunos ligeros, almuerzos/cenas completos).
- El usuario puede deshacer la accion con un boton "Deshacer" que aparece por 5 segundos.

---

### US-1.9: Guardar plan como plantilla
**Prioridad:** P2 | **Estimacion:** M

Como usuario, quiero guardar mi plan semanal como plantilla reutilizable, para aplicarlo en semanas futuras sin recrearlo.

**Criterios de aceptacion:**
- Existe una opcion "Guardar como plantilla" en el menu del calendario.
- Se pide un nombre para la plantilla (ej: "Semana vegetariana", "Menu familiar").
- La plantilla almacena todas las recetas y sus posiciones en el calendario.
- Al crear un plan para una nueva semana, existe la opcion "Usar plantilla".
- Se muestran las plantillas guardadas con su nombre y un resumen.
- Al aplicar una plantilla, se asignan las recetas a los slots correspondientes.
- Las plantillas son ilimitadas en plan Pro, maximo 3 en plan Free.

---

### US-1.10: Configurar porciones por slot
**Prioridad:** P2 | **Estimacion:** S

Como usuario, quiero ajustar el numero de porciones para cada comida, para que la lista de compras refleje las cantidades reales que necesito.

**Criterios de aceptacion:**
- Cada slot del calendario muestra un indicador de porciones.
- Al tocar el indicador, se puede cambiar el numero (1-10) con un selector numerico.
- El cambio de porciones afecta las cantidades en la lista de compras.
- El default es el valor configurado en el perfil del usuario.

---

## Epic 2: Gestion de Recetas

### US-2.1: Buscar recetas
**Prioridad:** P1 | **Estimacion:** M

Como usuario, quiero buscar recetas por nombre o ingrediente, para encontrar opciones para mis comidas.

**Criterios de aceptacion:**
- Existe una pantalla "Explorar Recetas" accesible desde la navegacion principal.
- La barra de busqueda esta en la parte superior y se activa al tocar.
- Los resultados aparecen en un grid de tarjetas (2 columnas).
- Cada tarjeta muestra: imagen, titulo, tiempo de preparacion, dificultad.
- La busqueda se ejecuta al escribir (con debounce de 500ms).
- Si no hay resultados, se muestra un estado vacio con sugerencia de ajustar el termino.
- Los resultados se paginan con scroll infinito (20 resultados por pagina).
- Si no hay texto de busqueda, se muestran recetas populares/trending.

---

### US-2.2: Filtrar recetas
**Prioridad:** P1 | **Estimacion:** M

Como usuario, quiero filtrar recetas por tipo de comida, tiempo y dificultad, para encontrar opciones relevantes rapidamente.

**Criterios de aceptacion:**
- Existe un boton de filtros junto a la barra de busqueda.
- Al tocarlo, se abre un bottom sheet con opciones de filtro.
- Filtros disponibles:
  - Tipo de comida: desayuno, almuerzo, cena, snack (multiselect)
  - Tiempo de preparacion: menos de 15 min, 15-30 min, 30-60 min, mas de 60 min
  - Dificultad: facil, media, dificil
- Los filtros activos se muestran como chips debajo de la barra de busqueda.
- Se puede eliminar un filtro tocando la "X" en el chip correspondiente.
- Los filtros se combinan con la busqueda de texto.
- Los resultados se actualizan al aplicar/quitar filtros.
- Las preferencias alimentarias del perfil se aplican automaticamente (sin necesidad de filtrar manualmente).

---

### US-2.3: Ver detalle de receta
**Prioridad:** P1 | **Estimacion:** M

Como usuario, quiero ver el detalle completo de una receta, para saber que ingredientes necesito y como prepararla.

**Criterios de aceptacion:**
- Al tocar una tarjeta de receta, se navega a la pantalla de detalle.
- La pantalla muestra: imagen hero grande, titulo, descripcion breve.
- Badges visibles: tiempo total, dificultad, numero de porciones.
- Tab "Ingredientes": lista completa con cantidades y unidades.
- Tab "Preparacion": pasos numerados con texto descriptivo.
- Selector de porciones que recalcula las cantidades de ingredientes.
- Boton "Agregar al plan" que abre selector de dia y slot.
- Boton de favorito (corazon) en la esquina superior derecha.
- Se puede volver atras con gesto de swipe o boton.

---

### US-2.4: Guardar receta como favorita
**Prioridad:** P1 | **Estimacion:** S

Como usuario, quiero guardar recetas como favoritas, para acceder rapidamente a las que mas me gustan.

**Criterios de aceptacion:**
- Existe un icono de corazon en la tarjeta de receta y en la pantalla de detalle.
- Al tocar el corazon, la receta se marca como favorita (corazon se llena con color).
- Al tocar nuevamente, se desmarca (corazon vuelve a estar vacio).
- La accion incluye una animacion de feedback visual.
- Las recetas favoritas se persisten y sincronizan con el servidor.
- En plan Free, el limite es 20 favoritos. Al llegar al limite, se muestra un mensaje con sugerencia de upgrade a Pro.
- En plan Pro, los favoritos son ilimitados.

---

### US-2.5: Ver mis recetas favoritas
**Prioridad:** P1 | **Estimacion:** S

Como usuario, quiero ver todas mis recetas favoritas en una seccion dedicada, para elegir rapidamente al planificar.

**Criterios de aceptacion:**
- Existe una pestana o seccion "Favoritos" en la pantalla de recetas.
- Las recetas favoritas se muestran en el mismo formato de grid que la busqueda.
- Se puede filtrar favoritos por tipo de comida.
- Si no hay favoritos, se muestra un estado vacio invitando a explorar recetas.
- Las recetas estan disponibles offline si fueron cacheadas previamente.
- Se puede quitar de favoritos directamente desde esta vista (long press o swipe).

---

### US-2.6: Crear receta personalizada
**Prioridad:** P2 | **Estimacion:** XL

Como usuario, quiero crear mis propias recetas con mis ingredientes y pasos, para planificar comidas que no estan en la base de datos.

**Criterios de aceptacion:**
- Existe un boton "Crear receta" en la pantalla de recetas (solo Pro).
- Formulario con campos: titulo (obligatorio), descripcion, imagen (opcional).
- Seccion de ingredientes: agregar ingredientes con cantidad, unidad y nombre.
- Seccion de preparacion: agregar pasos en orden con texto descriptivo.
- Configurar: tiempo de preparacion, dificultad, porciones, tipo de comida.
- Se puede tomar foto o seleccionar de galeria.
- Validacion: minimo titulo y 1 ingrediente para guardar.
- La receta personalizada es privada (solo visible para el creador).
- Se puede editar y eliminar recetas personalizadas en cualquier momento.
- Las recetas personalizadas aparecen en busquedas y pueden agregarse al plan.

---

### US-2.7: Colecciones de recetas
**Prioridad:** P3 | **Estimacion:** L

Como usuario, quiero organizar mis recetas en colecciones tematicas, para encontrarlas por contexto.

**Criterios de aceptacion:**
- Se pueden crear colecciones con nombre personalizado (ej: "Cenas rapidas", "Postres").
- Agregar receta a una coleccion desde el detalle de receta.
- Una receta puede estar en multiples colecciones.
- Las colecciones se muestran en la seccion de favoritos.
- Se pueden editar y eliminar colecciones.

---

## Epic 3: Lista de Compras

### US-3.1: Generar lista de compras automatica
**Prioridad:** P1 | **Estimacion:** XL

Como usuario, quiero generar automaticamente una lista de compras a partir de mi plan semanal, para saber exactamente que comprar.

**Criterios de aceptacion:**
- Existe un boton "Generar lista" visible en la pantalla del plan semanal.
- Al presionarlo, se genera una lista con todos los ingredientes de las recetas del plan.
- Los ingredientes duplicados se combinan sumando cantidades (ej: 200g cebolla + 300g cebolla = 500g cebolla).
- Las unidades se convierten cuando es posible (200g + 0.5kg = 700g).
- Si ya existe una lista activa para esa semana, se pregunta si desea reemplazarla o actualizarla.
- La generacion no toma mas de 3 segundos.
- Se muestra un resumen al terminar: "X items en Y categorias".

---

### US-3.2: Ver lista agrupada por pasillo
**Prioridad:** P1 | **Estimacion:** M

Como usuario, quiero ver la lista de compras organizada por seccion del supermercado, para recorrer el super de forma eficiente.

**Criterios de aceptacion:**
- La lista se agrupa en secciones: Frutas y Verduras, Carnes y Pescados, Lacteos y Huevos, Panaderia, Granos y Cereales, Enlatados, Condimentos, Congelados, Bebidas, Otros.
- Cada seccion tiene un header con nombre e icono representativo.
- Las secciones son colapsables (tocar header para expandir/colapsar).
- Dentro de cada seccion, los items se ordenan alfabeticamente.
- Se muestra el total de items por seccion en el header.
- Las secciones sin items no se muestran.

---

### US-3.3: Marcar items como comprados
**Prioridad:** P1 | **Estimacion:** S

Como usuario, quiero marcar items de la lista como comprados mientras recorro el supermercado, para no olvidar nada.

**Criterios de aceptacion:**
- Cada item tiene un checkbox a la izquierda.
- Al tocar el checkbox, el item se marca como comprado con animacion.
- Los items comprados se muestran con texto tachado y opacidad reducida.
- Los items comprados se mueven al final de su seccion.
- Se muestra un progreso general en el header: "X de Y items" con barra de progreso.
- El estado de check se persiste (se mantiene si se cierra y reabre la app).
- Se puede desmarcar un item tocando nuevamente el checkbox.

---

### US-3.4: Agregar item manual a la lista
**Prioridad:** P1 | **Estimacion:** S

Como usuario, quiero agregar items manualmente a la lista de compras, para incluir productos que no son ingredientes de recetas.

**Criterios de aceptacion:**
- Existe un boton "+" o "Agregar item" al final de la lista.
- Al tocarlo, se muestra un campo de texto para ingresar el nombre del item.
- Opcionalmente, se puede asignar cantidad, unidad y categoria.
- Si no se asigna categoria, va a la seccion "Otros".
- El item manual se distingue visualmente de los generados automaticamente (icono diferente).
- Los items manuales se pueden eliminar con swipe.

---

### US-3.5: Editar items de la lista
**Prioridad:** P2 | **Estimacion:** S

Como usuario, quiero editar la cantidad o eliminar items de la lista, para ajustarla a lo que realmente necesito.

**Criterios de aceptacion:**
- Al tocar un item (no el checkbox), se muestra un dialogo de edicion.
- Se puede modificar la cantidad y la unidad.
- Se puede eliminar el item con un boton "Eliminar" o con gesto de swipe izquierdo.
- Los cambios se guardan automaticamente.
- Se puede deshacer una eliminacion con un Snackbar "Deshacer" por 5 segundos.

---

### US-3.6: Compartir lista de compras
**Prioridad:** P2 | **Estimacion:** M

Como usuario, quiero compartir mi lista de compras con otra persona, para que alguien mas pueda hacer las compras por mi.

**Criterios de aceptacion:**
- Existe un boton "Compartir" en el menu de la lista (solo Pro).
- Al tocarlo, se genera un texto formateado con todos los items agrupados por seccion.
- Se abre el dialogo nativo de compartir del sistema (WhatsApp, email, SMS, etc.).
- El formato del texto es legible: seccion, items con cantidades, items no comprados primero.
- Alternativa: generar un enlace temporal que otra persona puede abrir para ver la lista (sin editar).

---

### US-3.7: Historial de listas de compras
**Prioridad:** P2 | **Estimacion:** M

Como usuario, quiero ver mis listas de compras anteriores, para consultar que compre en semanas pasadas.

**Criterios de aceptacion:**
- Existe una seccion "Historial" accesible desde la pantalla de lista de compras (solo Pro).
- Se muestran las listas anteriores ordenadas por fecha (mas reciente primero).
- Cada entrada muestra: fecha, numero de items, estado (completada/parcial).
- Al tocar una lista del historial, se puede ver el detalle completo.
- Se puede reutilizar una lista pasada como base para una nueva.
- El historial se mantiene por 3 meses.

---

### US-3.8: Reiniciar lista de compras
**Prioridad:** P1 | **Estimacion:** S

Como usuario, quiero desmarcar todos los items de la lista, para reutilizarla si necesito ir al supermercado de nuevo.

**Criterios de aceptacion:**
- Existe una opcion "Reiniciar" en el menu de la lista.
- Al confirmar, todos los items se desmarcan (vuelven a "no comprado").
- La lista mantiene los mismos items y cantidades.
- Se pide confirmacion antes de reiniciar.

---

## Epic 4: Preferencias Alimentarias

### US-4.1: Configurar dieta
**Prioridad:** P1 | **Estimacion:** M

Como usuario, quiero indicar mi tipo de dieta, para que las recetas sugeridas se adapten a mis necesidades.

**Criterios de aceptacion:**
- En el perfil existe una seccion "Preferencias alimentarias".
- Opciones de dieta disponibles (seleccion multiple): vegetariano, vegano, sin gluten, sin lactosa, pescetariano.
- Las opciones se presentan como chips seleccionables con iconos.
- Al seleccionar una dieta, las busquedas de recetas filtran automaticamente.
- Las sugerencias del calendario respetan estas preferencias.
- Los cambios se guardan inmediatamente al seleccionar/deseleccionar.
- Se puede acceder a esta configuracion tanto desde el perfil como desde el onboarding inicial.

---

### US-4.2: Registrar alergias
**Prioridad:** P1 | **Estimacion:** S

Como usuario, quiero registrar mis alergias alimentarias, para que la app nunca me sugiera recetas con esos ingredientes.

**Criterios de aceptacion:**
- En el perfil existe una seccion "Alergias".
- Lista predefinida de alergias comunes: frutos secos, mani, mariscos, pescado, huevo, soya, trigo, leche, sesamo.
- Se presentan como chips seleccionables.
- Al seleccionar una alergia, las recetas que contengan el alergeno se excluyen de busquedas y sugerencias.
- Se muestra un indicador de advertencia si el usuario intenta agregar manualmente una receta con alergeno.
- En plan Free: hasta 3 alergias. En plan Pro: ilimitadas.

---

### US-4.3: Excluir ingredientes especificos
**Prioridad:** P2 | **Estimacion:** M

Como usuario, quiero excluir ingredientes que no me gustan, para no ver recetas que los contengan.

**Criterios de aceptacion:**
- En el perfil existe una seccion "Ingredientes excluidos".
- Campo de texto con autocompletado para buscar ingredientes.
- Los ingredientes excluidos se muestran como chips con "X" para eliminar.
- Las recetas con ingredientes excluidos no aparecen en busquedas ni sugerencias.
- A diferencia de las alergias, los ingredientes excluidos no generan advertencia (solo se ocultan).
- En plan Free: hasta 5 ingredientes. En plan Pro: ilimitados.

---

### US-4.4: Configurar objetivo calorico
**Prioridad:** P3 | **Estimacion:** M

Como usuario, quiero establecer un rango calorico diario objetivo, para que el plan semanal se alinee con mis necesidades energeticas.

**Criterios de aceptacion:**
- En el perfil existe una seccion "Objetivos nutricionales" (solo Pro).
- Slider o campo numerico para calorias diarias objetivo (1000-4000 kcal).
- El calendario muestra un indicador de calorias totales por dia.
- Las sugerencias automaticas priorizan recetas que se ajusten al rango.
- Si un dia supera el objetivo, se muestra un indicador visual (no bloqueante).
- Si la informacion nutricional no esta disponible, se indica claramente.

---

### US-4.5: Preferencias aplicadas durante onboarding
**Prioridad:** P1 | **Estimacion:** S

Como usuario nuevo, quiero configurar mis preferencias durante el registro, para que la app funcione correctamente desde el primer uso.

**Criterios de aceptacion:**
- Despues del registro, se muestra una pantalla de configuracion inicial.
- Paso 1: Seleccionar preferencias alimentarias (chips).
- Paso 2: Indicar numero de personas en el hogar (selector 1-10).
- Paso 3: Registrar alergias (chips con las mas comunes).
- Se puede omitir la configuracion con "Configurar despues".
- Las preferencias seleccionadas se aplican inmediatamente.
- Se puede cambiar todo desde el perfil en cualquier momento.

---

## Epic 5: Control de Costos

### US-5.1: Establecer presupuesto semanal
**Prioridad:** P2 | **Estimacion:** S

Como usuario, quiero definir un presupuesto semanal para alimentacion, para controlar cuanto gasto en comida.

**Criterios de aceptacion:**
- En el perfil existe una seccion "Presupuesto" (solo Pro).
- Campo para ingresar el presupuesto semanal en la moneda local.
- Selector de moneda (USD, CLP, MXN, ARS, COP, EUR).
- El presupuesto se muestra en el header del plan semanal.
- El presupuesto se puede modificar en cualquier momento.
- Si no se establece presupuesto, no se muestra indicador de costo.

---

### US-5.2: Ver costo estimado por receta
**Prioridad:** P2 | **Estimacion:** L

Como usuario, quiero ver el costo estimado de cada receta, para elegir opciones que se ajusten a mi presupuesto.

**Criterios de aceptacion:**
- Cada tarjeta de receta muestra un indicador de costo (1-4 signos de moneda).
- En el detalle de receta se muestra el costo estimado total y por porcion.
- Los costos se estiman basandose en precios promedio de ingredientes por region.
- Se puede elegir la region de precios en la configuracion.
- Si no hay datos de precio para un ingrediente, se excluye del calculo y se indica.
- El costo se recalcula al cambiar el numero de porciones.

---

### US-5.3: Ver costo total del plan semanal
**Prioridad:** P2 | **Estimacion:** M

Como usuario, quiero ver cuanto me costara el plan semanal completo, para compararlo con mi presupuesto.

**Criterios de aceptacion:**
- El header del calendario muestra el costo estimado total de la semana.
- Se compara visualmente con el presupuesto (verde: dentro, amarillo: cerca, rojo: excedido).
- Al tocar el indicador de costo, se muestra un desglose por dia.
- Cada dia muestra el costo total de las comidas asignadas.
- Si se agrega o elimina una comida, el costo se actualiza en tiempo real.
- Se muestra el ahorro estimado vs delivery: "Ahorras ~$XX vs pedir delivery".

---

### US-5.4: Historial de gastos
**Prioridad:** P3 | **Estimacion:** L

Como usuario, quiero ver un historial de mis gastos semanales en alimentacion, para identificar tendencias.

**Criterios de aceptacion:**
- Existe una pantalla de "Historial de gastos" (solo Pro).
- Grafico de barras con el costo estimado por semana (ultimas 12 semanas).
- Linea de presupuesto superpuesta para comparar.
- Promedio semanal, mes actual y mes anterior.
- Detalle al tocar una barra: desglose de esa semana.
- Indicador de tendencia (subiendo, estable, bajando).

---

### US-5.5: Alerta de presupuesto excedido
**Prioridad:** P2 | **Estimacion:** S

Como usuario, quiero recibir una alerta cuando mi plan supere el presupuesto, para hacer ajustes antes de comprar.

**Criterios de aceptacion:**
- Al agregar una comida que hace que el plan supere el presupuesto, se muestra un banner de advertencia.
- El banner indica cuanto se ha excedido.
- Incluye sugerencia: "Puedes reemplazar [receta cara] por [alternativa similar mas barata]".
- La alerta no bloquea la accion (es informativa, no restrictiva).
- Se puede descartar la alerta.

---

## Epic 6: Familia y Compartir

### US-6.1: Escalar porciones para la familia
**Prioridad:** P2 | **Estimacion:** M

Como usuario, quiero ajustar las porciones de todo el plan para mi familia, para que la lista de compras refleje las cantidades correctas.

**Criterios de aceptacion:**
- En el perfil se puede configurar el numero de comensales por defecto (1-10, solo Pro para mas de 2).
- Al agregar una comida al plan, las porciones por defecto reflejan el numero de comensales.
- Las porciones se pueden ajustar por comida individual (override del default).
- La lista de compras calcula las cantidades totales considerando todas las porciones.
- El costo estimado refleja las cantidades ajustadas.

---

### US-6.2: Compartir plan semanal
**Prioridad:** P3 | **Estimacion:** M

Como usuario, quiero compartir mi plan semanal con mi pareja o familiares, para que todos sepan que se va a comer.

**Criterios de aceptacion:**
- Existe un boton "Compartir plan" en el menu del calendario (solo Pro).
- Genera un enlace temporal (valido por 7 dias) con el plan semanal en formato legible.
- El enlace se puede compartir por WhatsApp, email o SMS.
- La persona que recibe el enlace puede ver el plan (solo lectura, sin cuenta requerida).
- Alternativa: generar una imagen compartible con el resumen de la semana.

---

### US-6.3: Lista de compras colaborativa
**Prioridad:** P3 | **Estimacion:** XL

Como usuario, quiero que mi pareja pueda marcar items de la lista en tiempo real, para coordinar las compras cuando vamos juntos al supermercado.

**Criterios de aceptacion:**
- El usuario Pro puede invitar a otra persona a la lista de compras via email.
- La persona invitada recibe un enlace para unirse (necesita cuenta MealPrep).
- Ambos ven la misma lista en tiempo real (via Supabase Realtime).
- Cuando uno marca un item, el otro lo ve actualizado inmediatamente.
- Se muestra quien marco cada item (avatar pequeno junto al check).
- La sincronizacion funciona con conexion a internet (no offline).
- El dueno del plan puede revocar el acceso compartido en cualquier momento.

---

### US-6.4: Perfiles de comensales
**Prioridad:** P3 | **Estimacion:** L

Como usuario, quiero crear perfiles para cada miembro de la familia, para gestionar alergias y preferencias individuales.

**Criterios de aceptacion:**
- En el perfil se pueden agregar "Comensales" (solo Pro).
- Cada comensal tiene: nombre, alergias, preferencias, ingredientes excluidos.
- Al planificar comidas, la app verifica que ningun comensal tenga alergia a los ingredientes.
- Si una receta contiene un alergeno de algun comensal, se muestra advertencia con el nombre del afectado.
- Los filtros de busqueda pueden considerar las restricciones de todos los comensales o de uno individual.

---

## Resumen de Historias por Prioridad

### P1 - MVP (17 historias)
| ID | Historia | Sprint |
|----|---------|--------|
| US-1.1 | Ver calendario semanal | 4 |
| US-1.2 | Navegar entre semanas | 4 |
| US-1.3 | Agregar comida a un slot | 4 |
| US-1.4 | Eliminar comida de un slot | 4 |
| US-1.5 | Mover comidas con drag-and-drop | 5 |
| US-2.1 | Buscar recetas | 2 |
| US-2.2 | Filtrar recetas | 3 |
| US-2.3 | Ver detalle de receta | 2 |
| US-2.4 | Guardar receta como favorita | 7 |
| US-2.5 | Ver mis recetas favoritas | 7 |
| US-3.1 | Generar lista de compras automatica | 6 |
| US-3.2 | Ver lista agrupada por pasillo | 6 |
| US-3.3 | Marcar items como comprados | 6 |
| US-3.4 | Agregar item manual a la lista | 7 |
| US-3.8 | Reiniciar lista de compras | 7 |
| US-4.1 | Configurar dieta | 3 |
| US-4.2 | Registrar alergias | 3 |
| US-4.5 | Preferencias aplicadas durante onboarding | 1 |

### P2 - Post-MVP (13 historias)
| ID | Historia |
|----|---------|
| US-1.6 | Copiar comida a otro dia |
| US-1.7 | Sugerencias rapidas de comida |
| US-1.8 | Rellenar semana automaticamente |
| US-1.9 | Guardar plan como plantilla |
| US-1.10 | Configurar porciones por slot |
| US-2.6 | Crear receta personalizada |
| US-3.5 | Editar items de la lista |
| US-3.6 | Compartir lista de compras |
| US-3.7 | Historial de listas de compras |
| US-4.3 | Excluir ingredientes especificos |
| US-5.1 | Establecer presupuesto semanal |
| US-5.2 | Ver costo estimado por receta |
| US-5.3 | Ver costo total del plan semanal |
| US-5.5 | Alerta de presupuesto excedido |
| US-6.1 | Escalar porciones para la familia |

### P3 - Futuro (5 historias)
| ID | Historia |
|----|---------|
| US-2.7 | Colecciones de recetas |
| US-4.4 | Configurar objetivo calorico |
| US-5.4 | Historial de gastos |
| US-6.2 | Compartir plan semanal |
| US-6.3 | Lista de compras colaborativa |
| US-6.4 | Perfiles de comensales |
