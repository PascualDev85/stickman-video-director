# Canal de perros — instrucciones para Claude Code

Canal de YouTube Shorts animados sobre ciencia, comportamiento e historia de los perros, narrado por **Layla y Dobby**, los dos perros reales de David (canal **LayBo**). Dueño: David (desarrollador, España). Se habla con David en español, directo y sin relleno.

## Dónde está todo
- Carpeta de trabajo (la que abre VS Code): `animados-monigote/canal-perros/`
  - `stickman-video-director/` → enlace al repo compartido con El Becario (rama **`shorts-es`**).
  - `expedientes/NNN-nombre/` → finales para publicar (mp4, portadas, .srt). Fuera del repo.
  - `branding/` → banner, perfil… Fuera del repo.
- Dentro del repo:
  - Motor: `skills/directing-stickman-videos/` (CLI `scripts/autopilot.mjs`, guía `references/shorts.md`, estilo B3 `references/b3-television.md`; perro de referencia en `assets/b3/accepted-dog*.{png,mp4}`).
  - Canal: `proyectos/canal-perros/` → **`BIBLIA.md` (leer siempre antes de producir)**.
  - Herramientas compartidas (no duplicar): `proyectos/el-becario/herramientas/` (`voz.py`, `crecimiento.py`, `ganchos.json`, `hoja.mjs`) y `proyectos/el-becario/lib.mjs` (planos, títulos, subtítulos karaoke). Kit de personajes del canal: `proyectos/canal-perros/kit.mjs` (Layla y Dobby; hoja: `node hoja-personajes.mjs`).
  - Un episodio = `proyectos/canal-perros/NNN-slug/` con la misma estructura que `el-becario/002-pollo-sin-cabeza/`.

## Cómo se hace un episodio
El mismo proceso que El Becario (ver `proyectos/el-becario/CLAUDE.md` y la sección «Producción» de su BIBLIA). Diferencias: narrador, voz, kit y reglas de tono de **esta** BIBLIA; fuentes científicas (estudio + año) en cada dato.

Comandos (desde `stickman-video-director/proyectos/canal-perros/NNN-slug/`):
```bash
E=../../../skills/directing-stickman-videos/scripts/autopilot.mjs
H=../../el-becario/herramientas
node scenes.mjs && node $E validate project.json
node $E tramo project.json --from A --to B
node $E preview project.json --seconds 60 --replace
```

## Reglas de David (no negociables)
- No tocar El Becario ni su carpeta. No crear otra skill, no sustituir el motor, no cambiar la estructura del repo sin permiso. Mejoras del motor buenas para los Shorts: se hacen (opcionales) y se le cuentan.
- No copiar guiones ni imágenes de otros canales: se toman **temas y hechos** (con sus fuentes primarias) y se cuentan de nuevo, mejor y más corto.
- Nunca pedir que pegue claves API. Su email es privado. No usar la cuenta de Apify conectada.
- Nada se publica solo: David sube los vídeos. Render final solo con su aprobación explícita.
- Commits terminan con la línea `Co-Authored-By` de Claude.

## Gastar pocos tokens
Una sesión por tarea. Lo aprendido va a la BIBLIA. Leer solo las secciones necesarias. QA con una hoja de fotogramas. `tramo` antes que `preview`. Respuestas cortas.
