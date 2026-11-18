# EXP 006 — Plan de montaje (leer esto al empezar la sesión)
Para arrancar: «Sigue con el EXPEDIENTE 006: lee `proyectos/el-becario/006-guerra-cerdo/montaje.md`».

## Estado (17-nov-2026): **PREVIEW v2 lista** (autocrítica aplicada, ver abajo). Antes: PREVIEW v1 → `output/preview.mp4` (47,2 s, −14,9 LUFS, zona segura **pass**, 21 planos). NO hay render final: falta el «aprobado» de David.
- Guion v2 (`guion.md`, 119 palabras). Voz: toma A ×1,06 + 7 pausas recortadas + 0,35 s insertados tras «tiro.» (10,42) para el disparo = 46,71 s. Toma B en `v1B.mp3` (sin usar).
- Cast nuevo en `kit.mjs`: `almirante`, `kaiser` (sombrero `picos`, sin símbolos), `casaca(1|2)`. Reutilizados: granjero, soldadoUS, ingles, becario. Objetos en `props.mjs` (cerdo, huerto, billete, banderas, barco, lápida, laudo, mapa NO con geografía real `mapaNO` + `mapCam` + `pin`).
- Motor/`lib.mjs`: nuevo `move.*` (pan, tilt, dolly, travelling, orbit, crane, handheld, zoom) para `camF`. Opcional, no cambia nada de lo anterior.
- Contador: `PUB = '2026-11-21'` → 225. **Recalcular si cambia la fecha.**
- Música: la del 005 (`music.mp3`) → `music-duck.wav` (`--duck 0.35 --quiet 44.2-47.2`, gain 0.2).
- oido.py: 0 problemas; ⚠ falsos (Scribe desplaza bordes) en canon/whoosh/stamp; ⚠ a escuchar con cascos: posibles chasquidos en 21,49 y 34,99, salto en la mezcla 24,35; música poco audible en pausas.
- QA: `node ../herramientas/hoja.mjs project.json hoja.png --w 200 --cols 7 --at 0.2`.

## Reglas nuevas 006 cumplidas
Sin «Expediente NNN» tras el gancho · 47 s (≈119 palabras; Montero ~2,4 pal/s → 120 palabras = 50 s, no 43) · gancho con movimiento <0,5 s · bucles abiertos marcados (guion.md) · pase del aburrido · remate + gag del sueldo en la misma frase · pregunta en el comentario fijado · gestos en todos los personajes (nod, laugh, hop, flinch, gestures) · mapa con geografía real · música `--duck 0.35` + oido.py.

## Autocrítica v1 (~7/10)
Funciona: gancho claro (dos ejércitos + cerdo), el mapa con las dos banderas, la lápida del cerdo, el Becario en ventanita.
Mirar con David: (1) miniatura: soldados pequeños y mucho cielo; (2) cerdo muerto detrás de los subtítulos en varios planos; (3) campamentos del «AÑO n» algo apretados; (4) disparo sobre la pausa insertada (10,3 s); (5) mapa: la ventana de la frontera 49.º se ve poco; (6) cifra del gancho «más de dos mil hombres» (fuentes discrepan).

## v2 (17-nov, autocrítica «tiene que salir de 10»)
- Miniatura: horizonte en 700 (menos cielo), dos filas por bando con fusil al hombro, barcos al fondo, cerdo ×1,45, título 140 px arriba.
- Pies de todos los personajes en y ≤ 1690 (`FT`): nada queda detrás de los subtítulos. El cerdo muerto, con patas largas hacia arriba y ojos en X.
- 26 planos (antes 21), ninguno > ~3 s: + cerdo que se cuela en el huerto (1859), «¡MIS PATATAS!» (leyenda), primer plano del cerdo engullendo (las patatas desaparecen), Gettysburg en sepia, «armados y sin un tiro» con dos centinelas, «Bajas: cero» / lápida separados, carteles VALOR (cerdo 100 $ / Becario 0 $).
- Mapa: paralelo 49 grueso + las DOS fronteras reclamadas que se dibujan (Haro = EE. UU., azul; Rosario = R. U., rojo) y la isla en medio. Rótulo «UN TRATADO CON DOS LECTURAS».
- Años: día/noche que pasan + AÑO 1 → 12. Campamentos en los extremos con poste fronterizo.
- Coherencia: quitado el humo de cañón de los barcos (nunca hubo tiros). Granjero apunta en horizontal; estrellitas tras el PAM.
- Audio: gruñido de cerdo (ElevenLabs SFX, 2 × 17 créditos, `sfx/oink.wav` recortado a 0,39 s) en la pausa del gancho y tras «cero.»; música +3 dB (`music-loud.wav`) con `--quiet 34.4-35.6` para que no tape «tiro.» y `--quiet 44.2-47.2`. oido.py: 0 ✗; −15,0 LUFS; música −14,5 dB bajo la voz.
