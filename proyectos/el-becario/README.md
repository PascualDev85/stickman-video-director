# El Becario · canal de Shorts

- `kit.mjs`: El Becario, el granjero, Mike y la caja del archivo, dibujados como capas vectoriales del motor B3 (sin efecto TV).
- Cada episodio en su carpeta: `scenes.mjs` genera `project.json` a partir de los tiempos reales de la narración.

Voz: MONTERO (ElevenLabs, eleven_v4, id rXI8ZNc3ZIKyGcQPbQMl) con acotaciones de actuación.

```bash
cd proyectos/el-becario/01-pollo-sin-cabeza
node scenes.mjs
node ../../../skills/directing-stickman-videos/scripts/autopilot.mjs preview project.json --seconds 58
```
