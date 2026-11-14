#!/usr/bin/env python3
"""«Oído» de Claude: revisa el audio de un expediente con números (Claude no puede escuchar).

Uso (desde la carpeta del episodio, después de `preview` o `render`):
  python3 ../herramientas/oido.py                         -> usa project.json, words.json y output/preview.mp4
  python3 ../herramientas/oido.py --video output/film.mp4 --cuts 4.70,6.0

Qué mira (cada pista por separado, reconstruida desde project.json, y la mezcla final):
  1. Volumen final: LUFS integrado (objetivo −14/−15), pico real (≤ −1 dBTP), muestras saturadas.
  2. Palabras tapadas: para cada palabra, voz frente a (música + efectos) en la banda de la voz (300–4000 Hz).
     Solo el núcleo de las sílabas (Scribe alarga las palabras con silencio). < 8 dB = aviso, < 3 dB = problema (no se entiende).
  3. Efectos: si suenan encima de una palabra, si son tan flojos que no se oirán y qué palabras pisan.
  4. Música: cuánto queda por debajo de la voz al hablar (ideal −14…−22 dB) y si se oye en las pausas.
  5. Chasquidos: saltos bruscos de muestra en la voz (cortes de retime) y en la mezcla.
  6. Silencios muertos (> 0,7 s sin nada) y pausas de la voz (para revisar los remates).
  7. Velocidad: palabras por segundo por bloque de subtítulo (> 4 = atropellado).
No sustituye escuchar con cascos: David valida el gusto (si el efecto es gracioso, si la música pega).
"""
import argparse, json, os, subprocess, sys
import numpy as np

SR = 16000


def load(path, start=0.0, sr=SR):
    if not os.path.exists(path):
        return None
    raw = subprocess.run(['ffmpeg', '-v', 'quiet', '-ss', str(start), '-i', path, '-vn', '-ac', '1', '-ar', str(sr), '-f', 'f32le', '-'],
                         capture_output=True).stdout
    return np.frombuffer(raw, dtype=np.float32).copy()


def db(x):
    return 20 * np.log10(max(float(x), 1e-9))


def rms(a):
    return float(np.sqrt(np.mean(a.astype(np.float64) ** 2))) if len(a) else 0.0


def band_rms(a, lo=300, hi=4000):
    if len(a) < 64:
        return rms(a)
    spec = np.fft.rfft(a * np.hanning(len(a)))
    f = np.fft.rfftfreq(len(a), 1 / SR)
    m = (f >= lo) & (f <= hi)
    return float(np.sqrt(np.sum(np.abs(spec[m]) ** 2)) / len(a))


def place(track, clip, t, gain=1.0, maxdur=None):
    i = int(round(t * SR))
    if maxdur:
        clip = clip[: int(maxdur * SR)]
    if i >= len(track) or clip is None:
        return
    n = min(len(clip), len(track) - i)
    track[i:i + n] += clip[:n] * gain


def ebur(path):
    out = subprocess.run(['ffmpeg', '-nostats', '-i', path, '-af', 'ebur128=peak=true', '-f', 'null', '-'], capture_output=True, text=True).stderr
    tail = out[out.rfind('Summary'):]
    def get(key):
        for l in tail.splitlines():
            l = l.strip()
            if l.startswith(key + ':') and l.split(':', 1)[1].split():
                return float(l.split(':', 1)[1].split()[0])
        return None
    return get('I'), get('Peak')


def clicks(a, sr, label, near=None, win=0.08):
    """Saltos de muestra mucho mayores que el entorno (típico de un corte sin fundido)."""
    d = np.abs(np.diff(a))
    if not len(d):
        return []
    hop = int(0.01 * sr)
    local = np.convolve(np.abs(a[1:]), np.ones(hop) / hop, mode='same') + 1e-4
    ratio = d / local
    cand = np.where((ratio > 6) & (d > 0.08) & (local < 0.02))[0]  # solo sobre fondo tranquilo: dentro de la voz, las consonantes (p, t, s) también dan saltos
    hits, last = [], -1e9
    for i in cand:
        t = i / sr
        if near is not None and not any(abs(t - c) < win for c in near):
            continue
        if t - last > 0.05:
            hits.append((round(t, 2), round(float(ratio[i]), 1)))
            last = t
    return hits


def main():
    ap = argparse.ArgumentParser()
    ap.add_argument('--project', default='project.json')
    ap.add_argument('--words', default='words.json')
    ap.add_argument('--video', default='output/preview.mp4')
    ap.add_argument('--cuts', default='', help='tiempos (s, línea de tiempo final) donde hubo cortes/inserciones de voz')
    a = ap.parse_args()

    p = json.load(open(a.project))
    W = json.load(open(a.words))
    W = W.get('words', W) if isinstance(W, dict) else W
    W = [{'w': x.get('word', x.get('text')), 's': x['start'], 'e': x['end']} for x in W]
    voice = load(p['voice']['path'])
    if voice is None:
        sys.exit('No encuentro la voz ' + p['voice']['path'])
    lead = p['voice'].get('lead', 0) or 0
    dur = len(voice) / SR + lead + (p['voice'].get('tail', 0) or 0)
    N = int(dur * SR) + SR
    V = np.zeros(N, np.float32); place(V, voice, lead)
    M = np.zeros(N, np.float32); FXT = np.zeros(N, np.float32)
    music = p.get('music')
    if music:
        place(M, load(music['path']), music.get('offset', 0) or 0, music.get('gain', 1))
    fx_list = []
    for s in p.get('sfx', []):
        clip = load(s['path'])
        if clip is None:
            fx_list.append((s, None)); continue
        mx = s.get('max') or s.get('duration')
        place(FXT, clip, s['time'], s.get('gain', 1), mx)
        fx_list.append((s, clip[: int(mx * SR)] * s.get('gain', 1) if mx else clip * s.get('gain', 1)))
    BG = M + FXT
    warn = prob = 0
    out = []
    say = out.append

    # 1. Volumen de la mezcla final
    say('== 1. Volumen final ==')
    if os.path.exists(a.video):
        I, peak = ebur(a.video)
        mix48 = load(a.video, sr=48000)
        sat = int(np.sum(np.abs(mix48) > 0.999)) if mix48 is not None else 0
        flag = '' if I is not None and -15.8 <= I <= -13.2 else '  ⚠ objetivo −14/−15'
        say(f'LUFS integrado {I}  ·  pico real {peak} dBTP  ·  muestras saturadas {sat}{flag}')
        if flag: warn += 1
        if peak is not None and peak > -1.0: say('  ⚠ pico real > −1 dBTP (puede distorsionar al recomprimir YouTube)'); warn += 1
        if sat: say('  ✗ hay saturación'); prob += 1
    else:
        mix48 = None
        say(f'(sin vídeo {a.video}: solo pistas reconstruidas)')

    # 2. Palabras tapadas
    say('\n== 2. Palabras tapadas por música/efectos (voz − fondo, 300–4000 Hz) ==')
    bad = []
    fr = int(0.03 * SR)  # tramos de 30 ms; solo cuentan los que tienen voz (Scribe alarga las palabras con el silencio de detrás)
    for x in W:
        i, j = int((x['s'] + lead) * SR), int((x['e'] + lead) * SR)
        if x['e'] - x['s'] < 0.08: continue  # tramos de Scribe demasiado cortos: medida no fiable
        segs = [(k, k + fr) for k in range(i, max(i + 1, j - fr + 1), fr)]
        lv = [db(rms(V[a0:b0])) for a0, b0 in segs]
        if not lv or max(lv) < -45: continue
        voiced = [s for s, l in zip(segs, lv) if l > max(-42, max(lv) - 10)]  # núcleo de las sílabas (lo que decide si se entiende)
        snrs = [db(band_rms(V[a0:b0])) - db(band_rms(BG[a0:b0])) for a0, b0 in voiced]
        snr = float(np.median(snrs))
        if snr < 8: bad.append((x, snr))
    if not bad: say('Ninguna: todas las palabras quedan ≥ 8 dB por encima del fondo.')
    for x, snr in bad:
        lvl = '✗' if snr < 3 else '⚠'
        say(f"  {lvl} {x['s']:6.2f}s «{x['w']}»  {snr:5.1f} dB")
        if snr < 3: prob += 1
        else: warn += 1

    # 3. Efectos
    say('\n== 3. Efectos ==')
    for s, clip in fx_list:
        name = os.path.basename(s['path'])
        if clip is None:
            say(f"  ✗ {s['time']:6.2f}s {name}: el archivo no existe"); prob += 1; continue
        # parte audible del efecto (por encima de −50 dBFS en ventanas de 20 ms)
        hop = int(0.02 * SR)
        env = np.array([rms(clip[k:k + hop]) for k in range(0, max(1, len(clip) - hop), hop)])
        on = np.where(env > 10 ** (-50 / 20))[0]
        if not len(on):
            say(f"  ⚠ {s['time']:6.2f}s {name}: casi inaudible (< −50 dBFS)"); warn += 1; continue
        t0, t1 = s['time'] + on[0] * 0.02, s['time'] + (on[-1] + 1) * 0.02
        i, j = int(t0 * SR), int(t1 * SR)
        fxl = db(rms(FXT[i:j])); musl = db(rms(M[i:j])); vl = db(rms(V[i:j]))
        over = [x['w'] for x in W if x['s'] + lead < t1 and x['e'] + lead > t0]
        notes = []
        if fxl < musl - 3: notes.append('más flojo que la música: no se oirá'); warn += 1
        if over and fxl > vl - 6: notes.append('compite con la voz'); warn += 1
        tag = ('⚠ ' if notes else '✓ ')
        say(f"  {tag}{t0:6.2f}–{t1:5.2f}s {name:14s} efecto {fxl:5.1f} dBFS · música {musl:5.1f} · voz {vl:5.1f}"
            + (f" · pisa: {' '.join(over[:6])}" if over else ' · en silencio') + (f"  ← {'; '.join(notes)}" if notes else ''))

    # 4. Música
    say('\n== 4. Música ==')
    speech = np.zeros(N, bool)
    for x in W:
        speech[int((x['s'] + lead) * SR):int((x['e'] + lead) * SR)] = True
    if music:
        ratio = db(rms(M[speech])) - db(rms(V[speech]))
        gaps = [(W[k]['e'], W[k + 1]['s']) for k in range(len(W) - 1) if W[k + 1]['s'] - W[k]['e'] > 0.3]
        pause_lvls = [db(rms(M[int((g0 + lead) * SR):int((g1 + lead) * SR)])) for g0, g1 in gaps]
        say(f'Bajo la voz: música {ratio:.1f} dB respecto a la voz (ideal −14…−22)'
            + ('  ⚠ demasiado alta' if ratio > -12 else '  ⚠ casi no se oye' if ratio < -26 else ''))
        if ratio > -12 or ratio < -26: warn += 1
        if pause_lvls:
            say(f'En las pausas: {np.median(pause_lvls):.1f} dBFS de mediana' + ('  ⚠ no se nota que sube' if np.median(pause_lvls) < -38 else ''))
    else:
        say('Sin música.')

    # 5. Chasquidos
    say('\n== 5. Chasquidos ==')
    cuts = [float(c) for c in a.cuts.split(',') if c.strip()]
    hv = clicks(V, SR, 'voz', near=cuts or None)
    if cuts:
        say(f"Cortes revisados {cuts}: " + ('limpios ✓' if not hv else f'⚠ posibles chasquidos {hv}'))
        if hv: warn += 1
    hm = clicks(mix48, 48000, 'mezcla') if mix48 is not None else []
    hm = [h for h in hm if not any(abs(h[0] - f['time']) < 0.08 for f in p.get('sfx', []))]  # el arranque de un golpe no cuenta
    say('Mezcla: ' + ('sin saltos bruscos ✓' if not hm else f'⚠ saltos en {hm[:8]} (escuchar ahí)'))
    if hm: warn += 1

    # 6. Silencios y pausas
    say('\n== 6. Silencios y pausas ==')
    if mix48 is not None:
        hop = 4800
        env = np.array([rms(mix48[k:k + hop]) for k in range(0, len(mix48) - hop, hop)])
        dead, start = [], None
        for k, e in enumerate(env):
            if e < 10 ** (-50 / 20):
                start = k if start is None else start
            else:
                if start is not None and (k - start) * 0.1 > 0.7: dead.append((round(start * 0.1, 1), round(k * 0.1, 1)))
                start = None
        say('Silencio muerto (> 0,7 s): ' + (str(dead) + '  ⚠' if dead else 'ninguno ✓'))
        if dead: warn += 1
    pauses = [(W[k]['w'], W[k]['e'], round(W[k + 1]['s'] - W[k]['e'], 2)) for k in range(len(W) - 1) if W[k + 1]['s'] - W[k]['e'] >= 0.3]
    say('Pausas de la voz ≥ 0,3 s (¿cada remate tiene la suya?):')
    for w, e, g in pauses:
        say(f'  {e:6.2f}s tras «{w}»  {g:.2f} s')

    # 7. Velocidad
    say('\n== 7. Velocidad por bloque de subtítulo ==')
    caps = p.get('captions') or []
    fast = []
    for c in caps:
        n = len(c['text'].split()); d = c['end'] - c['start']
        if d > 0.25 and n / d > 4.0: fast.append((round(c['start'], 2), c['text'], round(n / d, 1)))
    say('Nada atropellado ✓' if not fast else '\n'.join(f'  ⚠ {t}s «{tx}» {r} pal/s' for t, tx, r in fast))
    warn += len(fast)

    print('\n'.join(out))
    print(f'\nRESUMEN: {prob} problema(s), {warn} aviso(s). ' + ('Listo para que David lo escuche.' if not prob else 'Arreglar los ✗ antes de enseñarlo.'))


if __name__ == '__main__':
    main()
