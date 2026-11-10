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
- Comentario fijado con pregunta sobre el próximo expediente.
- Horario de partida: 20:00 Madrid / 13:00 CDMX; ajustar con los datos del canal.
- Ritmo: 2 fijos por semana (martes y jueves) + un tercero (sábado) solo si hay un expediente de reserva terminado. Nunca varios el mismo día.
- Al subir: «no creado para niños», **sin** restricción de edad (con restricción aparece un aviso y el Short casi no se recomienda), uso de IA = No (animación), promoción pagada = No.
- Después de publicar: despublicar los subtítulos automáticos (Studio → Subtítulos), porque el vídeo ya los lleva grabados. Enlazar el nuevo y el anterior como «vídeo relacionado».

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
| 002 | Mike, el pollo sin cabeza (1945–1947) | Hecho (v5); cambiar sello a 002 y adelantar la promesa |
| 003 | La guerra de los emús (1932) | Pendiente |
