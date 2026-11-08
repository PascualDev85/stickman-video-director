// Vertical (YouTube Shorts / Reels / TikTok) layout helpers for the B runtime.
// Fractions are conservative cross-platform values for a 9:16 frame; platform UI
// changes over time, so the check reports problems for review instead of moving art.
export const SHORTS = {width: 1080, height: 1920, fps: 30};
export const SAFE = {left: 0.05, top: 0.115, right: 0.88, bottom: 0.80};
export const CAPTION_Y = 0.68; // lower-middle of the safe area, above title/channel UI
export const CAPTION_SIZE = 64; // design-plane px (~54 px on a 1080-wide frame)
export const LOUDNESS = -14; // integrated LUFS target for vertical deliveries

export const isVertical = p => p.height > p.width;

/** Safe rectangle in output pixels. */
export function safeRect(p) {
  return {left: SAFE.left * p.width, top: SAFE.top * p.height, right: SAFE.right * p.width, bottom: SAFE.bottom * p.height};
}

/** Safe rectangle in design-plane units (plane width is always 1280). */
export function safePlane(plane) {
  return {left: SAFE.left * plane.width, top: SAFE.top * plane.height, right: SAFE.right * plane.width, bottom: SAFE.bottom * plane.height};
}

/** Map a local box through the current canvas transform to an output-pixel bounding box. */
export function boxFromTransform(ctx, x, y, w, h) {
  const m = ctx.getTransform();
  const pts = [[x, y], [x + w, y], [x, y + h], [x + w, y + h]].map(([a, b]) => [m.a * a + m.c * b + m.e, m.b * a + m.d * b + m.f]);
  const xs = pts.map(q => q[0]), ys = pts.map(q => q[1]);
  return {left: Math.min(...xs), top: Math.min(...ys), right: Math.max(...xs), bottom: Math.max(...ys)};
}

/**
 * Compare recorded boxes with the safe rectangle. Text and captions outside it are
 * problems (the platform UI hides them); images only get a note, because a character
 * may intentionally extend past the edge as long as its face/action stays visible.
 */
export function checkBoxes(p, boxes, tolerance = 2) {
  const s = safeRect(p), issues = [];
  for (const b of boxes) {
    const out = [];
    if (b.left < s.left - tolerance) out.push('left');
    if (b.top < s.top - tolerance) out.push('top');
    if (b.right > s.right + tolerance) out.push('right (button column)');
    if (b.bottom > s.bottom + tolerance) out.push('bottom (title/channel UI)');
    if (!out.length) continue;
    issues.push({level: ['text', 'caption'].includes(b.kind) ? 'problem' : 'note', kind: b.kind, t: Number(b.t.toFixed(3)), shot: b.shot, text: b.text, edges: out, box: Object.fromEntries(Object.entries(b).filter(([k]) => ['left', 'top', 'right', 'bottom'].includes(k)).map(([k, v]) => [k, Math.round(v)]))});
  }
  return issues;
}

/** Draw the blocked platform zones over a frame canvas (for review sheets only). */
export function paintUnsafe(ctx, w, h) {
  const s = {left: SAFE.left * w, top: SAFE.top * h, right: SAFE.right * w, bottom: SAFE.bottom * h};
  ctx.save(); ctx.fillStyle = 'rgba(230,30,30,.28)'; // drawn in the caller's coordinates (sheet tiles translate first)
  ctx.fillRect(0, 0, w, s.top); ctx.fillRect(0, s.bottom, w, h - s.bottom);
  ctx.fillRect(0, s.top, s.left, s.bottom - s.top); ctx.fillRect(s.right, s.top, w - s.right, s.bottom - s.top);
  ctx.strokeStyle = 'rgba(20,160,60,.9)'; ctx.lineWidth = Math.max(2, w / 360); ctx.strokeRect(s.left, s.top, s.right - s.left, s.bottom - s.top);
  ctx.restore();
}
