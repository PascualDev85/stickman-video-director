// Hoja de identidad visual de LayBo (propuestas para que David elija): paletas, «ficha del estudio» y portada tipo 9:16.
// Uso (desde proyectos/canal-perros/): node identidad.mjs [salida.png]
import fs from 'node:fs';
const R0 = decodeURIComponent(new URL('../../skills/directing-stickman-videos/', import.meta.url).pathname);
const {painter} = await import(R0 + 'scripts/autopilot-render.mjs');
const {createCanvas, GlobalFonts} = await import(R0 + 'node_modules/@napi-rs/canvas/index.js');
GlobalFonts.registerFromPath(R0 + 'assets/fonts/NotoSans.ttf', 'Hoja');
const {dog, dogFront, studyCard, pawPrint, PALETAS, R, E, P, G, S} = await import('./kit.mjs');
const out = process.argv[2] || 'identidad.png';
// node identidad.mjs salida.png [paleta1,paleta2,paleta3] [título]
const KEYS = (process.argv[3] || 'canela,parque,noche').split(','), pals = KEYS.map(k => PALETAS[k]);
const LET = process.argv[5] || 'ABC';
const TITLE = process.argv[4] || 'LayBo — identidad v1 · propuestas para elegir (A, B, C)';
async function render(w, h, layers, t = 2) {
  const draw = await painter({style: 'B3', width: w, height: h, fps: 30, base: process.cwd(), television: {enabled: false}, captions: [], shots: [{start: 0, end: 3, layers}]});
  return draw(t);
}
const bgR = (fill, h = 3000) => R(-60, -60, 1400, h, {radius: 0, fill, stroke: 'none'});
const txt = (text, x, y, size, color, o = {}) => ({type: 'text', text, x, y, size, bold: true, color, w: 1200, ...o});

// 1) paletas: muestras + Layla y Dobby encima del color principal
async function palPanel(pal) {
  const sw = ['paper', 'main', 'second', 'accent', 'ink'];
  return render(640, 400, [bgR(pal.paper), R(0, 470, 1280, 400, {radius: 0, fill: pal.ground, stroke: 'none'}),
    ...sw.map((k, i) => R(60 + i * 140, 40, 120, 120, {radius: 18, fill: pal[k], lineWidth: 6})),
    ...sw.map((k, i) => txt(pal[k], 64 + i * 140, 172 + (i % 2) * 24, 19, '#1d1d1d', {bold: false})),
    R(760, 30, 470, 150, {radius: 22, fill: pal.main, lineWidth: 8}), txt('LayBo', 820, 60, 80, pal.onMain || pal.paper, {outline: pal.onMain === '#1d1d1d' ? pal.paper : pal.ink, outlineWidth: 12}),
    dog({who: 'layla', x: 380, y: 560, scale: 0.75}), dog({who: 'dobby', x: 860, y: 560, scale: 0.7}), pawPrint({x: 1180, y: 300, scale: 0.8, color: pal.second})]);
}
// 2) fichas: misma ficha, 3 estilos (una por paleta)
const VARS = ['ficha', 'carpeta', 'oscura'];
async function cardPanel(i) {
  return render(640, 400, [bgR(pals[i].paper), studyCard({x: 640, y: 380, scale: 1.45, pal: pals[i], variant: VARS[i], uni: 'Universidad de Kioto', journal: 'Animal Cognition', year: '2015', at: 0.2})], 2);
}
// 3) portadas 9:16 (plano 1280×2276); zona segura 3:4 = y 284..1991
async function cover(i) {
  const pal = pals[i];
  const L = [bgR(pal.main), R(-60, 1500, 1400, 900, {radius: 0, fill: pal.ground, stroke: 'none'})];
  if (i === 0) L.push(G(Array.from({length: 18}, (_, k) => S([['M', 0, 0], ['L', Math.cos(k * 0.349) * 2400, Math.sin(k * 0.349) * 2400], ['L', Math.cos(k * 0.349 + 0.17) * 2400, Math.sin(k * 0.349 + 0.17) * 2400], ['Z']], 'rgba(255,255,255,0.13)', {stroke: 'none'})), {x: 640, y: 1100}));
  if (i === 2) L.push(...Array.from({length: 14}, (_, k) => pawPrint({x: 90 + (k % 4) * 340, y: 330 + Math.floor(k / 4) * 330, scale: 0.9, color: 'rgba(255,255,255,0.08)', angle: k * 23})));
  const T = [['TU PERRO', 'SABE SI'], ['¿TU PERRO', 'TE PILLA'], ['NO LE', 'MIENTAS']][i], T2 = ['MIENTES', 'MINTIENDO?', 'A TU PERRO'][i];
  L.push(txt(T[0], 90, 360, 150, pal.paper, {outline: pal.ink, outlineWidth: 22}), txt(T[1], 90, 530, 150, pal.paper, {outline: pal.ink, outlineWidth: 22}),
    txt(T2, 90, 700, 150, pal.accent, {outline: pal.ink, outlineWidth: 22}));
  if (i === 1) L.push(studyCard({x: 640, y: 1050, scale: 1.1, pal, variant: 'ficha', at: 0}));
  L.push(dogFront({who: 'layla', x: 420, y: 1900, scale: 1.25, expr: i === 1 ? 'seria' : 'reposo'}), dogFront({who: 'dobby', x: 900, y: 1900, scale: 1.2, expr: 'boba'}));
  if (i !== 1) L.push(G([R(-170, -60, 340, 120, {radius: 20, fill: pal.paper, lineWidth: 8}), txt('KIOTO · 2015', -150, -34, 52, pal.ink)], {x: 640, y: 1040, angle: -0.06}));
  return render(360, 640, L, 2);
}
const pw = 640, ph = 400, cw = 360, chh = 640, pad = 12, lab = 40;
const W = 3 * pw + 4 * pad, Hh = 70 + 2 * (ph + lab + pad) + chh + lab + pad + 20;
const sheet = createCanvas(W, Hh), ctx = sheet.getContext('2d');
ctx.fillStyle = '#1d1d1d'; ctx.fillRect(0, 0, W, Hh);
ctx.fillStyle = '#fff'; ctx.font = '700 34px Hoja'; ctx.fillText(TITLE, pad + 6, 48);
const label = (s, x, y) => { ctx.fillStyle = '#fff'; ctx.font = '700 22px Hoja'; ctx.fillText(s, x + 4, y + 28); };
let y = 70;
for (let i = 0; i < 3; i++) { const x = pad + i * (pw + pad); ctx.drawImage(await palPanel(pals[i]), x, y); label(`Paleta ${LET[i]} · ${pals[i].name}`, x, y + ph); }
y += ph + lab + pad;
for (let i = 0; i < 3; i++) { const x = pad + i * (pw + pad); ctx.drawImage(await cardPanel(i), x, y); label(`Ficha ${LET[i]} · ${VARS[i]} (entra desde abajo + sello de huella)`, x, y + ph); }
y += ph + lab + pad;
for (let i = 0; i < 3; i++) {
  const x = pad + i * (pw + pad) + (pw - cw) / 2;
  ctx.drawImage(await cover(i), x, y);
  // guía del recorte 3:4 (lo que se ve en la cuadrícula del canal)
  const sy = y + chh * (284 / 2276), sh = chh * (1707 / 2276);
  ctx.strokeStyle = '#ff3b3b'; ctx.setLineDash([8, 6]); ctx.lineWidth = 3; ctx.strokeRect(x + 2, sy, cw - 4, sh); ctx.setLineDash([]);
  label(`Portada ${LET[i]} (rojo = recorte 3:4)`, x - (pw - cw) / 2, y + chh);
}
fs.writeFileSync(out, sheet.toBuffer('image/png'));
console.log(out, W + 'x' + Hh);
