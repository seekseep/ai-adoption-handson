import sys
sys.path.insert(0, "/Users/seekseep/.claude/skills/genfig")
from genfig import Canvas

# 00: 作り始める前に、相談する段階を置く
c = Canvas(880, 280)
c.text(440, 38, "作り始める前に、相談する段階を置く", scale="heading")
idea = c.node(120, 170, "やりたいこと", emoji_cp="1f4a1", w=115, h=95)
talk = c.node(380, 170, "相談する", emoji_cp="1f4ac", shape="sticky", color="blue", w=170, h=74)
spec = c.node(640, 170, "作るものの仕様", emoji_cp="1f4cb", w=115, h=95)
make = c.node(830, 170, "作る", emoji_cp="2699", w=85, h=75)
c.link(idea, talk)
c.link(talk, spec)
c.link(spec, make)
print(c.save("00-thumbnail.svg"))

# 01: いきなり作る場合と、相談してから作る場合
c = Canvas(880, 350)
c.text(440, 36, "相談の 10 分が、あとの 40 分を決める", scale="heading")

c.sticky(50, 78, 370, 225, color="red")
c.text(235, 106, "いきなり作らせる", scale="label", fill="#b91c1c")
m1 = c.node(140, 190, "自分", emoji_cp="1f464", w=95, h=78)
c1 = c.node(325, 190, "Codex", emoji_cp="2699", w=95, h=78)
c.link(m1, c1, label="作って", label_scale="caption")
c.link(c1, m1, label="違う", label_scale="caption", primary=False, offset=30)
c.text(235, 272, "思っていたものと違う。往復が増える", scale="caption", fill="#b91c1c")

c.sticky(460, 78, 370, 225, color="green")
c.text(645, 106, "相談してから作らせる", scale="label", fill="#15803d")
m2 = c.node(550, 190, "自分", emoji_cp="1f464", w=95, h=78)
c2 = c.node(735, 190, "Codex", emoji_cp="2699", w=95, h=78)
c.link(m2, c2, label="どう作る？", label_scale="caption")
c.text(645, 272, "理解を合わせてから作り始められる", scale="caption", fill="#15803d")
print(c.save("01-talk-first.svg"))
