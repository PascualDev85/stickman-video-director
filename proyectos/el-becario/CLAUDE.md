# Historias Sin Cabeza — instrucciones para Claude Code

Canal de YouTube Shorts animados (@HistoriasSinCabeza) narrado por **El Becario**. Dueño: David (desarrollador, España). Se habla con David en español, directo y sin relleno.

## Dónde está todo
- Carpeta de trabajo (la que abre VS Code): `el-becario/`
  - `stickman-video-director/` → repo (fork `PascualDev85/stickman-video-director`, rama **`shorts-es`**).
  - `expedientes/NNN-nombre/` → finales para publicar (`EXPEDIENTE-NNN-FINAL.mp4`, portadas, .srt). Fuera del repo.
  - `branding/` → banner, perfil… Fuera del repo.
- Dentro del repo:
  - Motor: `skills/directing-stickman-videos/` (skill `directing-stickman-videos`, CLI `scripts/autopilot.mjs`, guía `references/shorts.md`).
  - Canal: `proyectos/el-becario/` → **`BIBLIA.md` (leer siempre antes de producir)**, `kit.mjs` (personajes), `lib.mjs` (planos, títulos, subtítulos karaoke…), `herramientas/voz.py` (voz), `herramientas/crecimiento.py` + `ganchos.json` (ganchos, títulos, retención, virales).
  - Un expediente = `proyectos/el-becario/NNN-slug/` con `scenes.mjs` (genera `project.json`), `narration.mp3`, `words.json`, `captions.json`, `mouth-env.json`, `music-duck.wav`, `sfx/`. Plantilla viva: `002-pollo-sin-cabeza/`.

## Cómo se hace un expediente (resumen; el detalle está en la BIBLIA)
1. Guion: 5 ganchos con fórmulas distintas de `ganchos.json` → `python3 herramientas/crecimiento.py gancho "…"` → David elige. 45-50 s, rigor histórico con fuentes, sin gore, español neutro, gag del sueldo una vez.
2. Voz (ElevenLabs, voz Montero `rXI8ZNc3ZIKyGcQPbQMl`, `eleven_v4`) → Scribe para tiempos → `voz.py words` → `voz.py silences` / `voz.py retime` (recortar/insertar SOLO en silencio real) → `voz.py mouth` → `voz.py caps words.json --skip N --max 20` → `voz.py musica music.mp3 words.json DUR --boost A-B`.
3. Escenas: copiar la estructura de `002-pollo-sin-cabeza/scenes.mjs` (planos con `shot()`, títulos `tag`/`slam` solo si aportan, karaoke con `captionTrack` + `burnCaptions: false`).
4. Comprobar barato: `node scenes.mjs` → `autopilot.mjs validate project.json` (zona segura **pass**) → `autopilot.mjs tramo project.json --from A --to B` para lo que cambie. Preview completa (`preview … --seconds 50 --replace`) solo para enseñar una versión a David.
5. Render final **solo con aprobación explícita de David** sobre la preview: `approve --note "…"` → `render --replace` → copiar `output/film.mp4` a `../../../expedientes/NNN-…/EXPEDIENTE-NNN-FINAL.mp4` (+ `.srt` y portada 3:4-safe).
6. Apuntar lo aprendido en la BIBLIA (lecciones), actualizar «Orden de episodios», commit y push a `shorts-es`.

Comandos (desde `stickman-video-director/proyectos/el-becario/NNN-slug/`):
```bash
E=../../../skills/directing-stickman-videos/scripts/autopilot.mjs
node scenes.mjs && node $E validate project.json
node $E tramo project.json --from 17.8 --to 21.8      # rápido, no aprobable
node $E preview project.json --seconds 50 --replace   # para que David la vea
```

## Reglas de David (no negociables)
- No crear otra skill que duplique la existente, no sustituir el motor, no rehacer lo que funciona, no cambiar la estructura del repo sin permiso. Mejoras del motor **buenas para los Shorts**: se hacen (opcionales, sin cambiar el comportamiento por defecto) y se le cuentan (qué, por qué, coste); las demás, se proponen.
- Nunca pedir que pegue claves API. Su email es privado: no publicarlo.
- No usar la cuenta de Apify conectada (es de su bot de Telegram).
- Nada se publica solo: David sube los vídeos.
- Commits terminan con la línea `Co-Authored-By` de Claude.

## Gastar pocos tokens
- Una sesión por tarea (un expediente, una mejora). Lo que se aprende va a la BIBLIA/herramientas, no a la conversación.
- Leer solo las secciones necesarias de la BIBLIA y de `scenes.mjs` (usar grep/offset), no archivos enteros grandes.
- QA visual con 1 hoja de fotogramas pequeña (no muchas imágenes sueltas); `tramo` antes que `preview`.
- No regenerar voz si basta con recortar o insertar silencios; Scribe para tiempos.
- Respuestas cortas: qué cambió y qué tiene que mirar David.
