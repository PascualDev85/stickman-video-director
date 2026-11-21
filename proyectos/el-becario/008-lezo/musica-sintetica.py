#!/usr/bin/env python3
"""Marcha barroca cómica para el EXP 008 (Lezo), compuesta y sintetizada aquí (original, sin derechos de terceros).
Uso: python3 musica-sintetica.py  ->  music-lezo.wav / music.mp3
Estructura (104 BPM, 4/4, compás = 2,308 s; OFFSET alinea los golpes con la voz):
  c1-2  intro: redoble creciente + fanfarria        (0–4,9 s)
  c3-10 tema A: clavecín + pizzicato + caja           (hasta 23 s)
  c11-14 tema B: metales                              (hasta 32 s)
  c15-18 tensión: pedal grave, timbales, pasos de puntillas (32–41,5 s)  ← «fiebre / se van / ¿hemos ganado?»
  c19   subida: redoble + riser                       (41,5–44,1 s)      ← «Espera. Mira el secreto de Vernon»
  c20-22 FANFARRIA triunfal con golpe en 44,1 s       (44,1–51 s)       ← «Medallas… de rodillas… la espada»
  c23   trombón triste que se desinfla (51,05 s)     ← «Y no ganaron»
  c24-25 pizzicato de oficina, bajito y cómico        ← «Una victoria imaginaria… sin cobrar»
"""
import numpy as np, wave, subprocess, sys

SR = 44100
BPM = 104
BEAT = 60 / BPM
BAR = BEAT * 4
OFFSET = 0.25
TOTAL = 58.2
N = int(TOTAL * SR)
rng = np.random.default_rng(8)
L = np.zeros(N); R = np.zeros(N)

def midi(n): return 440.0 * 2 ** ((n - 69) / 12)
NOTE = {'C': 0, 'D': 2, 'E': 4, 'F': 5, 'G': 7, 'A': 9, 'B': 11}
def m(name):  # 'F#5' -> midi
    base = NOTE[name[0]]; i = 1; acc = 0
    while name[i] in '#b': acc += 1 if name[i] == '#' else -1; i += 1
    return 12 * (int(name[i:]) + 1) + base + acc

def add(sig, t0, pan=0.0, gain=1.0):
    i0 = int((t0 + OFFSET) * SR)
    if i0 >= N: return
    seg = sig[:max(0, N - i0)]
    l = np.cos((pan + 1) * np.pi / 4); r = np.sin((pan + 1) * np.pi / 4)
    L[i0:i0 + len(seg)] += seg * gain * l * 1.41
    R[i0:i0 + len(seg)] += seg * gain * r * 1.41

def tt(d): return np.arange(int(d * SR)) / SR

def harpsi(f, d=0.5):
    t = tt(d); s = np.zeros_like(t)
    for k, a in zip(range(1, 9), [1, .7, .5, .45, .3, .25, .15, .1]):
        s += a * np.sin(2 * np.pi * f * k * t + k)
    env = np.exp(-t * 9) * (1 - np.exp(-t * 900))
    click = rng.standard_normal(len(t)) * np.exp(-t * 400) * .15
    return (s * env + click) * .18

def pizz(f, d=0.28):
    t = tt(d); s = np.sin(2 * np.pi * f * t) + .5 * np.sin(2 * np.pi * 2 * f * t) + .25 * np.sin(2 * np.pi * 3 * f * t)
    return s * np.exp(-t * 16) * (1 - np.exp(-t * 600)) * .4

def brass(f, d=0.5, vib=0.0):
    t = tt(d); ph = 2 * np.pi * f * t + vib * np.sin(2 * np.pi * 5.5 * t)
    s = sum((1 / k) ** .8 * np.sin(k * ph) for k in range(1, 12))
    att = 1 - np.exp(-t * 60); rel = np.clip((d - t) / .06, 0, 1)
    return s * att * rel * np.exp(-t * .6) * .09

def string(f, d=1.0):
    t = tt(d); s = np.zeros_like(t)
    for det in (-0.004, 0, 0.004):
        ph = 2 * np.pi * f * (1 + det) * t
        s += sum((1 / k) * np.sin(k * ph) for k in range(1, 9))
    att = 1 - np.exp(-t * 8); rel = np.clip((d - t) / .15, 0, 1)
    return s * att * rel * .045

def snare(d=0.18, g=1.0):
    t = tt(d); n = rng.standard_normal(len(t)); n = n - np.convolve(n, np.ones(6) / 6, 'same')
    return (n * np.exp(-t * 32) * .5 + np.sin(2 * np.pi * 190 * t) * np.exp(-t * 30) * .35) * g

def timp(f=75, d=0.7, g=1.0):
    t = tt(d); fr = f * (1 + .6 * np.exp(-t * 14))
    return np.sin(2 * np.pi * np.cumsum(fr) / SR) * np.exp(-t * 5.5) * .9 * g

def cymbal(d=1.6, g=1.0):
    t = tt(d); n = rng.standard_normal(len(t)); n = n - np.convolve(n, np.ones(3) / 3, 'same')
    return n * np.exp(-t * 2.4) * .25 * g

def riser(d, g=1.0):
    t = tt(d); n = rng.standard_normal(len(t)); n = np.convolve(n, np.ones(4) / 4, 'same')
    return n * (t / d) ** 2.2 * .35 * g

def trombone_fall(f0, f1, d):
    t = tt(d); fr = f0 * (f1 / f0) ** (t / d) * (1 + .012 * np.sin(2 * np.pi * 5 * t))
    ph = 2 * np.pi * np.cumsum(fr) / SR
    s = sum((1 / k) * np.sin(k * ph) for k in range(1, 8))
    return s * (1 - np.exp(-t * 30)) * np.clip((d - t) / .1, 0, 1) * .16

CH = {'D': ['D3', 'F#3', 'A3'], 'G': ['G3', 'B3', 'D4'], 'A': ['A3', 'C#4', 'E4'], 'Em': ['E3', 'G3', 'B3'], 'Bm': ['B2', 'D3', 'F#3'], 'F#': ['F#3', 'A#3', 'C#4']}
ROOT = {'D': 'D2', 'G': 'G2', 'A': 'A2', 'Em': 'E2', 'Bm': 'B1', 'F#': 'F#2'}

def bar_t(k): return (k - 1) * BAR            # inicio del compás k (1-based)

def oompah(k, chord, vol=1.0, snare_on=True):
    t0 = bar_t(k)
    add(pizz(midi(m(ROOT[chord])) * 1.0, .3), t0, -.2, 1.0 * vol)
    add(pizz(midi(m(ROOT[chord])) * 1.5, .3), t0 + 2 * BEAT, -.2, .8 * vol)
    for b in (1, 3):
        for n in CH[chord]: add(harpsi(midi(m(n)), .3), t0 + b * BEAT, .25, .45 * vol)
    if snare_on:
        for b in (0, 1, 2, 3): add(snare(.12), t0 + b * BEAT + .5 * BEAT, .1, .25 * vol)

def melody(k0, notes, inst='harpsi', vol=1.0, pan=0.0):
    t = bar_t(k0)
    for name, dur in notes:
        if name != 'R':
            f = midi(m(name))
            if inst == 'harpsi': add(harpsi(f, max(.3, dur * BEAT)), t, pan, vol)
            elif inst == 'brass': add(brass(f, dur * BEAT * .95, .3), t, pan, vol)
            elif inst == 'pizz': add(pizz(f, .3), t, pan, vol)
        t += dur * BEAT

# ---------------- compases 1-2: intro ----------------
for i in range(16):                       # redoble creciente
    add(snare(.1), bar_t(1) + i * BEAT / 2, .1, .08 + i * .028)
add(timp(73, .8), bar_t(1), -.3, .8)
for n in ('D4', 'A4', 'D5'): add(brass(midi(m(n)), BEAT * 1.8, .25), bar_t(2), 0, 1.0)
add(timp(73, .8), bar_t(2), -.3, .9); add(cymbal(1.2, .5), bar_t(2), .3)

# ---------------- compases 3-10: tema A ----------------
A = [[('D5', 1), ('F#5', .5), ('A5', .5), ('D6', 1), ('A5', 1)], [('B5', 1), ('G5', .5), ('B5', .5), ('A5', 2)],
     [('D5', 1), ('F#5', .5), ('A5', .5), ('D6', 1), ('A5', 1)], [('G5', 1), ('F#5', .5), ('E5', .5), ('D5', 2)],
     [('E5', 1), ('G5', .5), ('B5', .5), ('E6', 1), ('B5', 1)], [('C#6', 1), ('A5', .5), ('C#6', .5), ('B5', 2)],
     [('A5', 1), ('B5', .5), ('C#6', .5), ('D6', 1), ('E6', 1)], [('F#6', 1), ('E6', .5), ('C#6', .5), ('D6', 2)]]
chA = ['D', 'G', 'D', 'A', 'Em', 'A', 'D', 'A']
for i in range(8):
    melody(3 + i, A[i], 'harpsi', .9, .3)
    oompah(3 + i, chA[i], .9)
    if i % 2 == 1: add(timp(73 if chA[i] in 'DG' else 110, .4), bar_t(3 + i), -.3, .35)
# pizzicato doblando la melodía (octava baja) en la repetición
for i in range(4, 8): melody(3 + i, [(n.replace('5', '4').replace('6', '5'), d) for n, d in A[i]], 'pizz', .5, -.4)

# ---------------- compases 11-14: tema B (metales) ----------------
B = [[('G5', 1), ('B5', 1), ('D6', 1), ('B5', 1)], [('A5', 1), ('F#5', 1), ('D5', 2)],
     [('E6', 1), ('D6', .5), ('C#6', .5), ('B5', 1), ('A5', 1)], [('D6', 3), ('R', 1)]]
chB = ['G', 'D', 'A', 'D']
for i in range(4):
    melody(11 + i, B[i], 'brass', 1.0, 0)
    melody(11 + i, [(n, d) for n, d in B[i]], 'harpsi', .5, .3)
    oompah(11 + i, chB[i], 1.0)
add(cymbal(1.2, .5), bar_t(11), .3); add(timp(98, .6), bar_t(11), -.3, .7)
for b in range(4): add(snare(.12), bar_t(14) + b * BEAT, .1, .5)   # fill

# ---------------- compases 15-18: tensión (fiebre / se van / ¿hemos ganado?) ----------------
for k in range(15, 19):
    t0 = bar_t(k)
    add(string(midi(m('B2')), BAR), t0, -.2, 1.0); add(string(midi(m('F#3')), BAR), t0, .2, .7)
    for b in (0, 2): add(timp(62, .9), t0 + b * BEAT, -.3, .55 + .08 * (k - 15))
    tip = ['B3', 'D4', 'F#4', 'D4', 'B3', 'D4', 'A4', 'F#4']       # pasos de puntillas
    for j, n in enumerate(tip): add(pizz(midi(m(n)), .2), t0 + j * BEAT / 2 + (BEAT if k > 16 else 0) * 0, .3, .35)
# «¿hemos ganado?» → pequeña pregunta ascendente
melody(18, [('B4', .5), ('D5', .5), ('F#5', .5), ('G#5', .5), ('A5', 2)], 'harpsi', .7, .2)

# ---------------- compás 19: subida (Espera. Mira el secreto de Vernon.) ----------------
t0 = bar_t(19)
for i in range(32): add(snare(.08), t0 + i * BAR / 32, .1, .06 + i * .02)
add(riser(BAR, .7), t0, 0, 1.0)
for i, n in enumerate(['D4', 'F#4', 'A4', 'D5']): add(brass(midi(m(n)), BAR / 4 * 1.05, .2), t0 + i * BEAT, 0, .35 + .15 * i)

# ---------------- compases 20-22: FANFARRIA triunfal (Medallas…) ----------------
add(timp(73, 1.2), bar_t(20), -.3, 1.3); add(cymbal(2.0, 1.0), bar_t(20), .3)
for n in ('D3', 'A3', 'D4', 'F#4', 'A4', 'D5'): add(brass(midi(m(n)), BAR * .9, .35), bar_t(20), 0, 1.4)
F = [[('D6', .5), ('D6', .5), ('A5', 1), ('D6', 1), ('F#6', 1)], [('E6', 1), ('D6', .5), ('C#6', .5), ('B5', 1), ('A5', 1)],
     [('G5', .5), ('G5', .5), ('B5', 1), ('D6', 1), ('G6', 1)], [('F#6', 1), ('E6', 1), ('D6', 2)]]
chF = ['D', 'A', 'G']
for i in range(3):
    melody(20 + i, F[i], 'brass', 1.1, 0)
    melody(20 + i, F[i], 'harpsi', .6, .3)
    oompah(20 + i, chF[i], 1.1)
# arpegios de clavecín que brillan sobre la fanfarria
for k in (20, 21, 22):
    for j in range(8): add(harpsi(midi(m(['D5', 'F#5', 'A5', 'D6', 'A5', 'F#5', 'D5', 'A4'][j])), .3), bar_t(k) + j * BEAT / 2, .35, .35)
for b in range(4): add(snare(.12), bar_t(22) + b * BEAT / 2 + 0, .1, .4)

# ---------------- compás 23: trombón triste («Y no ganaron.») ----------------
t0 = bar_t(23)
add(trombone_fall(midi(m('F#4')), midi(m('C#3')), BAR * .9), t0 + .05, 0, 1.3)
add(timp(55, 1.0), t0 + BAR * .6, -.3, .5)

# ---------------- compases 24-25: oficina, bajito y cómico ----------------
bass = ['D3', 'R', 'A3', 'R', 'D3', 'R', 'A3', 'R']
for k in (24, 25):
    for j, n in enumerate(bass):
        if n != 'R': add(pizz(midi(m(n)), .25), bar_t(k) + j * BEAT / 2 * 1.0, -.2, .35)
    for j in (1, 3): add(harpsi(midi(m('F#4')), .25), bar_t(k) + j * BEAT, .3, .25)
add(pizz(midi(m('D2')), .6), bar_t(25) + 3.5 * BEAT, 0, .5)

# ---------------- reverb suave y salida ----------------
def reverb(x, wet=.14):
    ir_len = int(.9 * SR); ir = rng.standard_normal(ir_len) * np.exp(-np.arange(ir_len) / SR * 5.5)
    n = len(x) + ir_len; X = np.fft.rfft(x, n); I = np.fft.rfft(ir, n)
    return x + wet * np.fft.irfft(X * I, n)[:len(x)] * .05
L = reverb(L); R = reverb(R)
pk = max(np.abs(L).max(), np.abs(R).max()); g = 10 ** (-3 / 20) / pk
st = np.stack([L * g, R * g], 1)
# entrada y salida suaves (evita chasquidos)
fi = int(.05 * SR); fo = int(.4 * SR)
st[:fi] *= np.linspace(0, 1, fi)[:, None]; st[-fo:] *= np.linspace(1, 0, fo)[:, None]
pcm = (st * 32767).astype('<i2')
with wave.open('music-lezo.wav', 'wb') as w:
    w.setnchannels(2); w.setsampwidth(2); w.setframerate(SR); w.writeframes(pcm.tobytes())
# el motor limita music.gain a 0,2: se sube el volumen en origen (compresión suave + 8 dB + limitador)
subprocess.run(['ffmpeg', '-v', 'error', '-y', '-i', 'music-lezo.wav', '-af', 'acompressor=threshold=0.12:ratio=3:attack=5:release=80,volume=8dB,alimiter=limit=0.95', '-b:a', '192k', 'music.mp3'], check=True)
print('ok music-lezo.wav / music.mp3', round(TOTAL, 1), 's')
