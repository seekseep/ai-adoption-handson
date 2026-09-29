import sys
sys.path.insert(0, "/Users/seekseep/.claude/skills/genfig")
from genfig import Canvas

# 00: ひな形を土台に、自分の業務用に育てる
c = Canvas(860, 280)
c.text(430, 38, "ひな形を土台にすると、書き換えるのは処理だけ", scale="heading")
base = c.node(140, 165, "ひな形", emoji_cp="1f4e6", w=115, h=95)
edit = c.node(430, 165, "処理だけ書き換える", emoji_cp="2699", shape="sticky", color="green", w=210, h=74)
mine = c.node(720, 165, "自分の業務ツール", emoji_cp="1f6e0", w=120, h=95)
c.link(base, edit)
c.link(edit, mine)
print(c.save("00-thumbnail.svg"))

# 01: 一度に全部頼む場合と、1 つずつ足す場合
c = Canvas(880, 350)
c.text(440, 36, "条件は 1 つずつ足す。まとめて渡さない", scale="heading")

c.sticky(50, 78, 370, 225, color="red")
c.text(235, 106, "一度に 10 個伝える", scale="label", fill="#b91c1c")
c.node(140, 190, "まとめて依頼", emoji_cp="1f4e6", w=95, h=78)
c.node(325, 190, "どこが原因か不明", emoji_cp="2753", w=95, h=78)
c.text(235, 272, "動かないとき、切り分けられない", scale="caption", fill="#b91c1c")

c.sticky(460, 78, 370, 225, color="green")
c.text(645, 106, "1 つずつ足す", scale="label", fill="#15803d")
a = c.node(550, 190, "足す", emoji_cp="2795", w=95, h=78)
b = c.node(735, 190, "動かす", emoji_cp="2705", w=95, h=78)
c.link(a, b, label="くり返す", label_scale="caption")
c.text(645, 272, "壊れたら直前の 1 つが原因と分かる", scale="caption", fill="#15803d")
print(c.save("01-one-at-a-time.svg"))
