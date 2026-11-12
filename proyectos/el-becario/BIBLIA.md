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
- Investiga expedientes que no termina de creerse. Reacciona; no da clases.
- Humor: ironía seca, comparaciones con su propia vida laboral. No hace un chiste en cada frase.
- Voz: ElevenLabs **Montero** (`rXI8ZNc3ZIKyGcQPbQMl`, `eleven_v4`), tono funcionario sarcástico.
- Visual: cara redonda blanca, pelo de pinchos oscuro, camisa blanca, corbata roja, boca sincronizada con la voz.

## Estructura de un episodio (flexible, no plantilla rígida)
1. **0–3 s — Gancho:** la promesa más fuerte de la historia, dicha y vista en el primer segundo. El primer fotograma debe valer como miniatura.
2. **3–7 s — Expediente:** «Expediente cero cero X» + carpeta que cae + sello + una frase del Becario (máx. ~4 s).
3. **Historia:** cada frase aporta información, humor o tensión. Un gag visual cada 2–3 s.
4. **Giro o remate:** el dato que no se espera.
5. **Cierre fijo:** «Expediente cerrado.» + remate del Becario (por defecto: «¿Y yo? Sigo sin cobrar.»). Sello **CERRADO**.
6. **Bucle:** el último fotograma enlaza con el primero.

## Densidad de humor y ritmo visual (lección EXP 003 v2→v3: «parece aburrido»)
- **Un chiste cada ~5 s** (9-10 por Short), casi todos del Becario comparando con su vida laboral (impresora del Archivo, mi departamento, ni un sueldo) o de remate seco tras una pausa («Contra un pájaro… que no sabe volar»). La información va dentro del chiste, no antes.
- **Tipos que funcionan (001-003):** comparación con el Archivo; remate tras `[beat]`; la repetición seca («Diez balas por emú. Diez.»); la autointerrupción del Becario («espera, que lo leo bien»); el «spoiler:»; la cita real absurda del protagonista.
- **Ritmo visual:** un cambio cada 1,5-2,5 s (corte, zoom, slam, contador, sacudida, bocadillo, efecto); ningún plano quieto más de 3 s; el Becario reacciona en pantalla al menos 3 veces además del cierre.
- **Checklist antes de la voz:** contar chistes (≥8), contar palabras (≤140 para Montero ≈ 50 s a 1,1x), comprobar que cada chiste tiene su golpe visual en el mapa.

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
  - Kit: `person({noHat})` + `hatProp(who)` (sombrero que sale volando), `emu({headExtra})` (casco…), picotazos solapados se filtran solos.
- Subtítulos arriba probados (EXP 002 v8, `CAPS=arriba`): chocan con los títulos (al bajarlos tapan caras: la suegra, ¡CANTA!). Se quedan abajo.
- **Nada de sangre ni corte visible**: el hachazo es corte a negro + «¡ZAS!» + plumas.
- **Validar siempre** (`autopilot validate`) antes del preview: zona segura `pass` y tiempos de keys dentro del plano (`featherBurst`/`flapAt` cerca del final del plano fallan).
- Ganancia de SFX máx. 1 (validador): si un efecto se oye poco, comprimir/normalizar el wav, no subir la ganancia.
- El render final exige un preview aprobado por David.

## Revisión de datos (cada Short, a las 24 h, 48 h y 7 días)
No mirar antes de 24 h ni cada hora: los datos bailan.

| # | Dato | Dónde | Bien | Flojo | Si sale flojo |
|---|---|---|---|---|---|
| 1 | Se quedaron viendo / saltaron | Estadísticas → Interacción | > 65 % | < 50 % | Falla el gancho: cambiar los primeros 3 s del siguiente |
| 2 | Duración media vista ÷ duración del vídeo | Estadísticas → Interacción | > 70 % | < 50 % | Falla la historia: mirar la curva de retención |
| 3 | Curva de retención | Interacción → Retención de audiencia | Bajada suave | Caída brusca | Esa escena sobra o aburre |
| 4 | Visualizaciones | Vista general | Suben a saltos | Planas desde pronto | Si 1 y 2 están bien, es cuestión de tiempo |
| 5 | Suscriptores ganados | Vista general | ~1 por cada 300–500 visitas | 0 con miles de visitas | Dar más presencia al Becario |

Ignorar: términos de búsqueda (en Shorts son ruido), impresiones/CTR de miniatura (no aplican a Shorts) y la puntuación de vidIQ (orientativa).

### Histórico
| Nº | 24 h: visitas | Se quedaron | Media vista | Subs | Lectura |
|---|---|---|---|---|---|
| 001 | ~1.480 (12 h) | 67,3 % | 0:28 de 0:58 (~49 %) | 2 | Gancho bueno; la historia pierde a la mitad (bloque de contexto 9–28 s muy cargado) |

## Orden de episodios
| Nº | Historia | Estado |
|---|---|---|
| 001 | El hombre que vendió la Torre Eiffel (Victor Lustig, 1925) | Publicado 9-nov-2026 |
| 002 | Mike, el pollo sin cabeza (1945–1947) | Final aprobado (v10); publicar mié 11-nov 20:00 |
| 003 | La guerra de los emús (1932) | En preparación; publicar vie 13-nov 20:00 |
| 004 | La Guerra de los Pasteles (México–Francia, 1838-39) | Propuesto (semana 16-nov) |
| 005 | Garbo, el español que engañó a Hitler con 27 espías inventados (Joan Pujol) | Propuesto |
| 006 | La Guerra del Cerdo (San Juan, 1859-72): la única baja fue un cerdo | Propuesto |
| reserva | Hiroo Onoda (29 años en la selva): tratar con cuidado, hubo víctimas civiles | Reserva |

Ideas de personajes (más adelante, con datos de ~10 vídeos): secundario recurrente en el Archivo (el Jefe que nunca paga), no un segundo narrador. Los personajes españoles/latinos entran por las historias (Garbo, Remontel/Santa Anna).
