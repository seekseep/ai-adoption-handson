import sys
sys.path.insert(0, "/Users/seekseep/.claude/skills/genfig")
from genfig import Canvas

# 00: 用意した題材から、自分の業務に近いものを選ぶ
c = Canvas(880, 320)
c.text(440, 38, "近いものを 1 つ選べばよい", scale="heading")
a = c.node(130, 120, "名簿の整形", emoji_cp="1f4cb", w=100, h=82)
b = c.node(130, 240, "経費の集計", emoji_cp="1f4b4", w=100, h=82)
d = c.node(300, 120, "当番表", emoji_cp="1f4c5", w=100, h=82)
e = c.node(300, 240, "突き合わせ", emoji_cp="1f50d", w=100, h=82)
pick = c.node(560, 180, "近いものを選ぶ", emoji_cp="1f446", shape="sticky", color="green", w=185, h=74)
mine = c.node(790, 180, "自分の業務に直す", emoji_cp="1f6e0", w=110, h=90)
for n in (a, b, d, e):
    c.link(n, pick, primary=False)
c.link(pick, mine)
print(c.save("00-thumbnail.svg"))
