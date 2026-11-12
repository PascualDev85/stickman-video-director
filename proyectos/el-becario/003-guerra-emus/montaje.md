# EXP 003 — Plan de montaje (leer esto al empezar la sesión)

Para arrancar: «Sigue con el EXPEDIENTE 003: lee `proyectos/el-becario/003-guerra-emus/montaje.md`».
Leer también, solo estas secciones de la BIBLIA: «Densidad de humor y ritmo visual» y «Lecciones (no repetir)».

## Estado (12-nov-2026)
- `scenes.mjs` montado según el mapa (29 planos, END 51,75), `validate` = pass, preview v1 en `output/preview.mp4` → **pendiente de que David la vea**.
- SFX `rafaga`, `clic`, `motor`, `bum`, `impresora` son **provisionales sintetizados con ffmpeg**: sustituir por ElevenLabs con el mismo nombre en `sfx/` (no hay que tocar `scenes.mjs`). Música: falta (el proyecto la añade sola cuando exista `music-duck.wav`).
- QA: `node ../herramientas/hoja.mjs project.json hoja.png` (un fotograma por plano; `--from/--to`, `--at`, `--w`).

## Lo que ya está hecho (no repetir, no regenerar voz)
- Guion v3 aprobado (en `guion.md`). Voz = toma B v3 + «¿¡Al ejército!?» (variante 1) empalmado + pausas +0,3 s («Diez.» y «tanques») + **0,5 s para la ráfaga** tras «Disparan…».
- `narration.mp3` = **51,25 s**. `words.json` (números en cifras), `captions.json` (karaoke), `mouth-env.json`: al día con ese audio.
- Si se toca el audio otra vez: `voz.py retime` (actualiza words y scenes) → `voz.py mouth` → `voz.py caps words.json --skip 0 --max 20`.
- Kit (`../kit.mjs`): `emu()`, `mayor()`, `soldado(1|2)`, `lewisGun()`, `truck()`. Hoja: `node sheet.mjs` → `hoja-personajes-exp003.png` (revisada: todo se reconoce).
- Créditos ElevenLabs gastados en el 003: ~4.000.

## Personajes (kit.mjs)
| Función | Opciones útiles |
|---|---|
| `emu({x, y, scale, flip, run:{dur,period}, idle:{dur}, peck:[t], eye:'normal'|'grande', lookout, move, angle})` | Origen entre las patas, mira a la derecha (`flip:true` → izquierda). `eye:'grande'` = sorpresa/vigía; `lookout` = cuello estirado. |
| `mayor({…person})` / `soldado(1|2, {…person})` | Mismo rig que `becario` (expr, look, walk, idle, gestures, talk). Uniforme caqui + sombrero australiano. Mayor con bigote de morsa. |
| `lewisGun({x, y, scale, flip, firing:[t0,t1], jamAt})` | Fogonazos mientras `firing`; `jamAt` = humo que sube. |
| `truck({x, y, scale, flip, bump: dur, cargo: [capas]})` | `bump` = botes + ruedas girando. Meter soldado+Lewis en `cargo`. |
| Ya existentes | `becario`, `caseFolder({label:'EXPEDIENTE 003', stamp})`, `archiveBox`, `office()`, `desk()`, `emptyWallet()`, `bubble()`, `tag()`, `slam()`, `speedLines()`, `flash()`, `shake()`, `rays()`, `cloud()`, `captionTrack()` |
- Pendiente menor: `soldado(2)` con `expr:'nervioso'` → el bigote pisa la boca (usar `serio` o quitar bigote).
- Nada encima del personaje que forme «cara»; personajes dentro del camión, no encima (lección 002).

## Mapa de planos (tiempos reales de `captions.json`; un cambio cada 1,5-2,5 s)
| s | Voz | Plano / gag | SFX (solo en huecos) |
|---|---|---|---|
| 0,0-1,7 | «En 1932,» | **Fotograma 1 = miniatura**: trigal amarillo, emú enorme (scale ~1,5) a la derecha con mirada de funcionario; a la izquierda soldado pequeño apuntándole con la Lewis. `tag('AUSTRALIA · 1932', …, {pop:false})` pequeño arriba a un lado | — |
| 1,7-3,1 | «Australia le declaró la guerra» | Slam rojo «¡GUERRA!» + sacudida | whoosh antes |
| 3,1-4,0 | «a los emús.» | El emú gira la cabeza a cámara (zoom rápido) | — |
| 4,0-5,1 | «Y no la ganó.» | El emú picotea el sombrero del soldado → sale volando | boing en 5,1 |
| 5,15-7,0 | «Expediente 003.» | Carpeta cae + sello (estándar) | drop + stamp |
| 7,0-8,7 | «20.000 emús se comen el trigo,» | Plano general: fila/oleada de emús picoteando; contador «20.000» | — |
| 8,7-11,8 | «y el gobierno manda… espera, que lo leo bien…» | Becario en la oficina con un papel; se lo acerca (zoom lento) | — |
| 11,85-13,3 | «¿¡Al ejército!?» | Corte a primer plano Becario `sorpresa`, zoom brusco + sacudida + flash + slam «¿AL EJÉRCITO?» | scratch justo antes (11,6) |
| 13,3-14,0 | «Un mayor,» | El mayor entra marchando, saluda | — |
| 14,0-14,9 | «dos ametralladoras» | Dos Lewis caen con golpe | golpe en hueco |
| 14,9-16,25 | «y 10.000 balas.» | Caja de munición + contador 0→10.000; bocadillo del mayor «Pan comido.» | — |
| 16,26-18,8 | «Contra un pájaro… que no sabe volar.» | Emú solo intenta aletear, salta un poco y cae sentado | grillos cortos en la pausa (~17,3) |
| 18,8-20,4 | «Primera emboscada. Disparan…» | Estanque con emús bebiendo; soldados tras un arbusto; la Lewis asoma | — |
| **20,42-21,40** | (silencio) | **Ráfaga**: `lewisGun({firing})` + fogonazos + sacudida | ráfaga de ametralladora (ver SFX) |
| 21,4-23,15 | «y la ametralladora se atasca.» | `jamAt` humo + slam «¡CLIC!»; emús levantan la cabeza; bocadillo de un emú «¿Ya?» | clic en el hueco |
| 23,16-24,7 | «Como la impresora del Archivo.» | Corte 1,5 s: impresora del Archivo echando humo, Becario dándole golpes | — |
| 24,7-27,1 | «Se reparten en grupitos, con vigía y todo.» | Vista desde arriba: grupos que se separan; vigía con `lookout` y `eye:'grande'` (prismáticos opcional) | — |
| 27,1-29,2 | «Más organizados que mi departamento.» | Corte a la oficina: Becario entre montañas de papeles, cajas cayendo | — |
| 29,2-31,3 | «Montan la ametralladora en un camión.» | `truck({bump})` con soldado + Lewis en la caja, líneas de velocidad | motor |
| 31,3-32,8 | «Spoiler: los emús corren más.» | Los emús adelantan al camión tranquilamente (`run`), uno mira atrás | whoosh |
| 32,8-37,8 | «El mayor presume: 986 emús, con 9.860 balas.» | Mayor orgulloso con medalla; dos contadores (emús 986 / balas 9.860) | registradora al terminar |
| 37,8-39,4 | «Diez balas por emú.» | Slam «10 BALAS POR EMÚ» | — |
| 39,4-40,3 | «Diez.» | Zoom a la cara del Becario, silencio | — |
| 40,3-43,7 | «Y encima dice que aguantan balas… como tanques.» | Emús con casco/blindaje marchando en formación (recreación cómica) | — |
| 43,7-45,5 | «¿Y el resto? Siguen ahí.» | Zoom out: horizonte lleno de emús comiendo trigo = **mismo encuadre que el fotograma 1** (bucle) | — |
| 45,5-46,9 | «Expediente cerrado.» | Archivo: sello CERRADO sobre la carpeta | stamp |
| 46,9-51,25 | «A ellos les mandaron 10.000 balas. A mí, ni un sueldo.» | `emptyWallet()` del Becario (polilla); por la ventana asoma un emú mirándole (enlaza con el inicio) | — |
Bocadillos = «diálogo» mudo; nunca repiten el subtítulo. Títulos de arriba ~10 como mucho.

## Audio pendiente
- **Música** (familia «guerras ridículas», reutilizable en 004 y 006): marcha militar cómica con caja y tuba, ~55 s, sin voz. Después `voz.py musica music.mp3 words.json 51.25` (boost opcional en la ráfaga y el camión). Gain 0,17.
- **SFX nuevos** (ElevenLabs, en `sfx/`): ráfaga de ametralladora antigua (~0,9 s, para 20,42-21,40), clic metálico de atasco, motor de camión antiguo con botes, «bum» grave de emú (el sonido real que hacen), impresora atascada. Copiar de `../002-pollo-sin-cabeza/sfx/` los reutilizables: whoosh, stamp, drop, boing, crickets, scratch, register.
- Reglas: ningún efecto encima de una palabra; ganancia máx. 1; ambientes ≤0,2; whoosh ≤0,25.

## Comandos
```bash
cd proyectos/el-becario/003-guerra-emus
E=../../../skills/directing-stickman-videos/scripts/autopilot.mjs
node scenes.mjs && node $E validate project.json          # zona segura: pass
node $E tramo project.json --from 18.8 --to 23.2           # revisar un tramo
node $E preview project.json --seconds 52 --replace        # para David
```
`scenes.mjs`: copiar la estructura de `../002-pollo-sin-cabeza/scenes.mjs` (shot(), tag/slam, captionTrack + burnCaptions:false, captionSize 76). QA con una sola hoja de fotogramas pequeña.

## Publicación (cuando esté aprobado)
- Título con las palabras que se buscan: «La guerra de los emús» + número/fecha (≤40 caracteres). Probar con `crecimiento.py titulo`.
- Descripción con emojis + fuentes (Britannica, Australian Geographic, Wikipedia) + aviso de dramatización.
- Etiquetas: episodio primero (guerra de los emús, Emu War, Great Emu War, Australia 1932, emús) + fijas.
- Comentario fijado: pregunta sobre el 004 (Guerra de los Pasteles).
