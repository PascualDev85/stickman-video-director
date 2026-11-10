#!/usr/bin/env python3
"""Herramientas de voz para los expedientes (Historias Sin Cabeza). Evitan rehacer a mano lo de cada episodio.

Uso (desde la carpeta del episodio):
  python3 ../herramientas/voz.py words  scribe.json            -> words.json   (quita las acotaciones [..], une "cero cero N" y años)
  python3 ../herramientas/voz.py mouth  narration.mp3          -> mouth-env.json (envolvente de boca a 30 fps)
  python3 ../herramientas/voz.py gaps   words.json             -> lista las pausas > 0,2 s (para decidir qué recortar)
  python3 ../herramientas/voz.py retime narration.mp3 words.json scenes.mjs --cut 4.05-4.40 --cut 6.40-6.79 --insert 28.16:1.1
        Recorta silencios y/o inserta pausas en la narración y desplaza en scenes.mjs los tiempos literales de
        shot(), mouth(), F() y {time:}, y VOICE/END. Los tiempos LOCALES dentro de cada plano no se tocan: revisa los
        planos que contienen un corte. Después: voz.py mouth + autopilot captions --shorts + node scenes.mjs.
Requiere ffmpeg y numpy.
"""
import json, re, subprocess, sys

NUM = {'cero': 0, 'uno': 1, 'dos': 2, 'tres': 3, 'cuatro': 4, 'cinco': 5, 'seis': 6, 'siete': 7, 'ocho': 8, 'nueve': 9}


def words(src):
    d = json.load(open(src))
    ws = d['words'] if isinstance(d, dict) and 'words' in d else d
    clean, inb = [], False
    for w in ws:
        if w.get('type', 'word') != 'word':
            continue
        t = w['text']
        if t.startswith('['):
            inb = True
        if not inb:
            clean.append(w)
        if t.endswith(']'):
            inb = False
    out, i = [], 0
    while i < len(clean):
        t = clean[i]['text']
        if t == 'cero' and i + 2 < len(clean) and clean[i + 1]['text'] == 'cero':
            last = clean[i + 2]['text'].strip('.,')
            out.append({'word': f"00{NUM.get(last, last)}" + ('.' if clean[i + 2]['text'].endswith('.') else ''), 'start': clean[i]['start'], 'end': clean[i + 2]['end']})
            i += 3
            continue
        if t == 'mil' and i + 1 < len(clean) and clean[i + 1]['text'].startswith('novecientos'):
            j = i + 1
            while j + 1 < len(clean) and not clean[j]['text'].endswith(('.', ',')):
                j += 1
            print('aviso: año unido como texto, revisa:', ' '.join(c['text'] for c in clean[i:j + 1]), file=sys.stderr)
            out.append({'word': ' '.join(c['text'] for c in clean[i:j + 1]), 'start': clean[i]['start'], 'end': clean[j]['end']})
            i = j + 1
            continue
        out.append({'word': t, 'start': clean[i]['start'], 'end': clean[i]['end']})
        i += 1
    json.dump({'words': out, 'method': 'ElevenLabs Scribe; acotaciones quitadas'}, open('words.json', 'w'), ensure_ascii=False, indent=1)
    print(len(out), 'palabras -> words.json')


def mouth(mp3):
    import numpy as np
    raw = subprocess.run(['ffmpeg', '-v', 'error', '-i', mp3, '-ac', '1', '-ar', '16000', '-f', 'f32le', '-'], capture_output=True, check=True).stdout
    a = np.frombuffer(raw, dtype=np.float32)
    hop = 16000 // 30
    rms = np.array([np.sqrt(np.mean(a[i * hop:(i + 1) * hop] ** 2)) for i in range(len(a) // hop)])
    ref = np.percentile(rms[rms > 0.005], 95)
    env = np.convolve(np.where(rms < 0.01, 0, np.clip(rms / ref, 0, 1)), [0.25, 0.5, 0.25], mode='same')
    json.dump([round(float(v), 2) for v in env], open('mouth-env.json', 'w'))
    print(len(env), 'fotogramas -> mouth-env.json')


def gaps(src):
    w = json.load(open(src))['words']
    for a, b in zip(w, w[1:]):
        if b['start'] - a['end'] > 0.2:
            print(f"{a['end']:7.2f}  pausa {b['start'] - a['end']:.2f}s  {a['word']} | {b['word']}")


def retime(mp3, wjson, scenes, cuts, inserts):
    edits = sorted([(a, b - a * 0 - a, 'cut', b) for a, b in cuts] + [(t, g, 'ins', None) for t, g in inserts])
    def M(t):
        r = 0.0
        for at, _, kind, b in edits:
            if kind == 'cut':
                if t >= b: r -= b - at
                elif t > at: return round(at + r, 3)
            else:
                if t >= at: r += _
        return round(t + r, 3)
    # audio
    parts, prev, filt, n = [], 0.0, '', 0
    for at, g, kind, b in edits:
        filt += f"[0]atrim={prev}:{at},asetpts=PTS-STARTPTS[s{n}];"; parts.append(f'[s{n}]'); n += 1
        if kind == 'ins':
            filt += f"anullsrc=r=44100:cl=mono,atrim=0:{g}[s{n}];"; parts.append(f'[s{n}]'); n += 1; prev = at
        else:
            prev = b
    filt += f"[0]atrim={prev},asetpts=PTS-STARTPTS[s{n}];"; parts.append(f'[s{n}]'); n += 1
    filt += ''.join(parts) + f'concat=n={n}:v=0:a=1[o]'
    tmp = mp3 + '.orig.mp3'
    subprocess.run(['cp', mp3, tmp], check=True)
    subprocess.run(['ffmpeg', '-v', 'error', '-y', '-i', tmp, '-filter_complex', filt, '-map', '[o]', '-ar', '44100', '-ac', '1', '-c:a', 'libmp3lame', '-q:a', '2', mp3], check=True)
    w = json.load(open(wjson))
    for x in w['words']:
        x['start'], x['end'] = M(x['start']), M(x['end'])
    json.dump(w, open(wjson, 'w'), ensure_ascii=False, indent=1)
    s = open(scenes).read()
    f = lambda v: ('%.3f' % v).rstrip('0').rstrip('.')
    s = re.sub(r"shot\(([\d.]+), ([\d.]+|END),", lambda m: f"shot({f(M(float(m.group(1))))}, {m.group(2) if m.group(2) == 'END' else f(M(float(m.group(2))))},", s)
    s = re.sub(r"mouth\(([\d.]+), ([\d.]+)\)", lambda m: f"mouth({f(M(float(m.group(1))))}, {f(M(float(m.group(2))))})", s)
    s = re.sub(r"F\(([\d.]+), '", lambda m: f"F({f(M(float(m.group(1))))}, '", s)
    s = re.sub(r"\{time: ([\d.]+),", lambda m: f"{{time: {f(M(float(m.group(1))))},", s)
    s = re.sub(r"const VOICE = ([\d.]+), END = ([\d.]+);", lambda m: f"const VOICE = {f(M(float(m.group(1))))}, END = {f(M(float(m.group(2))))};", s)
    open(scenes, 'w').write(s)
    print('hecho; original guardado en', tmp)


if __name__ == '__main__':
    cmd, *args = sys.argv[1:]
    if cmd == 'words': words(args[0])
    elif cmd == 'mouth': mouth(args[0])
    elif cmd == 'gaps': gaps(args[0])
    elif cmd == 'retime':
        cuts = [tuple(map(float, a.split('-'))) for k, a in zip(args, args[1:]) if k == '--cut']
        ins = [tuple(map(float, a.split(':'))) for k, a in zip(args, args[1:]) if k == '--insert']
        retime(args[0], args[1], args[2], cuts, ins)
    else: print(__doc__)
