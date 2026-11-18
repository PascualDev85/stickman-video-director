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
