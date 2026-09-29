import sys
sys.path.insert(0, "/Users/seekseep/.claude/skills/genfig")
from genfig import Canvas

# 00: 後から来る条件を、入力欄で受け取る
c = Canvas(840, 300)
c.text(420, 38, "後から増える条件は、入力欄で受ける", scale="heading")
req = c.node(130, 170, "後から来る要望", emoji_cp="1f5e3", w=125, h=100)
box = c.node(400, 170, "条件の入力欄", emoji_cp="1f4dd", shape="sticky", color="green", w=185, h=74)
chart = c.node(700, 170, "条件を満たす座席表", emoji_cp="1fa91", w=135, h=100)
c.link(req, box, label="書き足す")
c.link(box, chart, label="作り直す")
print(c.save("00-thumbnail.svg"))

# 01: コードに埋め込む場合と、入力欄で受ける場合
c = Canvas(860, 340)
c.text(430, 36, "条件をどこに置くかで、来月の手間が変わる", scale="heading")

c.sticky(50, 78, 360, 220, color="red")
c.text(230, 106, "そのつど Codex に頼む", scale="label", fill="#b91c1c")
me1 = c.node(150, 188, "自分", emoji_cp="1f464", w=95, h=80)
cx1 = c.node(310, 188, "Codex", emoji_cp="2699", w=95, h=80)
c.link(me1, cx1, label="毎回", label_scale="caption")
c.text(230, 272, "条件が増えるたびに頼み直す", scale="caption", fill="#b91c1c")

c.sticky(450, 78, 360, 220, color="green")
c.text(630, 106, "条件を書く欄を作る", scale="label", fill="#15803d")
me2 = c.node(550, 188, "自分", emoji_cp="1f464", w=95, h=80)
form = c.node(710, 188, "入力欄", emoji_cp="1f4dd", w=95, h=80)
c.link(me2, form, label="書くだけ", label_scale="caption")
c.text(630, 272, "Codex に頼むのは今日だけ", scale="caption", fill="#15803d")
print(c.save("01-two-ways.svg"))
