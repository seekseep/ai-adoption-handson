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

# 00: 使える席に前から順に番号を振る。使えない席は飛ばす
c = Canvas(820, 280)
c.text(410, 38, "使える席に、前の列の左から番号を振る", scale="heading")
desks = node(c, 160, 165, "机の並び", emoji_cp="1fa91", w=130, h=100)
rule = node(c, 410, 165, "使えない席は飛ばす", emoji_cp="1f6ab", shape="sticky", color="orange", w=190, h=96)
nums = node(c, 670, 165, "1, 2, 3 …", emoji_cp="1f522", w=130, h=100)
link(c, desks, rule, label="数える")
link(c, rule, nums, label="振る")
print(c.save("00-thumbnail.svg"))

# 01: 番号は描くたびに数え直すので、条件を変えても振り直さなくてよい
c = Canvas(880, 300)
c.text(440, 38, "条件が変わっても、番号は自動で振り直される", scale="heading")
change = node(c, 150, 170, "使えない席を 1 つ増やす", emoji_cp="1f4ac", w=190, h=100)
calc = node(c, 440, 170, "描くたびに数え直す", emoji_cp="2699", shape="sticky", color="blue", w=190, h=96)
nums = node(c, 730, 170, "詰め直した番号", emoji_cp="1f522", w=150, h=100)
link(c, change, calc)
link(c, calc, nums)
print(c.save("01-renumber.svg"))
