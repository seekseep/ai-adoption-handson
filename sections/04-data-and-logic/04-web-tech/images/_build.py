import sys
sys.path.insert(0, "/Users/seekseep/.claude/skills/genfig")
from genfig import Canvas

# 00: ホームページの技術が、いろいろなことに広がった
c = Canvas(880, 320)
c.text(440, 38, "もとはホームページの技術。いまはこれだけできる", scale="heading")
base = c.node(120, 175, "HTML", emoji_cp="1f310", shape="sticky", color="blue", w=150, h=84)
a = c.node(420, 105, "画面を作る", emoji_cp="1f5b1", w=105, h=88)
b = c.node(600, 105, "計算する", emoji_cp="1f9ee", w=105, h=88)
d = c.node(420, 250, "図を描く", emoji_cp="1f4ca", w=105, h=88)
e = c.node(600, 250, "ファイルを読む", emoji_cp="1f4c4", w=105, h=88)
for n in (a, b, d, e):
    c.link(base, n, primary=False)
print(c.save("00-thumbnail.svg"))

# 01: HTML ファイルを渡すだけで、相手のブラウザで動く
c = Canvas(880, 290)
c.text(440, 38, "ファイルを渡すだけ。インストールは要らない", scale="heading")
me = c.node(130, 175, "自分", emoji_cp="1f464", w=110, h=90)
file = c.node(400, 175, "HTML ファイル", emoji_cp="1f4c4", w=120, h=95)
other = c.node(680, 175, "相手のブラウザ", emoji_cp="1f310", w=120, h=95)
c.link(me, file, label="メール・共有フォルダ", label_scale="caption")
c.link(file, other, label="開くだけで動く", label_scale="caption")
print(c.save("01-just-a-file.svg"))
