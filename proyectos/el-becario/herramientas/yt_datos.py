#!/usr/bin/env python3
"""Datos de YouTube del canal (SOLO LECTURA) para mejorar los expedientes.

Sin dependencias: solo librería estándar. Las credenciales viven FUERA del repo:
  el-becario/.secretos/client_secret.json   (OAuth «App de escritorio», lo descarga David)
  el-becario/.secretos/yt-token.json        (lo crea `login`; nunca se sube)

Uso (desde proyectos/el-becario/):
  python3 herramientas/yt_datos.py login                 # una vez: abre el navegador
  python3 herramientas/yt_datos.py videos                # Shorts del canal + ids → youtube-ids.json
  python3 herramientas/yt_datos.py informe 002           # diagnóstico de un expediente (o un videoId)
  python3 herramientas/yt_datos.py canal                 # tabla comparando todos los expedientes

`informe` escribe NNN-slug/datos-youtube.md: métricas, fuentes de tráfico y la curva de retención
cruzada con words.json (qué frase suena) y project.json (qué plano se ve) en cada caída.
Permisos pedidos: youtube.readonly + yt-analytics.readonly. No puede cambiar nada del canal.
"""
import base64, hashlib, http.server, json, os, re, secrets, sys, threading, time, urllib.parse, urllib.request, webbrowser
from datetime import date, datetime, timezone
from pathlib import Path

HERE = Path(__file__).resolve().parent
CANAL = HERE.parent                                   # proyectos/el-becario
SECRETOS = CANAL.parents[2] / '.secretos'             # el-becario/.secretos (fuera del repo)
CLIENT = SECRETOS / 'client_secret.json'
TOKEN = SECRETOS / 'yt-token.json'
IDS = CANAL / 'youtube-ids.json'
SCOPES = 'https://www.googleapis.com/auth/youtube.readonly https://www.googleapis.com/auth/yt-analytics.readonly'
DATA = 'https://www.googleapis.com/youtube/v3/'
ANALYTICS = 'https://youtubeanalytics.googleapis.com/v2/reports'

# Umbrales orientativos para Shorts (ajustarlos con datos propios en la BIBLIA)
U = dict(gancho3s=0.80, visto=70.0, megusta=4.0, feed=70.0)  # visto: tabla de la BIBLIA


def die(msg):
    print('✗ ' + msg); sys.exit(1)


# ---------- OAuth (loopback + PKCE, estándar de Google para apps de escritorio) ----------
def client():
    if not CLIENT.exists():
        die(f'Falta {CLIENT}. Descárgalo de Google Cloud → Credenciales → ID de cliente OAuth (App de escritorio).')
    c = json.loads(CLIENT.read_text())
    return c.get('installed') or c.get('web')


def post(url, data):
    req = urllib.request.Request(url, urllib.parse.urlencode(data).encode(), method='POST')
    try:
        return json.load(urllib.request.urlopen(req))
    except urllib.error.HTTPError as e:
        die(f'OAuth {e.code}: {e.read().decode()[:300]}')


def save_token(t):
    SECRETOS.mkdir(exist_ok=True)
    t['expires_at'] = time.time() + t.get('expires_in', 3600) - 60
    TOKEN.write_text(json.dumps(t)); os.chmod(TOKEN, 0o600)


def login():
    c = client(); verifier = secrets.token_urlsafe(64); state = secrets.token_urlsafe(16)
    challenge = base64.urlsafe_b64encode(hashlib.sha256(verifier.encode()).digest()).rstrip(b'=').decode()
    got = {}

    class H(http.server.BaseHTTPRequestHandler):
        def do_GET(self):
            q = urllib.parse.parse_qs(urllib.parse.urlparse(self.path).query)
            if 'code' in q or 'error' in q:
                got.update({k: v[0] for k, v in q.items()})
            self.send_response(200); self.send_header('Content-Type', 'text/html; charset=utf-8'); self.end_headers()
            self.wfile.write('<h2>Listo. Ya puedes cerrar esta pestaña y volver a Claude.</h2>'.encode())
        def log_message(self, *a): pass

    srv = http.server.HTTPServer(('127.0.0.1', 0), H)
    redirect = f'http://127.0.0.1:{srv.server_port}'
    url = 'https://accounts.google.com/o/oauth2/v2/auth?' + urllib.parse.urlencode(dict(
        client_id=c['client_id'], redirect_uri=redirect, response_type='code', scope=SCOPES, state=state,
        code_challenge=challenge, code_challenge_method='S256', access_type='offline', prompt='consent'))
    print('Abriendo el navegador para iniciar sesión con la cuenta del canal…\nSi no se abre, copia esta URL:\n' + url)
    webbrowser.open(url)
    threading.Thread(target=srv.serve_forever, daemon=True).start()
    for _ in range(600):
        if got: break
        time.sleep(0.5)
    srv.shutdown()
    if not got: die('Tiempo agotado esperando el login.')
    if got.get('error') or got.get('state') != state: die(f'Login cancelado o inválido: {got.get("error")}')
    t = post('https://oauth2.googleapis.com/token', dict(code=got['code'], client_id=c['client_id'],
             client_secret=c.get('client_secret', ''), redirect_uri=redirect, grant_type='authorization_code', code_verifier=verifier))
    save_token(t); print('✓ Sesión guardada en', TOKEN)


def access():
    if not TOKEN.exists(): die('Primero: python3 herramientas/yt_datos.py login')
    t = json.loads(TOKEN.read_text())
    if time.time() > t.get('expires_at', 0):
        c = client()
        n = post('https://oauth2.googleapis.com/token', dict(refresh_token=t['refresh_token'], client_id=c['client_id'],
                 client_secret=c.get('client_secret', ''), grant_type='refresh_token'))
        n.setdefault('refresh_token', t['refresh_token']); save_token(n); t = n
    return t['access_token']


def get(url, params):
    req = urllib.request.Request(url + '?' + urllib.parse.urlencode(params), headers={'Authorization': 'Bearer ' + access()})
    try:
        return json.load(urllib.request.urlopen(req))
    except urllib.error.HTTPError as e:
        body = e.read().decode()
        if e.code == 400 and 'invalid_grant' in body: die('La sesión caducó: vuelve a hacer login.')
        raise RuntimeError(f'{e.code}: {body[:400]}')


# ---------- YouTube Data API ----------
def iso_dur(s):
    m = re.match(r'PT(?:(\d+)H)?(?:(\d+)M)?(?:(\d+)S)?', s or '')
    return sum(int(x or 0) * k for x, k in zip(m.groups(), (3600, 60, 1))) if m else 0


def my_channel():
    it = get(DATA + 'channels', dict(part='id,snippet,statistics,contentDetails', mine='true'))['items']
    if not it: die('Esta cuenta de Google no tiene canal. Inicia sesión con la del canal (o su cuenta de marca).')
    return it[0]


def uploads():
    ch = my_channel(); pl = ch['contentDetails']['relatedPlaylists']['uploads']; ids, tok = [], None
    while True:
        r = get(DATA + 'playlistItems', dict(part='contentDetails', playlistId=pl, maxResults=50, **({'pageToken': tok} if tok else {})))
        ids += [i['contentDetails']['videoId'] for i in r['items']]; tok = r.get('nextPageToken')
        if not tok: break
    vids = []
    for k in range(0, len(ids), 50):
        r = get(DATA + 'videos', dict(part='snippet,statistics,contentDetails,status', id=','.join(ids[k:k + 50])))
        for v in r['items']:
            vids.append(dict(id=v['id'], title=v['snippet']['title'], published=v['snippet']['publishedAt'][:10],
                             dur=iso_dur(v['contentDetails']['duration']), privacy=v['status']['privacyStatus'],
                             views=int(v['statistics'].get('viewCount', 0))))
    return ch, sorted(vids, key=lambda v: v['published'])


# ---------- expedientes ----------
def expedientes():
    return {p.name[:3]: p for p in sorted(CANAL.glob('[0-9][0-9][0-9]-*')) if p.is_dir()}


def load_ids():
    return json.loads(IDS.read_text()) if IDS.exists() else {}


def resolve(arg):
    exps, ids = expedientes(), load_ids()
    if re.fullmatch(r'\d{3}', arg):
        if arg not in ids: die(f'No sé qué vídeo es el {arg}. Ejecuta `videos` o añádelo a {IDS.name}.')
        return ids[arg], exps.get(arg)
    num = next((k for k, v in ids.items() if v == arg), None)
    return arg, exps.get(num) if num else None


def norm(s):
    return re.sub(r'[^a-z0-9]', '', s.lower().translate(str.maketrans('áéíóúüñ', 'aeiouun')))


def guess_ids(vids):
    """Empareja vídeos con expedientes por palabras del slug en el título. Respeta lo ya apuntado a mano."""
    ids = load_ids(); exps = expedientes()
    for num, p in exps.items():
        if num in ids: continue
        words = [w for w in p.name[4:].split('-') if len(w) > 3]
        best = max(vids, key=lambda v: sum(norm(w) in norm(v['title']) for w in words), default=None)
        if best and any(norm(w) in norm(best['title']) for w in words) and best['id'] not in ids.values():
            ids[num] = best['id']
    IDS.write_text(json.dumps(dict(sorted(ids.items())), indent=1, ensure_ascii=False) + '\n')
    return ids


# ---------- YouTube Analytics ----------
BASE = ['views', 'engagedViews', 'estimatedMinutesWatched', 'averageViewDuration', 'averageViewPercentage',
        'likes', 'comments', 'shares', 'subscribersGained', 'subscribersLost']


def report(vid, start, metrics, dims=None, extra=None):
    p = dict(ids='channel==MINE', startDate=start, endDate=date.today().isoformat(), metrics=','.join(metrics), filters='video==' + vid)
    if dims: p['dimensions'] = dims
    p.update(extra or {})
    try:
        r = get(ANALYTICS, p)
    except RuntimeError as e:
        if 'engagedViews' in metrics and '400' in str(e):
            return report(vid, start, [m for m in metrics if m != 'engagedViews'], dims, extra)
        raise
    cols = [h['name'] for h in r.get('columnHeaders', [])]
    return [dict(zip(cols, row)) for row in r.get('rows', [])]


def totals(vid, start):
    rows = report(vid, start, BASE, 'video')
    return rows[0] if rows else {}


def traffic(vid, start):
    rows = report(vid, start, ['views'], 'insightTrafficSourceType', {'sort': '-views'})
    tot = sum(r['views'] for r in rows) or 1
    return [(r['insightTrafficSourceType'], r['views'], 100 * r['views'] / tot) for r in rows]


def retention(vid, start):
    rows = report(vid, start, ['audienceWatchRatio', 'relativeRetentionPerformance'], 'elapsedVideoTimeRatio')
    return [(r['elapsedVideoTimeRatio'], r['audienceWatchRatio'], r.get('relativeRetentionPerformance')) for r in rows]


# ---------- cruce con el expediente ----------
def words_at(folder, t, span=1.2):
    f = folder and folder / 'words.json'
    if not f or not f.exists(): return ''
    w = json.loads(f.read_text()); w = w.get('words', w)
    near = [x['word'] for x in w if x['end'] >= t - span and x['start'] <= t + 0.3]
    return ' '.join(near)


def shot_at(folder, t):
    f = folder and folder / 'project.json'
    if not f or not f.exists(): return ''
    shots = json.loads(f.read_text())['shots']
    for i, s in enumerate(shots):
        if s['start'] <= t < s['end']: return f'plano {i} ({s["start"]:.2f}–{s["end"]:.2f}s)'
    return ''


def at(curve, x):
    """Interpola audienceWatchRatio en la fracción x del vídeo."""
    if not curve: return None
    prev = curve[0]
    for c in curve:
        if c[0] >= x:
            if c[0] == prev[0]: return c[1]
            k = (x - prev[0]) / (c[0] - prev[0]); return prev[1] + k * (c[1] - prev[1])
        prev = c
    return curve[-1][1]


def pct(a, b): return 100 * a / b if b else 0


def informe(arg):
    vid, folder = resolve(arg)
    v = get(DATA + 'videos', dict(part='snippet,statistics,contentDetails', id=vid))['items']
    if not v: die(f'Vídeo {vid} no encontrado en tu canal.')
    v = v[0]; start = v['snippet']['publishedAt'][:10]; dur = iso_dur(v['contentDetails']['duration'])
    edad = (datetime.now(timezone.utc) - datetime.fromisoformat(v['snippet']['publishedAt'].replace('Z', '+00:00'))).total_seconds() / 3600
    T = totals(vid, start); tr = traffic(vid, start); cur = retention(vid, start)
    views = T.get('views', 0) or int(v['statistics'].get('viewCount', 0))
    L = [f'# Datos YouTube — {v["snippet"]["title"]}', '',
         f'`{vid}` · publicado {start} (hace {edad / 24:.1f} días) · {dur}s · consultado {date.today()}', '']
    if edad < 72:
        L += ['> ⚠️ YouTube Analytics va con 24–72 h de retraso: con menos de 3 días las cifras están incompletas.', '']
    L += ['## Métricas', '| Métrica | Valor | Referencia Shorts |', '|---|---|---|',
          f'| Visualizaciones | {views:,} | |']
    if 'engagedViews' in T:
        L.append(f'| Visualizaciones con interacción | {T["engagedViews"]:,} ({pct(T["engagedViews"], views):.0f} %) | cuanto más cerca de 100 %, menos deslizan |')
    avp = T.get('averageViewPercentage')
    mg = pct(T.get('likes', 0), views)
    L += [f'| % medio visto | {avp or 0:.0f} % | ≥ {U["visto"]:.0f} % (más de 100 % = lo vuelven a ver) |',
          f'| Duración media vista | {T.get("averageViewDuration", 0)} s de {dur} s | |',
          f'| Me gusta / visualizaciones | {mg:.1f} % | ≥ {U["megusta"]:.0f} % |',
          f'| Compartidos | {T.get("shares", 0)} ({1000 * T.get("shares", 0) / views if views else 0:.1f} por 1.000) | |',
          f'| Comentarios | {T.get("comments", 0)} | |',
          f'| Suscriptores | +{T.get("subscribersGained", 0)} / −{T.get("subscribersLost", 0)} ({1000 * T.get("subscribersGained", 0) / views if views else 0:.1f} por 1.000) | |', '']
    feed = next((p for s, _, p in tr if s == 'SHORTS'), 0)
    L += ['## De dónde vienen', '| Fuente | Vistas | % |', '|---|---|---|'] + [f'| {s} | {n:,} | {p:.0f} % |' for s, n, p in tr] + ['']
    D = []
    if cur:
        g = at(cur, min(3 / dur, 1)) if dur else None
        fin = cur[-1][1]
        L += ['## Retención', f'- A los 3 s sigue viendo: **{g * 100:.0f} %** (objetivo ≥ {U["gancho3s"] * 100:.0f} %)' if g is not None else '',
              f'- Al final: **{fin * 100:.0f} %**' + (' → hay revisionados (bucle)' if fin > 1 else ''), '']
        drops = sorted(((cur[i - 1][1] - cur[i][1], cur[i][0]) for i in range(1, len(cur))), reverse=True)[:5]
        L += ['### Mayores caídas (dónde se van)', '| Segundo | Se va | Plano | Lo que se oye |', '|---|---|---|---|']
        for d, x in sorted(drops, key=lambda z: z[1]):
            t = x * dur
            L.append(f'| {t:.1f} s | {d * 100:.1f} pts | {shot_at(folder, t)} | {words_at(folder, t)} |')
        rel = [c for c in cur if c[2] is not None]
        if rel:
            mal = [c for c in rel if c[2] < 0.35]
            L += ['', f'- Retención relativa (frente a Shorts de duración parecida, 0,5 = media): '
                  f'media {sum(c[2] for c in rel) / len(rel):.2f}' + (f'; por debajo de 0,35 en {mal[0][0] * dur:.1f}–{mal[-1][0] * dur:.1f} s' if mal else '')]
        L += ['', '<details><summary>Curva completa</summary>', '', '| s | viendo | relativa |', '|---|---|---|']
        L += [f'| {c[0] * dur:.1f} | {c[1] * 100:.0f} % | {c[2] if c[2] is not None else ""} |' for c in cur[::4]] + ['', '</details>', '']
        if g is not None and g < U['gancho3s']: D.append(f'**Gancho**: a los 3 s solo queda el {g * 100:.0f} %. Revisar fotograma 0, primera frase y movimiento en el segundo 1.')
    else:
        L += ['## Retención', 'Sin curva todavía (YouTube la da con suficientes vistas y 1–3 días de margen).', '']
    if avp and avp < U['visto']: D.append(f'**% visto bajo** ({avp:.0f} %): sobra metraje o hay un tramo plano; mirar las caídas de arriba.')
    if views and mg < U['megusta']: D.append(f'**Pocos «me gusta»** ({mg:.1f} %): falta un remate claro o una pregunta que invite a reaccionar.')
    if tr and feed < U['feed']: D.append(f'**Poco feed de Shorts** ({feed:.0f} %): YouTube aún no lo está empujando en el feed.')
    L += ['## Diagnóstico automático'] + ([f'- {d}' for d in D] or ['- Nada por debajo de los umbrales.']) + [
        '', '_Umbrales orientativos en `yt_datos.py` (U); ajustarlos con datos del canal. Lo de «deslizaron / se quedaron» solo está en Studio._']
    out = (folder / 'datos-youtube.md') if folder else Path(f'datos-youtube-{vid}.md')
    out.write_text('\n'.join(x for x in L if x is not None) + '\n')
    print('\n'.join(L)); print('\n→', out)


def canal():
    ch, vids = uploads(); ids = guess_ids(vids); inv = {v: k for k, v in ids.items()}
    s = ch['statistics']
    print(f'# {ch["snippet"]["title"]} — {s.get("subscriberCount", "?")} suscriptores · {int(s.get("viewCount", 0)):,} vistas\n')
    print('| Exp | Título | Publicado | Vistas | % visto | Me gusta % | Compart./1k | Subs/1k |\n|---|---|---|---|---|---|---|---|')
    for v in vids:
        try:
            T = totals(v['id'], v['published'])
        except RuntimeError:
            T = {}
        n = T.get('views', 0) or v['views']
        print(f'| {inv.get(v["id"], "—")} | {v["title"][:40]} | {v["published"]} | {n:,} | {T.get("averageViewPercentage", 0):.0f} % | '
              f'{pct(T.get("likes", 0), n):.1f} | {1000 * T.get("shares", 0) / n if n else 0:.1f} | {1000 * T.get("subscribersGained", 0) / n if n else 0:.1f} |')


def videos():
    ch, vids = uploads(); ids = guess_ids(vids); inv = {v: k for k, v in ids.items()}
    print(f'Canal: {ch["snippet"]["title"]}')
    for v in vids:
        print(f'{inv.get(v["id"], "—"):>3}  {v["id"]}  {v["published"]}  {v["dur"]:>3}s  {v["privacy"]:<8} {v["views"]:>7,}  {v["title"]}')
    print(f'\n→ {IDS.name} (corrígelo a mano si algún emparejamiento está mal)')


if __name__ == '__main__':
    cmd = sys.argv[1] if len(sys.argv) > 1 else ''
    if cmd == 'login': login()
    elif cmd == 'videos': videos()
    elif cmd == 'informe' and len(sys.argv) > 2: informe(sys.argv[2])
    elif cmd == 'canal': canal()
    else: print(__doc__)
