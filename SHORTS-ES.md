# Fork: modo Shorts (vertical 9:16) en español

Rama `shorts-es` sobre `kaomei/stickman-video-director` (commit `eb4bb37`). Añade un modo Shorts al modo B (Autopilot) sin tocar los estilos ni el modo A. Los vídeos horizontales salen igual que antes.

## Qué cambia

| Problema en el original | Qué hace ahora |
|---|---|
| El vertical se componía como horizontal y los subtítulos quedaban bajo la interfaz de Shorts | Subtítulos al 68 % de la altura, tamaño de móvil y ancho ajustado a la columna segura |
| No había forma de saber si algo quedaba tapado | Revisión de zonas seguras en `validate`, en cada render (`preview-safezone.png`) y con el comando `safezone` |
| Los subtítulos estaban pensados para horizontal (hasta 8 palabras) | `captions --shorts`: de 2 a 5 palabras por subtítulo, con corte en las comas |
| La hoja de contacto deformaba los fotogramas verticales | La hoja de contacto sale en vertical |
| Volumen sin normalizar | Volumen del vídeo completo a −14 LUFS en dos pasadas, sin tocar el equilibrio entre voz y efectos |
| Proyectos nuevos en 1280×720 | `init --shorts` crea proyectos en 1080×1920 a 30 fps |
| Guion con cierre de "debate" y flujo de aprobación pensado para vídeos largos | `references/shorts.md`: ficha fija del canal, gancho en 1,5 s, final en bucle, presupuesto de palabras en español, aprobaciones por lotes y kit de publicación para Shorts |
| La petición de "clonar un canal" no tenía tratamiento | Se convierte en análisis de patrones más episodios originales (por la política de contenido no auténtico y el cambio de ranking de octubre de 2026) |

## Uso

```bash
cd skills/directing-stickman-videos && npm ci
node scripts/autopilot.mjs init /ruta/mi-short --style B1 --shorts
node scripts/autopilot.mjs captions palabras.json /ruta/mi-short/captions.json --shorts
node scripts/autopilot.mjs validate /ruta/mi-short/project.json   # incluye safezone.status
node scripts/autopilot.mjs preview  /ruta/mi-short/project.json --seconds 45
```

`examples/b1-shorts/project.json` reorganiza el ejemplo B1 original en vertical. Solo sirve para ver la maquetación: la narración es la original en inglés y los tiempos de los subtítulos son aproximados.

## Tests

`npm test` da 110 pruebas correctas: las 102 originales y 8 nuevas en `tests/shorts.test.mjs`.
