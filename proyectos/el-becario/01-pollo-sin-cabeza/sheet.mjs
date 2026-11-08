import fs from 'node:fs';
const R = '/home/claude/repo/stickman-video-director/skills/directing-stickman-videos/scripts/';
const {painter} = await import(R + 'autopilot-render.mjs');
const {becario, granjero, mike, archiveBox} = await import('./kit.mjs');
const W = 1280, H = 1280 * 1920 / 1080;
const exprs = ['cansado', 'sarcastico', 'sorpresa', 'agobiado', 'contento', 'serio'];
const layers = [{type: 'rect', x: -20, y: -20, w: 1320, h: H + 40, radius: 0, fill: '#f4efe4', stroke: 'none'}];
exprs.forEach((e, i) => {
  const cx = 230 + (i % 3) * 410, cy = 760 + Math.floor(i / 3) * 760;
  const arms = [[{shoulder: 10}, {shoulder: 10}], [{shoulder: 20, elbow: 100}, {shoulder: 0}], [{shoulder: 150, elbow: 10}, {shoulder: 150, elbow: 10}], [{shoulder: 60, elbow: 120}, {shoulder: 60, elbow: 120}], [{shoulder: 0}, {shoulder: 120, elbow: 20, hand: 'point'}], [{shoulder: 5}, {shoulder: 30, elbow: 90}]][i];
  layers.push(becario({x: cx, y: cy, scale: 0.85, expr: e, armL: arms[0], armR: arms[1]}));
  layers.push({type: 'text', text: e.toUpperCase(), x: cx - 110, y: cy + 20, size: 40, bold: true, color: '#151515'});
});
layers.push(archiveBox({x: 230, y: 2230, scale: 0.9}), granjero({x: 640, y: 2230, scale: 0.85, axe: true, armR: {shoulder: 40, elbow: 60}}), mike({x: 1030, y: 2200, scale: 1.1}));
const p = {style: 'B3', width: 1080, height: 1920, fps: 30, base: process.cwd(), television: {enabled: false}, captions: [], shots: [{start: 0, end: 1, layers}]};
const draw = await painter(p);
fs.writeFileSync('sheet.png', draw(0.1).toBuffer('image/png'));
console.log('ok');
