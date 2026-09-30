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

# 00: 部屋とテーブルを言葉で伝えると、そのとおりの図が画像で手に入る
c = Canvas(820, 280)
c.text(410, 38, "言葉で伝えた部屋とテーブルが、そのまま画像になる", scale="heading")
words = node(c, 140, 165, "部屋とテーブルの説明", emoji_cp="1f4ac", w=140, h=100)
codex = node(c, 410, 165, "Codex", emoji_cp="2699", shape="sticky", color="blue", w=150, h=96)
png = node(c, 680, 165, "座席表.png", emoji_cp="1f5bc", w=130, h=100)
link(c, words, codex, label="頼む")
link(c, codex, png, label="描いて保存")
print(c.save("00-thumbnail.svg"))

# 01: 変えたいことも言葉で伝える。書き換わるのはプログラムの中の数字
c = Canvas(880, 300)
c.text(440, 38, "変えたいときも、言葉で頼むだけ", scale="heading")
ask = node(c, 130, 170, "「テーブルを横 4 卓に」", emoji_cp="1f4ac", w=170, h=100)
code = node(c, 440, 170, "main.js の数字", emoji_cp="1f4dd", shape="sticky", color="yellow", w=170, h=80)
png = node(c, 750, 170, "新しい図", emoji_cp="1f5bc", w=120, h=100)
link(c, ask, code, label="Codex が書き換え", label_scale="caption")
link(c, code, png, label="描き直し", label_scale="caption")
print(c.save("01-change-by-words.svg"))
