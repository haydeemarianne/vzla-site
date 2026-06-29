# Handoff: Venezuela Site — Plataforma humanitaria de emergencia

## Overview
**Venezuela Site** (vzla.site) es una plataforma humanitaria creada tras el terremoto de Venezuela del 24 jun 2026 (M7.5). Conecta familias afectadas con voluntarios **sin login** — la identidad es el número de teléfono, verificado por código SMS.

Este paquete contiene el diseño de referencia de:
- **App pública (móvil, 392px):** Inicio, Casos Apadrinados (lista + detalle + flujo apadrinar con SMS), Limpieza Comunitaria, Ingenieros Voluntarios.
- **Panel de Validadores (escritorio):** tablero de "Recorrido del caso" (journey board) donde los admins validan solicitudes.
- **Guía de Componentes & estilo.**

## About the Design Files
El archivo `Venezuela Ayuda.dc.html` de este bundle es una **referencia de diseño hecha en HTML** — un prototipo que muestra el aspecto y comportamiento buscados, **no** código de producción para copiar tal cual. La tarea es **recrear este diseño en el entorno del codebase destino** (React, Vue, Next, etc.) usando sus patrones y librerías establecidos. Si aún no existe codebase, elige el framework más apropiado (sugerencia: **React + Vite + TypeScript**, o **Next.js** si necesitas rutas/SSR) e impleméntalo allí.

> Nota técnica: el `.dc.html` es un "Design Component" — usa una sintaxis de plantilla propia (`<x-dc>`, `{{ }}`, `<sc-for>`, `<sc-if>`) y una clase `Component` con `renderVals()`. **No** intentes portar esa sintaxis; léela como especificación de UI y reescríbela en componentes nativos del codebase.

## Fidelity
**Alta fidelidad (hifi).** Colores, tipografía, espaciado, radios y estados son finales. Recrea la UI con precisión usando las librerías del codebase. Los datos (casos, teléfonos, código SMS `482193`) son ficticios/demo: sustitúyelos por datos reales y un proveedor SMS real.

---

## Design Tokens

### Color
| Token | Hex | Uso |
|---|---|---|
| Azul primario | `#4263ac` | Acciones, enlaces, acentos, foco |
| Azul suave | `#83A2DB` | Acento secundario, logo, donut "validados", barras de progreso, gradiente héroe |
| Azul profundo (gradiente) | `#33508c` | Fin de gradiente / hover oscuro |
| Negro UI | `#0f172a` | Texto principal, botones oscuros, pill "En revisión", nav activa |
| Coral urgencia | `#CE6969` | Puntos de notificación, dona "pendientes", chip pulsante de emergencia |
| Ámbar urgencia | `#f59e0b` / texto `#b45309`, fondo `#fef3e2` | Badge "Crítica" |
| Amarillo alta | texto `#92600e`, fondo `#fef9c3` | Badge "Alta" |
| Gris media | texto `#475569`, fondo `#eef2f6` | Badge "Media" |
| Verde éxito | `#16a34a` (texto `#15803d`, fondo `#dcfce7`) | Validado, botón WhatsApp |
| Superficie | `#f4f5f7` | Fondo de pantalla móvil |
| Fondo app | `#eceef2` | Lienzo general |
| Borde tarjeta | `#eef0f3` / `#e2e6ee` | Bordes |
| Texto secundario | `#94a3b8` / `#64748b` / `#7b8595` | Subtítulos, metadatos |
| Pastel avatares | `#e7dcf2` (lila), `#dfe6f4` (azul), `#d6e8e0` (verde), `#f0d6d6` (coral), `#f3e2cf` (arena), `#fde68a`, `#bfdbfe`, `#bbf7d0`, `#fbcfe8` | Fondos de avatares circulares |

### Tipografía
- **Familia:** `'Okta Neue', 'Onest', system-ui, sans-serif`.
  - **Okta Neue** es la fuente de marca (de pago, de Ascend). Está cableada por `@font-face` apuntando a `fonts/oktaneue-{regular,medium,semibold,bold}-webfont.woff2` (+ `.woff`). Coloca esos archivos en `/fonts` para activarla.
  - **Onest** (Google Fonts, pesos 300–800) es el respaldo activo si Okta Neue no está disponible.
- **Datos/monoespaciada:** `'JetBrains Mono'` para teléfonos y tokens.
- **Pesos:** 700 = títulos; 600 = subtítulos/énfasis; 500 = etiquetas; 400 = cuerpo. (Diseño deliberadamente *ligero* — evita 800.)
- **Escala móvil:** título pantalla 21px/700; héroe 25px/700; cuerpo 13.5px; metadatos 12–12.5px; etiquetas 11–12px.
- **Escala escritorio:** título página 34px/700 `letter-spacing:-1px`; secciones 16–18px/700; filas 13–14px.
- **letter-spacing:** títulos grandes `-.4px` a `-1px`.

### Radios
- Tarjetas móviles: `18–24px`. Tablero/secciones escritorio: `22–28px`. Inputs/botones: `13–15px`. Chips/badges: `999px` (pill). Avatares: `50%` (círculo). Iconos-tile: `9–14px`.

### Sombras
- Tarjeta suave: `0 14px 34px rgba(16,24,40,.07)`
- Tarjeta elevada/hover: `0 10px 26px rgba(16,24,40,.08)`
- Héroe móvil: `0 18px 38px -16px rgba(66,99,172,.55)`
- Pill negro "En revisión": `0 18px 34px -10px rgba(2,6,23,.55)`
- Icono flotante riel: `0 3px 10px rgba(16,24,40,.05)`

### Espaciado
- Padding pantalla móvil: `6px 20–22px`. Gap entre tarjetas: `11–14px`. Padding interno tarjeta: `14–18px`.
- Ancho marco móvil: **392px** (contenido), bezel `#0f172a` radio 48px, pantalla radio 38px, alto 792px.
- Sidebar de navegación (herramienta): 288px.

---

## Screens / Views

### 1. Inicio (móvil)
- **Propósito:** entrada; el usuario elige cómo ayudar.
- **Layout (vertical, scroll):**
  1. **Header:** logo (tile 30px azul `#4263ac` con corazón blanco) + nombre "Venezuela Site" (15px/700); botón circular 34px (icono ubicación/ajuste) a la derecha. **Estilo Material:** sobre el fondo degradado, todas las tarjetas son blancas elevadas (sin borde, sombra difusa), e iconos/botones son circulares.
  2. **Héroe:** **tarjeta blanca flotante** (radio 24px, sombra `0 18px 40px -18px rgba(16,24,40,.22)`) — mismo lenguaje que las tarjetas del panel. Chip pill coral suave (`#fbeaea`/texto `#b04b4b`, punto `#CE6969` pulsante) "RESPUESTA AL TERREMOTO M7.5"; título "Ayuda directa," + "familia por familia." (segunda línea en `#83A2DB`), 26px/700 `#2b3340`; subtítulo (13.5px `#7b8595`); botón negro full-width `#0f172a` "Ver casos urgentes" → navega a Casos. El fondo de la pantalla móvil es el **mismo degradado del panel** `linear-gradient(180deg,#eef0f4,#e3e6ee)`; las tarjetas son blancas sin borde, con sombra suave.
  3. **KPIs:** 3 tarjetas iguales (flex) — "156 casos activos" (azul), "89 apadrinados" (verde), "312 voluntarios" (negro). Valor 21px/700.
  4. **"¿Cómo quieres ayudar?"** (16px/700) + grid 2 columnas de 6 módulos: Casos apadrinados, Limpieza comunitaria, Ingenieros voluntarios, Transporte solidario, Materiales imprimibles, Donantes. Cada tarjeta: tile de icono pastel (38px, radio 11px), título (13.5px/700), descripción (11.5px). Hover: borde `#cdd6e6` + sombra.
- **Tab bar inferior** (4 ítems): Inicio, Casos, Limpieza, Ingenieros. Activo en `#4263ac`, inactivo `#94a3b8`.

### 2. Casos apadrinados — lista (móvil)
- **Propósito:** explorar familias que esperan apoyo 1:1.
- **Layout:** título "Casos apadrinados" (21px/700) + subtítulo "{n} familias esperan apoyo 1:1"; botón buscar circular 36px. Fila de **filtros** scroll horizontal (pills): Todos / Críticos / Cerca de mí / Con niños. Activo = fondo `#4263ac` texto blanco; inactivo = blanco con borde.
- **Tarjeta de caso** (botón full-width, radio 20px, hover sombra):
  - **Avatar circular** 48px (color pastel, iniciales 15px/700 `#3a4250`).
  - Nombre familia (14.5px/700) + **badge de urgencia** (pill). Metadato: icono pin + "{ubicación} · {n} personas" (12px `#94a3b8`).
  - Resumen (12.5px `#475569`).
  - Chips de necesidades (11.5px, fondo `#f1f4f9`, radio 8px).
  - Footer con borde superior: "{n} días sin ayuda" + enlace "Apadrinar →" (13px/700 `#4263ac`).

### 3. Caso — detalle (móvil)
- Botón "Volver" (pill con borde). Cabecera: avatar circular 62px + nombre (20px/700) + badge; "{ubicación} · publicado hace {n} días".
- **Stats** (3 tarjetas): personas / niños / días sin ayuda.
- Tarjeta "Su situación" (label uppercase 12px `#94a3b8` + párrafo 13.5px).
- "Qué necesitan ahora": lista de ítems (tile icono pastel 34px + label/cantidad + badge prioridad). Ej.: Agua potable (Urgente/Crítica), Insulina (Urgente/Crítica), Comida (Alta).
- Caja informativa azul (`#eff6ff`/borde `#dde6f5`): explica que al apadrinar recibe el teléfono privado, compromiso 1:1.
- **Barra fija inferior** (gradiente fade): botón corazón (52px, secundario) + botón primario `#4263ac` "Apadrinar a esta familia".

### 4. Flujo Apadrinar (móvil) — 3 pasos
Header: "Atrás" (pill) + "Paso {n} de 3"; 3 barras de progreso (activas `#4263ac`, inactivas `#dde3ee`).
- **Paso 1 — Identidad:** título "Apadrinas a {familia}"; explicación (sin cuenta, identifican por teléfono). Input "Tu nombre"; input teléfono con prefijo fijo "🇻🇪 +58" + campo numérico. Nota de privacidad con icono candado. Botón "Enviarme el código".
- **Paso 2 — Verificación SMS:** tile icono 54px; "Verifica tu teléfono"; "Enviamos un código de 6 dígitos a +58 {tel}". **6 celdas** (44–46px, radio 14px; celda activa/llena borde `#4263ac` 2px, vacía borde `#e2e6ee`). Input oculto captura dígitos. Botón demo "Autorrellenar demo: 482 193". Texto "Reenviar en 0:28". Botón "Verificar y apadrinar" — **deshabilitado** (fondo `#c7d2e8`, texto "Ingresa el código") hasta tener 6 dígitos, luego activo `#4263ac`.
- **Paso 3 — Confirmado:** círculo verde 66px con check; "¡Caso asignado a ti!"; tarjeta de **contacto privado** (avatar + nombre + teléfono mono) con botones **WhatsApp** (verde) y **Llamar** (secundario). Tarjeta "Tu compromiso" (3 puntos con check). Botón "Ver más casos".

### 5. Limpieza comunitaria (móvil)
- Título + subtítulo. **Mapa decorativo** (gradiente `#dbe4f3→#eef2f8`, líneas SVG, pines gota azul/coral) con etiqueta "3 puntos activos cerca".
- **Tarjetas de punto:** lugar (14.5px/700) + fecha/hora (icono reloj); badge tipo (Escombros/Limpieza/Drenaje). Descripción. **Stack de avatares** circulares 26px (margin-left -8px) + "{apuntados}/{meta} voluntarios". **Barra de progreso** (`#4263ac`, fondo `#eef0f3`, alto 7px) con `width:{pct}`. Botón oscuro "Me apunto".

### 6. Ingenieros voluntarios (móvil)
- Segmented control 2 pestañas: "Solicitar evaluación" / "Soy ingeniero" (activo = fondo blanco + sombra).
- **Solicitar:** aviso ámbar (no entrar si hay daño visible). Inputs: dirección; chips seleccionables de daño (Grietas, Techo caído, Inclinación, Columnas, Otro); teléfono (+58). Botón primario "Solicitar evaluación".
- **Soy ingeniero:** nombre, N° colegiatura (CIV), chips de zonas (Caracas, La Guaira, Los Teques, Miranda, Vargas). Botón "Registrarme como voluntario". Nota: la colegiatura se valida antes de asignar.

### 7. Panel de Validadores — "Recorrido del caso" (escritorio)
- **Fondo:** gradiente `linear-gradient(180deg,#eef0f4,#e3e6ee)`. Layout flex: **riel de iconos** circulares (42px, blancos, sombra suave) a la izquierda — back, share, upload, estrella, +, móvil, base de datos, calendario, enviar, alerta (con punto coral), y abajo separado un círculo **negro** (ajustes). 
- **Columna de contenido:**
  - **Top nav:** logo + "Venezuela Ayuda" ("Ayuda" en `#83A2DB`); nav en **pills** (Casos, Limpieza, Ingenieros, Transporte, **Validación** [activa: negro `#0f172a` texto blanco], Donantes, Reportes); a la derecha iconos circulares buscar/correo/campana (con puntos coral) + avatar lila "AM".
  - **Título:** "Recorrido del caso" (34px/700, `-1px`).
  - **Board** (tarjeta gradiente clara, radio 28px, sombra grande): cabecera "Gestión de casos nuevos" (18px/700) + **stack de avatares** circulares 48px (borde blanco 3px) con **badges contador** (lila/coral) + 3 iconos circulares (añadir/exportar/calendario).
  - **4 etapas** en fila con scroll horizontal, cada una con su **label centrado** debajo (`#7b8595`):
    1. **Recepción** (252px): tarjeta blanca con 2 filas (avatar + check doble + icono calendario), separadas por línea. Tareas: "Asignar caso a validador", "Confirmar recepción a la familia".
    2. **Verificación** (300px): tarjeta-lista de 5 filas (avatar/+ a la izquierda, texto, a la derecha **check doble + icono** si `done`, o **tres puntos** `⋯` si pendiente). Filas: Verificar identidad ✓, Verificar urgencia ✓, Verificar ubicación ✓, Asignar a equipo de zona ⋯ (negrita), Avisar estimación a la familia ⋯ (negrita).
    3. **Asignación** (300px): igual formato. Buscar padrino (+), Confirmar disponibilidad (+), Estimar tiempo ⋯, Compartir contacto privado ⋯, Marcar como apadrinado (+).
    4. **Seguimiento** (320px): flecha curva SVG conectando desde el board hacia el **pill negro "En revisión"** (138×84, radio 20px, texto blanco 14.5px/600); debajo **grid 2 col** de 6 mini-tarjetas (icono check azul `#4b6aa0` o "+"): Entrega confirmada, Comunicación con familia, Verificación en campo (+), Notificación a la familia, Caso resuelto, Cierre y reporte (+).
  - **Fila inferior** (grid 1.55fr / 1fr):
    - **Casos recientes:** tabla (Caso / Estado / Recibido / Val.). Estado = pill de color (Aprobado verde, Pendiente coral, En revisión azul). Val = avatar circular 30px.
    - **Estado de la cola:** 2 **donas** (conic-gradient): "Validados" 47 (azul `#83A2DB`, 84%), "Pendientes" 8 (coral `#CE6969`, 30%), con leyenda de punto de color.

### 8. Componentes & estilo (escritorio)
Referencia visual: paleta (swatches), tipografía (muestras de pesos), botones (Primario `#4263ac`, Oscuro, Secundario, WhatsApp verde), badges (Crítica/Alta/Media/Validado), formularios (input, teléfono con prefijo, celdas de código SMS).

---

## Interactions & Behavior
- **Navegación móvil:** tab bar inferior + navegación contextual (botones que cambian de pantalla). Tarjetas de caso abren el detalle; detalle → flujo apadrinar.
- **Flujo apadrinar:** máquina de 3 pasos. Avanzar con "siguiente"; "Atrás" retrocede paso o vuelve al detalle desde el paso 1. El botón de verificar se **habilita solo con 6 dígitos**. "Autorrellenar demo" inyecta `482193`.
- **Filtros y segmented controls:** cambian estado activo (color de fondo) y filtran/cambian el contenido mostrado.
- **Panel:** la pestaña "Validación" está activa; filas de aprobar/rechazar (en la versión tabla); el board es de solo lectura/estado.
- **Sin animaciones de entrada complejas** (se retiraron por estabilidad). Transiciones: hover de tarjetas (sombra/borde), pulso del punto de emergencia (`@keyframes` opacidad, 1.6s infinito).

## State Management
Estado necesario (mínimo):
- `screen` — pantalla/ruta activa.
- `apStep` (1–3), `phone`, `code` (string ≤6) — flujo apadrinar; `codeReady = code.length===6`.
- `casoId` — caso seleccionado para el detalle.
- `filtro` (casos), `ing` ('sol'|'reg'), `panelTab` — estados de filtros/pestañas.
- **Backend real a implementar:** publicar caso, verificación SMS (proveedor real, p. ej. Twilio), asignar padrino y revelar teléfono privado solo al padrino, registro/validación de ingenieros (CIV), inscripción a jornadas de limpieza, panel con autenticación por **token secreto en URL**.

## Validación de formularios
- Teléfono: numérico, prefijo +58 fijo; el campo solo acepta dígitos.
- Código SMS: exactamente 6 dígitos (se filtran no-dígitos), botón deshabilitado hasta completar.
- Ingeniero: CIV requerido antes de asignar casos (validación manual del equipo).

## Assets
- **Iconos:** todos SVG inline (stroke), estilo lineal 1.7–2.2px, `stroke-linecap/linejoin: round`. No se usa librería externa — puedes mapearlos a **lucide-react** (equivalentes: heart, brush/broom, wrench, truck, file-text, gift, shield-check, droplet, pill, search, bell, mail, plus, calendar, send, database, settings, arrow-left/right, check, message-circle, phone, lock, alert-triangle, share-2, upload, star).
- **Bandera 🇻🇪:** emoji.
- **Imágenes/fotos:** ninguna real; usar slots para fotos de familias/zonas si se desea (con consentimiento).
- **Fuente Okta Neue:** archivos `.woff2/.woff` a colocar en `/fonts` (el usuario los tiene vía Ascend). Respaldo: Onest (Google Fonts).

## Files
- `Venezuela Ayuda.dc.html` — diseño de referencia completo (todas las pantallas). Incluido en este bundle.
