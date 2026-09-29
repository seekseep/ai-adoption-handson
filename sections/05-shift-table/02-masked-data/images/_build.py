import sys
sys.path.insert(0, "/Users/seekseep/.claude/skills/genfig")
from genfig import Canvas

# 00: 記号にして渡し、戻ってきたら手元で実名に直す
c = Canvas(900, 300)
c.text(450, 38, "記号にして渡し、返ってきたら手元で戻す", scale="heading")
real = c.node(110, 180, "実名のデータ", emoji_cp="1f4cb", w=115, h=95)
mask = c.node(330, 180, "記号に置き換え", emoji_cp="1f3ad", w=115, h=95)
ai = c.node(560, 180, "Codex", emoji_cp="2699", shape="sticky", color="blue", w=150, h=72)
back = c.node(790, 180, "手元で戻す", emoji_cp="1f504", w=115, h=95)
c.link(real, mask)
c.link(mask, ai, label="渡す", label_scale="caption")
c.link(ai, back, label="返る", label_scale="caption")
print(c.save("00-thumbnail.svg"))

# 01: 置き換えの前後で、何が消えて何が残るか
c = Canvas(880, 350)
c.text(440, 36, "置き換えると、消えるものと残るものがある", scale="heading")

c.sticky(50, 78, 370, 225, color="red")
c.text(235, 106, "置き換える前", scale="label", fill="#b91c1c")
c.node(140, 190, "氏名", emoji_cp="1f464", w=95, h=78)
c.node(325, 190, "働けない理由", emoji_cp="1f4ad", w=95, h=78)
c.text(235, 278, "計算に使わない情報まで渡している", scale="caption", fill="#b91c1c")

c.sticky(460, 78, 370, 225, color="green")
c.text(645, 106, "置き換えた後", scale="label", fill="#15803d")
c.node(550, 190, "A さん・B さん", emoji_cp="1f3ad", w=95, h=78)
c.node(735, 190, "出られる日", emoji_cp="1f4c5", w=95, h=78)
c.text(645, 278, "計算に必要なものは全部残っている", scale="caption", fill="#15803d")
print(c.save("01-before-after.svg"))

# 02: 置き換え漏れが 1 件でもあると、そこから出る
c = Canvas(880, 320)
c.text(440, 38, "置き換え漏れが 1 件あれば、そこから出ていく", scale="heading")
a = c.node(150, 180, "A さん", emoji_cp="1f3ad", w=100, h=85)
b = c.node(300, 180, "B さん", emoji_cp="1f3ad", w=100, h=85)
d = c.node(450, 180, "田中美咲", emoji_cp="26a0", w=100, h=85)
server = c.node(730, 180, "OpenAI のサーバー", emoji_cp="1f5a5", w=125, h=100)
c.link(d, server, label="実名のまま届く", color="#ef4444")
c.text(440, 296, "一度送ってしまったものは取り消せない", scale="caption", fill="#b91c1c")
print(c.save("02-leak-risk.svg"))
