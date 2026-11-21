import sys, json
t = sys.stdin.read(); i = t.find('{')
if i < 0:
    print(t[:800]); sys.exit()
d = json.loads(t[i:])
def walk(o):
    if isinstance(o, dict):
        if o.get('level') == 'problem': print(o.get('t'), 'shot', o.get('shot'), repr(o.get('text')), o.get('edges'))
        for v in o.values(): walk(v)
    elif isinstance(o, list):
        for v in o: walk(v)
walk(d)
print(d.get('valid'), {k: v for k, v in d.get('safezone', {}).items() if k != 'problems'})
