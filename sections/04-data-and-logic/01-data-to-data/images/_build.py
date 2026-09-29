import sys
sys.path.insert(0, "/Users/seekseep/.claude/skills/genfig")
from genfig import Canvas

# 00: データを渡して、加工されたデータを受け取る
c = Canvas(820, 280)
c.text(410, 38, "データを渡して、データを受け取る", scale="heading")
src = c.node(130, 165, "手元のデータ", emoji_cp="1f4cb", w=120, h=95)
ai = c.node(410, 165, "AI", emoji_cp="2699", shape="sticky", color="blue", w=170, h=72)
dst = c.node(690, 165, "整えたデータ", emoji_cp="1f4ca", w=120, h=95)
c.link(src, ai, label="渡す")
c.link(ai, dst, label="返る")
print(c.save("00-thumbnail.svg"))

# 01: 入力も出力もデータ、という形
c = Canvas(840, 270)
c.text(420, 36, "入力もデータ、出力もデータ", scale="heading")
a = c.node(150, 160, "入力データ", shape="parallelogram", color="blue", w=210, h=86, label_scale="heading")
b = c.node(420, 160, "変換", shape="hexagon", color="green", w=180, h=86, label_scale="heading")
d = c.node(690, 160, "出力データ", shape="parallelogram", color="blue", w=210, h=86, label_scale="heading")
c.link(a, b)
c.link(b, d)
print(c.save("01-shape.svg"))

# 02: 繰り返すたびにデータが外へ出る
c = Canvas(860, 390)
c.text(430, 36, "同じ作業を繰り返すと、そのたびにデータが外へ出る", scale="heading")
server = c.node(720, 225, "OpenAI のサーバー", emoji_cp="1f5a5", w=125, h=100)
m1 = c.node(140, 120, "1 回目", emoji_cp="1f4cb", w=95, h=80)
m2 = c.node(140, 225, "2 回目", emoji_cp="1f4cb", w=95, h=80)
m3 = c.node(140, 330, "3 回目…", emoji_cp="1f4cb", w=95, h=80)
c.link(m1, server, label="データ", label_scale="caption")
c.link(m2, server, label="データ", label_scale="caption")
c.link(m3, server, label="データ", label_scale="caption")
print(c.save("02-every-time.svg"))
