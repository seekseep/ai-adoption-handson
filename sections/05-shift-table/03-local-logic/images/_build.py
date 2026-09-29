import sys
sys.path.insert(0, "/Users/seekseep/.claude/skills/genfig")
from genfig import Canvas

# 00: 条件だけ渡して仕組みを受け取り、実データは手元で入れる
c = Canvas(880, 330)
c.text(440, 38, "渡すのは条件だけ。実データは手元で入れる", scale="heading")
me = c.node(120, 190, "自分", emoji_cp="1f464", w=110, h=90)
codex = c.node(400, 110, "Codex", emoji_cp="2699", shape="sticky", color="blue", w=165, h=70)
tool = c.node(400, 265, "できた仕組み", emoji_cp="1f6e0", shape="sticky", color="green", w=165, h=70)
data = c.node(720, 265, "実データ", emoji_cp="1f4cb", w=115, h=92)
c.link(me, codex, label="条件だけ", label_scale="caption")
c.link(codex, tool, label="受け取る", label_scale="caption")
c.link(data, tool, label="手元で入れる", label_scale="caption")
print(c.save("00-thumbnail.svg"))

# 01: 3 つのやり方で、Codex に渡る情報の量
c = Canvas(900, 330)
c.text(450, 36, "やり方を変えると、渡る情報が減っていく", scale="heading")

c.sticky(40, 78, 270, 210, color="red")
c.text(175, 106, "1. そのまま", scale="label", fill="#b91c1c")
c.node(120, 185, "氏名", emoji_cp="1f464", w=88, h=74)
c.node(232, 185, "希望", emoji_cp="1f4c5", w=88, h=74)
c.text(175, 264, "全部渡る", scale="caption", fill="#b91c1c")

c.sticky(320, 78, 270, 210, color="orange")
c.text(455, 106, "2. 置き換え", scale="label", fill="#c2410c")
c.node(400, 185, "記号", emoji_cp="1f3ad", w=88, h=74)
c.node(512, 185, "希望", emoji_cp="1f4c5", w=88, h=74)
c.text(455, 264, "一部だけ渡る", scale="caption", fill="#c2410c")

c.sticky(600, 78, 270, 210, color="green")
c.text(735, 106, "3. 仕組みだけ", scale="label", fill="#15803d")
c.node(735, 185, "条件の説明", emoji_cp="1f4d0", w=95, h=78)
c.text(735, 264, "何も渡らない", scale="caption", fill="#15803d")
print(c.save("01-three-ways.svg"))

# 02: 実データを入れても、Codex には何も届かない
c = Canvas(880, 330)
c.text(440, 38, "実データを入れても、外には何も出ない", scale="heading")
c.sticky(60, 78, 480, 200, color="green")
c.text(300, 106, "自分の PC の中", scale="label", fill="#15803d")
data = c.node(180, 190, "実データ", emoji_cp="1f4cb", w=105, h=85)
tool = c.node(400, 190, "仕組み", emoji_cp="1f6e0", w=105, h=85)
c.link(data, tool, label="入れる", label_scale="caption")
c.node(720, 180, "Codex には届かない", emoji_cp="26d4", w=110, h=90)
c.text(440, 310, "Codex を終了していても動く", scale="caption", fill="#15803d")
print(c.save("02-data-stays-here.svg"))
