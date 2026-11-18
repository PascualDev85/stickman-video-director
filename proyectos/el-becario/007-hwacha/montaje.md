# EXP 007 — montaje (18-nov)

- Voz: toma B entera (71,36 s, sin recortes). Final a ×1,12 con `voz.py ritmo` → 64,2 s.
- 39 planos (ninguno > 3 s salvo 1,4-3,2 s), portada `thumbCard` (rayos rojos, Gwon Yul pícaro + hwacha, «100 FLECHAS / CONTRA 30.000»), bucle al final.
- Personajes nuevos en kit.mjs: gwonYul, soldadoKr(1|2), monje(1|2), ashigaru(1|2), samurai, coreana(1|2) (sombreros jeonrip/jingasa/kabuto, `lames`, `beard`, `bald`). Objetos en `props.mjs` (hwacha con carga y mecha animadas, andanada `volley`, empalizada, nobori, barca, caja, libro, trapo).
- La fuente no tiene hangul: nada de 행주치마 en pantalla (salían cuadrados) → «HAENGJU CHIMA».
- Música: la del 003 (guerra cómica) → `music-duck.wav` `--duck 0.35` con `--quiet` 21.1-22.5 · 34.6-35.4 · 58.3-59.3 · 68.4-71.86.
- Motor: preview/tramo tenían tope de 60 s → variable opcional `PREVIEW_MAX=90` (autopilot.mjs + autopilot-core.mjs); sin ella todo igual.
  `PREVIEW_MAX=90 node $E preview project.json --seconds 72 --replace`
- QA: validate 0 problemas · safezone pass · −14,8 LUFS · oido.py: 2 ✗ falsos («se» 21,36 y «antes.» 58,84: voz 18 dB y 2 dB sobre la música medida a mano; «antes.» es la cola de la palabra).

## v2 (18-nov, autocrítica)
- Portada nueva: el hwacha DISPARA en el fotograma 0 (abanico de 16 cohetes con estela, fogonazo, humo), japoneses aterrados abajo a la derecha, Gwon Yul pícaro enorme; título «100 COHETES / CONTRA 30.000».
- Bocadillos a 72 px (antes 50-56: no se leían en el móvil).
- «Son cohetes»: hwacha más grande en el centro, fogonazo y andanada que se ve salir.
- Velocidad: `preview-x1.12.mp4` (64,2 s, 2,9 pal/s) y `preview-x1.2.mp4` (59,9 s, 3,2 pal/s; @historiaslocasok ~3,5).

## v3 (18-nov, autocrítica 2)
- Ladera menos repetida: «Y suben» = empalizada de cerca con 3 escaleras y ashigaru trepando; «Vuelven a atacar» = 3 viñetas que entran (OLEADA / OTRA / Y OTRA). Lanzas (yari) en la mitad de los ashigaru.
- Cifras en los subtítulos (rojas): words.json con números fusionados (100, 30.000, 2.300, 10 a 1, 76, 227); original en `words-letras.json`. Bloques de subtítulo de < 0,45 s re-cortados.
- Chistes visuales en el tramo 36-46 s sin chistes: viñetas, araña que baja a la caja vacía, «ENVÍO URGENTE» en la barca.
- Ojo: `validate` sin `--seconds` no detectó dos errores del árbol B3 que sí rompían la preview (rect de alto 0 y anidación > 8). Tras cambiar planos, lanzar la preview (o `validate --seconds N`).
- v3b: tramo 40-49 s (final 34-41 s): ventanita del Becario agobiado en «se han acabado» (con golpe de zoom y sacudida en el general) y contento diciendo adiós en la retirada; samurái con miedo; zoom tras «barcos.» con vítores (crowd 0,14). Bucle comprobado: el último fotograma = portada (solo cambia el giro de los rayos).
