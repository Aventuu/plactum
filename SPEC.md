# Plactum — Especificación del proyecto (v1)

Repo: https://github.com/Aventuu/plactum
Estado: mockup de diseño validado, repo vacío, listo para implementación.

---

## 1. Resumen del producto

Newsletter semanal de pago sobre inteligencia artificial, orientada al mercado
colombiano (mercado inicial, primeros 6 meses) con expansión a Latinoamérica
proyectada después. Cubre lo que publican y construyen los científicos, CEOs
y críticos que están decidiendo el rumbo de la IA — curado y analizado, no
solo agregado. Cadencia: un expediente a fondo por semana.

**Regla no negociable de contenido:** nunca se reproduce texto de fuentes
originales — todo se parafrasea con voz propia, citando la fuente por nombre,
no por cita textual (evita infracción de copyright y es coherente con el
posicionamiento editorial de la marca).

---

## 2. Identidad de marca

**Nombre:** Plactum — nombre inventado, no es una etimología real. Mitología
de marca construida a propósito: "el ojo que no se cierra."

**Historia de marca (copy final para "Quiénes somos"):**
> Hay quienes duermen esperando que el futuro llegue solo. Y hay quienes
> vigilan. Plactum es el ojo que no se cierra: la disciplina de estar
> despierto antes que los demás, de leer la señal en la oscuridad antes de
> que se vuelva ruido para todos.

**Taglines:**
- "El ojo que no se cierra." — bio de redes, ícono/favicon
- "Vemos la señal antes de que sea ruido." — subtítulo del sitio
- "Antes de que sea noticia, ya lo vimos." — campaña de lanzamiento

**Tono:** editorial, directo, sin hype ni catastrofismo. Cubre cuatro
categorías de voces en la IA con el mismo rigor crítico, sin bando fijo:

| Categoría | Color | Ejemplos de figuras |
|---|---|---|
| Constructores | Azul `#5B8DEF` | Dario Amodei, Sam Altman, Demis Hassabis |
| Contrarians | Violeta `#B47EE5` | Yann LeCun, Ilya Sutskever |
| Doomers | Rojo `#E15B5B` | Geoffrey Hinton, Eliezer Yudkowsky |
| Escépticos | Verde `#6FBF73` | Gary Marcus |

Roster completo (16 figuras, con rol y postura de cada una) en documento
aparte: `plactum-roster-figuras.md`. Es contenido operativo del equipo
editorial, no especificación técnica — se mantiene y amplía por separado.

Definición de términos propios del producto (señal, expediente, cupo
fundador) en `plactum-glosario-conceptos.md`.

---

## 3. Sistema de diseño

Estética "dossier/señal" — deliberadamente distinta de los defaults típicos
de diseño generado por IA (nada de cream+serif+terracota, nada de negro+neón
único). Referencia visual completa: archivo `plactum-landing.jsx` del mockup
(usar como fuente de verdad para spacing, componentes y microinteracciones).

**Color:**
```
ink:        #14161C   (fondo base)
panel:      #1B1E27   (superficies/tarjetas)
border:     #2A2E3A
paper:      #EDEAE1   (texto principal)
muted:      #8B8D98   (texto secundario)
mutedFaint: #5B5D68   (texto terciario/labels)
amber:      #E8A33D   (acento de marca / CTA)
```
Colores de categoría: ver tabla de la sección 2.

**Tipografía:**
- Display/logo: Space Grotesk (bold, mayúsculas, tracking cerrado)
- Titulares y cuerpo editorial: Source Serif 4
- Labels, eyebrows, datos: IBM Plex Mono
- UI general (botones, nav): Inter

**Componentes clave a replicar:**
- Header sticky con blur, menú móvil funcional (hamburguesa, no solo desktop)
- Tarjetas en carril horizontal con scroll (usado en "Últimas señales" y
  "Más leídos") — no grid que se apila en mobile
- Navegación por scroll usa `scrollIntoView` vía JS, no anchors nativos
  `href="#"` (evita problemas de interceptación en ciertos entornos/sandboxes)
- Todo cambio de página debe resetear el scroll a la parte superior

---

## 4. Arquitectura de páginas

**Home (`/`)**
1. Hero — thesis + CTA único "Leer más" (sin botón de suscripción compitiendo)
2. Signal Strip — últimas señales por figura, carril horizontal
3. Cobertura — las 4 categorías editoriales
4. Más leídos — carril horizontal de artículos destacados de la semana
5. Teaser de precio — CTA a `/precios`

**Artículo (`/articulo/[slug]`)**
- Contenido completo hasta punto de corte (~50%)
- Muro de suscripción **flotante**: aparece vía `IntersectionObserver` cuando
  el lector llega al punto bloqueado — no es un bloque fijo en el documento.
  Se ancla al fondo de la pantalla, permanece visible el resto de la lectura.

**Precios (`/precios`)**
- Dos planes: Fundador vs. Regular (ver sección 5)
- Barra de progreso de cupo fundador: **solo porcentaje, nunca el número
  total** — evita comunicar una base de suscriptores pequeña. Mecánica: al
  agotar el cupo real, se anuncia la ampliación y ahí sí se revela el número.
- FAQ de suscripción (cancelación, método de cobro, vigencia del precio)

---

## 5. Modelo de precios

- **Fundador:** $4.99 USD/mes, fijo de por vida, cupo inicial real y pequeño
  (30–40 suscriptores, no revelado públicamente)
- **Regular:** $14.99 USD/mes, se activa al agotar el cupo fundador
- El USD es el **ancla de precio mostrada**; el cobro real en Colombia se
  procesa en **pesos colombianos** vía MercadoPago. Pendiente de decidir:
  ¿el monto en COP se congela por suscriptor al momento de suscribirse, o se
  recalcula cada ciclo según tasa de cambio vigente?

---

## 6. Pagos e infraestructura técnica

**Procesador: MercadoPago desde el día uno** (no Wompi, no Stripe/Lemon
Squeezy/Paddle). Razón: expansión a LatAm proyectada a 6 meses — misma
cuenta/API funciona en Colombia, México, Argentina, Chile, Perú y Uruguay sin
migrar de plataforma ni pedirle a suscriptores activos que vuelvan a meter
su tarjeta.
- Métodos en Colombia: PSE, Efecty, tarjetas, saldo MercadoPago
- Suscripciones: usar "Planes de suscripción" / API de Preapproval
- **Regla técnica crítica:** el webhook es la única fuente de verdad del
  estado del pago — nunca la redirección inmediata post-checkout. En PSE la
  confirmación puede tardar minutos; confiar en la redirección causa
  reportes de pago rotos (problema documentado en integraciones mal hechas).
- Cobro llega al saldo de MercadoPago → retiro directo a cuenta bancaria
  colombiana, sin Payoneer ni Wise.

**Stack sugerido:**
- Frontend + hosting: Next.js en Vercel (conectado al repo de GitHub)
- Base de datos / auth de suscriptores: Supabase
- Envío de newsletter y emails transaccionales: Resend
- Pagos: MercadoPago (ver arriba)

---

## 7. Plan de lanzamiento (resumen — detalle completo en documento aparte)

- Fase 0: landing con lista de espera, 3 números en reserva antes de lanzar
- Fase 1: oferta fundador, número 1 gratis, foco único en LinkedIn
- Fase 2: sumar X/Twitter, alianzas con creadores locales, WhatsApp como
  canal de distribución de bajo costo
- Canales priorizados para Colombia: LinkedIn > WhatsApp > X/Twitter >
  comunidades tech locales (Medellín/Bogotá)

---

## 8. Próximos pasos

1. Implementar el diseño del mockup (`plactum-landing.jsx`) como base de
   componentes reales en Next.js
2. Definir esquema de Supabase (suscriptores, estado de plan, artículos)
3. Integrar MercadoPago (checkout + webhook)
4. Conectar dominio `plactum.com` una vez registrado
5. Configurar Resend para envío real de números
