# Historias Sin Cabeza — biblia del canal

Documento de referencia para cada episodio. Lo que está aquí ya está decidido; cambiarlo requiere justificarlo.

## Canal
- **Nombre:** Historias Sin Cabeza (@HistoriasSinCabeza). Lema: *historias reales que no tienen ni pies ni cabeza*.
- **Qué contamos:** historias reales absurdas, estafas increíbles, guerras ridículas, inventos raros, errores históricos, personajes extravagantes y misterios con explicación sorprendente.
- **Qué no:** morbo, sangre ni burla de víctimas. El humor sale de la historia y de cómo la cuenta el Becario.
- **Público:** adultos de España y Latinoamérica, 18–34. Contenido **no infantil**.
- **Idioma:** español neutro. Sin regionalismos marcados.
- **Duración:** la que pida la historia; objetivo 45–50 s (el 001, de 58 s, perdió a la mitad del público hacia el segundo 28).

## El Becario
- Becario del Archivo, precario y sarcástico. **Lleva meses sin cobrar** (gag fijo, una vez por episodio, nunca más).
- **Regla del gag del sueldo (acordada con David, 13-nov):** la premisa es fija (nunca cobra) pero **la frase nunca se repite**: sale de la comparación con la historia del episodio (003 «A ellos, diez mil balas. A mí, ni un sueldo»; 004 «Esa pierna tuvo dos funerales. Yo no he tenido ni una nómina»). Un guiño visual propio del episodio puede acompañarlo (004: pastel con etiqueta «NÓMINA DE NOVIEMBRE») sustituyendo a la cartera vacía, no sumándose. **Romper la expectativa como mucho 1 de cada 4-5 episodios** y solo cuando haya público que la espere: gag a mitad y final con giro, que le «paguen» con algo absurdo del episodio, o un hito («casi cobra») en el episodio 10 o el día 250. Si la retención cae en los últimos 3 s o los comentarios dicen que cansa, se cambia.
- **Contador «DÍAS SIN COBRAR: N»** (elemento fijo desde el 004; el 003 salió sin él): cartel `counter()` de `002-pollo-sin-cabeza/scenes.mjs`, en el plano final junto al gag del sueldo, y al final salta a N+1. **N = 215 + días desde el 11-nov-2026** (fecha de publicación del episodio; calcularlo el día del render). Nunca en los segundos 4–10 (ver lección del 001).
- Investiga expedientes que no termina de creerse. Reacciona; no da clases.
- Humor: ironía seca, comparaciones con su propia vida laboral. No hace un chiste en cada frase.
- Voz: ElevenLabs **Montero** (`rXI8ZNc3ZIKyGcQPbQMl`, `eleven_v4`), tono funcionario sarcástico.
- Visual: cara redonda blanca, pelo de pinchos oscuro, camisa blanca, corbata roja, boca sincronizada con la voz.

## Estructura de un episodio (flexible, no plantilla rígida)
1. **0–3 s — Gancho:** la promesa más fuerte de la historia, dicha y vista en el primer segundo. El primer fotograma debe valer como miniatura.
2. **3 s en adelante — directo a la historia.** ~~«Expediente cero cero X» tras el gancho~~: **prohibido** (datos 001/002: −30/−36 pts en esos 3 s; quitado en 004 y 005). El número del expediente solo en imagen (carpeta, sello) si no frena, o al cierre.
3. **Historia:** cada frase aporta información, humor o tensión. Un gag visual cada 2–3 s. **Bucles abiertos** (ver «Guion que retiene»).
4. **Giro o remate:** el dato que no se espera.
5. **Cierre fijo:** «Expediente cerrado.» + remate del Becario (por defecto: «¿Y yo? Sigo sin cobrar.»). Sello **CERRADO**.
6. **Bucle:** el último fotograma enlaza con el primero.

## Guion que retiene (añadido 15-nov; adaptado de un vídeo de un creador faceless, solo los principios, no sus cifras)
- **El gancho cumple tres cosas en 3 s:** qué vas a ver, por qué te importa y por qué quedarte hasta el final. Y **repite la promesa del título** (si el título dice «27 espías», los primeros segundos también).
- **Bucles abiertos encadenados:** cada vez que se cierra una pregunta, se abre otra antes de que el espectador piense «ya sé cómo acaba». Recursos que ya tenemos: los PASO 1-5 del 005, el contador de agentes, «espera, que lo leo bien…», «spoiler:», el remate que llega después del dato. Al revisar el guion, marcar dónde se abre y dónde se cierra cada pregunta: si hay un hueco de más de ~8 s sin pregunta abierta, ahí se van.
- **Pase del «espectador que se aburre» (obligatorio, lo hace Claude antes de la voz):** leer el guion como alguien que desliza a la mínima y marcar cada frase en la que se iría (información que no aporta, contexto antes del chiste, frase que repite lo que ya se ve). Esas frases se cortan o se convierten en chiste. Se apunta en `guion.md`.
- **Nada de relleno ni de alargar para llegar a una duración.** Mejor 40 s que retienen que 55 s con paja. La duración la manda la historia (objetivo 35-45 s en Shorts).
- **Al final, algo que pida reaccionar** (los «me gusta» van al 1-3 %, y lo bueno en Shorts es ≥ 4 %): una pregunta con respuesta fácil y opinable en el remate o en el comentario fijado, no «suscríbete».

## Shorts frente a vídeos largos: tácticas distintas (15-nov)
El vídeo del creador faceless habla de **vídeos largos**. En Shorts cambia la mecánica: nadie hace clic, el vídeo arranca solo en el feed y se decide en 1-2 s.

| | Shorts (lo nuestro) | Vídeo largo |
|---|---|---|
| Cómo llega la gente | Feed: se reproduce solo | Clic en título + miniatura |
| Métrica que manda | **% que se queda** (frente a los que deslizan) en 1-2 s + % visto (≥ 80-100 %, con repeticiones) | CTR de la miniatura + minutos vistos (35-50 % ya es bueno) |
| Gancho | **Visual primero**: algo se mueve y se entiende antes de 0,5 s, con el texto en pantalla; luego la frase | Promesa en los primeros 30 s, que repite título y miniatura |
| Título y miniatura | Pesan poco (búsqueda, pestaña del canal); el primer fotograma es la «miniatura» | Lo son casi todo; pruebas A/B de títulos y miniaturas |
| Bucles abiertos | **Una sola pregunta central** que se resuelve al final + micro-preguntas cada ~8 s | Varias preguntas grandes encadenadas durante minutos |
| Final | **Cortar en el remate**, sin despedida: si el final enlaza con el principio, se repite y el % visto pasa del 100 % | Cierre + siguiente vídeo recomendado |
| Duración | La más corta que cuente bien la historia (**objetivo 35-45 s**; 002 de 50 s = 62 % visto, 001 de 58 s = 50 %) | La que necesite el contenido (8-15 min), sin relleno |
| Monetizar | 10 M de visualizaciones en 90 días (+1.000 subs) | 4.000 h (+1.000 subs) |
| Frecuencia | Más vídeos = más oportunidades de salir de la tanda de prueba (3/semana si la calidad aguanta) | Menos vídeos, cada uno muy trabajado |

**Qué cambiamos en nuestros Shorts por esto:**
1. **El cierre se acorta.** «Expediente cerrado» + gag del sueldo + contador son 4-5 s después del remate de la historia, y es donde cae la curva (al final quedan 29 % en el 001 y 39 % en el 002). Probar en el 006: remate de la historia y gag del sueldo **en la misma frase**, y corte directo al bucle. Curva del 003: los últimos 12 s solo pierden 4 pts (31 % → 27 %), así que el cierre no es urgente; lo que más pesa sigue siendo el arranque.
2. **Objetivo 35-45 s** (≈100-120 palabras), no 50.
3. **Primer fotograma con movimiento y texto** que se entienda sin sonido (ya lo hacemos: miniatura = fotograma 1; vigilar que algo se mueva antes de 0,5 s).
4. **Si se hace un vídeo largo** (emús, Garbo…), enlazarlo desde el Short con «vídeo relacionado»: el Short lleva gente al largo, que es el que suma horas.

## Elegir el tema con datos, no con gusto (15-nov)
- Antes de cada guion, 3 comprobaciones: **outliers** (vídeos con muchas más visitas que la media de su canal: el tema tira solo; `crecimiento.py virales` o vidIQ `outliers`), **temas que se repiten** en 3+ canales (es el público pidiéndolo) y **los comentarios** de esos vídeos (qué preguntan, qué echan en falta: ahí salen el gancho y el «dato que nadie cuenta»).
- Lo que ya dice nuestro canal: el 003 (emús, absurdo que se entiende en 1 s) es el primero que salió de la tanda de prueba. Preferir historias que se entienden en una frase y son absurdas a primera vista.

## Competencia directa: @historiaslocasok (18-nov)
- Empezó el 5-nov, como nosotros: **53 Shorts en 13 días (4/día)**, 2.680 subs, mediana **8.500 vistas** (la nuestra ~1.400). Dos virales: la mina de oro «salada» (743k, 84 s, 3,6 % me gusta) y 82 cohetes contra un ejército (465k, 96 s). 13 de 53 se quedan por debajo de 2.100. Mezcla historia real con cuentos inventados y fábulas. Repetir el análisis: `python3 herramientas/crecimiento.py competencia @historiaslocasok`.
- **También hicieron el pollo (6.400) y los emús (8.500)**, por debajo de su propia mediana: nuestros temas no son el problema. La diferencia está en el formato y en el volumen.
- Qué hacen distinto: (1) **empiezan en mitad de una acción rara**, sin fecha, lugar ni presentación («Cargó la escopeta con oro y disparó contra las paredes de su mina») → fórmula `accion-rara` en `ganchos.json`; (2) lo cuentan como un cuento, con diálogos de los personajes, y nadie se presenta; (3) **el porqué se guarda para el giro final**; (4) duran **63-96 s** (mediana 71); (5) el tema que gana es el **ingenio o el engaño del pequeño contra el poderoso**; (6) en lo visual: fondos ilustrados de color, monigotes de cabeza redonda con mucha expresión y primeros planos.
- Qué tomamos (sin copiar ni títulos ni historias): el gancho de acción rara en el primer segundo, priorizar temas de ingenio o engaño (Garbo, Lustig) y **probar un expediente de 60-70 s** contado como cuento con giro. Esto contradice el objetivo de 35-45 s: es una prueba y se decide con datos. Qué no tomamos: historias inventadas (nuestra marca es «real y con fuentes») ni 4 al día (el motor no da; la meta es 3 por semana).
- **Receta de portada (18-nov, 005/006, al estilo de los primeros planos de @historiaslocasok):** el plano 0 (~1-1,5 s, mientras suenan las primeras palabras) es una tarjeta aparte, `thumbCard` + `thumbTitle` en scenes.mjs: `rays()` de un color fuerte (rojo, azul…), protagonista en `bust: true` grande (escala 1,5-2,2) con emoción clara (`picaro`; `nervioso` ya trae gotas de sudor), el objeto del absurdo grande delante y 2-4 objetos del episodio alrededor. Título arriba: etiqueta en y 330, línea 1 en y 420 (170-190 px, amarilla) y línea 2 en y 600, con x 600 y maxW 880 para no tocar la columna de botones. Comprobar el fotograma 0 con `tramo --from 0 --to 0.5` y `validate`.
- **Ritmo (18-nov, autocrítica 005/006):** nosotros hablábamos a 2,6-2,7 palabras/s y ellos a ~3,5. Se acelera el montaje final con `voz.py ritmo film.mp4 FINAL.mp4 1.12 film.srt FINAL.srt`: imagen, voz, música y efectos a la vez, mismo tono y todo sincronizado. El motor sigue igual y lo aprobado es la preview a 1x más el factor. A partir del 007, escribir el guion ya pensando en ~3 palabras/s y pausas solo en los remates. Planos: si sobra cielo o hierba, `ZOOM` global en scenes.mjs envolviendo `camF` (006: 1,1).
- **El segundo 0-3 es la miniatura (regla de David, 18-nov):** en Shorts ya no se elige portada, así que el primer fotograma tiene que funcionar solo como miniatura: personaje con cara de emoción + objeto o situación absurda que se entienda sin sonido + el título grande (≤ 4 palabras) dentro de la zona segura. Nada de cielos vacíos, fundidos desde negro ni rótulos de «Expediente». Comprobar con el fotograma 0 de la preview: si no lo pararías en el feed, se rehace el plano 1. (006: título + cerdo + dos ejércitos = vale.)
- EXP 004 (publicado mar 01:00 ES): 1.257 vistas a las ~30 h, la misma tanda que 001-003 → la hora LatAm no cambió el día 1. Pendiente: su curva en `yt_datos.py informe 004` cuando Analytics tenga datos.

## Paciencia con los datos (15-nov)
- YouTube enseña cada vídeo primero a una tanda pequeña (~1.300-1.500 en nuestro canal) y decide si lo amplía; a veces tarda días o semanas. **No borrar ni cambiar de tema por un vídeo plano**: es información para el siguiente. Cada vídeo, mejor que el anterior.
- **Monetización:** los Shorts no suman a las 4.000 horas. Vía Shorts = 1.000 suscriptores + 10 M de visualizaciones de Shorts en 90 días. Si se quiere monetizar antes, la vía es un **vídeo largo** (4-8 min) de las historias que mejor funcionen como Short (candidatas: emús, Garbo). Decisión de David; proponerlo cuando haya 2-3 Shorts que salgan de la tanda de prueba.
- **Pruebas A/B de título:** YouTube deja probar hasta 3 títulos (y miniaturas en vídeos largos) desde Studio en los vídeos que lo admiten; probarlo en cada vídeo donde aparezca la opción. Copiar la fórmula de los títulos ganadores, nunca el título.

## Densidad de humor y ritmo visual (lección EXP 003 v2→v3: «parece aburrido»)
- **Un chiste cada ~5 s** (9-10 por Short), casi todos del Becario comparando con su vida laboral (impresora del Archivo, mi departamento, ni un sueldo) o de remate seco tras una pausa («Contra un pájaro… que no sabe volar»). La información va dentro del chiste, no antes.
- **Tipos que funcionan (001-003):** comparación con el Archivo; remate tras `[beat]`; la repetición seca («Diez balas por emú. Diez.»); la autointerrupción del Becario («espera, que lo leo bien»); el «spoiler:»; la cita real absurda del protagonista.
- **Ritmo visual:** un cambio cada 1,5-2,5 s (corte, zoom, slam, contador, sacudida, bocadillo, efecto); ningún plano quieto más de 3 s; el Becario reacciona en pantalla al menos 3 veces además del cierre.
- **Checklist antes de la voz:** contar chistes (≥8), contar palabras (**≤120** para Montero ≈ 43 s; antes 140 ≈ 50 s), comprobar que cada chiste tiene su golpe visual en el mapa, **pase del espectador que se aburre**, **bucles abiertos sin huecos de más de ~8 s**, **nada de «Expediente NNN» tras el gancho** y **pregunta o remate que pida reaccionar**.

## Rigor histórico
- Cada dato del guion, contrastado en **al menos dos fuentes**, sin depender solo de Wikipedia.
- Si un hecho tiene incertidumbre, se dice en la propia frase («dicen que», «según la versión más conocida»), una sola vez y sin repetirlo.
- Cifras dudosas (dinero, años de condena…) se omiten antes que darlas mal.
- Las recreaciones humorísticas (persecuciones, gags) son libres; la **narración** solo afirma lo que se puede sostener.
- La descripción incluye las fuentes y, si procede: «Animación humorística basada en el relato más conocido; algunos momentos están dramatizados».

## Identidad visual
- Estilo B3: vectorial plano, contorno negro grueso, colores sólidos.
- Colores del canal: amarillo `#ffd21f`, rojo `#e0261b`, tinta `#1d1d1d`, papel `#f4f1e6`.
- Rótulos: Inter Black con contorno negro grueso; sellos rojos rectangulares inclinados.
- Recursos fijos: oficina del archivo, carpeta EXPEDIENTE 00X, sello, sello CERRADO.

## Sonido
- Música por familia de historias (ej. «estafas y pícaros»: París años 20), reutilizable entre episodios.
- Efectos reales de ElevenLabs en `sfx/`; whoosh en cada transición importante.
- Volumen final −14 LUFS; la voz siempre por encima de la música.

## Control de calidad antes de publicar
- [ ] El gancho se entiende desde el primer fotograma, sin sonido.
- [ ] El Becario tiene personalidad, no es solo un narrador.
- [ ] Subtítulos legibles, sin faltas y dentro de los márgenes seguros (comprobador `safezone`).
- [ ] Los cortes caen con las palabras (tiempos de la transcripción real, no estimados).
- [ ] Hechos revisados frente a las fuentes.
- [ ] Bucle final → inicial.
- [ ] Revisión de fotogramas clave en hoja de contactos.

## Publicación
- Título corto con la promesa, sin engañar ni revelar el desenlace. Sin hashtags en el título.
- Descripción: 2 líneas de gancho + fuentes + 3 hashtags.
- Etiquetas (pesan poco; sirven sobre todo para el nombre en inglés y las variantes): primero 4-5 del episodio (protagonista, tema, nombre en inglés, lugar), después las fijas: Historias Sin Cabeza, El Becario, historias reales, curiosidades, historia.
- Comentario fijado con pregunta sobre el próximo expediente.
- Horario de partida: 20:00 Madrid / 13:00 CDMX; ajustar con los datos del canal.
- Ritmo: 2 fijos por semana (martes y jueves) + un tercero (sábado) solo si hay un expediente de reserva terminado. Nunca varios el mismo día.
- Al subir: «no creado para niños», **sin** restricción de edad (con restricción aparece un aviso y el Short casi no se recomienda), uso de IA = No (animación), promoción pagada = No.
- Después de publicar: despublicar los subtítulos automáticos (Studio → Subtítulos), porque el vídeo ya los lleva grabados. Enlazar el nuevo y el anterior como «vídeo relacionado».

### TikTok e Instagram (cuentas con el email de estudio, no el personal)
- **Perfil TikTok** — Nombre: Historias Sin Cabeza · Usuario: @historiassincabeza · Bio (≤80): «Historia real, contada mal. 🗂️ El Becario abre un expediente cada semana.» · Cuenta de empresa (Entretenimiento) · Enlace: youtube.com/@HistoriasSinCabeza
- **Perfil Instagram** — Nombre: Historias Sin Cabeza · Usuario: @historiassincabeza · Categoría: Creador de contenido digital · Bio (≤150): «Historias reales que no tienen ni pies ni cabeza 🗂️ / Las investiga un becario que no cobra / Expediente nuevo cada semana 👇» · Enlace: youtube.com/@HistoriasSinCabeza
- **Texto del vídeo**: 1 frase gancho (sin destripar) + pregunta para comentar + «Expediente completo en YouTube» + 4-5 hashtags. Subir siempre el .mp4 original y portada propia (sin marca de agua de otra red).

### Programar con vidIQ (conector de Claude; YouTube + TikTok + IG gratis, solo X cuesta créditos)
- Cuentas conectadas en vidIQ (12-nov-2026). Flujo: `vidiq_video_upload` (localFile del FINAL.mp4) → `vidiq_social_post_draft_create` (un borrador, 3 destinos, `publishAt` con zona horaria) → enseñar el borrador a David → **solo con su «sí»** `vidiq_social_post_publish`.
- YouTube: se sube al momento, privado y «Programado»; se puede editar en Studio hasta la hora. Descripción y etiquetas de `publicacion.md`; categoría 27 (Educación).
- TikTok/IG: vidIQ los guarda y los envía a la hora; no aparecen antes en las apps. **No admite portada propia** (sale el fotograma 1, que ya es portada). Para la portada propia en TikTok, subirlo desde el móvil.
- Nada programado se puede cancelar ni cambiar desde vidIQ. Comentario fijado: lo pega y fija David en cada red (ninguna API deja fijar).
- TikTok: privacidad todo el mundo, comentarios sí, música confirmada, **marca de IA = sí** (voz de ElevenLabs = audio realista). YouTube: IA = No (animación).
- Hora por defecto: 19:00 España (12:00 MX, 13:00 CO/PE, 15:00 AR). Si los datos dicen que el público es sobre todo latino, 01:00 España.
- Hashtags: 2-3 fijos (#historia #curiosidades + #shorts en YouTube) + 2-3 del episodio. Etiquetas de YouTube: 4-5 del episodio + 5 fijas.

## Crecimiento (adaptado de youtube-agent-skill, MIT; herramientas en `herramientas/crecimiento.py` y `ganchos.json`)
- **Gancho (al escribir el guion):** escribir 5 primeras frases con fórmulas distintas de `ganchos.json` (preferir encaje «alto»: lo imposible, el dato, lo que le pasó a otro, al revés de lo que crees, el más, desmontarlo, desde dentro, la comparación). Pasarlas por `crecimiento.py gancho "…"` y elegir con David. 6-12 palabras, número/nombre/fecha, sin presentar el canal.
- **Título + portada = una pareja:** `crecimiento.py titulo "…" --portada "…"`. Título ≤40 caracteres (móvil), lo importante delante, ≤2 palabras en mayúsculas, sin hashtags. Portada de 3-4 palabras que NO repita el título (misma promesa, otras palabras). Escribir 10 títulos, quedarse con 2.
- **Título de un Short (YouTube):** el Short se ve solo en el feed, así que el título trabaja sobre todo en búsqueda, «vídeos relacionados» y la pestaña del canal. Debe llevar **las palabras que alguien buscaría** (tema + objeto: «pollo sin cabeza», «guerra de los emús») y un número o fecha. Ahí puede coincidir con el primer fotograma; la regla de «portada que no repita el título» vale para las portadas de TikTok/IG y para la estantería. La puntuación de vidIQ es orientativa (EXP 002: «1945: le cortaron la cabeza. Siguió vivo» = 78 pero sin «pollo» → se cambió a «El pollo que vivió 18 meses sin cabeza»).
- **Retención (24 h, 48 h, 7 días):** David exporta el CSV de retención → `crecimiento.py retencion retention.csv --duracion N --subs captions.json` → gancho, barrancos (con la frase del Becario en ese segundo) y goteo. Un cambio por vídeo, empezando por el gancho.
- **Comentarios (primeras horas tras publicar):** separar en 4 montones y decir cuántos hay: preguntas (contestar; son ideas de expedientes), correcciones (si tienen razón, reconocerlo y dar las gracias; no discutir lo que no se puede comprobar), elogios (contestar a algunos con algo concreto de su comentario), provocaciones (no contestar). Respuestas de <30 palabras en la voz del Becario. Fijar la pregunta que más gente comparte, no el comentario más bonito. Dar corazón a muchos.
- **Ideas de expedientes (1 vez por semana):** `crecimiento.py virales videos.json` con listados públicos de canales del nicho (curiosidades/historia en español y en inglés): lo que supera 2x la mediana de su canal es lo que funciona. Nunca con la cuenta de Apify del bot.
- **Semana tipo:** martes y jueves 20:00 en YouTube; TikTok e Instagram el mismo día; comentarios en las 2 primeras horas; datos a las 24 h/48 h/7 días; el fin de semana se prepara el siguiente expediente (y el sábado solo si hay uno de reserva).

## Producción: proceso y lecciones (leer antes de cada expediente)
Para no repetir pruebas ni gastar créditos/tokens. Todo sale de los EXP 001 y 002.

### Proceso de voz (probado)
1. Guion aprobado por David **antes** de gastar créditos. Autocrítica + segunda opinión (otra IA) si es un episodio nuevo.
2. ElevenLabs `creative_generate_speech`, modelo `eleven_v4`, voz Montero `rXI8ZNc3ZIKyGcQPbQMl`, 2 tomas (~1.000 créditos cada una para ~48 s). Acotaciones en inglés entre corchetes (`[deadpan]`, `[sighs]`, `[serious, slower]`). Números escritos en letra («cero cero dos», «mil novecientos…»).
3. Tiempos: fijar la toma con `creative_add_flow_asset_node` y `creative_transcribe_audio` (Scribe, 0 créditos). `herramientas/voz.py words` limpia acotaciones y une «cero cero N»; los años hay que dejarlos como «1945.» a mano.
4. `voz.py mouth` (boca) y `voz.py caps words.json --skip N --max 20` (subtítulos: bloques de una línea, cortados en puntuación/pausas, nunca terminan en artículo o preposición; `--skip` = palabras que ya dice el título del gancho). `captionSize: 76` en project.json.
5. Para comparar tomas: transcribir también la B y montar un mp3 con las frases clave A/B (pitido 1 = A, pitido 2 = B). David decide de oído.
6. `voz.py silences narration.mp3` para ver los silencios REALES; `voz.py retime` recorta solo dentro de ellos (aborta si no) o **inserta una pausa** donde deba oírse un efecto sin voz encima. Comprobar después con RMS que la primera consonante de la palabra siguiente sigue ahí.

### Lecciones (no repetir)
- **Contrastar también lo que se dibuja, no solo lo que se dice.** EXP 003: la medalla del mayor no existió (en el Parlamento dijeron que la merecían los emús), así que se la pusimos al emú. Buscar siempre 2-3 datos «que nadie cuenta» para meterlos en imagen, bocadillo o descripción (dan comentarios y confianza).
- **Kit de «de 7 a 9» (EXP 003):** el gancho se mueve antes de 0,5 s (sin tapar la voz); el protagonista parpadea/reacciona; barridos (`whip`) en los cortes que cambian de escenario; cifras del subtítulo en rojo (`captionTrack(..., {num: RED})`); nombre real y lugar en etiqueta; música audible con `voz.py musica … --duck 0.62`; volumen final ≈ −14/−15 LUFS (`ffmpeg -af ebur128`).
- **Autocrítica EXP 003 v2 (6/10):** miniatura con el protagonista pequeño; rótulos que repetían el subtítulo (¡GUERRA!, ¿AL EJÉRCITO?, 10 BALAS POR EMÚ) → sustituidos por imagen (mira, sombrero que cae, «×10»); 15 planos del mismo trigal con el mismo encuadre; sujetos pequeños en planos abiertos. Antes de enseñar: protagonista ≥ 2/3 del cuadro en la miniatura, sujetos grandes, variar encuadres.
- **`cam()` recibe números (from, to); con una función de cámara, `camF()`.** Si no, salen escalas null y el validador dice «Invalid scaleX». `DEBUG=1 node autopilot.mjs …` muestra la traza.
- **Keys de gestos:** `gestures` con `t1` = final del plano rompe el orden de tiempos (y con `walk` corto, la duración total es la del paseo). Para dejar un brazo arriba hasta el final, `poses`.
- **`sample()` usa grados en `a`** (no pasar `deg()`), y los keys a mano solo admiten x, y, angle, alpha, scaleX/Y (no `s`).
- **Un chiste de sonido necesita silencio.** Si el narrador dice «suena a tubería atascada», el efecto va en una pausa propia antes del remate, nunca debajo de la voz.
- **Un efecto que se nombra tiene que sonar a lo que se nombra** (tubería = desagüe atascado, no gorgoteo de pollo).
- **Datos reales del canal en pantalla** (seguidores, días): comprobarlos el día del render. Seguidores a 10-nov-2026: 6.
- **Mike sin cabeza:** cuello liso que sale del cuerpo + dos plumitas en el corte. Nada de rayas verticales (parecía una mazorca), collares (parecía un cruasán) ni coronas.
- **Nada encima del corte del cuello** (burbujas, notas): forma una «cara» y rompe el chiste. Los efectos salen hacia un lado.
- **El primer fotograma es la miniatura:** el cartel no puede tapar al personaje; pequeño y a un lado.
- **Cada plano con un personaje u objeto reconocible desde el primer fotograma** (el autobús sin Mike no contaba nada).
- **No repetir arriba lo que dice el subtítulo.** El título de arriba aporta otra cosa (contexto o remate).
- **Títulos de arriba:** `tag()` de lib.mjs (etiqueta de papel con borde y sombra, estilo expediente). **Rótulos de golpe:** `slam(..., {outline: true})` para que se lean en cualquier fondo.
- **Pausas largas de la voz** alargan el vídeo: recortar con `voz.py retime` hasta 45-48 s, sin tocar las pausas cómicas.
- **Recortar e insertar SOLO en silencio medido** (RMS < -42 dB), con 60 ms de margen. Los bordes de palabra de Scribe fallan hasta 0,4 s: así se cortó la «C» de «Colorado» («olorado») y la «S» de «Suena» en la v4.
- **Ningún efecto encima de una palabra.** Golpes (sello, hacha, caja) en los huecos de la voz o justo antes; ambientes (gente, neón) ≤ 0,2; whooshes ≤ 0,25. Nada de efectos al arrancar el vídeo: el gorgoteo inicial tapaba «Este pollo vivió».
- **Remate «ni gratis» + grillos:** hace falta ~0,8 s de silencio después (se insertó 0,4 s).
- **Títulos de arriba solo si aportan** (contexto, número, remate visual): unos 10 por vídeo. Los que repetían el subtítulo (A POR UN POLLO, Y SE VA, RESPIRAR, TUBERÍA ATASCADA, NI UN LUNES…) se quitaron.
- **Nada desborda, ni durante la animación:** un `slam` entra a escala `from` (1,6 por defecto), así que ancho×from tiene que caber entre x 64 y 1126 del plano. Rótulos grandes: `from` 1,1-1,3. Etiqueta del gancho con `{pop: false}` para que salga entera en el primer fotograma.
- **Cajas dentro de la escena:** el contador no puede tapar la etiqueta de la carpeta (contador en y≈660).
- **Subtítulos karaoke** (desde EXP 002 v6): `captionTrack(WORDS, captions)` de lib.mjs pinta los bloques de captions.json con la palabra que se dice en amarillo, abajo del todo (y≈1765 del plano = 77 % de la altura; más abajo lo tapa el título y el canal de YouTube); en project.json `burnCaptions: false` (el motor no los pinta pero exporta el .srt para subirlo a YouTube).
- **Tramos explicativos (el «cómo»): un solo mundo visual y un golpe por frase.** EXP 002: todo en la radiografía (hacha fantasma que pasa por donde estaba la cabeza → corte seco al tronco del cerebro → pulmones dentro de Mike → anda). Nada de dibujos sueltos que no se entienden (el óvalo rosa parecía un pulmón).
- **Primeros planos: el personaje por encima de los subtítulos** (patas y pies por encima de y≈1700 del plano).
- **Música con ducking:** `voz.py musica music.mp3 words.json DUR --boost A-B` → baja bajo la voz, sube en pausas y en el tramo de fiesta; gain 0.17.
- **Personajes en vehículos/edificios: dentro, por la ventana** (Mike en la ventana del bus; su silueta tras la cortina del motel), nunca encima.

- **Mapas con geografía real (EXP 005):** nada de polígonos a ojo (parecían manchas). Contornos simplificados en longitud/latitud + `geo()` y `mapCam()` en `005-garbo/props.mjs`: copiarlos y añadir costas cuando haga falta. Nombres de país en el mapa, ciudad con punto y nombre; en planos con zoom, solo los nombres que caben (zona segura).
- **Que nadie esté solo respirando (EXP 005):** cada personaje en pantalla hace al menos un gesto ligado a la frase (asentir, reír, señalar, retroceder, saltar). Helpers `nod`, `laugh`, `hop`, `flinch` en `005-garbo/scenes.mjs`; `gestures` suma al brazo base (uno por brazo y plano).
- **Revisar el audio sin oído (EXP 005):** después de cada preview, `python3 ../herramientas/oido.py --cuts T1,T2` (volumen, palabras tapadas, efectos que pisan la voz, música, chasquidos, silencios, velocidad). Sin ✗ antes de enseñarla; los ⚠ se revisan. El gusto (si un efecto hace gracia) lo valida David con cascos.
- **Música: `--duck 0.35` y `gain 0.2`** (005). Con `--duck 0.62` (003) la música solo bajaba 4 dB bajo la voz y los golpes de la melodía tapaban sílabas («dos», «nazis», «existían»). Así queda ~−17 dB bajo la voz y se sigue oyendo en las pausas. Remate final: `voz.py musica … --quiet A-B` para que la música se aparte del todo.
- **EXP 004 (13-nov):** voz de 56 s → `atempo=1.04` (mismo tono) + pausas NO cómicas a ~0,22 s con `voz.py retime` = 50,8 s sin regenerar. Escalar los tiempos de Scribe /1,04 antes de `voz.py words`.
- **El motor rechaza** keys con t fuera del plano, `x/y` fuera de ±10.000, `lineWidth: 0` y keys a mano con `a` (es `angle`; `a` solo vale dentro de `sample()`). En 004 `scenes.mjs` tiene un saneado final (`clip`) que recorta keys/from/to al plano: copiarlo.
- **Columna de botones (derecha):** ningún texto pasa de x≈930 del vídeo. Miniatura: título a la izquierda, protagonista grande a la derecha.
- **El brazo izquierdo se dibuja detrás de la cabeza:** para «taparse los ojos» se ponen manos como capa encima (004, «Se la amputan»).
- **Primeros planos de un objeto:** quitar del set a los personajes que se cuelan (`funeral(d, {sa: false})`).

- **EXP 006 (16-nov):** Montero lee ~**2,4 palabras/s**: 120 palabras = 50 s, no 43. Para ≤45 s hacen falta ≈100-105 palabras o atempo 1,06 + pausas recortadas. Una pausa de efecto se inserta con `voz.py retime --insert T:0.35`; el disparo va en la pausa, nunca sobre la palabra. vidIQ puede quedarse sin créditos (renuevan el 22-nov): `yt-dlp --flat-playlist --dump-json "ytsearchN:…"` da visitas y duración públicas. Cifras de ejércitos discrepan entre fuentes: en pantalla/voz decir «más de»; en descripción, «según varias fuentes».
- **EXP 006 v2 (17-nov):** antes de enseñar, regla de pies (`FT = 1680`: ningún personaje ni objeto importante por debajo de y≈1690) y ningún plano > 3 s. Si un efecto se nombra en la historia como «no pasó» (no hubo tiros), no se dibuja (fuera humo de cañones). Un SFX de animal de ElevenLabs cuesta 17 créditos: recortar al primer golpe (0,3-0,4 s) para que quepa en la pausa. Si se sube la música, `--quiet` en cada remate que oido.py marque con ✗.
- **EXP 007 (18-nov, prueba de formato):** 191 palabras con Montero = 71 s en bruto (2,7 pal/s) → final a **×1,2 = 60 s (3,2 pal/s)** con `voz.py ritmo`; David lo aprobó. Lecciones: (1) **la fuente no tiene hangul ni otros alfabetos no latinos**: salen cuadrados → transcribir («HAENGJU CHIMA»); (2) **bocadillos a ≥ 70 px** (a 50-56 no se leen en el móvil); (3) **la portada tiene que ser ACCIÓN en el fotograma 0** (el arma disparando, fogonazo `burst`, víctimas con cara de miedo), no el objeto quieto; (4) preview > 60 s: `PREVIEW_MAX=90` (opcional en el motor); (5) nombres raros escritos para la voz («Guon Yul», «jéngchu») y corregidos en `words.json`; (6) oido.py da ✗ falsos en palabras susurradas o colas de palabra: medir voz y música a mano antes de tocar nada.
- **Cámara (motor, 16-nov):** `lib.mjs` → `move.pan/tilt/dolly/travelling/orbit/crane/handheld/zoom(d, …)` para `camF(layers, d, move.xxx(d, …), px, py)` (los 8 movimientos de videógrafo; orbit es aproximación 2D). `handheld` es continuo (`shake` es solo un golpe). Usar un movimiento distinto por escena: dolly en confrontación, handheld en tensión, crane para abrir plano, pan en el mapa/campamentos.

### Motor y ahorro (acordado con David, 10-nov-2026)
- Si una mejora del motor es buena para los Shorts, **se hace** y se le cuenta a David (qué, por qué, coste). Las propuestas de mejora del motor se le van diciendo para ir mejorándolo.
- Ahorrar tokens/créditos en cada vídeo: reutilizar lib.mjs/kit.mjs/voz.py, QA con una sola hoja de fotogramas, no regenerar voz si basta con recortar/insertar silencios, Scribe (0 créditos) para tiempos.
- Hecho en el motor (rama shorts-es, todo opcional y sin cambiar lo que había):
  - `burnCaptions: false` (subtítulos propios; el .srt se sigue exportando).
  - `autopilot tramo project.json --from A --to B`: renderiza solo ese tramo con su audio (~7 s para 6 s de vídeo). Para revisar cambios; no sirve para aprobar.
  - Contorno real de texto (`outline` + `outlineWidth`): `slam` y los subtítulos ya lo usan (antes, 8 copias por texto).
  - La zona segura también se comprueba en el pico de cada animación de texto.
  - Espejo: `scaleX`/`scaleY` negativos ya pasan la validación (antes `flip` del emú/Lewis/camión fallaba en validate aunque la hoja de personajes lo pintara).
  - `herramientas/hoja.mjs`: hoja de fotogramas (uno por plano) en una sola imagen, para QA barato.
  - `voz.py musica … --duck X` (por defecto 0,42), `captionTrack({num})`, `emu({blink, bodyExtra})`, `DEBUG=1` en autopilot.
  - Kit: `person({noHat})` + `hatProp(who)` (sombrero que sale volando), `emu({headExtra})` (casco…), picotazos solapados se filtran solos.
- Subtítulos arriba probados (EXP 002 v8, `CAPS=arriba`): chocan con los títulos (al bajarlos tapan caras: la suegra, ¡CANTA!). Se quedan abajo.
- **Nada de sangre ni corte visible**: el hachazo es corte a negro + «¡ZAS!» + plumas.
- **Validar siempre** (`autopilot validate`) antes del preview: zona segura `pass` y tiempos de keys dentro del plano (`featherBurst`/`flapAt` cerca del final del plano fallan).
- Ganancia de SFX máx. 1 (validador): si un efecto se oye poco, comprimir/normalizar el wav, no subir la ganancia.
- El render final exige un preview aprobado por David.

## Revisión de datos (cada Short, a las 24 h, 48 h y 7 días)
No mirar antes de 24 h ni cada hora: los datos bailan.

**Automático (solo lectura):** `python3 herramientas/yt_datos.py informe NNN` → `NNN-slug/datos-youtube.md` con métricas, fuentes y la curva de retención cruzada con el plano y la frase de cada caída; `canal` compara todos. Credenciales en `el-becario/.secretos/` (fuera del repo). El dato 1 (se quedaron/saltaron) solo está en Studio: captura.

| # | Dato | Dónde | Bien | Flojo | Si sale flojo |
|---|---|---|---|---|---|
| 1 | Se quedaron viendo / saltaron | Estadísticas → Interacción | > 65 % | < 50 % | Falla el gancho: cambiar los primeros 3 s del siguiente |
| 2 | Duración media vista ÷ duración del vídeo | Estadísticas → Interacción | > 70 % | < 50 % | Falla la historia: mirar la curva de retención |
| 3 | Curva de retención | Interacción → Retención de audiencia | Bajada suave | Caída brusca | Esa escena sobra o aburre |
| 4 | Visualizaciones | Vista general | Suben a saltos | Planas desde pronto | Si 1 y 2 están bien, es cuestión de tiempo |
| 5 | Suscriptores ganados | Vista general | ~1 por cada 300–500 visitas | 0 con miles de visitas | Dar más presencia al Becario |

**Lección 001 (datos):** después del gancho, ir directo a la historia. Nada de «Expediente NNN» + quién soy + gag del sueldo entre los segundos 4 y 10: el gag del sueldo va a mitad o al final. **Confirmado con el 002 (14-nov):** solo «Expediente 002. Colorado, 1945» y aun así −30 pts en 4,5–7,5 s. Regla: **nada de «Expediente NNN» tras el gancho**; el gancho enlaza directo con la historia (005 ya sale así).

Ignorar: términos de búsqueda (en Shorts son ruido), impresiones/CTR de miniatura (no aplican a Shorts) y la puntuación de vidIQ (orientativa).

### Histórico
| Nº | 24 h: visitas | Se quedaron | Media vista | Subs | Lectura |
|---|---|---|---|---|---|
| 002 | ~1.350 (24 h, público) | ? | ? | ? | 2,4 % me gusta (001: 2,9 %). Pendiente informe con yt_datos |
| 001 | ~1.480 (12 h) | 67,3 % | 0:28 de 0:58 (~49 %) | 2 | Gancho bueno; la historia pierde a la mitad (bloque de contexto 9–28 s muy cargado) |
| 001 | 1.478 (3 días, yt_datos) | 61 % con interacción | 50 % | 2 | **Curva:** 106 % a los 5 s → 54 % a los 12 s. Se van en «Expediente 001. Yo llevo meses sin cobrar… así que quiero saber cómo» (−36 pts en 4,6–8,1 s). Desde los 15 s la curva es plana y la retención relativa sube a 0,8: **la historia engancha; lo que echa es la autopresentación tras el gancho** |
| 002 | 1.350 (2,6 días, yt_datos) | 52 % con interacción | 62 % | 4 | **Curva:** 119 % a los 3 s → 76 % a los 8,5 s. Se van en «Expediente 002. Colorado, 1945» (−30 pts en 4,5–7,5 s). Desde los 15 s la relativa sube de 0,40 a 0,73: la historia engancha. 2,4 % me gusta, 0 comentarios |
| 003 | 2.673 públicas (2,9 días; Analytics aún 1.242) | 63 % con interacción (el mejor) | 47 % | 3 | **Primero que sale de la tanda de prueba.** Curva: 116 % a los 3 s → 55 % a los 11 s. Se van en «Expediente 003. 20.000 emús…» (**−40 pts** en 5,2–8,3 s): tercera confirmación. Del s 15 al final baja suave (46 % → 27 %): el cierre no es un barranco. 1,4 % me gusta, 0 compartidos |

## Orden de episodios
| Nº | Historia | Estado |
|---|---|---|
| 001 | El hombre que vendió la Torre Eiffel (Victor Lustig, 1925) | Publicado 9-nov-2026 |
| 002 | Mike, el pollo sin cabeza (1945–1947) | Final aprobado (v10); publicar mié 11-nov 20:00 |
| 003 | La guerra de los emús (1932) | Programado con vidIQ vie 13-nov 19:00 (YT/TikTok/IG) |
| 004 | La Guerra de los Pasteles (1838-39): la pierna de Santa Anna | Final aprobado (13-nov); 14-nov: quitado «Expediente 004» tras el gancho (49,7 s). Programado con vidIQ mar 17-nov 01:00 ES (= lun 18:00 CDMX; prueba de hora LatAm) en YT/TikTok/IG |
| 005 | Garbo, el español que engañó a Hitler con 27 espías inventados (Joan Pujol) | Final aprobado (13-nov, v4); publicar mié 18-nov (contador 223) |
| 006 | La Guerra del Cerdo (San Juan, 1859-72): la única baja fue un cerdo | Preview v2 (17-nov, 47 s); pendiente aprobación de David; publicar sáb 21-nov (contador 225) |
| 007 | El hwacha de Haengju (Corea, 1593): prueba del formato de @historiaslocasok (gancho `accion-rara`, cuento con diálogos, giro final). Carpeta `007-hwacha/` | Final aprobado (18-nov, v2, ×1,2 = 60 s); publicar **lun 23-nov 20:00 ES** (contador 227). Comparar con 005/006 |
| 008 | Blas de Lezo en Cartagena de Indias (1741): hundió sus propios barcos; Inglaterra acuñó las medallas de la victoria antes de ganar. Mismo formato que el 007 para confirmar | Por preparar |
| 009 | La primera huelga de la historia (Deir el-Medina, ~1157 a. C., Papiro de la Huelga de Turín): **debut del Jefe** (español, el que no paga) en el gag del sueldo | Por preparar; antes, hoja con 2-3 diseños del Jefe |
| reserva | Hiroo Onoda (29 años en la selva): tratar con cuidado, hubo víctimas civiles | Reserva |

Ideas de personajes (más adelante, con datos de ~10 vídeos): secundario recurrente en el Archivo (el Jefe que nunca paga, **español**; lo confirmó David el 18-nov), no un segundo narrador. Entra en el gag del sueldo (cameo de 2-3 s) a partir del **009**: el 007 prueba el formato y el 008 lo repite para confirmar (un solo cambio cada vez). Antes, hoja con 2-3 diseños para que David elija. Los personajes españoles/latinos entran por las historias (Garbo, Remontel/Santa Anna).
