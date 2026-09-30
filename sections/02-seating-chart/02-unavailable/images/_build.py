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

# 00: 使えない席を言葉で指すと、その椅子が描き分けられる
c = Canvas(820, 280)
c.text(410, 38, "使えない席を、場所の言葉で伝える", scale="heading")
words = node(c, 160, 165, "「テーブル 1 の左前」", emoji_cp="1f4ac", w=160, h=100)
codex = node(c, 410, 165, "Codex", emoji_cp="2699", shape="sticky", color="blue", w=150, h=96)
desk = node(c, 670, 165, "灰色に × の椅子", emoji_cp="1f6ab", w=140, h=100)
link(c, words, codex, label="頼む")
link(c, codex, desk, label="描き分け")
print(c.save("00-thumbnail.svg"))

# 01: 場所で指すと言葉が長くなる → 次の節で番号を振る理由
c = Canvas(880, 300)
c.text(440, 38, "場所で指すと、言い方が長くなる", scale="heading")
c.sticky(40, 80, 380, 190, color="orange")
c.text(230, 110, "場所で指す", scale="label", fill="#c2410c")
c.text(230, 170, "「テーブル 5 の、いちばん", scale="body")
c.text(230, 200, "　後ろ側の椅子」", scale="body")
c.sticky(460, 80, 380, 190, color="green")
c.text(650, 110, "番号で指す", scale="label", fill="#15803d")
c.text(650, 185, "「17 番」", scale="heading")
c.connector(425, 175, 455, 175)
print(c.save("01-long-words.svg"))
