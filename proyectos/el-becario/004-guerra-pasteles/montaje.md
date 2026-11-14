# EXP 004 — Plan de montaje (leer esto al empezar la sesión)

Para arrancar: «Sigue con el EXPEDIENTE 004: lee `proyectos/el-becario/004-guerra-pasteles/montaje.md`».
Leer también, de la BIBLIA, solo «Densidad de humor y ritmo visual» y «Lecciones (no repetir)».

## Estado (14-nov-2026): FINAL v4 sin «Expediente 004» (voz 3,12–4,92 s fuera; `T()` en scenes.mjs; música --duck 0.35 gain 0.2 + quiet en remates; audio con oido.py, 0 ✗) → expedientes/. Antes (13-nov): FINAL APROBADO Y RENDERIZADO → expedientes/004-guerra-pasteles/ (publicar lun 16-nov; texto en publicacion.md)
- **v3:** Remontel en la proa con rodillo (el barco ya navega de proa), velas abombadas con vergas, caballo rehecho, cámara más cerca en calle/desfile/turba, contador DÍAS SIN COBRAR 220→221 (`PUB = '2026-11-16'` en scenes.mjs: **recalcular si cambia la fecha**) y pastel «NÓMINA DE NOVIEMBRE» en lugar de la cartera.
- **Preview v3:** `output/preview.mp4` (51,47 s, −14,7 LUFS, zona segura **pass**, 34 planos). NO hay render final: necesita aprobación de David.
- Voz: toma B ×1,04 + pausas recortadas (50,83 s). Original: `v1B.mp3`. Créditos ElevenLabs: 1.874 voz + 85 sfx (5 × 17).
- Personajes nuevos en `kit.mjs` (santaAnna con `peg: 'R'`, remontel, oficialMx 1/2, soldadoUS 1/2, turba 1/2/3, orador; sombreros bicorne/toque/shako/sombrero). Objetos en `props.mjs`. Hoja: `hoja-personajes-exp004.png`.
- SFX nuevos (ElevenLabs, flow «EXP 004 Guerra de los Pasteles - voz»): canon, corneta, cascos, candado, monedas. Reutilizados del 002/003: whoosh, drop, stamp, scratch, bum, crowd, crickets.
- Música: la marcha del 003 (familia «guerras ridículas») → `music-duck.wav` (`--duck 0.62 --boost 31.6-34.1`).
- QA: `node ../herramientas/hoja.mjs project.json hoja.png --w 200 --cols 7 [--at 0.15]`.

## Autocrítica (Claude, sin haberla oído: David tiene que escucharla)
v1 → 7,5/10. **v2 (arreglados 1, 2, 3 y 5: Santa Anna sorprendido entre el humo, manos tapando los ojos, tartas grandes, lágrimas) → ~8/10.** Lo que funciona: miniatura clara (Santa Anna grande + «LA GUERRA DE LOS PASTELES» + pastel), escalada de la pierna (honores → «A la pierna» → 2.º funeral → carroza/desfile/discursos en 3 golpes → cojín → turba → corcho → vitrina), re-gancho en 24 s, un cambio cada ~1,5 s, 11 golpes visuales, bucle pastelito → pastel.
Lo que bajaría nota / mirar con David:
1. Tramo 13-22 s (barco, cañón, humo) es el menos gracioso: el bicornio volando se lee como un pájaro.
2. «Se la amputan»: el Becario levanta las manos pero no se tapa los ojos del todo.
3. Oficiales con tartas (5-8 s): las tartas se ven pequeñas.
4. El caballo de la carroza es mejorable (cabeza rara) — sale 0,7 s.
5. Santa Anna llorando en el funeral: la expresión «agobiado» no se lee como llanto (faltan lágrimas).
6. SFX: comprobar de oído que el cañonazo (20,35), la corneta (27,72) y el candado (43,55) caen bien y que la música se oye (la voz ocupa el 97 % del tiempo).

## Publicación (borrador)
- Título YouTube: **La Guerra de los Pasteles (1838)** (32 car., «El dato», sin avisos). Alternativa: «Santa Anna enterró su pierna con honores».
- Portada TikTok/IG: **ENTERRÓ SU PIERNA** o **2 FUNERALES. 1 PIERNA**.
- Descripción: fuentes de `guion.md` + «Animación humorística basada en el relato más conocido; algunos momentos están dramatizados».
- Fecha: **lunes 16-nov** (programada por David).

## Personajes y objetos nuevos (kit.mjs) — hechos
- `santaAnna`: general mexicano años 1830, casaca azul con charreteras doradas, fajín, patillas, pelo oscuro peinado hacia delante. Variante con pata de palo/corcho y muleta.
- `remontel`: pastelero francés, gorro de cocinero, bigote fino, delantal.
- `pierna`: la protagonista. Pierna con bota de montar; versión con lazo/medalla. Cara NO (es un trozo de persona: nada de ojos).
- `piernaCorcho`: prótesis de corcho/madera con bota negra (la de Illinois).
- Atrezo: pastel, escaparate de pastelería, barco de vela francés con bandera, cañón (humo, sin heridos), ataúd pequeño, carroza con caballos, bandera, plato de pollo asado, vitrina de museo.
- Reutilizar: `becario`, `caseFolder`, `soldado` (oficiales y soldados de Illinois con otro color), `person` (turba), `office`, `desk`, `bubble`, `tag`, `slam`.

## Mapa visual (tiempos de words.json; un golpe cada 1,5-2,5 s)
| s | Frase | Plano y gag |
|---|---|---|
| 0,0-3,1 | «Santa Anna perdió una pierna por culpa de unos pasteles.» | **Miniatura:** Santa Anna grande (≥2/3), con muleta y pata de palo, mirando con odio un pastel con vela sobre una mesa. Etiqueta pequeña a un lado «MÉXICO, 1838» (`pop:false`). Se mueve antes de 0,5 s: el pastel tiembla / el general aprieta la muleta. |
| 3,1-5,0 | «Expediente cero cero cuatro.» | Archivo: carpeta EXPEDIENTE 004 cae sobre la mesa + sello. Becario con un pastelito en la mano, lo esconde. (≤2 s, sin autopresentación) |
| 5,0-7,9 | «Unos oficiales arrasan la pastelería de un francés.» | `whip` → escaparate «PÂTISSERIE» en Tacubaya: 2 oficiales salen con tartas en los brazos; Remontel detrás, gorro de cocinero, brazos arriba. Etiqueta «TACUBAYA». |
| 7,9-9,7 | «La tienda no valía ni mil pesos.» | Remontel junto a su tienda (pequeña, un cartelito de precio colgado «< 1.000 $»). |
| 9,7-13,4 | «Pide… espera, que lo leo bien… sesenta mil.» | Corte al Becario con la factura; acerca el papel a la cara (zoom), parpadea; slam rojo «60.000» con sacudida. |
| 13,4-15,7 | «Francia le apoya. [beat] Con barcos.» | Remontel con una banderita francesa → en el silencio, corte seco: barco de guerra francés enorme entra en cuadro (el mástil con bandera). |
| 15,7-17,8 | «Y ya puestos, pide seiscientos mil.» | Factura que se desenrolla hasta el suelo; contador 60.000 → 600.000 (cifra en rojo en el subtítulo). |
| 17,8-19,6 | «Santa Anna defiende Veracruz…» | Santa Anna a caballo / de pie en el muelle, sable en alto, pose heroica. Etiqueta «VERACRUZ, 1838». |
| 19,6-21,5 | «y un cañonazo le alcanza la pierna.» | Cañón del barco: ¡BUM! humo; cámara sacude; nube de humo tapa a Santa Anna (nada de heridas). |
| 21,5-22,4 | «Se la amputan.» | Corte a sierra de médico en silueta tras una cortina (sombra), «ñic»; nada explícito. O el Becario tapándose los ojos. |
| 22,4-24,3 | «México acaba aceptando pagar.» | Mesa de firmas: bolsa de dinero cruza de México a Francia; Remontel sonríe con pastel. Etiqueta «PAZ: MARZO 1839». |
| 24,3-25,9 | «Pero lo raro empieza ahora.» | **Re-gancho:** Becario se acerca a cámara, baja la voz (zoom lento, vignette). |
| 25,9-28,0 | «La entierra con honores militares.» | Ataúd pequeño con la pierna (solo la bota asomando), soldados en fila saludando, corneta. Santa Anna con muleta, pañuelo. |
| 28,0-28,8 | «[beat] A la pierna.» | Primer plano seco del ataúd con la bota → Becario mira a cámara. |
| 28,8-31,6 | «Años después, la desentierra para un segundo funeral:» | Pala, tierra que sale volando, Santa Anna levanta la caja feliz. Etiqueta «1842». |
| 31,6-34,1 | «carroza, desfile, discursos.» | 3 golpes rápidos (uno por palabra): carroza con caballos y la caja → desfile con banderas → señor en atril con bocadillo «…» y gente llorando. |
| 34,1-35,0 | «Para una pierna.» | Plano fijo: la pierna en un cojín de terciopelo, focos. |
| 35,0-39,5 | «Hasta que una turba enfadada con él… la desentierra otra vez y la pasea por la calle.» | Multitud con antorchas y carteles «¡FUERA SANTA ANNA!»; la pierna sale en volandas por la calle, cruza el cuadro. |
| 39,5-41,0 | «¿Y la de corcho?» | Becario saca de la caja del archivo una foto: pierna de corcho con bota negra. |
| 41,0-43,8 | «Se la quitaron los estadounidenses, dicen que mientras comía pollo.» | Santa Anna en una mesa con pollo asado, pierna de corcho apoyada en la silla; soldados de Illinois llegan; él huye a caballo/a saltitos; un soldado se lleva la pierna. Etiqueta «1847». (Guiño: el pollo del plato tiene cabeza.) |
| 43,8-45,1 | «Y no la devuelven.» | Vitrina de museo «ILLINOIS (EE. UU.)» con la pierna dentro, candado; un cartel «NO SE DEVUELVE». |
| 45,1-46,3 | «Expediente cerrado.» | Archivo: sello CERRADO. |
| 46,3-48,6 | «Esa pierna tuvo dos funerales.» | Becario sostiene foto de la pierna con dos coronas de flores. |
| 48,6-50,8 | «[suspiro] Yo no he tenido ni una nómina.» | Becario con la cartera vacía (`emptyWallet`), una mosca. **Bucle:** último plano vuelve al pastel con vela del primer fotograma. |

Chistes con golpe visual: 60.000 slam · barco en el silencio · factura que llega al suelo · re-gancho · ataúd mini · «A la pierna» · 3 golpes del funeral · cojín de terciopelo · turba · pollo con cabeza · vitrina con candado · cartera vacía.
