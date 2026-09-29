import sys
sys.path.insert(0, "/Users/seekseep/.claude/skills/genfig")
from genfig import Canvas

# 00: マップの文字を書くと、そのとおりに机が並ぶ
c = Canvas(800, 280)
c.text(400, 38, "文字で書いた配置が、そのまま座席表になる", scale="heading")
text = c.node(150, 165, "マップの文字", emoji_cp="1f4dd", w=125, h=100)
app = c.node(400, 165, "作る", emoji_cp="2699", shape="sticky", color="green", w=150, h=70)
chart = c.node(650, 165, "座席表", emoji_cp="1fa91", w=125, h=100)
c.link(text, app, label="読む")
c.link(app, chart, label="並べる")
print(c.save("00-thumbnail.svg"))
