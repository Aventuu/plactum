# Plactum — Plantilla editorial y pipeline de automatización

Objetivo: que el único paso manual del proceso semanal sea revisar el
borrador, editar si hace falta, y publicar. Todo lo demás (monitoreo,
selección de ángulo, redacción, formato, distribución) corre solo. Para que
eso no baje la calidad, cada expediente sigue una estructura fija — nunca
se improvisa el formato semana a semana.

---

## 1. Plantilla estándar del expediente

Todo expediente, sin excepción, tiene estas siete partes en este orden:

| # | Sección | Función | ¿Dónde se muestra? |
|---|---|---|---|
| 1 | **Título** | Afirma el hallazgo concreto, nunca genérico. Regla: si el título podría servir para cualquier semana, está mal escrito. | Home, artículo, email, redes |
| 2 | **Deck** (1–2 líneas) | Resume la tesis completa del expediente en una frase | Home, tarjetas, email |
| 3 | **Lo esencial** (3–4 bullets) | Resumen ejecutivo para quien tiene 30 segundos | **Gratis, antes del muro** |
| 4 | **Cuerpo del análisis** (2–3 subtítulos temáticos) | El desarrollo completo | Se corta a la mitad para no-suscriptores |
| 5 | **Por qué importa** | Conecta el hallazgo con la tensión de las 4 categorías — es lo que lo hace análisis y no reporte suelto | Detrás del muro |
| 6 | **Fuentes** | Lista de dónde salió cada dato, con link — nunca cita textual | Detrás del muro, al final |
| 7 | **Metadata** | Número de expediente, fecha, categoría principal, figuras mencionadas (tags del roster), slug, tiempo de lectura | No visible como texto — campos del sistema |

**Por qué la sección 3 ("Lo esencial") va gratis:** es la diferencia entre un
muro de pago agresivo y uno premium. Le da al no-suscriptor valor real
inmediato — no solo un texto cortado a media frase — lo cual genera más
confianza para pagar que un muro que se siente puramente restrictivo.

**Regla de corte del muro:** siempre al final de la sección 4 (cuerpo del
análisis), nunca a mitad de una sección. Esto reemplaza el corte manual "a
mitad de frase" del mockup — con automatización, el corte tiene que ser una
regla consistente, no una decisión editorial cada vez.

---

## 2. Pipeline automatizado

| Paso | Qué hace el sistema | Input | Output |
|---|---|---|---|
| **1. Monitoreo** | Corre búsquedas programadas sobre las 16 figuras del roster (`plactum-roster-figuras.md`) | Roster + fecha de la semana | Lista de hallazgos crudos de la semana |
| **2. Selección de ángulo** | Un prompt evalúa los hallazgos y elige cuál (o qué cruce de varios) tiene más peso, y lo ubica en la tensión de las 4 categorías | Hallazgos del paso 1 | Ángulo/tesis elegido + categoría asignada |
| **3. Borrador** | Genera el expediente completo siguiendo la plantilla de la sección 1 — siempre parafraseando, atribuyendo por nombre, nunca citando texto original | Ángulo del paso 2 | Borrador completo (las 7 partes) |
| *(4. Revisión — humana, sin cambios)* | — | — | — |
| **5. Formato** | Genera slug, calcula tiempo de lectura, aplica el punto de corte del muro, asigna metadata | Borrador aprobado | Registro listo para publicar |
| **6. Publicación y distribución** | Publica en el sitio, dispara el envío por Resend a suscriptores, publica el gancho en LinkedIn/X | Registro del paso 5 | Expediente en vivo |

**Lo único que ves:** un borrador completo (pasos 1–3 ya resueltos) esperando
en una bandeja de revisión. Editas si hace falta. Un solo clic en "Publicar"
dispara los pasos 5 y 6 automáticamente.

---

## 3. Qué cambia en la revisión humana (paso 4)

Con este pipeline, revisar ya no es "escribir desde cero con ayuda" — es
control de calidad sobre algo ya estructurado. Tres cosas puntuales a
revisar cada vez, en este orden:

1. **Precisión:** ¿los hechos citados son correctos y verificables?
2. **Parafraseo real:** ¿alguna frase quedó demasiado cerca de la fuente
   original? (riesgo de copyright — revisar especialmente la sección de
   Fuentes y cualquier frase que suene "prestada")
3. **Voz:** ¿suena a Plactum (editorial, directo, sin hype) o suena a
   resumen genérico de IA? Si suena genérico, es señal de que el prompt del
   paso 3 necesita ajuste, no solo de que este expediente necesita edición.

---

## 4. Pendiente técnico

Este documento define el *qué* (plantilla y flujo). Falta definir, ya en
Claude Code, el *cómo* de los pasos 1–3: qué fuentes exactas se consultan
por figura (RSS, X API, scraping puntual), y el prompt/lógica que decide el
ángulo del paso 2 — esa lógica de selección es la pieza más delicada del
pipeline, porque de ahí depende que cada expediente tenga una tesis real y
no solo encadene hechos sueltos.
