# EXP 007 — El hwacha de Haengju (Corea, 1593)

Prueba del formato de @historiaslocasok (ver BIBLIA «Competencia directa»): gancho `accion-rara`, cuento con diálogos, porqué guardado para el giro, 60-70 s. Su vídeo del tema («82 hoyos contra un ejército», 465k) es un cuento inventado; el nuestro es la versión real.
Publicación: **lun 23-nov 20:00 ES**, contador **227**. Serie: 007 formato → 008 Blas de Lezo (mismo formato, tema nuestro) → 009 debut del Jefe (primera huelga, Deir el-Medina).

## Guion v2 (18-nov; mezcla con la propuesta de otra IA)

[tense] Metió cien flechas en un carro de madera. [beat] Y lo apuntó a treinta mil soldados.
Corea. Arriba de la colina, el general Gwon Yul con dos mil trescientos hombres. Algunos, monjes.
Abajo, los japoneses: más de diez a uno.
Un soldado mira el carro: «General, ¿eso es un arma… o un carro de la compra?»
«Que se acerquen.»
Y suben. Oleada tras oleada.
«¿Ahora, general?» [beat] «Ahora.»
Encienden la mecha. [beat] Son cohetes. Y salen las cien a la vez.
[deadpan] Cien. A la vez. La impresora del Archivo no saca ni dos hojas.
Vuelven a atacar. Una y otra vez. Hasta que a los coreanos se les acaban las flechas.
«General… se han acabado.» [beat] Y por el río aparecen barcos. Cargados de flechas.
Al anochecer, los japoneses se retiran.
Y cuentan que las mujeres subían piedras en el delantal… y que por eso el delantal se llama «haengju chima».
[beat] Precioso. Pero esa palabra ya sale en un libro de setenta y seis años antes. Y «haengju» es… [beat] el trapo de cocina.
[deadpan] Cien cohetes, treinta mil enemigos… y el invento que sigue sin funcionar es mi nómina. Doscientos veintisiete días sin cobrar.

Cambios v1→v2 (de la otra IA): «más de diez a uno», «Que se acerquen», «Encienden la mecha», «Vuelven a atacar. Una y otra vez», «cuentan que» (la ayuda de las mujeres puede ser cierta; lo falso es el origen del nombre), remate «el invento que sigue sin funcionar es mi nómina». Fuera «Cae herido hasta el comandante» (una sola fuente). No se toma: gancho de dato (la prueba es `accion-rara`), «Corea, 1593» hablado, «dos barcos con diez mil flechas» (cifras de una sola fuente), quitar el trapo de cocina (es el porqué del giro). Para quedar en ~70 s: fuera Seúl (dos frases), «Cada flecha lleva pólvora» y «en Corea».

## Guion v1 (18-nov; Montero, eleven_v4)

[tense] Metió cien flechas en un carro de madera. [beat] Y lo apuntó a treinta mil soldados.            <- A: ¿qué hace un carro contra 30.000?
Corea. Arriba de la colina, el general Gwon Yul con dos mil trescientos hombres. Algunos, monjes.      <- etiqueta «COREA, 1593» en imagen
Abajo, los japoneses, que ya tenían Seúl.
Un soldado mira el carro: «General, ¿eso es un arma… o un carro de la compra?»                          <- B: ¿qué es el carro? (recreación)
«Quietos. Que suban.»                                                                                    <- C: ¿cuándo dispara? (recreación)
Y suben. Oleada tras oleada.
«¿Ahora, general?» [beat] «Ahora.»                                                                       <- C se cierra
Mecha. [beat] Cada flecha lleva pólvora. Son cohetes. Y salen las cien a la vez.                         <- A y B se cierran
[deadpan] Cien. A la vez. La impresora del Archivo no saca ni dos hojas.
Cae herido hasta el comandante japonés. Pero a los coreanos se les acaban las flechas.                   <- D: ¿y ahora?
«General… no quedan.» [beat] Y por el río aparecen barcos. Cargados de flechas.                          <- D se cierra
Al anochecer, los japoneses se retiran. Dos meses después, abandonan Seúl.
Y la parte que todos cuentan: las mujeres subían piedras en el delantal, y por eso en Corea el delantal se llama «haengju chima».   <- E: giro
[beat] Precioso. Pero esa palabra ya sale en un libro de setenta y seis años antes. Y «haengju» es… [beat] el trapo de cocina.   <- «1517» en imagen; E se cierra
[deadpan] Las flechas, de verdad. Los delantales, leyenda. Y mi sueldo, también: doscientos veintisiete días sin cobrar.

Palabras: 191 → ≈80 s en bruto con Montero (2,4 pal/s) → ≈71 s con `voz.py ritmo … 1.12`.
Último fotograma / comentario fijado: **«¿Tú te creías lo del delantal?»**
Diálogos = recreación de cuento (como los bocadillos del 006): la narración no los atribuye como citas. Lo afirmado como hecho está en la tabla de fuentes.

### Bucles abiertos (hueco máx. ~8 s)
| t aprox. (final ×1,12) | Se abre | Se cierra |
|---|---|---|
| 0-4 s | A: un carro contra 30.000 | «Son cohetes» (~25 s) |
| 12-15 s | B: «¿un arma o un carro de la compra?» | «Son cohetes» |
| 15-22 s | C: «Quietos. Que suban» → ¿cuándo? | «Ahora» |
| 30-36 s | D: se acaban las flechas | barcos con flechas |
| 42-55 s | E: la leyenda del delantal | «76 años antes» |
| 55-69 s | remate + sueldo en la misma frase, corte al bucle | |

### Pase del «espectador que se aburre»
- Fuera: fecha hablada (va en etiqueta), Byeokjegwan/Ming, Ukita e Ishida por nombre, torre de asedio, cifra de 10.000 flechas (una sola fuente), número de oleadas (las fuentes no coinciden), bajas.
- Chistes / golpes: «Algunos, monjes» · «¿o un carro de la compra?» · «¿Ahora?… Ahora» · «Cien. A la vez» + impresora · barcos de flechas · «Precioso. Pero…» · flechas/delantales/sueldo. (7: formato cuento, menos chiste y más tensión; es parte de la prueba.)

## Fuentes (contrastado 18-nov)
| Dato | Fuentes |
|---|---|
| Haengju, 14-mar-1593 (12-feb lunar), Gwon Yul defiende una fortaleza en colina junto al río Han | Wikipedia «Battle of Haengju» · Korea Times (2020) · Warfare History Network |
| ~2.300 defensores, soldados y monjes guerreros (otras: 2.800-3.000) | Wikipedia · Warfare History Network |
| ~30.000 japoneses (cifra coreana; otras: >10.000) → descripción: «según las crónicas coreanas» | Wikipedia · Warfare History Network |
| Seúl en manos japonesas desde 1592; la abandonan en mayo de 1593 | Wikipedia «Imjin War» · Wikipedia «Battle of Haengju» |
| Hwacha: carro que lanza 100 singijeon (flechas con tubo de pólvora) | Wikipedia «Hwacha» y «Singijeon» · Weapons and Warfare |
| Gwon Yul atribuyó la victoria a los singijeon/hwacha | Wikipedia «Singijeon» · Wikipedia «Battle of Haengju» |
| Ukita Hideie (comandante) herido | Wikipedia · cavac (copia) → **buscar 2.ª fuente independiente** |
| Se quedan casi sin flechas; llegan barcos de suministro por el río | Wikipedia (Hawley, *The Imjin War*: I Bun) · Seoul Shinmun 24-abr-2023 (Jeong Geol, 79 años, comandante naval de Chungcheong, lleva las flechas en barco) · warhistory.org «The Assault on Haengju». Cifra (1 vs «decenas de miles») discrepa → sin número |
| «Haengju chima»: la palabra ya aparece en textos de 1517 y 1527 → la leyenda es posterior | Wikipedia «Battle of Haengju» · Encyclopedia of Korean Culture (encykorea.aks.ac.kr/Article/E0062862) · Instituto Nacional de la Lengua Coreana (korean.go.kr, «어원 탐구» 2006) · Hangyo (2026). Sasŏng t'onghae de Choe Sejin = 1517. «Haengju» = trapo de cocina; coincide en sonido con el castillo (幸州) |

## Voz (18-nov)
- ElevenLabs flow `CGfX4YemO8KHgnjJ7jhy` (2 tomas × 1.213 créditos = 2.426; Scribe 0). Montero, eleven_v4. Escrito para la voz: «Guon Yul», «jéngchu chima» (en subtítulos poner «Gwon Yul» y «haengju chima»).
- Toma A `v1A.mp3` 70,88 s · toma B `v1B.mp3` 71,36 s (≈2,7 pal/s, más rápido que el 006) → con ×1,12 ≈ 63 s. Tiempos: `scribe-A.json`, `scribe-B.json`.
- `comparar-AB.mp3` (85 s): 6 frases clave, pitido 1 = A, pitido 2 = B: gancho · carro de la compra · ¿Ahora? Ahora · Cien a la vez + impresora · delantal + trapo de cocina · remate y sueldo. Elige David.
