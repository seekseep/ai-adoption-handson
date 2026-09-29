import sys
sys.path.insert(0, "/Users/seekseep/.claude/skills/genfig")
from genfig import Canvas

# 00: 配置のデータと、席ごとの事情のデータは別
c = Canvas(820, 350)
c.text(410, 38, "変わる頻度が違うものは、別々に持つ", scale="heading")
layout = c.node(150, 118, "部屋の形", emoji_cp="1f4d0", w=120, h=92)
c.text(150, 190, "めったに変わらない", scale="caption", fill="#475569")
info = c.node(150, 258, "席ごとの事情", emoji_cp="1f4cb", w=120, h=92)
c.text(150, 330, "人事や都合で変わる", scale="caption", fill="#475569")
app = c.node(430, 188, "組み合わせる", emoji_cp="2699", shape="sticky", color="green", w=170, h=70)
chart = c.node(690, 188, "座席表", emoji_cp="1fa91", w=120, h=95)
c.link(layout, app)
c.link(info, app)
c.link(app, chart)
print(c.save("00-thumbnail.svg"))

# 01: 1 欄に詰め込む場合と、欄を分ける場合
c = Canvas(860, 330)
c.text(430, 36, "同じ情報でも、入れ物を分けると読める", scale="heading")

c.sticky(50, 78, 360, 210, color="red")
c.text(230, 106, "1 つの欄に詰め込む", scale="label", fill="#b91c1c")
c.node(230, 185, "A1!田中*窓側#優先", emoji_cp="1f635", w=150, h=95)
c.text(230, 262, "増えるほど読めなくなる", scale="caption", fill="#b91c1c")

c.sticky(450, 78, 360, 210, color="green")
c.text(630, 106, "欄を分ける", scale="label", fill="#15803d")
c.node(555, 180, "部屋の形", emoji_cp="1f4d0", w=100, h=82)
c.node(705, 180, "席の事情", emoji_cp="1f4cb", w=100, h=82)
c.text(630, 262, "それぞれ短く保てる", scale="caption", fill="#15803d")
print(c.save("01-separate-inputs.svg"))
