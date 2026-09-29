import sys
sys.path.insert(0, "/Users/seekseep/.claude/skills/genfig")
from genfig import Canvas

# 00: 出席者を空いている席に順番に入れる
c = Canvas(820, 290)
c.text(410, 38, "今日いる人だけを、空いている席に入れる", scale="heading")
roster = c.node(140, 170, "出席の一覧", emoji_cp="1f4cb", w=125, h=100)
judge = c.node(410, 170, "誰をどこに", emoji_cp="2699", shape="sticky", color="green", w=170, h=72)
chart = c.node(680, 170, "今日の座席表", emoji_cp="1fa91", w=125, h=100)
c.link(roster, judge, label="出席・欠席")
c.link(judge, chart, label="割り当て")
print(c.save("00-thumbnail.svg"))

# 01: 固定席の人が欠席なら、その席は空けておく
c = Canvas(860, 330)
c.text(430, 36, "固定席の人が欠席のとき、どうするか", scale="heading")

c.sticky(50, 78, 360, 210, color="red")
c.text(230, 106, "他の人を入れる", scale="label", fill="#b91c1c")
c.node(160, 183, "部長の席", emoji_cp="1fa91", w=100, h=82)
c.node(310, 183, "別の人", emoji_cp="1f464", w=100, h=82)
c.text(230, 262, "座った人が気まずい", scale="caption", fill="#b91c1c")

c.sticky(450, 78, 360, 210, color="green")
c.text(630, 106, "空けておく（今回の方針）", scale="label", fill="#15803d")
c.node(560, 183, "部長の席", emoji_cp="1fa91", w=100, h=82)
c.node(710, 183, "空席のまま", emoji_cp="1f6ab", w=100, h=82)
c.text(630, 262, "戻ってきても困らない", scale="caption", fill="#15803d")
print(c.save("01-absent-fixed-seat.svg"))
