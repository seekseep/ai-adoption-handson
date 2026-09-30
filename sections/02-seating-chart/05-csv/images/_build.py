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

# 00: CSV を渡すと、クラスごとの座席表がまとめて PNG になる
c = Canvas(900, 300)
c.text(450, 38, "CSV を 1 つ渡すと、クラスの数だけ画像ができる", scale="heading")
csv = node(c, 110, 170, "names.csv", emoji_cp="1f4c4", w=130, h=100)
page = node(c, 350, 170, "座席表のページ", emoji_cp="2699", shape="sticky", color="green", w=170, h=96)
c.sticky(530, 95, 340, 160, color="blue")
for i, cls in enumerate(["A", "B", "C"]):
    x = 590 + i * 110
    c.emoji("1f5bc", x - 30, 118, 60)
    c.text(x, 205, cls + "クラス.png", scale="caption")
c.text(700, 240, "まとめて保存", scale="label", fill="#1d4ed8")
link(c, csv, page, label="選ぶ")
c.connector(445, 170, 520, 170)
print(c.save("00-thumbnail.svg"))

# 01: 前の節と比べて、名簿が Codex を通らなくなる
c = Canvas(900, 330)
c.text(450, 36, "名簿の通り道が変わる", scale="heading")
c.sticky(40, 78, 390, 220, color="red")
c.text(235, 106, "4. 名前をコードに書く", scale="label", fill="#b91c1c")
n1 = node(c, 120, 200, "名簿", emoji_cp="1f4cb", w=90, h=80)
x1 = node(c, 340, 200, "Codex", emoji_cp="2699", w=90, h=80)
link(c, n1, x1, label="渡る", label_scale="caption")
c.sticky(470, 78, 390, 220, color="green")
c.text(665, 106, "5. CSV を手元で読む", scale="label", fill="#15803d")
n2 = node(c, 550, 200, "名簿", emoji_cp="1f4cb", w=90, h=80)
p2 = node(c, 770, 200, "自分の PC の中", emoji_cp="1f4bb", w=120, h=80)
link(c, n2, p2, label="読むだけ", label_scale="caption")
c.text(665, 275, "Codex には何も渡らない", scale="caption", fill="#15803d")
print(c.save("01-data-stays.svg"))
