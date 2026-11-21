// EXPEDIENTE 008 — «Blas de Lezo en Cartagena de Indias» (Historias Sin Cabeza). Short 9:16, ~59 s (final a ×1,2 ≈ 49 s).
// Guion v2 (18-nov-2026), toma A de ElevenLabs sin recortar. Tiempos = words.json (Scribe).
// v2 (21-nov): los personajes del siglo XVIII NO mueven los labios (narra el Becario); el Becario narra en ventanita
// (con boca sincronizada) y reacciona; planos ≤ 2,6 s, fondos variados, portada y bucle, gags.
// Publica: miércoles 25-nov-2026 · contador 229 (PUB/DAYS).
import fs from 'node:fs';
import {execSync} from 'node:child_process';
import {becario, almirante, casaca, soldadoDe, lezo, vernon, E, R, G, P, S, deg, INK, PAPER, ctext, sign} from '../kit.mjs';
import {GROUND, RED, YEL, tag, captionTrack, layout, fill, band, lin, mix, r3, eOut, eInOut, eBack, shake, sample, camF, cam, slam, popIn, flash, rays, office, emptyWallet, move, makeEpisode, F} from '../lib.mjs';
import {ukFlag, humo, asta} from '../006-guerra-cerdo/props.mjs';
import {mar, mar2, agua, barcoX, fuerte, tumba, medalla, plan, sudor, cabina, ciudad, bigBen, escalera, grietas, trofeo, lupa, esFlag, bala, columna, cortina, foco, caja, chorro, confeti, destellos, medallaGira, pila, prensa} from './props.mjs';

const {WORDS, shots, shot, mouth} = makeEpisode('words.json');
layout.titleDY = 0;
const VOICE = Number(execSync('ffprobe -v error -show_entries format=duration -of csv=p=0 narration.mp3').toString()), END = r3(VOICE + 0.28); // VOICE = duración real de narration.mp3
// ANCLAJES: los planos se anclan a palabras (Scribe) → al cambiar la voz o la toma, todo se reajusta solo.
const norm = w => w.toLowerCase().replace(/[^\p{L}\d]/gu, '');
const E_ = (w, n = 1) => { let c = 0; for (const x of WORDS) if (norm(x.text) === w && ++c === n) return x.end; throw new Error('ancla no encontrada: ' + w + '#' + n); };
const T = (w, n = 1) => { let c = 0; for (const x of WORDS) if (norm(x.text) === w && ++c === n) return x.start; throw new Error('ancla no encontrada: ' + w + '#' + n); };
const DAYS = 229; // contador «DÍAS SIN COBRAR» (PUB = mié 25-nov-2026)
const NAVY = '#1f3a6e';
const FY = GROUND + 120; // pies de los personajes
const sh = (a, b, f) => shot(a, b, d => f(d, a, b));

// ---------- utilidades ----------
const cubierta = () => [band(GROUND + 80, 900, '#9a6a3c'), band(GROUND + 80, 10, '#5a3a1e'), ...[0, 1, 2, 3].map(i => P([['M', 100 + i * 330, GROUND + 160], ['L', 260 + i * 330, GROUND + 160]], {stroke: '#7d5229', lineWidth: 6}))];
const tierra = (c = '#b5a07a') => [band(GROUND + 80, 900, c), band(GROUND + 80, 10, '#6b5a3a')];
const noche = d => [fill('#141a36'), band(820, 400, '#1f2650'), ...[[120, 520], [300, 620], [520, 480], [760, 600], [880, 470], [1180, 560], [420, 760]].map(([x, y], i) => E(x, y, 10, 10, {fill: '#fff6c8', stroke: 'none', keys: sample(t => ({alpha: 0.65 + 0.35 * Math.sin(t * (1.4 + i * 0.2))}), 0, d)})), E(1040, 380, 130, 130, {fill: '#f4f1d0', lineWidth: 8})];
const counter = (n, o = {}) => G([R(-210, -46, 420, 92, {radius: 10, fill: '#fff6d6', stroke: RED, lineWidth: 8}), ctext(`DÍAS SIN COBRAR: ${n}`, 0, -30, 40, {maxW: 380, color: RED})], o);
const fila = (fn, n, x0, dx, y, s, extra = () => ({})) => Array.from({length: n}, (_, i) => fn(i, {x: x0 + i * dx, y: y + (i % 2) * 14, scale: s, ...extra(i)}));
const clamp = v => Math.max(0, Math.min(1, v));
/** Trayecto: de x0 a x1 (y escala s0→s1) entre t0 y t1. Para `move` de los personajes (valores absolutos). */
const go = (d, x0, x1, {t0 = 0, t1 = d, y = FY, s0, s1 = s0, e = eInOut} = {}) => sample(t => { const u = e(clamp((t - t0) / (t1 - t0))); return {x: mix(x0, x1, u), y, ...(s0 !== undefined ? {s: mix(s0, s1, u)} : {})}; }, 0, d);
/** Va y viene entre xa y xb (nervioso/paseando). */
const pace = (d, xa, xb, per = 1.6, {y = FY, s} = {}) => sample(t => ({x: mix(xa, xb, (1 - Math.cos(2 * Math.PI * t / per)) / 2), y, ...(s !== undefined ? {s} : {})}), 0, d);
/** Entra corriendo desde x0 hasta x1 (tIn s) y luego se agita cerca de x1. */
const runIn = (d, x0, x1, tIn = 0.8, amp = 40, per = 0.9, {y = FY} = {}) => sample(t => ({x: t < tIn ? mix(x0, x1, eOut(t / tIn)) : x1 + amp * Math.sin((t - tIn) * 2 * Math.PI / per), y}), 0, d);
/** Saltitos de alegría. */
const hop = (d, x, amp = 38, f = 6.5, {y = FY} = {}) => sample(t => ({x, y: y - amp * Math.abs(Math.sin(t * f))}), 0, d);
/** Anillo de salpicadura en el agua. */
const ring = (x, y, t0, d, w = 160) => G([E(0, 0, w, w * 0.3, {fill: 'none', stroke: PAPER, lineWidth: 8})], {x, y, from: r3(t0), to: r3(Math.min(d, t0 + 0.9)), keys: sample(t => ({s: mix(0.3, 2.2, (t - t0) / 0.9), alpha: 1 - (t - t0) / 0.9}), r3(t0), r3(Math.min(d, t0 + 0.9)))});
/** Chispas que suben (barco en llamas). */
const chispas = (x, y, d, n = 9) => Array.from({length: n}, (_, i) => G([E(0, 0, 14, 14, {fill: i % 2 ? '#ffb02e' : '#ff6a1f', stroke: 'none'})], {x, y, keys: sample(t => { const u = ((t * 0.9 + i * 0.37) % 1); return {x: x - 160 + i * 40 + Math.sin(t * 6 + i) * 24, y: y - u * 520, alpha: 1 - u}; }, 0, d)}));
/** Tropa en formación con perspectiva: filas del fondo (pequeñas) al frente (grandes); cada soldado marcha y rebota; banderas entre las filas. */
const tropa = (d, {who = 'casaca', rows = 3, perRow = 8, s0 = 0.3, ds = 0.1, y0 = FY - 300, dy = 90, dx = 150, drift = 0, bob = 12, period = 0.5, flags = [], flag = 'uk'} = {}) =>
  Array.from({length: rows}, (_, r) => { const s = s0 + r * ds, y = y0 + r * dy, x0 = 70 + (r % 2) * 60 + r * 14;
    return Array.from({length: perRow}, (_, i) => { const x = x0 + i * dx * (1 + r * 0.1), n = 1 + ((i + r) % 2), mk = who === 'casaca' ? casaca : soldadoDe, withFlag = flags.includes(i) && r === rows - 2;
      const far = r < rows - 1 && rows >= 4; // filas del fondo: solo busto (el árbol B3 admite ~30 figuras completas por plano)
      return G([mk(n, {x: 0, y: far ? 380 * s : 0, scale: s, expr: r % 2 ? 'serio' : 'nervioso', bust: far, ...(far ? {idle: {dur: d}} : {walk: {dur: d, period, stride: 14}})}), ...(withFlag ? [asta(flag === 'uk' ? ukFlag({}, 120) : esFlag({}, 120), {x: 70 * s * 2, y: 0, h: 1050 * s, dur: d})] : [])],
        {x, y, keys: sample(t => ({x: x + drift * t, y: y - bob * (0.4 + 0.5 * r) * Math.abs(Math.sin(Math.PI * (t / period + i * 0.17)))}), 0, d)}); }); }).flat();
const WALK = (d, period = 0.6, stride = 20) => ({dur: d, period, stride});
const LIMP = d => ({dur: d, period: 0.95, stride: 13}); // Lezo cojea: pata de palo (peg 'L') y paso lento
const punch = f => t => { const v = f(t); return {...v, s: (v.s ?? 1) * (t < 0.16 ? 1 + 0.05 * (1 - t / 0.16) : 1)}; };
/** Cámaras: empuje con golpe, panorámica, grúa, mano, órbita. */
const C = {
  dolly: (d, a = 1.0, b = 1.22) => punch(move.dolly(d, a, b)),
  pan: (d, dx, s = 1.1) => punch(move.pan(d, dx, s)),
  trav: (d, dx, s = 1.12) => punch(move.travelling(d, dx, s)),
  crane: (d, dy = 300, a = 1.0, b = 1.2) => punch(move.crane(d, dy, a, b)),
  hand: (d, amp = 8, s = 1.08) => punch(move.handheld(d, amp, s)),
  orbit: (d, amp = 80, roll = 2.5, s = 1.12) => punch(move.orbit(d, amp, roll, s)),
  hdolly: (d, a = 1.0, b = 1.22, amp = 7) => punch(t => { const h = move.handheld(d, amp, 1)(t); return {...h, s: mix(a, b, eInOut(t / d))}; }),
};
const pop = (layer, x, y, t0, d, until) => G([popIn(layer, t0, d, 0.22, until)], {x, y, ...(until ? {from: t0, to: until} : {})}); // pop-in centrado en (x, y)
/** Cabeceo en los instantes ts (reacción de los personajes: ellos NO hablan, narra el Becario). */
const nod = (d, ts, amp = 6) => [{t: 0, angle: 0}, ...ts.filter(t => t + 0.2 < d).flatMap(t => [{t: r3(t), angle: deg(amp)}, {t: r3(t + 0.2), angle: 0}])];
/** Becario en ventanita, narrando con la boca sincronizada (voz de [a, b]) y reaccionando. */
const becCam = (t0, d, expr, a, b, {x = 200, y = 720, look = 1, s: sc = 1} = {}) => G([R(-170, -235, 340, 470, {radius: 24, fill: '#e8e2d0', lineWidth: 10}), R(-120, -200, 110, 150, {radius: 4, fill: '#c9d6e3', lineWidth: 6}),
  becario({x: 0, y: 440, scale: 0.85, expr, look, bust: true, idle: {dur: d}, talk: mouth(a, b), headKeys: [{t: 0, angle: 0}, {t: r3(t0 + 0.25), angle: 0}, {t: r3(t0 + 0.4), angle: deg(-6 * look)}, {t: d, angle: deg(-6 * look)}]}),
  R(-170, 150, 340, 85, {radius: 0, fill: '#8a6a4a', lineWidth: 8}), R(-170, -235, 340, 470, {radius: 24, fill: 'none', lineWidth: 12})],
{x, y, from: r3(t0), keys: sample(t => ({s: sc * mix(0.3, 1, eBack((t - t0) / 0.2)), a: -3}), r3(t0), d)});

// Gancho / portada: rayos DORADOS, 6 barcos contra un bosque de barcos, Lezo pícaro y Vernon sonriendo (el primer fotograma es la miniatura; luego todo se mueve).
const thumbCard = d => [...rays(d, '#f0a500', '#ffd84a', 640, 1250, 14, 16), band(1180, 1400, '#2f7fb5'), band(1180, 14, '#1d567e'),
  G([0, 1, 2].flatMap(r => Array.from({length: 6}, (_, i) => barcoX({x: 560 + i * 120 + (r % 2) * 50, y: 1240 + r * 90, scale: 0.27, flag: 'uk', flip: true, dur: d}))), {keys: lin(d, 0, -160, 'x')}),
  ...Array.from({length: 6}, (_, i) => barcoX({x: 560 + (i % 3) * 95 + (i > 2 ? 40 : 0), y: 1480 + (i > 2 ? 90 : 0), scale: 0.3, flag: 'es', dur: d})),
  lezo({x: 300, y: 2080, scale: 1.55, bust: true, expr: 'picaro', look: 1, idle: {dur: d}, headKeys: nod(d, [0.5, 1.1, 1.8], 7)}), vernon({x: 1000, y: 2080, scale: 1.25, bust: true, expr: 'contento', look: -1, idle: {dur: d}, headKeys: nod(d, [0.3, 0.8, 1.3, 1.9], -6)})];
const thumbTitle = () => { const line = (text, y, size, color) => ({...ctext(text, 600, y, size, {maxW: 880, color}), outline: INK, outlineWidth: 22});
  return G([G([tag('HISTORIA REAL · 1741', 330, 46, {pop: false, color: RED, tilt: -2})], {x: -40}), G([line('SEIS BARCOS', 440, 160, PAPER), line('CONTRA +100', 620, 140, RED)], {angle: deg(-3)})]); };

// ================= PLANOS =================
// 0–1.35 · «Seis barcos…» — portada viva: la flota avanza, cañonazo, cámara en mano que se cierra
sh(0, T('más'), d => [camF(thumbCard(d), d, C.hdolly(d, 1.0, 1.3, 9), 640, 1300), pop(ctext('6', 0, -100, 220, {color: YEL}), 690, 1330, 0.24, d), flash(1.0, 0.12, '#ffffff', 0.55), thumbTitle()]);
// 1.35–2.57 · «…contra más de cien.» — Lezo cojea hacia su flotilla; la flota inglesa lo llena todo
sh(T('más'), T('hundan'), d => [flash(0.72, 0.1, '#ffffff', 0.5), camF([...mar(d, {sky: '#f6d9a8'}), G([0, 1, 2].flatMap(r => Array.from({length: 5}, (_, i) => barcoX({x: 520 + i * 150 + (r % 2) * 60, y: 1050 + r * 80, scale: 0.4, flag: 'uk', flip: true, dur: d}))), {keys: lin(d, 0, -120, 'x')}),
  ...Array.from({length: 6}, (_, i) => barcoX({x: 90 + i * 70, y: 1230 + (i % 2) * 20, scale: 0.26, flag: 'es', dur: d})), ...tierra('#9a6a3c'),
  lezo({x: 200, y: FY, scale: 1.1, expr: 'serio', walk: LIMP(d), peg: 'L', move: go(d, 160, 480, {s0: 1.1, s1: 1.2})}), pop(ctext('+100', 0, -100, 150, {color: PAPER}), 830, 800, 0.2, d)], d, C.crane(d, 220, 1.05, 1.22), 640, 1100)]);
// 2.57–3.99 · «¡Hundan los nuestros!» — Lezo se echa encima de la cámara cojeando y ordena
sh(T('hundan'), T('perdón'), (d, a, b) => [camF([...mar(d, {sky: '#f6d9a8'}), ...fila((i, o) => barcoX({...o, flag: 'es', dur: d}), 3, 280, 330, 1130, 0.32), ...cubierta(),
  lezo({x: 1000, y: FY + 30, scale: 1.2, expr: 'serio', walk: LIMP(d), peg: 'L', move: go(d, 1000, 700, {y: FY + 30, s0: 1.2, s1: 1.7, e: eOut})}), flash(0, 0.1, '#ffffff', 0.7)],
d, C.hdolly(d, 1.05, 1.22, 12), 640, 1000), becCam(0.45, d, 'sorpresa', a, b)]);
// 3.99–6.27 · «¿Perdón, almirante? ¿Los nuestros?» — camarote: el oficial se agita; Lezo cojea por la estancia
sh(T('perdón'), T('en'), d => [camF([...cabina(d),
  almirante({x: 560, y: FY, scale: 1.2, expr: 'sorpresa', look: 1, walk: WALK(d, 0.42, 16), move: pace(d, 360, 620, 1.5)}), lezo({x: 960, y: FY, scale: 1.2, expr: 'serio', look: -1, walk: LIMP(d), peg: 'L', move: pace(d, 940, 1060, 2.4)}),
  pop(ctext('?', 0, -90, 150, {color: RED}), 520, 520, 0.5, d), pop(ctext('?', 0, -90, 110, {color: RED}), 640, 470, 1.2, d), sudor(500, 700, 0.8)], d, C.orbit(d, 90, 2.5, 1.1), 640, 1000)]);
// «En la entrada de la bahía. Que les estorben.» — horizonte bajo, barcos grandes que se hunden, Lezo recorre el muelle
sh(T('en'), T('se'), d => [camF([...mar2(d, {hy: 1150}), ...fila((i, o) => barcoX({...o, flag: 'es', dur: d, sink: {t0: 1.0 + i * 0.3, len: 1.0, depth: 190, tilt: 0.25 * (i % 2 ? -1 : 1)}}), 3, 330, 330, 1200, 0.85),
  ...agua(1235), ring(330, 1250, 1.5, d, 240), ring(990, 1250, 2.0, d, 240), ...tierra('#9a6a3c'), lezo({x: 110, y: FY, scale: 1.1, expr: 'serio', walk: LIMP(d), peg: 'L', move: go(d, 110, 400, {s0: 1.1})})], d, C.trav(d, 200, 1.08), 640, 1000),
  slam('HUNDIRSE VOLUNTARIAMENTE', 600, 480, 42, 1.4, d, {stamp: true, color: RED, tilt: -4, maxW: 700})]);
// 8.89–10.6 · «Se llama Blas de Lezo.» — Lezo cojea hacia nosotros y se planta
sh(T('se'), T('cojo'), d => [camF([...rays(d, '#cfe3f7', '#e6f1fb', 640, 1100, 12, 12), lezo({x: 640, y: FY + 40, scale: 1.0, expr: 'serio', walk: LIMP(d), peg: 'L', move: go(d, 640, 640, {y: FY + 40, s0: 1.0, s1: 1.55, e: eOut})})], d, t => ({...C.dolly(d, 1.0, 1.12)(t), a: Math.sin(t * 3) * 0.6}), 640, 900), tag('BLAS DE LEZO', 357, 80)]);
// 10.6–12.4 · «Cojo, tuerto y manco.»
sh(T('cojo'), T('unos'), d => [camF([...rays(d, '#cfe3f7', '#e6f1fb', 640, 1100, 12, 12), lezo({x: 640, y: FY + 40, scale: 1.35, expr: 'serio', idle: {dur: d}, peg: 'L', headKeys: nod(d, [0.1, 0.65, 1.2], 8)}),
  pop(sign('COJO', -150, -55, 300, 110, {size: 70, color: RED}), 450, 1555, 0.05, d), pop(sign('TUERTO', -180, -55, 360, 110, {size: 70, color: RED}), 860, 640, 0.62, d), pop(sign('MANCO', -155, -55, 310, 110, {size: 70, color: RED}), 330, 980, 1.18, d)], d, C.hand(d, 9, 1.08), 640, 1000)]);
// «Unos cuatro mil hombres.» — tropa en formación con banderas, cámara baja que acompaña
sh(T('unos'), T('delante'), d => [camF([fill('#e8dcc0'), band(1010, 600, '#d9cfae'), ...tierra(), ...tropa(d, {who: 'soldadoDe', rows: 3, perRow: 7, s0: 0.36, ds: 0.12, y0: FY - 150, dy: 70, dx: 160, drift: -50, bob: 14, flags: [3], flag: 'es'})], d,
  t => ({...C.trav(d, 260, 1.12)(t), a: 1.4 * Math.sin(t * 2.4)}), 640, 1100), slam('UNOS 4.000', 600, 640, 130, 0.1, d, {color: NAVY, outline: true, maxW: 820})]);
// «Delante, Vernon,» — Vernon se pavonea hacia la cámara delante de su ejército
sh(T('delante'), T('veinte'), d => [camF([fill('#e8dcc0'), ...tierra('#a89a6a'), ...tropa(d, {who: 'casaca', rows: 3, perRow: 8, s0: 0.26, ds: 0.07, y0: FY - 280, dy: 80, dx: 150, drift: -60, bob: 10, flags: [2, 5], flag: 'uk'}),
  vernon({x: 400, y: FY + 40, scale: 1.0, expr: 'picaro', walk: WALK(d, 0.55, 20), move: go(d, 400, 700, {y: FY + 40, s0: 1.0, s1: 1.45, e: eOut})})], d, C.dolly(d, 1.0, 1.15), 640, 1000), tag('ALMIRANTE VERNON', 357, 76)]);
// «veinte mil.» — la cámara sube y descubre el ejército entero
sh(T('veinte'), T('y', 2), d => [camF([fill('#e8dcc0'), ...tierra('#a89a6a'), ...tropa(d, {who: 'casaca', rows: 5, perRow: 8, s0: 0.22, ds: 0.075, y0: FY - 400, dy: 95, dx: 150, drift: -80, bob: 9, flags: [1, 4, 7], flag: 'uk'}),
  vernon({x: 1100, y: FY + 60, scale: 0.95, expr: 'contento', walk: WALK(d, 0.55, 20), move: go(d, 1100, 880, {y: FY + 60, s0: 0.95})})], d, C.crane(d, 110, 1.1, 1.22), 640, 1000), slam('+ 20.000', 600, 620, 130, 0.1, d, {color: RED, outline: true})]);
// «Y un secreto en Londres.» — bucle abierto: Londres de noche, Vernon se pasea con aire de conspirador (se resuelve en las medallas)
sh(T('y', 2), T('dos'), d => [camF([fill('#1f2a44'), ...[[120, 520], [320, 640], [560, 480], [800, 600], [1180, 540]].map(([x, y]) => E(x, y, 10, 10, {fill: '#fff6c8', stroke: 'none'})), bigBen({x: 1020, y: 1330, scaleX: 1.5, scaleY: 1.5}), ...tierra('#2a3350'),
  vernon({x: 300, y: FY, scale: 1.1, expr: 'picaro', walk: WALK(d, 0.6, 18), move: go(d, 300, 640, {s0: 1.1, s1: 1.3})}),
  pop(G([R(-110, -70, 220, 140, {radius: 8, fill: '#f2e3bf', lineWidth: 8}), P([['M', -110, -70], ['L', 0, 10], ['L', 110, -70]], {lineWidth: 7}), E(0, 10, 44, 44, {fill: RED, lineWidth: 6})]), 860, 900, 0.35, d),
  pop(ctext('?', 0, -90, 150, {color: PAPER}), 400, 640, 0.5, d), pop(ctext('?', 0, -90, 110, {color: PAPER}), 560, 560, 0.7, d)], d, C.orbit(d, 90, 2.5, 1.12), 640, 1000), tag('EL SECRETO DE VERNON… AL FINAL', 357, 46, {t0: 0.2, color: RED}), slam('CONFIDENCIAL', 600, 470, 70, 0.55, d, {color: RED, stamp: true, tilt: -5, maxW: 760})]);
// «Dos barcos se hunden en Bocachica.» — batalla de verdad: el fuerte y la flota inglesa se cañonean, balas, columnas de agua y barcos que se van a pique
sh(T('dos'), T('otro'), d => [camF([...mar2(d, {hy: 1170}), G([fuerte({scaleX: 0.95, scaleY: 0.95})], {x: 170, y: 1290}), ...[0, 1, 2, 3].map(i => humo(330 + i * 70, 1000 - i * 30, 0.15 + i * 0.45, d)),
  G([0, 1, 2].map(i => barcoX({x: 1420 - i * 330, y: 1120 + (i % 2) * 36, scale: 0.6, flag: 'uk', flip: true, dur: d})), {keys: lin(d, 0, -120, 'x')}),
  barcoX({x: 560, y: 1250, scale: 0.95, flag: 'es', dur: d, sink: {t0: 0.7, len: 1.1, depth: 270, tilt: -0.3}}), barcoX({x: 980, y: 1250, scale: 0.95, flag: 'es', dur: d, sink: {t0: 1.0, len: 1.1, depth: 270, tilt: 0.3}}), ...agua(1290),
  bala(1100, 880, 560, 1230, 0.2, 0.6, d), bala(1050, 900, 980, 1230, 0.55, 0.6, d), bala(330, 960, 900, 930, 0.4, 0.7, d, 380), bala(330, 980, 1000, 960, 1.0, 0.7, d, 380),
  columna(560, 1280, 0.8, d), columna(980, 1280, 1.15, d), ring(560, 1290, 0.8, d, 260), ring(980, 1290, 1.15, d, 260), flash(0.2, 0.08, '#ffffff', 0.4), flash(0.55, 0.08, '#ffffff', 0.4), flash(1.0, 0.08, '#ffffff', 0.45)],
  d, C.hdolly(d, 1.0, 1.22, 11), 640, 1000), tag('BOCACHICA', 357, 84)]);
// 18.5–19.85 · «Otro lo queman.»
sh(T('otro'), T('y', 3), d => [camF([...mar(d, {sky: '#f2c9a0'}), barcoX({x: 640, y: 1150, scale: 1.25, flag: 'es', dur: d, fire: true}), ...chispas(640, 900, d), humo(560, 760, 0.1, d), humo(760, 700, 0.5, d), ...agua(1170)], d, C.hdolly(d, 1.0, 1.28, 16), 640, 1000)]);
// 19.85–21.82 · «Y los ingleses entran igual.» — travelling con la flota; Vernon se pasea con aire de dueño
sh(T('y', 3), T('almirante', 2), d => [camF([...mar(d), G([0, 1, 2].map(i => barcoX({x: 1500 - i * 420, y: 1100 + (i % 2) * 40, scale: 0.7, flag: 'uk', flip: true, dur: d})), {keys: lin(d, 0, -1500, 'x')}),
  barcoX({x: 260, y: 1210, scale: 0.4, flag: 'es', dur: d, sink: {t0: 0, len: 0.01, depth: 230, tilt: 0.2}}), ...agua(1170),
  vernon({x: 1250, y: FY + 60, scale: 1.0, expr: 'picaro', walk: WALK(d, 0.55, 20), move: go(d, 1250, 760, {y: FY + 60, s0: 1.0, s1: 1.1})}), slam('ENTRADA LIBRE', 600, 700, 66, 0.9, d, {color: RED, stamp: true, tilt: -4})], d, C.trav(d, -240, 1.1), 640, 1000)]);
// 21.83–23.86 · «Almirante, han pasado.» — el oficial entra corriendo; barcos ingleses ENORMES al fondo
sh(T('almirante', 2), T('ya'), (d, a, b) => [camF([...mar(d), ...fila((i, o) => barcoX({...o, flag: 'uk', flip: true, dur: d}), 3, 200, 440, 1040, 1.0), ...cubierta(),
  almirante({x: 720, y: FY, scale: 1.15, expr: 'miedo', look: 1, walk: WALK(d, 0.4, 18), move: runIn(d, -150, 720, 0.7, 40, 0.8)}), lezo({x: 1040, y: FY, scale: 1.15, expr: 'serio', look: -1, idle: {dur: d}, peg: 'L', headKeys: nod(d, [1.0], 6)}), sudor(680, 680, 0.9)], d, C.hand(d, 9, 1.1), 640, 1000), becCam(0.3, d, 'agobiado', a, b, {y: 1270})]);
// 23.87–24.76 · «Ya lo veo.»
sh(T('ya'), T('el'), d => [camF([...rays(d, '#e9e2cf', '#f4efe4', 640, 1100, 10, 12), lezo({x: 640, y: FY + 40, scale: 1.45, expr: 'sarcastico', idle: {dur: d}, peg: 'L', headKeys: nod(d, [0.4], 8)})], d, t => ({s: mix(1.0, 1.15, eOut(t / d)), a: -1.5 * t}), 640, 900)]);
// 24.76–26.61 · «El plan tenía letra pequeña.»
sh(T('el'), T('aun'), d => [camF([fill('#e9e2cf'), G([plan({})], {x: 640, y: 1000, scaleX: 1.2, scaleY: 1.2}), G([lupa({})], {x: 700, y: 1180, from: 0.9, keys: sample(t => ({s: mix(0.05, 1, eBack((t - 0.9) / 0.2))}), 0.9, d)})
  ], d, t => ({s: mix(1.0, 1.3, eInOut(t / d)), a: 2 * Math.sin(t * 2.2)}), 640, 1100), slam('LETRA PEQUEÑA', 600, 560, 70, 1.0, d, {color: RED, stamp: true, tilt: -4, maxW: 760})]);
// 26.61–28.25 · «Aun así, resiste.» — Lezo cojea por la muralla, desafiante
sh(T('aun'), T('una'), d => [camF([...ciudad(d), ...tierra('#c9b48a'), fuerte({x: 330, y: GROUND + 60, scaleX: 1.1, scaleY: 1.1}), lezo({x: 1150, y: FY, scale: 1.2, expr: 'serio', walk: LIMP(d), peg: 'L', move: go(d, 1150, 800, {s0: 1.2})})], d, C.trav(d, 220, 1.1), 640, 1000)]);
// 28.25–30.17 · «Una madrugada, los ingleses asaltan» — noche: marchan hacia el fuerte
sh(T('una'), T('san'), d => [camF([...noche(d), ...tierra('#3a3a52'), fuerte({x: 640, y: GROUND + 60, scaleX: 1.2, scaleY: 1.2}),
  G(fila((i, o) => casaca(1 + (i % 2), {...o, expr: 'nervioso', walk: WALK(d, 0.5, 14)}), 5, 150, 250, FY + 30, 0.5), {keys: lin(d, -260, 0, 'x')})], d, C.crane(d, -220, 1.0, 1.15), 640, 1100), tag('MADRUGADA', 357, 70, {t0: 0.2})]);
// 30.17–31.82 · «el fuerte de San Felipe» — las escaleras son demasiado cortas (gag)
sh(T('san'), T('y', 4), d => [camF([...noche(d), ...tierra('#3a3a52'), fuerte({x: 640, y: GROUND + 60, scaleX: 1.2, scaleY: 1.2}),
  G([escalera({}, 220)], {x: 450, y: GROUND + 60, angle: deg(8)}), G([escalera({}, 220)], {x: 830, y: GROUND + 60, angle: deg(-8)}),
  casaca(1, {x: 440, y: GROUND + 40 - 180, scale: 0.38, expr: 'nervioso', walk: WALK(d, 0.35, 10)}), casaca(2, {x: 840, y: GROUND + 40 - 180, scale: 0.38, expr: 'miedo', walk: WALK(d, 0.35, 10)}),
  pop(lezo({x: 0, y: 160, scale: 0.55, bust: true, expr: 'sarcastico', idle: {dur: d}}), 640, 1010, 0.4, d), pop(sign('ESCALERA 3 m', -190, -50, 380, 100, {size: 58, color: RED}), 330, 960, 0.15, d), pop(sign('MURO 5 m', -150, -50, 300, 100, {size: 58, color: RED}), 930, 960, 0.3, d)], d, C.hdolly(d, 1.15, 1.0, 9), 640, 1100), tag('SAN FELIPE', 357, 76)]);
// 31.82–32.65 · «y fracasan.»
sh(T('y', 4), T('seiscientas'), d => [camF([...noche(d), ...tierra('#3a3a52'), fuerte({x: 640, y: GROUND + 60, scaleX: 1.2, scaleY: 1.2}),
  ...Array.from({length: 4}, (_, i) => G([casaca(1 + (i % 2), {x: 0, y: 0, scale: 0.85, expr: 'miedo'})], {x: 200 + i * 280, y: FY - 40, keys: sample(t => ({a: (i % 2 ? -1 : 1) * 85 * eOut(t / (0.3 + i * 0.05))}), 0, d)})), slam('FRACASAN', 600, 700, 130, 0.04, d, {color: RED, stamp: true, outline: true, tilt: -4}), flash(0, 0.1, PAPER, 0.7)], d, t => ({...C.hand(d, 26, 1.1)(t), a: Math.sin(t * 30) * 1.2 * Math.max(0, 1 - t / 0.6)}), 640, 1000)]);
// 32.65–34.4 · «Unas seiscientas bajas.»
sh(T('seiscientas'), T('llega'), d => [camF([fill('#e8dcc0'), ...tierra('#a89a6a'), ...fila((i, o) => tumba({x: o.x, y: o.y + 100, scaleX: 1.2, scaleY: 1.2}), 5, 160, 240, 1150), slam('600 BAJAS', 600, 640, 160, 0.9, d, {color: RED, outline: true})], d, move.tilt(d, -240, 1.1), 640, 1000)]);
// 34.41–36.57 · «Pasan las semanas, llega la fiebre»
sh(T('llega'), T('mueren'), d => [camF([fill('#dfe9d2'), ...tierra('#a89a6a'), casaca(1, {x: 640, y: FY, scale: 1.3, expr: 'agobiado', walk: WALK(d, 1.1, 8), move: pace(d, 560, 720, 2.2)}), sudor(520, 560, 0.05),
  pop(sign('FIEBRE', -200, -60, 400, 120, {size: 80, color: '#2e6b4a'}), 640, 1160, 0.3, d)], d, t => ({...C.dolly(d, 1.0, 1.15)(t), a: 2.2 * Math.sin(t * 3)}), 640, 1000), tag('PASAN LAS SEMANAS', 357, 66)]);
// 36.57–38.23 · «mueren miles de ingleses»
sh(T('mueren'), T('tras'), d => [camF([fill('#cfd6dc'), ...tierra('#8f9aa6'), ...[0, 1, 2, 3, 4, 5].map(i => pop(tumba({x: 0, y: 0, scaleX: 1.1, scaleY: 1.1}), 130 + i * 200, 1250 + (i % 2) * 110, 0.1 + i * 0.18, d))], d, C.crane(d, -260, 1.0, 1.12), 640, 1000), tag('MUEREN MILES', 357, 80)]);
// 38.23–40.69 · «Después de más de dos meses, se van.» — la cámara acompaña a la flota; Lezo se despide
sh(T('tras'), T('entonces'), d => [camF([...ciudad(d), G([0, 1, 2].map(i => barcoX({x: 700 - i * 380, y: 1120 + (i % 2) * 40, scale: 0.5, flag: 'uk', dur: d})), {keys: lin(d, 0, 1100, 'x')}), ...agua(1170), ...tierra('#c9b48a'),
  lezo({x: 300, y: FY, scale: 0.9, expr: 'contento', idle: {dur: d}, peg: 'L', gestures: [{t0: 0.5, t1: d - 0.05, arm: 'R', shoulder: 170, elbow: 20}], headKeys: nod(d, [0.7, 1.3, 1.9], 6)})], d, C.pan(d, 300, 1.1), 640, 1000), slam('+ 2 MESES', 600, 650, 120, 0.2, d, {color: NAVY, outline: true})]);
// 40.69–42.71 · «Entonces, ¿hemos ganado?» — el oficial salta de alegría; Lezo cojea hacia él con cara de «no»
sh(T('entonces'), T('espera'), (d, a, b) => [camF([...ciudad(d), ...tierra('#c9b48a'), almirante({x: 560, y: FY, scale: 1.2, expr: 'contento', look: 1, idle: {dur: d}, move: hop(d, 560)}),
  lezo({x: 1100, y: FY, scale: 1.2, expr: 'sarcastico', look: -1, walk: LIMP(d), peg: 'L', move: go(d, 1100, 880, {s0: 1.2})}), pop(sign('¡VICTORIA!', -190, -60, 380, 120, {size: 76, color: '#2e6b4a'}), 640, 720, 0.4, d)], d, C.orbit(d, 80, 2.5, 1.1), 640, 1000), becCam(0.9, d, 'picaro', a, b)]);
// «Espera.» — el Becario lo anuncia
sh(T('espera'), T('mira'), (d, a, b) => [camF([...office(d), bigBen({x: 1000, y: 1060}), becario({x: 640, y: FY, scale: 1.25, expr: 'picaro', look: 0, idle: {dur: d}, talk: mouth(a, b), gestures: [{t0: 0.1, t1: d - 0.05, arm: 'R', shoulder: 120, elbow: 10}]})], d, C.dolly(d, 1.0, 1.2), 640, 1000), tag('¿EL SECRETO?', 357, 84)]);
// «Mira el secreto de Vernon.» — redoble: el telón se abre y la caja de medallas estalla
sh(T('mira'), T('medallas'), d => [camF([fill('#150d1f'), foco(), caja({x: 640, y: 1420, s: 1.7, t0: r3(d - 0.22), d}), ...cortina(d, r3(d - 0.95), 0.55), pop(ctext('?', 0, -90, 260, {color: PAPER}), 640, 700, 0.25, d, r3(d - 0.95))],
  d, t => { const k = t / d; return {s: 1.0 + 0.16 * k * k, x: Math.sin(t * 57) * 14 * k * k, y: Math.cos(t * 43) * 10 * k * k, a: Math.sin(t * 37) * 1.3 * k * k}; }, 640, 1000), tag('EL SECRETO DE VERNON', 357, 62), flash(r3(d - 0.2), 0.18, '#ffffff', 0.95)]);
// «Medallas.» — la medalla gira, llueven medallas y confeti
sh(T('medallas'), T('vernon', 3), d => [camF([...rays(d, '#fff1b5', '#ffe36b', 640, 1000, 18, 14), ...confeti(d, {n: 70}), G([medalla({})], {x: 640, y: 1000, keys: sample(t => { const sc = mix(0.2, 1.5, eOut(t / 0.35)); return {sx: sc * (0.12 + 0.88 * Math.abs(Math.cos(t * 7))), sy: sc}; }, 0, d)}),
  ...chorro(640, 1250, 0, d), ...destellos([[420, 780, 0.15], [880, 760, 0.3, 1.2], [500, 1250, 0.45], [860, 1220, 0.55]], d)], d, C.hdolly(d, 1.0, 1.2, 10), 640, 1000), slam('¡VERNON HA GANADO!', 590, 450, 60, 0.25, d, {color: RED, stamp: true, outline: true, tilt: -4, maxW: 760})]);
// «Vernon, de pie,» — entramos en la medalla
sh(T('vernon', 3), T('rodillas'), d => [camF([...rays(d, '#fff1b5', '#ffe36b', 640, 1000, 14, 14), ...confeti(d, {n: 50, speed: 0.8}), G([medalla({})], {x: 640, y: 1000}), ...destellos([[500, 900, 0.5], [760, 1100, 0.9], [640, 820, 1.3]], d)],
  d, t => ({s: mix(1.0, 2.2, eInOut(t / d)), x: mix(0, 220, eInOut(t / d)), a: 1.5 * Math.sin(t * 2)}), 640, 1000)]);
// «y Lezo, de rodillas, entregándole la espada.»
sh(T('rodillas'), T('las'), (d, a, b) => [camF([...rays(d, '#fff1b5', '#ffe36b', 640, 1000, 14, 14), ...confeti(d, {n: 40, speed: 0.8}), G([medalla({})], {x: 640, y: 1000}), ...destellos([[900, 1080, 1.0], [700, 880, 1.6]], d)],
  d, t => ({s: mix(2.2, 2.6, t / d), x: mix(220, -260, eInOut(t / d))}), 640, 1000), slam('¿PERO QUÉ…?', 600, 560, 88, 1.6, d, {color: RED, stamp: true, outline: true, tilt: 3, maxW: 700}), becCam(1.4, d, 'sorpresa', a, b, {x: 200, y: 1150})]);
// «Las acuñaron antes de ganar.» — la cámara se aleja y descubre la MONTAÑA de medallas y la prensa que sigue acuñando
sh(T('las'), T('y', 6), d => [camF([...rays(d, '#fff1b5', '#ffe36b', 640, 1000, 14, 14), G([pila({})], {x: 640, y: 1560}), prensa(d, {x: 230, y: 1300, scaleX: 0.9, scaleY: 0.9}), G([medalla({})], {x: 640, y: 780, scaleX: 0.55, scaleY: 0.55}),
  ...destellos([[420, 1180, 0.4], [860, 1240, 0.8], [640, 1100, 1.2]], d)], d, t => ({s: mix(2.4, 0.95, eOut(t / d)), y: mix(-200, 0, eOut(t / d))}), 640, 1000), slam('ANTES DE GANAR', 600, 400, 72, 0.9, d, {color: NAVY, stamp: true, outline: true, tilt: -4})]);
// «Y no ganaron.» — la medalla se agrieta, cae la ceniza y llega el trombón triste
sh(T('y', 6), T('una', 2), (d, a, b) => [camF([...rays(d, '#fff1b5', '#ffe36b', 640, 1000, 14, 14), G([pila({})], {x: 640, y: 1560}), ...confeti(d, {n: 40, colors: ['#9aa3ab', '#6b7a8a', '#c9ced3'], speed: 0.7}),
  G([medalla({}), grietas({})], {x: 640, y: 820, scaleX: 1.0, scaleY: 1.0, keys: sample(t => ({a: t > 0.1 ? Math.sin(t * 40) * 0.04 * Math.max(0, 1 - t / 0.5) : 0}), 0, d)})], d, C.hand(d, 18, 1.08), 640, 1000),
  slam('NO GANARON', 600, 1500, 96, 0.05, d, {color: RED, stamp: true, outline: true, tilt: 4}), flash(0, 0.12, PAPER, 0.6), becCam(0.5, d, 'sarcastico', a, b)]);
// 53.99–56.61 · «Una victoria imaginaria, como mi nómina.»
sh(T('una', 2), T('doscientos'), (d, a, b) => [camF([...office(d), pop(G([E(0, 0, 360, 260, {fill: PAPER, lineWidth: 8}), trofeo({y: 20, scaleX: 1.1, scaleY: 1.1})]), 380, 620, 0.2, d),
  becario({x: 700, y: FY, scale: 1.25, expr: 'cansado', look: 0, idle: {dur: d}, talk: mouth(a, b), headKeys: [{t: 0, angle: deg(4)}, {t: 1.6, angle: deg(8)}, {t: d, angle: deg(8)}]})], d, C.pan(d, -160, 1.1), 640, 1000)]);
// 56.61–59.12 · «Doscientos veintinueve días sin cobrar.»
sh(T('doscientos'), VOICE, (d, a, b) => [camF([...office(d), counter(DAYS, {x: 640, y: 480, scaleX: 1.6, scaleY: 1.6}), emptyWallet(930, 1060, 0.3, d, 1.1),
  becario({x: 480, y: FY, scale: 1.25, expr: 'cansado', look: 1, idle: {dur: d}, talk: mouth(a, b), headKeys: [{t: 0, angle: deg(4)}, {t: d, angle: deg(-4)}]})], d, C.dolly(d, 1.0, 1.2), 640, 1000)]);
// Bucle: vuelve al primer fotograma (la portada).
sh(VOICE, END, d => [camF(thumbCard(d), d, t => ({s: mix(1.1, 1.0, eOut(t / 0.2))}), 640, 1300), flash(0, 0.12, PAPER, 0.8), thumbTitle()]);

// Planos contiguos: el hueco de 0,01 s entre palabras se absorbe en el plano anterior.
for (let i = 1; i < shots.length; i++) shots[i - 1].end = shots[i].start;

// Subtítulos karaoke (motor: burnCaptions false; exporta el .srt)
const captions = JSON.parse(fs.readFileSync('captions.json', 'utf8'));
const cap = captionTrack(WORDS, captions);
for (const s of shots) s.layers.push(...cap(s.start, s.end));
// Efectos anclados a las palabras. REGLA (oido.py): nunca encima de una palabra → whoosh un instante ANTES del corte; golpes en el hueco DESPUÉS de la palabra.
const sfx = [...shots.slice(1, -1).map(x => F(r3(x.start - 0.14), 'whoosh', 0.14)),
  F(2.06, 'canon', 0.3, 0.45), F(r3(E_('cojo') + 0.02), 'boing', 0.2, 0.28), F(r3(E_('manco') + 0.02), 'boing', 0.2, 0.28), F(r3(E_('bocachica') + 0.03), 'drop', 0.3, 0.28), F(r3(E_('queman') + 0.03), 'puf', 0.25, 0.28), F(r3(E_('igual') + 0.03), 'boing', 0.25, 0.28),
  F(r3(E_('pequeña') + 0.03), 'scratch', 0.25, 0.28), F(r3(E_('felipe') + 0.05), 'canon', 0.22, 0.35), F(r3(E_('fracasan') + 0.03), 'boing', 0.3, 0.28), F(r3(E_('bajas') + 0.03), 'drop', 0.16, 0.2), F(r3(E_('ingleses', 2) + 0.03), 'drop', 0.1, 0.2),
  F(r3(E_('entonces') + 0.03), 'crowd', 0.08, 0.28), F(r3(E_('medallas') + 0.03), 'impresora', 0.5, 0.28), F(r3(E_('medallas') + 0.03), 'subboom', 0.45, 1.0), F(r3(E_('espada') + 0.03), 'boing', 0.3, 0.28), F(r3(E_('ganar') + 0.03), 'drop', 0.3, 0.28), F(r3(E_('ganaron') + 0.03), 'drop', 0.35, 0.28),
  F(r3(E_('nómina') + 0.03), 'scratch', 0.25, 0.28), F(VOICE, 'whoosh', 0.25)];
fs.writeFileSync('project.json', JSON.stringify({version: 1, style: 'B3', width: 1080, height: 1920, fps: 30, voice: {path: 'narration.mp3', lead: 0, tail: r3(END - VOICE)}, television: {enabled: false}, music: {path: 'music-duck.wav', gain: 0.2}, burnCaptions: false, captions, shots, sfx}, null, 1));
console.log('shots', shots.length, 'end', END);
