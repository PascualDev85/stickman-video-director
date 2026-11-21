# EXP 008 Lezo — sesión de mejoras (preparada el 21-nov-2026)

**Arranque (pegar en la sesión nueva):** «Lee `proyectos/el-becario/008-lezo/SESION-MEJORAS.md` y `BIBLIA.md` (solo la parte de lecciones 008). Empieza por el bloque A; no renderices sin mi OK.»

Publicación: **miércoles 25-nov-2026**, contador **229** (007 sale el lunes 23-nov). Quedan 4 días: lo imprescindible es el bloque A; el resto es opcional.

## Estado de partida (todo funciona; nada roto)
- Preview v5 ×1,2 = `output/preview-x1.2.mp4` (48,3 s). `validate` pass, zona segura pass, `oido.py` sin avisos rojos.
- `scenes.mjs` (36 planos **anclados a palabras** con `T('palabra', n)`): si cambia la voz, se reajusta solo. Copias: `scenes-v4.mjs.bak`, `scenes-v3-tiempos-fijos.mjs.bak`, `voz-v2/` (voz y guion anteriores).
- Voz: **una sola toma** (`v3A.mp3`, 57,6 s, Montero `eleven_v4`), sin escuchar por Claude. Guion v3 en `guion.md` / `narracion-eleven.txt`.
- Música: **propia, sintetizada** (`musica-sintetica.py` → `music.mp3` → `voz.py musica … --duck 0.25 --boost 44.1-45.2`; `music.gain` 0,2 es el máximo del motor).
- Comandos (desde `008-lezo/`): `node scenes.mjs && E=../../../skills/directing-stickman-videos/scripts/autopilot.mjs && PREVIEW_MAX=90 node $E validate project.json --seconds 60` · `preview … --seconds 60 --replace` · `python3 ../herramientas/oido.py` · `python3 ../herramientas/voz.py ritmo output/preview.mp4 output/preview-x1.2.mp4 1.2 output/preview.srt output/preview-x1.2.srt`.
- Límites del motor: ~30 figuras completas por plano (más: `bust: true`), anidación ≤ 8, `music.gain` ≤ 0,2, `validate` sin `--seconds` no los detecta.

## Recursos (a 21-nov)
| Recurso | Estado |
|---|---|
| ElevenLabs | ≈ 120 créditos de 38.124 (voz ≈ 900/toma, Scribe ≈ 320, música ≈ 900-1.500). Revisar si se renuevan. |
| vidIQ | 0 créditos hasta el **22-nov 20:37 UTC**; `vidiq_generate_music` cuesta 25 créditos/pista. |
| Higgsfield | 1,12 créditos (plan gratuito): no sirve. |

## A. Imprescindible antes de publicar
1. **David ve y oye la preview ×1,2** y decide: ¿ritmo ×1,2 o ×1,25? ¿le convence la voz, la música sintetizada y la miniatura dorada? (Claude no puede oírlas.)
2. Si hay OK: `approve --note "…"` → `render --replace` → `ritmo` ×1,2 sobre `output/film.mp4` → copiar a `../../../expedientes/008-lezo/EXPEDIENTE-008-FINAL.mp4` (+ `.srt` y portada 3:4-safe).
3. Título, descripción y comentario fijado con `crecimiento.py` (comentario: «¿Qué harías tú con esas medallas: fundirlas, esconderlas o enmarcarlas?»). Fuentes de los datos en la ficha: ver `guion.md` (tabla) — Wikipedia EN, IHR/IHO 2022, Serrano Álvarez 2016.
4. BIBLIA («Orden de episodios»), commit y push a `shorts-es` con la línea `Co-Authored-By` de Claude. Nada se publica solo: sube David.

## B. Mejoras propuestas (por orden de retorno)
1. **Música generada** cuando haya créditos: ElevenLabs `eleven_music_v2_5` (prompt probado: «Instrumental comedic baroque-orchestral march, swashbuckling naval feel, pizzicato strings and harpsichord, staccato theme, snare rolls and timpani, bold brass fanfares, ~128 BPM, mischievous and heroic, energy builds over 60 s with a short tense drop around the middle and a triumphant final swell, no vocals») o vidIQ. Después: `voz.py musica` con `--boost 44.1-45.2` y `oido.py`. Si no hay créditos, la sintetizada vale.
2. **Segunda toma de voz** (≈ 900 + Scribe 317 créditos) si alguna línea suena mal; al estar anclado a palabras, basta repetir Scribe → `voz.py words/mouth/caps/musica` → `node scenes.mjs`.
3. **Pulido visual**: prensa de medallas (bloque gris pobre), «¡VERNON HA GANADO!» demasiado pequeño por la zona segura (probar dos líneas), revisar el instante en que sale volando la tapa de la caja (`mira`→`medallas`), mar vacío abajo en Bocachica, que los soldados usen una marcha menos «en el sitio». Mejoras del **motor** (caminar con desplazamiento real, más figuras por plano): solo si David las aprueba (regla del CLAUDE.md: opcionales y se le cuentan).
4. **Audio**: pico real −0,8 dBTP (objetivo ≤ −1), posibles chasquidos a 0,91 s y 43,6 s (transitorios de redoble/riser: suavizar con fade o mover 30 ms).
5. **Herramientas de audio de terceros** (David las nombró; **no están instaladas**): ver abajo.

## C. Skills de audio que David quiere valorar (no descargadas)
- **Earshot** — repositorio `github.com/Leonxlnx/earshot` (identificado por búsqueda web, sin auditar). Describe audio con etiquetas AudioSet, puntúa si un clip encaja con un texto, sintetiza sonidos por código (banco de 201 efectos), CLI/Python/MCP, CPU, requiere Python 3.10+ y ffmpeg. Podría complementar `oido.py` (Claude «oye» sin escuchar) y dar efectos sin créditos.
- **Real SFX**: no se ha encontrado un repositorio con ese nombre. Parecidos: `m4bwav/sfxwright`, `nkapila6/sfx-gen`, `remotion-dev` «add-sfx» (CC0, WAV normalizado a −3 dB). Pedir a David la URL exacta.
- **Openverse**: no hay skill dedicada; Openverse tiene API pública (audio CC de Freesound, Jamendo y Wikimedia Commons, con filtros de licencia). Hay una skill «web media getter» (sickn33/agentic-awesome-skills) que cubre SFX reales CC.
- **Antes de instalar nada**: clonar en una carpeta aparte (no en `~/.claude/skills`), leer el código y los scripts de instalación, confirmar licencia (los efectos y la música deben ser CC0 o CC-BY con atribución anotada: checklist de `shorts.md`), y pedir permiso a David. Una skill instalada es código que se ejecuta con sus permisos.

## D. Decisiones de David
- ¿×1,2 o ×1,25? · ¿Música sintetizada o esperar a generada? · ¿Se mejora el motor para caminatas/multitudes? · ¿Se evalúan Earshot/Openverse/«Real SFX» ahora o tras publicar el 008?
