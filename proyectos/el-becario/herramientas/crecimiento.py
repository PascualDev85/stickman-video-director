#!/usr/bin/env python3
"""crecimiento.py - herramientas de análisis para Historias Sin Cabeza (sin dependencias).

Adaptado de Jakeschincariol/youtube-agent-skill (MIT): retention.py, swipe.py y title.py,
pasados a español y a Shorts. Las fórmulas de gancho están en ganchos.json.

  python3 crecimiento.py retencion retention.csv --duracion 49 [--subs ../002-pollo-sin-cabeza/captions.json]
      Lee el CSV de retención de YouTube Studio (Estadísticas -> vídeo -> Interacción -> gráfico de
      retención -> icono de descarga). Dice cuánto se pierde en el gancho (3 s), los «barrancos»
      (segundos concretos donde se va la gente) y qué decía el Becario en cada uno.

  python3 crecimiento.py gancho "Este pollo vivió 18 meses sin cabeza."
      Qué fórmulas de ganchos.json usa una frase y avisos (longitud, número/nombre/fecha).

  python3 crecimiento.py titulo "Vendió la Torre Eiffel… y no era suya" --portada "LA VENDIÓ"
      Revisa título + portada como pareja: corte en móvil (40) y escritorio (60), mayúsculas,
      palabras en la portada (máx. 3-4), que la portada no repita el título, número/nombre/fecha.

  python3 crecimiento.py virales videos.json [--min 2]
      Ordena vídeos de otros canales por cuántas veces superan la MEDIANA de su propio canal
      (no por visitas brutas) y dice qué fórmula usa cada título. videos.json:
      [{"canal": "...", "titulo": "...", "vistas": 41200, "url": "..."}, ...]  (mín. 4 por canal)
      Solo listados públicos (p. ej. `yt-dlp --flat-playlist -J URL_DEL_CANAL` desde el Mac).
      Nunca con la cuenta de Apify del bot de Telegram.

  python3 crecimiento.py competencia @historiaslocasok
      Radiografía de los Shorts de un canal (yt-dlp, sin claves): ritmo de publicación, mediana,
      duración, destacados frente a su propia mediana con fórmula de título y % de me gusta.
"""
import csv, json, os, re, statistics, sys

AQUI = os.path.dirname(os.path.abspath(__file__))
G = json.load(open(os.path.join(AQUI, 'ganchos.json')))
FORMULAS = G['formulas']


def formulas_de(texto):
    hits = []
    for f in FORMULAS:
        n = sum(1 for p in f['match'] if re.search(p, texto, re.I))
        if n: hits.append((n, f))
    hits.sort(key=lambda x: -x[0])
    return [f for _, f in hits]


# ---------- retención ----------
def leer_csv(path):
    rows = []
    with open(path, newline='', encoding='utf-8-sig', errors='replace') as fh:
        for r in csv.reader(fh):
            nums = []
            for c in r:
                c = c.strip().replace('%', '').replace(',', '.')
                try: nums.append(float(c))
                except ValueError: pass
            if len(nums) >= 2: rows.append((nums[0], nums[1]))
    return rows


def subs_cerca(subs, t, margen=1.5):
    return ' '.join(c['text'] for c in subs if c['start'] <= t + margen and c['end'] >= t - margen)


def retencion(args):
    path = args[0]
    dur = float(args[args.index('--duracion') + 1]) if '--duracion' in args else None
    subs = json.load(open(args[args.index('--subs') + 1])) if '--subs' in args else []
    rows = leer_csv(path)
    if len(rows) < 8: sys.exit('No he podido leer al menos 8 puntos del CSV.')
    xs, ys = [r[0] for r in rows], [r[1] for r in rows]
    eje_pct = max(xs) <= 100.5
    if eje_pct and not dur: sys.exit('El eje va en % del vídeo: pasa --duracion (segundos).')
    seg = (lambda x: x / 100 * dur) if eje_pct else (lambda x: x)
    ini = ys[0] or 100.0
    gancho = min((y for x, y in rows if seg(x) <= 3.0), default=ini)
    fuga = ini - gancho
    caidas = sorted(((ys[i - 1] - ys[i]) / max(1e-6, seg(xs[i]) - seg(xs[i - 1])), seg(xs[i - 1]), ys[i - 1] - ys[i])
                    for i in range(1, len(rows)))[::-1]
    barrancos = [(t, d) for _, t, d in caidas if d > 0.8 and t > 3.0][:5]
    medio = [(ys[i - 1] - ys[i]) for i in range(1, len(rows)) if 3 < seg(xs[i]) < (dur or seg(xs[-1])) * 0.85]
    goteo = sum(medio) / len(medio) if medio else 0
    print(f'\n  {path}: {len(rows)} puntos, {ys[0]:.0f}% -> {ys[-1]:.0f}% (final)')
    v = 'bien' if fuga < 25 else 'flojo' if fuga < 40 else 'grave'
    print(f'  GANCHO     se pierde un {fuga:.0f}% en los 3 primeros segundos [{v}]. Si es flojo: primera frase y primer fotograma.')
    print('  BARRANCOS  momentos concretos en los que se va la gente:')
    for t, d in sorted(barrancos):
        print(f'    -{d:4.1f}%  en {t:5.1f}s' + (f'   «{subs_cerca(subs, t)}»' if subs else ''))
    if not barrancos: print('    ninguno marcado: la pérdida es goteo, no un momento.')
    print(f'  GOTEO      {goteo:.2f}% por punto en el medio. Si es alto: ritmo (cortar, no reescribir).')
    if ys[-1] > ys[0] * 0.95: print('  BUCLE      el final retiene casi como el principio: el bucle funciona (revisiones).')
    print()


# ---------- gancho ----------
def gancho(args):
    frase = ' '.join(a for a in args if not a.startswith('--'))
    fs = formulas_de(frase)
    pal = len(frase.split())
    print(f'\n  «{frase}»  ({pal} palabras)')
    print('  Fórmulas: ' + (', '.join(f"{f['nombre']} (encaje {f['encaje']})" for f in fs) if fs else 'ninguna clara: revisa ganchos.json'))
    if pal > 14: print('  - Largo para 3 s: busca 6-12 palabras.')
    if not re.search(r'\d|\b[A-ZÁÉÍÓÚ][a-záéíóú]+\b', frase[1:]): print('  - Sin número, nombre ni fecha: lo concreto gana a lo grande.')
    if re.search(r'\b(canal|suscr|becario|hola)\b', frase, re.I): print('  - No empieces presentando el canal o al Becario.')
    print()


# ---------- título + portada ----------
def titulo(args):
    port = args[args.index('--portada') + 1] if '--portada' in args else ''
    t = ' '.join(a for a in args if not a.startswith('--') and a != port)
    avisos = []
    if len(t) > 60: avisos.append(f'{len(t)} caracteres: se corta en escritorio (60) y en móvil (40).')
    elif len(t) > 40: avisos.append(f'{len(t)} caracteres: en móvil se corta a los 40; que lo importante vaya delante.')
    may = [w for w in re.findall(r'\b[A-ZÁÉÍÓÚÑ]{3,}\b', t)]
    if len(may) > 2: avisos.append('Más de 2 palabras en mayúsculas: parece spam.')
    if '#' in t: avisos.append('Sin hashtags en el título (van en la descripción).')
    if not re.search(r'\d|\b[A-ZÁÉÍÓÚ][a-záéíóú]+', t[1:]): avisos.append('Sin número, nombre ni fecha.')
    if port:
        pw = port.split()
        if len(pw) > 4: avisos.append(f'La portada tiene {len(pw)} palabras: a tamaño de feed, 3-4 como mucho.')
        stop = {'este', 'esta', 'esto', 'pero', 'para', 'como', 'cómo', 'porque', 'todo', 'nada', 'sobre'}
        comunes = ({w.lower() for w in re.findall(r'\w{4,}', port)} & {w.lower() for w in re.findall(r'\w{4,}', t)}) - stop
        if comunes: avisos.append(f'La portada repite el título ({", ".join(sorted(comunes))}): misma promesa, otras palabras.')
    fs = formulas_de(t)
    print(f'\n  Título: «{t}»  ({len(t)} caracteres)' + (f'\n  Portada: «{port}»' if port else ''))
    print('  Fórmula: ' + (fs[0]['nombre'] if fs else '—'))
    for a in avisos or ['Sin avisos.']: print('  - ' + a)
    print()


# ---------- virales ----------
def virales(args):
    lo = float(args[args.index('--min') + 1]) if '--min' in args else 1.5
    rows = json.load(open(args[0]))
    by = {}
    for r in rows: by.setdefault(r.get('canal') or r.get('channel', '?'), []).append(r)
    out, finos = [], []
    for ch, vids in by.items():
        vs = [float(v.get('vistas', v.get('views', 0)) or 0) for v in vids]
        if len(vids) < 4: finos.append(f'{ch} ({len(vids)})'); continue
        med = statistics.median(vs) or 1
        for v, n in zip(vids, vs):
            tit = v.get('titulo') or v.get('title', '')
            fs = formulas_de(tit)
            out.append((n / med, int(n), int(med), ch, tit, fs[0]['nombre'] if fs else 'sin clasificar'))
    out = sorted((o for o in out if o[0] >= lo), reverse=True)
    print(f'\n  {len(rows)} vídeos de {len(by)} canales; destacan los que superan {lo}x su propia mediana\n')
    for m, n, med, ch, tit, f in out[:25]:
        print(f'  {m:5.1f}x  {n:>9,} vs {med:>8,}  {ch[:20]:<20} {tit[:55]}\n          {f}')
    if not out: print('  Ninguno supera el umbral: más vídeos por canal o baja --min.')
    if finos: print('\n  Sin contar (menos de 4 vídeos): ' + ', '.join(finos))
    cuenta = {}
    for o in out: cuenta[o[5]] = cuenta.get(o[5], 0) + 1
    if cuenta: print('\n  Fórmulas entre los destacados: ' + ', '.join(f'{k} ×{v}' for k, v in sorted(cuenta.items(), key=lambda x: -x[1])))
    print('  (La fórmula es un juicio sobre el TÍTULO, no la razón de que funcionara.)\n')


def competencia(args):
    """Radiografía de los Shorts de un canal público con yt-dlp (tarda ~2 s por vídeo)."""
    import subprocess
    h = args[0].lstrip('@')
    url = h if h.startswith('http') else f'https://www.youtube.com/@{h}/shorts'
    campos = '%(upload_date)s|%(duration)s|%(view_count)s|%(like_count)s|%(channel_follower_count)s|%(id)s|%(title)s'
    r = subprocess.run(['yt-dlp', '--no-update', '--skip-download', '--ignore-errors', '--print', campos, url],
                       capture_output=True, text=True)
    vids = []
    for l in r.stdout.splitlines():
        p = l.split('|', 6)
        if len(p) < 7 or not p[2].isdigit(): continue
        num = lambda x: int(x) if x.isdigit() else 0
        vids.append(dict(fecha=p[0], dur=num(p[1]), vistas=num(p[2]), likes=num(p[3]), subs=num(p[4]), id=p[5],
                         titulo=re.sub(r'\s*#\S+', '', p[6]).strip()))
    if len(vids) < 4: sys.exit(f'Solo {len(vids)} vídeos leídos. ¿URL correcta? {r.stderr[-300:]}')
    vids.sort(key=lambda v: v['fecha'])
    med = statistics.median(v['vistas'] for v in vids) or 1
    dias = {}
    for v in vids: dias[v['fecha']] = dias.get(v['fecha'], 0) + 1
    print(f'\n  @{h}: {vids[-1]["subs"]:,} subs · {len(vids)} Shorts del {vids[0]["fecha"]} al {vids[-1]["fecha"]}'
          f' ({len(vids) / len(dias):.1f}/día publicando) · mediana {int(med):,} vistas'
          f' · duración mediana {statistics.median(v["dur"] for v in vids):.0f} s')
    top = sorted(vids, key=lambda v: -v['vistas'])
    print(f'\n  Destacados (≥ 2x su mediana):')
    for v in [v for v in top if v['vistas'] >= 2 * med][:15]:
        fs = formulas_de(v['titulo'])
        lk = f'{100 * v["likes"] / v["vistas"]:.1f} %' if v['vistas'] else '-'
        print(f'  {v["vistas"] / med:5.1f}x {v["vistas"]:>9,}  {v["dur"]:>3} s  ♥{lk:>6}  {v["fecha"]}  {v["titulo"][:50]}'
              f'\n         {fs[0]["nombre"] if fs else "sin clasificar"} · youtu.be/{v["id"]}')
    flojos = [v for v in vids if v['vistas'] < med / 4]
    print(f'\n  Flojos (< 1/4 de la mediana): {len(flojos)} de {len(vids)}'
          f' · duración mediana destacados {statistics.median([v["dur"] for v in top[:max(3, len(top) // 5)]]):.0f} s')
    print('  Guion de uno: yt-dlp --skip-download --write-auto-subs --sub-langs "es.*" URL (YouTube bloquea bajar el vídeo).\n')


if __name__ == '__main__':
    if len(sys.argv) < 3: sys.exit(__doc__)
    cmd, args = sys.argv[1], sys.argv[2:]
    {'retencion': retencion, 'gancho': gancho, 'titulo': titulo, 'virales': virales,
     'competencia': competencia}.get(cmd, lambda a: sys.exit(__doc__))(args)
