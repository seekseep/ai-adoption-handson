import os
import sys
sys.path.insert(0, os.path.expanduser("~/.claude/skills/genfig"))
from genfig import Canvas

# overview: チャットボットは答えるだけ、エージェントは手元で手を動かす。だから線引きを学ぶ
c = Canvas(860, 440)
c.text(430, 36, "チャットボットは「答える」、AI エージェントは「手を動かす」", scale="heading")

c.sticky(40, 70, 370, 200, color="blue")
c.text(225, 98, "チャットボット", scale="label", fill="#1d4ed8")
c.node(130, 175, "答えを返す", emoji_cp="1f4ac", w=105, h=85, label_scale="label")
c.node(320, 175, "人が貼る", emoji_cp="1f464", w=105, h=85, label_scale="label")
c.connector(180, 162, 270, 162)
c.text(225, 252, "動かすのは人", scale="caption", fill="#1d4ed8")

c.sticky(450, 70, 370, 200, color="red")
c.text(635, 98, "AI エージェント", scale="label", fill="#b91c1c")
c.node(540, 175, "頼まれると", emoji_cp="1f916", w=105, h=85, label_scale="label")
c.node(730, 175, "自分で作る", emoji_cp="1f4c2", w=105, h=85, label_scale="label")
c.connector(590, 162, 680, 162)
c.text(635, 252, "読む・書く・消すまでできる", scale="caption", fill="#b91c1c")

c.text(430, 312, "できることが増えるぶん、線引きを自分で決める", scale="label")
for i, (cp, s) in enumerate([
    ("1f512", "渡してはいけないデータ"),
    ("2699", "学習されない設定の意味"),
    ("1f6a7", "どこまで任せるか（権限）"),
]):
    x = 50 + i * 260
    c.sticky(x, 340, 240, 64, color="yellow")
    c.emoji(cp, x + 16, 352, 40)
    c.text(x + 66, 380, s, scale="body", anchor="start")
print(c.save("overview.svg"))
