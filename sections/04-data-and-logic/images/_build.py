import os
import sys
sys.path.insert(0, os.path.expanduser("~/.claude/skills/genfig"))
from genfig import Canvas

# overview: 成果物を毎回つくらせるか、仕組みを一度つくらせて自分（や他の人）が使うか
c = Canvas(860, 400)
c.text(430, 36, "成果物をつくらせるか、仕組みをつくらせるか", scale="heading")

c.sticky(40, 70, 370, 250, color="orange")
c.text(225, 98, "成果物を直接つくらせる", scale="label", fill="#c2410c")
c.node(110, 180, "データ", emoji_cp="1f4cb", w=90, h=85, label_scale="label")
c.node(225, 180, "AI", emoji_cp="1f916", w=90, h=85, label_scale="label")
c.node(340, 180, "成果物", emoji_cp="1f4c4", w=90, h=85, label_scale="label")
c.connector(150, 165, 185, 165)
c.connector(265, 165, 300, 165)
c.text(225, 276, "毎回データを渡す", scale="body", fill="#c2410c")
c.text(225, 300, "中身が変わるたびに頼み直し", scale="caption", fill="#c2410c")

c.sticky(450, 70, 370, 250, color="green")
c.text(635, 98, "仕組みをつくらせて、自分で使う", scale="label", fill="#15803d")
c.node(520, 180, "AI", emoji_cp="1f916", w=90, h=85, label_scale="label")
c.node(635, 180, "仕組み", emoji_cp="1f6e0", w=90, h=85, label_scale="label")
c.node(750, 180, "人も使える", emoji_cp="1f465", w=90, h=85, label_scale="label")
c.connector(560, 165, 595, 165)
c.connector(675, 165, 710, 165)
c.text(635, 276, "データは手元から出ない", scale="body", fill="#15803d")
c.text(635, 300, "頼むのは一度だけ。何度でも・人にも使える", scale="caption", fill="#15803d")

c.text(430, 360, "同じシフト表を両方のやり方で作って、AI に渡したものを比べる", scale="caption", fill="#475569")
print(c.save("overview.svg"))
