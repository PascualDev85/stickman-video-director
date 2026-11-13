# EXP 005 — Plan de montaje (leer esto al empezar la sesión)

Para arrancar: «Sigue con el EXPEDIENTE 005: lee `proyectos/el-becario/005-garbo/montaje.md`».

## Estado (13-nov-2026): **FINAL APROBADO** (v4) → `expedientes/005-garbo/` (vídeo, .srt, 2 portadas; textos en `publicacion.md`). Antes: PREVIEW v4 lista → `output/preview.mp4` (52,30 s, −14,9 LUFS, zona segura **pass**, 28 planos).
- **v4:** movimiento en ~20 personajes (helpers `nod`, `laugh`, `hop`, `flinch` + `gestures`/`walk`): Garbo se toca el sombrero, señala el manual, retrocede con cada NO, se rasca la barbilla, coge la carpeta, se ríe; el oficial asiente y hace el pulgar arriba; el escocés da un respingo; la viuda solloza; los soldados miran alrededor; saltos con cada medalla (las medallas saltan con él); risas en «inventarla». Respaldo `scenes.v3.mjs`.
- **v3.2:** mapas con geografía real (`props.mjs`: contornos en lon/lat → `geo()`, Portugal con su raya, Irlanda, África, nombres de países y ciudades; `mapCam(cx, cy, s)` encuadra un punto). Audio medido con `herramientas/oido.py` (0 ✗): `--duck 0.35 --quiet 47.5-51.6`, música gain 0.2, morse 0.06, grillos tras «existían», portazo 0.2.
- **v3:** +0,25 s de pausa tras «…por un español.» (respaldos `*.v2.*`); en `scenes.mjs` CUT = 6,0 y CUTX = 1,43. Ventanita del Becario de busto grande (`becario({bust: true})`, opción nueva del kit, por defecto no cambia nada) con mesa delante. `plantilla()` entra de golpe y el número cuenta (AGENTES 3 → 27 en la radio). Despachos con decorado propio: alemán (archivador + lámpara), británico (mapa del Canal + estantería).
- (v2, abajo) Pendiente: que David la vea. NO hay render final.
- **v2 (mejoras pedidas por David):** fuera «Expediente cero cero cinco» (voz recortada 4,72–6,40 s, lección 001; respaldo `narration.v1.mp3`, `words.v1.json`, `captions.v1.json`, `scenes.v1.mjs`, `props.v1.mjs`); en `scenes.mjs` los tiempos siguen siendo los de la v1 y `T()` los desplaza. «Cómo fabricar un espía» = Garbo + manual (sin oficina). Mini tablón `plantilla()` «AGENTES: N» (Glasgow 3, radio 27). Mapas con nombres de países y la cabeza de Garbo en la ruta; SEÑUELO y ¡AQUÍ! separados. Rechazos ×1-×3 grandes y Garbo más grande. Liverpool: ficha grande tachada + MUERTO. Medallas grandes en el pecho. Fondos: oficina alemana roja (`DE`), británica verde (`UK`). Becario en ventanita `becCam()` en ¡GUT!, la viuda y Calais.
- Guion, fuentes, título y voz: `guion.md`. Voz: toma A ×1,06 + 10 pausas recortadas (`cuts.txt`) = 53,11 s.
- Personajes nuevos en `kit.mjs`: pujol (gabardina + fedora), oficialDe (Abwehr, monóculo, SIN símbolos nazis), ingles (MI5, bombín), viuda (velo), soldadoDe 1/2 (casco), escoces (boina tam). Sombreros nuevos: fedora, peaked, casco, veil, tam.
- Objetos en `props.mjs` (ficha, saco, embajada, mapa + ruta animada, tranvía, guía, botella 1 L, pinta, periódico, sobre, radio, cruz de hierro sin esvástica, MBE, manual, paso, calais, calendario).
- `voz.py words`: arreglado «cero cero cinco:» → «005:» (antes salía «00cinco:» si había puntuación).
- SFX: reutilizados whoosh/drop/stamp/scratch/crickets/monedas (004) + medalla (003); nuevos portazo y puf (ElevenLabs, 2 × 17 créditos, flow «EXP 005 Garbo - voz»); morse sintetizado con ffmpeg.
- Música: la del 001 (familia «estafas y pícaros») → `music-duck.wav` (`--duck 0.35 --quiet 47.5-51.6`, gain 0.2; medido con `oido.py`).
- Contador DÍAS SIN COBRAR: `PUB = '2026-11-18'` (222→223). **Recalcular si cambia la fecha de publicación.**
- QA: `node ../herramientas/hoja.mjs project.json hoja.png --w 200 --cols 8 --at 0.6`.

## Autocrítica v1 (~7,5/10)
Funciona: miniatura (tablón de 27 fichas + Garbo grande guiñando + «27 ESPÍAS / NINGUNO EXISTÍA»), los 5 PASOS como columna vertebral (un cambio cada ~1,8 s), la viuda que se esfuma, «¡GUT!», las dos medallas, bucle tablón → tablón.
Mirar con David:
1. Mapas (17–19 s y 38 s): esquemáticos; faltan nombres (Madrid/Londres/Calais) — se entienden por la voz y las etiquetas.
2. Plano de la embajada (9,5–13 s): el inglés asoma tapado en parte por Garbo.
3. «Mata a un espía inventado» (30,5 s): la ficha con sello MUERTO es pequeña.
4. Oficial alemán: caricatura sin símbolos (decisión para no tener problemas en YouTube/TikTok).
5. SFX y música: comprobar de oído (portazo 8,98; sellos; puf 33,9; morse 36,15; medalla 42,0).

## Publicación (borrador)
Título YouTube: **El espía español que inventó 27 espías** · Portada TikTok/IG: **NINGUNO EXISTÍA** · Descripción: ver `guion.md`.
