import sys
sys.path.insert(0, "/Users/seekseep/.claude/skills/genfig")
from genfig import Canvas

# 00: 繰り返している作業の中から、仕組みにできるものを選ぶ
c = Canvas(880, 380)
c.text(440, 38, "毎月くり返している作業の中から、1 つ選ぶ", scale="heading")
a = c.node(120, 115, "月初の集計", emoji_cp="1f4ca", w=100, h=82)
b = c.node(120, 220, "定例の資料", emoji_cp="1f4c4", w=100, h=82)
d = c.node(120, 325, "勤怠の集計", emoji_cp="23f0", w=100, h=82)
pick = c.node(500, 220, "これにする", emoji_cp="1f50d", shape="sticky", color="green", w=185, h=76)
tool = c.node(770, 220, "小さなツール", emoji_cp="1f6e0", w=115, h=95)
c.link(a, pick, primary=False)
c.link(b, pick, primary=False)
c.link(d, pick, primary=False)
c.link(pick, tool)
print(c.save("00-thumbnail.svg"))

# 01: 向いている作業と向いていない作業
c = Canvas(880, 350)
c.text(440, 36, "向き不向きがある。無理に選ばない", scale="heading")

c.sticky(50, 78, 370, 225, color="green")
c.text(235, 106, "向いている", scale="label", fill="#15803d")
c.node(140, 190, "毎月やる", emoji_cp="1f504", w=95, h=78)
c.node(325, 190, "手順が同じ", emoji_cp="1f4d0", w=95, h=78)
c.text(235, 270, "入力と出力がはっきり言える", scale="caption", fill="#15803d")

c.sticky(460, 78, 370, 225, color="red")
c.text(645, 106, "向いていない", scale="label", fill="#b91c1c")
c.node(550, 190, "毎回判断が変わる", emoji_cp="1f3b2", w=95, h=78)
c.node(735, 190, "年 1 回だけ", emoji_cp="1f4c5", w=95, h=78)
c.text(645, 270, "ルールにできない・作る方が長い", scale="caption", fill="#b91c1c")
print(c.save("01-good-and-bad.svg"))

# 02: 大きな業務から、仕組みにする部分だけを切り出す
c = Canvas(880, 320)
c.text(440, 38, "全部やろうとせず、いちばん面倒な 1 ステップを切り出す", scale="heading")
whole = c.node(140, 180, "月次レポート作成", emoji_cp="1f4da", w=125, h=100)
cut = c.node(430, 180, "切り出す", emoji_cp="2702", shape="sticky", color="orange", w=160, h=72)
part = c.node(720, 180, "集計の部分だけ", emoji_cp="1f4ca", w=120, h=95)
c.link(whole, cut)
c.link(cut, part)
c.text(440, 296, "全部を一度にやろうとすると、40 分では何も完成しない", scale="caption", fill="#c2410c")
print(c.save("02-slice.svg"))
