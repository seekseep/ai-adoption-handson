import sys
sys.path.insert(0, "/Users/seekseep/.claude/skills/genfig")
from genfig import Canvas

# 00: 勤務希望をそのまま渡してシフト表をもらう
c = Canvas(840, 280)
c.text(420, 38, "勤務希望をそのまま渡して、シフト表をもらう", scale="heading")
src = c.node(130, 165, "名前つきの勤務希望", emoji_cp="1f4cb", w=125, h=100)
ai = c.node(420, 165, "Codex", emoji_cp="2699", shape="sticky", color="blue", w=175, h=74)
dst = c.node(710, 165, "シフト表", emoji_cp="1f4c5", w=120, h=95)
c.link(src, ai, label="全部渡す")
c.link(ai, dst)
print(c.save("00-thumbnail.svg"))

# 01: 渡したものの中身を分解する
c = Canvas(900, 430)
c.text(450, 36, "いま渡したものの中身", scale="heading")
box = c.node(140, 225, "貼り付けた文章", emoji_cp="1f4cb", w=120, h=100)
a = c.node(470, 110, "氏名", emoji_cp="1f464", w=100, h=82)
b = c.node(470, 235, "勤務できる日", emoji_cp="1f4c5", w=100, h=82)
d = c.node(470, 360, "働けない理由", emoji_cp="1f4ad", w=100, h=82)
c.link(box, a, primary=False)
c.link(box, b, primary=False)
c.link(box, d, primary=False)
c.text(740, 110, "個人情報", scale="label", fill="#b91c1c")
c.text(740, 235, "業務情報", scale="label", fill="#c2410c")
c.text(740, 352, "家族構成や\n学業のこと", scale="label", fill="#b91c1c")
print(c.save("01-what-you-sent.svg"))
