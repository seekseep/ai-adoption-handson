import sys
sys.path.insert(0, "/Users/seekseep/.claude/skills/genfig")
from genfig import Canvas

# 00: 今日の持ち帰り 3 つ
c = Canvas(880, 300)
c.text(440, 38, "明日から使う 3 つ", scale="heading")
a = c.node(180, 175, "空のフォルダから\n始める", shape="sticky", color="green", w=230, h=110, label_scale="heading")
b = c.node(440, 175, "仕組みを\n作ってもらう", shape="sticky", color="blue", w=230, h=110, label_scale="heading")
d = c.node(700, 175, "F12 で\n通信を確かめる", shape="sticky", color="purple", w=230, h=110, label_scale="heading")
print(c.save("00-thumbnail.svg"))
