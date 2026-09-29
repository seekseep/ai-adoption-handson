import sys
sys.path.insert(0, "/Users/seekseep/.claude/skills/genfig")
from genfig import Canvas

# 00: ブラウザは選ばれた 1 ファイルだけ、Python はフォルダごと
c = Canvas(820, 350)
c.text(410, 38, "ブラウザが届かないところに手を伸ばすのが Python", scale="heading")
browser = c.node(120, 145, "ブラウザ", emoji_cp="1f310", w=115, h=92)
one = c.node(670, 130, "選んだ 1 ファイル", emoji_cp="1f4c4", w=120, h=92)
py = c.node(390, 260, "Python", emoji_cp="1f40d", w=105, h=85)
whole = c.node(670, 260, "フォルダの中ぜんぶ", emoji_cp="1f4c2", w=120, h=92)
c.link(browser, one, label="読める")
c.link(browser, py, label="ここから先", primary=False, dash="dashed", head=False)
c.link(py, whole, label="読める")
print(c.save("00-thumbnail.svg"))

# 01: ブラウザの制限と Python の自由度
c = Canvas(820, 330)
c.text(410, 36, "読めるものが違う", scale="heading")

c.sticky(50, 78, 330, 210, color="blue")
c.text(215, 104, "ブラウザ", scale="label", fill="#1d4ed8")
user = c.node(133, 172, "自分", emoji_cp="1f464", w=92, h=78)
picked = c.node(298, 172, "選んだファイル", emoji_cp="1f4c4", w=105, h=85)
c.link(user, picked, label="選ぶ", label_scale="caption")
c.text(215, 272, "選んだものしか読めない", scale="caption", fill="#1d4ed8")

c.sticky(440, 78, 330, 210, color="green")
c.text(605, 104, "Python", scale="label", fill="#15803d")
py = c.node(523, 172, "Python", emoji_cp="1f40d", w=92, h=78)
dir_ = c.node(688, 172, "フォルダごと", emoji_cp="1f4c2", w=105, h=85)
c.link(py, dir_, label="読む", label_scale="caption")
c.text(605, 272, "何十個でもまとめて読める", scale="caption", fill="#15803d")
print(c.save("01-browser-vs-python.svg"))
