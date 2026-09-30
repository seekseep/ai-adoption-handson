import os
import sys
sys.path.insert(0, os.path.expanduser("~/.claude/skills/genfig"))
from genfig import Canvas

# 公開版の genfig には node 同士を結ぶ link() が無いので、ここで用意する。
# node() の位置と大きさを覚えておき、箱の縁から縁へ矢印を引く。
_boxes = {}


def node(c, cx, cy, label, **kw):
    c.node(cx, cy, label, **kw)
    box = (cx, cy, kw.get("w", 120), kw.get("h", 88))
    _boxes[id(box)] = box
    return box


def _edge(box, tx, ty, pad=10):
    cx, cy, w, h = box
    dx, dy = tx - cx, ty - cy
    if dx == 0 and dy == 0:
        return cx, cy
    sx = (w / 2 + pad) / abs(dx) if dx else float("inf")
    sy = (h / 2 + pad) / abs(dy) if dy else float("inf")
    s = min(sx, sy)
    return cx + dx * s, cy + dy * s


def link(c, a, b, label=None, label_scale="label"):
    x1, y1 = _edge(a, b[0], b[1])
    x2, y2 = _edge(b, a[0], a[1])
    c.connector(x1, y1, x2, y2, label=label, label_scale=label_scale)

# 00: 名簿の順に、番号の席へ座らせる
c = Canvas(820, 280)
c.text(410, 38, "名簿の 1 人目から順に、番号の席へ", scale="heading")
names = node(c, 150, 165, "名簿", emoji_cp="1f4cb", w=120, h=100)
seats = node(c, 410, 165, "1 番, 2 番 …", emoji_cp="1f522", shape="sticky", color="blue", w=160, h=96)
png = node(c, 670, 165, "名前入りの座席表", emoji_cp="1f5bc", w=150, h=100)
link(c, names, seats, label="順に座る")
link(c, seats, png, label="描く")
print(c.save("00-thumbnail.svg"))

# 01: 名前をプログラムに書く = 名簿を Codex に渡している
c = Canvas(880, 320)
c.text(440, 38, "名前を書き込んでもらう ＝ 名簿を Codex に渡す", scale="heading")
me = node(c, 130, 180, "名簿を持つ自分", emoji_cp="1f464", w=150, h=100)
codex = node(c, 440, 180, "Codex", emoji_cp="2699", shape="sticky", color="blue", w=150, h=96)
code = node(c, 750, 180, "main.js に名前", emoji_cp="1f4dd", w=150, h=100)
link(c, me, codex, label="名前を全部送る", label_scale="caption")
link(c, codex, code, label="書き込む", label_scale="caption")
c.text(440, 295, "クラスが変わるたびに、また送ることになる", scale="caption", fill="#b91c1c")
print(c.save("01-names-in-code.svg"))
