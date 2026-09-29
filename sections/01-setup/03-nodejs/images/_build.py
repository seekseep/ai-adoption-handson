import sys
sys.path.insert(0, "/Users/seekseep/.claude/skills/genfig")
from genfig import Canvas

# 00: アプリ版とターミナル版は同じ Codex
c = Canvas(820, 300)
c.text(410, 38, "入口が違うだけで、中身も料金も同じ", scale="heading")
app = c.node(130, 120, "アプリ版", emoji_cp="1f5b1", w=115, h=90)
cli = c.node(130, 235, "ターミナル版", emoji_cp="2328", w=115, h=90)
node = c.node(390, 235, "Node.js", emoji_cp="1f4e6", shape="sticky", color="orange", w=150, h=64)
codex = c.node(675, 175, "Codex", emoji_cp="2699", shape="sticky", color="blue", w=160, h=80)
c.link(app, codex)
c.link(cli, node, label="必要", label_scale="caption")
c.link(node, codex)
print(c.save("00-thumbnail.svg"))

# 01: 4 つの入口。土台が要るのはターミナル版だけ
c = Canvas(860, 390)
c.text(430, 36, "Codex への入口は 4 つ。追加で入れるものが要るのは 1 つだけ", scale="heading")

c.text(150, 72, "そのまま使える", scale="label", fill="#15803d")
a = c.node(120, 132, "アプリ版", emoji_cp="1f5b1", w=105, h=86)
b = c.node(272, 162, "ブラウザ版", emoji_cp="1f310", w=105, h=86)
e = c.node(424, 192, "エディタ拡張", emoji_cp="1f4bb", w=105, h=86)

c.text(200, 268, "土台が要る", scale="label", fill="#c2410c")
d = c.node(120, 322, "ターミナル版", emoji_cp="2328", w=105, h=86)
node = c.node(320, 322, "Node.js", emoji_cp="1f4e6", shape="sticky", color="orange", w=155, h=62)

codex = c.node(735, 240, "Codex", emoji_cp="2699", shape="sticky", color="blue", w=160, h=82)

c.link(a, codex, primary=False)
c.link(b, codex, primary=False)
c.link(e, codex, primary=False)
c.link(d, node, label="必要", label_scale="caption")
c.link(node, codex)
print(c.save("01-four-entrances.svg"))
