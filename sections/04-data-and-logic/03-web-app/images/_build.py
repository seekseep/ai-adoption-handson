import sys
sys.path.insert(0, "/Users/seekseep/.claude/skills/genfig")
from genfig import Canvas

# 00: 入力・処理・出力が画面の部品としてつながる
c = Canvas(840, 270)
c.text(420, 38, "アプリケーションは 3 つの部分でできている", scale="heading")
i = c.node(150, 160, "入力", shape="parallelogram", color="blue", w=200, h=86, label_scale="heading")
p = c.node(420, 160, "処理", shape="hexagon", color="green", w=180, h=86, label_scale="heading")
o = c.node(690, 160, "出力", shape="parallelogram", color="blue", w=200, h=86, label_scale="heading")
c.link(i, p)
c.link(p, o)
print(c.save("00-thumbnail.svg"))

# 01: 3 つの部分が、それぞれ何をするか
c = Canvas(880, 330)
c.text(440, 36, "業務ツールは、だいたいこの形をしている", scale="heading")
i = c.node(150, 150, "入力", shape="parallelogram", color="blue", w=200, h=84, label_scale="heading")
p = c.node(440, 150, "処理", shape="hexagon", color="green", w=180, h=84, label_scale="heading")
o = c.node(730, 150, "出力", shape="parallelogram", color="blue", w=200, h=84, label_scale="heading")
c.link(i, p)
c.link(p, o)
c.text(150, 228, "データや条件を受け取る", scale="caption", fill="#475569")
c.text(440, 228, "ルールどおりに扱う", scale="caption", fill="#475569")
c.text(730, 228, "見せる・保存する", scale="caption", fill="#475569")
c.sticky(60, 258, 760, 46, color="gray")
c.text(440, 288, "自分の業務も、この 3 つで言い直せるならツールにできる", scale="body", fill="#475569")
print(c.save("01-three-parts.svg"))
