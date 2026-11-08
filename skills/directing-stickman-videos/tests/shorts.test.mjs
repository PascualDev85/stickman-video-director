import test from 'node:test';
import assert from 'node:assert/strict';
import fs from 'node:fs';
import os from 'node:os';
import path from 'node:path';
import {spawnSync} from 'node:child_process';
import {ROOT, FFMPEG, run, save, loadProject, groupWords, SHORT_CUES} from '../scripts/autopilot-core.mjs';
import {painter, safezoneReview, render} from '../scripts/autopilot-render.mjs';
import {checkBoxes, safeRect, SHORTS} from '../scripts/shorts.mjs';

const cli = path.join(ROOT, 'scripts/autopilot.mjs');
const command = args => spawnSync(process.execPath, [cli, ...args], {encoding: 'utf8', timeout: 120000});
function vertical(t, overrides = {}) {
  const dir = fs.mkdtempSync(path.join(os.tmpdir(), 'stickman-shorts-test-'));
  t.after(() => fs.rmSync(dir, {recursive: true, force: true}));
  run(FFMPEG, ['-v', 'error', '-f', 'lavfi', '-i', 'sine=frequency=310:duration=1.2', '-y', path.join(dir, 'voice.wav')]);
  const project = {version: 1, style: 'B1', width: 360, height: 640, fps: 12, voice: {path: 'voice.wav'},
    captions: [{start: 0.1, end: 0.6, text: '¿Sabías esto?'}, {start: 0.6, end: 1.1, text: 'Los gatos sueñan.'}],
    shots: [{start: 0, end: 1.2, layers: [{type: 'text', text: 'DATO RARO', x: 100, y: 320, size: 90, bold: true}, {type: 'pose', pose: 1, x: 330, y: 560, w: 620}]}], sfx: [], ...overrides};
  const file = path.join(dir, 'project.json'); save(file, project);
  return {dir, project, file};
}

test('init --shorts scaffolds a 1080x1920 project; landscape default is unchanged', t => {
  const dir = fs.mkdtempSync(path.join(os.tmpdir(), 'stickman-shorts-init-'));
  t.after(() => fs.rmSync(dir, {recursive: true, force: true}));
  assert.equal(command(['init', path.join(dir, 'v'), '--shorts']).status, 0);
  const v = JSON.parse(fs.readFileSync(path.join(dir, 'v/project.json')));
  assert.deepEqual([v.width, v.height, v.fps], [SHORTS.width, SHORTS.height, SHORTS.fps]);
  assert.equal(command(['init', path.join(dir, 'h')]).status, 0);
  const h = JSON.parse(fs.readFileSync(path.join(dir, 'h/project.json')));
  assert.deepEqual([h.width, h.height], [1280, 720]);
});

test('Shorts caption grouping keeps short phone-readable cues and breaks on commas', () => {
  const words = 'Los gatos duermen, en serio, casi dieciséis horas al día cuando nadie los mira.'.split(' ').map((word, i) => ({start: i * 0.3, end: i * 0.3 + 0.25, word}));
  const cues = groupWords({words}, 0, SHORT_CUES);
  assert.ok(cues.every(c => c.text.split(' ').length <= 5 && c.text.length <= 26), JSON.stringify(cues));
  assert.equal(cues[0].text, 'Los gatos duermen,');
  // Landscape grouping is unchanged.
  assert.ok(groupWords({words}).length < cues.length);
});

test('safe-zone check flags text and captions under platform UI, but only notes images', () => {
  const p = {width: 1080, height: 1920}, s = safeRect(p);
  const issues = checkBoxes(p, [
    {kind: 'text', t: 0, shot: 0, text: 'TOP', left: 100, top: s.top - 50, right: 300, bottom: s.top + 20},
    {kind: 'caption', t: 1, shot: 0, text: 'low', left: 200, top: s.bottom - 10, right: 500, bottom: s.bottom + 40},
    {kind: 'image', t: 1, shot: 0, text: 'hero.png', left: 900, top: 900, right: 1080, bottom: 1200},
    {kind: 'text', t: 1, shot: 0, text: 'OK', left: 200, top: 600, right: 600, bottom: 700},
  ]);
  assert.deepEqual(issues.map(i => [i.kind, i.level]), [['text', 'problem'], ['caption', 'problem'], ['image', 'note']]);
});

test('vertical projects place captions in the safe area and pass validation', async t => {
  const f = vertical(t), p = loadProject(f.file), draw = await painter(p);
  draw(0.3); const caption = draw.boxes().find(b => b.kind === 'caption'), s = safeRect(p);
  assert.ok(caption.top > s.top && caption.bottom < s.bottom && caption.top > p.height * 0.6, JSON.stringify(caption));
  assert.equal(safezoneReview(p, draw).problems.length, 0);
  const r = command(['validate', f.file]); assert.equal(r.status, 0, r.stderr);
  assert.equal(JSON.parse(r.stdout).safezone.status, 'pass');
});

test('validate reports text hidden by the Shorts UI', async t => {
  const f = vertical(t); f.project.shots[0].layers[0].y = 40; save(f.file, f.project);
  const r = command(['validate', f.file]); assert.equal(r.status, 0, r.stderr);
  const z = JSON.parse(r.stdout).safezone;
  assert.equal(z.status, 'needs_repair'); assert.equal(z.problems[0].text, 'DATO RARO'); assert.ok(z.problems[0].edges.includes('top'));
});

test('overlong vertical captions fail with a Shorts-specific hint', async t => {
  const f = vertical(t, {captions: [{start: 0.1, end: 1.1, text: 'Este subtítulo es demasiado largo para un Short vertical'}]});
  const draw = await painter(loadProject(f.file));
  assert.throws(() => draw(0.5), /captions --shorts/);
});

test('captionY, loudness and vertical caption size are validated', t => {
  const f = vertical(t, {captionY: 0.95}); assert.throws(() => loadProject(f.file), /captionY/);
  f.project.captionY = 0.7; f.project.loudness = -3; save(f.file, f.project); assert.throws(() => loadProject(f.file), /loudness/);
  f.project.loudness = -14; f.project.captionSize = 100; save(f.file, f.project); assert.ok(loadProject(f.file));
  const h = vertical(t, {width: 640, height: 360, captionY: 0.7}); assert.throws(() => loadProject(h.file), /vertical projects only/);
});

test('vertical render is portrait, leveled near the loudness target and reviewed', async t => {
  const f = vertical(t), report = await render(loadProject(f.file), {seconds: 1.2});
  assert.equal(report.safezone_status, 'pass');
  assert.ok(Math.abs(report.loudness.measured_after - report.loudness.target_lufs) < 2, JSON.stringify(report.loudness));
  assert.ok(fs.existsSync(path.join(f.dir, 'output/preview-safezone.png')));
});
