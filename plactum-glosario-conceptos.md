# Plactum — Glosario de conceptos del producto

Documento de referencia para términos propios del producto que no son
autoexplicativos por su nombre — útil para que cualquiera que retome el
proyecto (incluido Claude Code) no tenga que inferir el significado desde
el código o el mockup. Se amplía a medida que aparezcan más términos.

---

## Señal

Una **señal** es una observación corta y puntual sobre algo que dijo,
publicó o hizo una figura del roster editorial (`plactum-roster-figuras.md`)
— el nivel más pequeño y frecuente de contenido del producto, distinto del
expediente semanal a fondo.

### Señal vs. expediente

| | Señal | Expediente |
|---|---|---|
| Extensión | Una línea | Análisis completo (500+ palabras) |
| Frecuencia | Puntual, cuando hay algo relevante entre semana | Uno por semana, fijo |
| Ejemplo | "LeCun apostó su carrera a que los LLMs son un callejón sin salida" | El artículo completo sobre la apuesta de $1,000M contra los LLMs |
| Dónde vive | Carril "Últimas señales detectadas" en el home | Página de artículo propia (`/articulo/[slug]`) |

### Origen del término

Conecta directo con la mitología de marca (ver `plactum-narrativa-y-plan.md`,
sección 1): *"leer la señal en la oscuridad antes de que se vuelva ruido
para todos."* Una señal es el indicio temprano y todavía silencioso de algo,
antes de que se vuelva noticia masiva ("ruido"). El expediente semanal es lo
que pasa cuando una señal — o varias cruzadas entre sí — acumula suficiente
peso para un análisis completo.

### Dónde aparece en el producto

- Carril "Últimas señales detectadas" en el home (componente `SIGNALS` en
  `plactum-landing.jsx`)
- "Radar corto de señales entre números" — uno de los tres beneficios
  listados en ambos planes de precio (fundador y regular)
- En el plan de lanzamiento (`plactum-narrativa-y-plan.md`, sección 6):
  "1–2 señales sueltas si hay algo puntual relevante" entre expedientes,
  con la nota explícita de que es mejor no publicar relleno que forzar una
  señal floja solo por cadencia

---

## Expediente

El número semanal completo — el producto principal que reciben los
suscriptores. Cada expediente numerado (Nº 001, Nº 002...) se ubica dentro
de la tensión editorial de las cuatro categorías (constructores, contrarians,
doomers, escépticos — ver `plactum-roster-figuras.md`), no solo reporta un
hecho suelto.

---

## Cupo fundador

El grupo inicial y deliberadamente pequeño (30–40 suscriptores) que puede
acceder al precio promocional de por vida ($4.99 USD/mes). Se comunica
públicamente solo como porcentaje de avance, nunca como número absoluto —
ver `SPEC.md`, sección 4, y el razonamiento completo en
`plactum-narrativa-y-plan.md`.
