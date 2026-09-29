import sys
sys.path.insert(0, "/Users/seekseep/.claude/skills/genfig")
from genfig import Canvas

# 00: 条件を入れると、仕組みがデータを生む
c = Canvas(840, 280)
c.text(420, 38, "条件を入れると、仕組みがデータを生む", scale="heading")
rule = c.node(130, 165, "条件・ルール", emoji_cp="1f4d0", w=120, h=95)
logic = c.node(420, 165, "仕組み", emoji_cp="2699", shape="sticky", color="green", w=185, h=74)
data = c.node(700, 165, "できたデータ", emoji_cp="1f4ca", w=120, h=95)
c.link(rule, logic, label="決める")
c.link(logic, data, label="生む")
print(c.save("00-thumbnail.svg"))

# 01: 入力がデータの場合と、入力が条件の場合
c = Canvas(880, 350)
c.text(440, 36, "Codex に渡すものが、まるごと入れ替わる", scale="heading")

c.sticky(50, 78, 370, 220, color="orange")
c.text(235, 106, "データからデータ", scale="label", fill="#c2410c")
a1 = c.node(140, 195, "実データ", emoji_cp="1f4cb", w=100, h=82)
a2 = c.node(320, 195, "結果", emoji_cp="1f4ca", w=100, h=82)
c.link(a1, a2, label="渡す", label_scale="caption")
c.text(235, 275, "毎回データが外へ出る", scale="caption", fill="#c2410c")

c.sticky(460, 78, 370, 220, color="green")
c.text(645, 106, "仕組みからデータ", scale="label", fill="#15803d")
b1 = c.node(550, 195, "条件だけ", emoji_cp="1f4d0", w=100, h=82)
b2 = c.node(730, 195, "仕組み", emoji_cp="2699", w=100, h=82)
c.link(b1, b2, label="渡す", label_scale="caption")
c.text(645, 275, "データは外へ出ない", scale="caption", fill="#15803d")
print(c.save("01-data-vs-rule.svg"))

# 02: 1 回もらえば、以降は自分の PC だけで回る
c = Canvas(880, 350)
c.text(440, 36, "仕組みは 1 回もらえば、あとは自分のもの", scale="heading")
me = c.node(130, 175, "自分", emoji_cp="1f464", w=105, h=88)
codex = c.node(390, 110, "Codex", emoji_cp="2699", shape="sticky", color="blue", w=165, h=70)
logic = c.node(390, 245, "仕組み", emoji_cp="1f6e0", shape="sticky", color="green", w=165, h=70)
data = c.node(720, 245, "毎月の結果", emoji_cp="1f4ca", w=120, h=95)
c.link(me, codex, label="1 回だけ頼む", label_scale="caption")
c.link(codex, logic, label="受け取る", label_scale="caption")
c.link(logic, data, label="何度でも", label_scale="caption")
c.text(440, 330, "2 回目以降、Codex は要らない", scale="caption", fill="#15803d")
print(c.save("02-once-and-reuse.svg"))
