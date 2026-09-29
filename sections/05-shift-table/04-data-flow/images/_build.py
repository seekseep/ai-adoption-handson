import sys
sys.path.insert(0, "/Users/seekseep/.claude/skills/genfig")
from genfig import Canvas

# 00: 通信の記録が空であることを自分の目で確かめる
c = Canvas(840, 290)
c.text(420, 38, "「通信していない」を、自分の目で確かめる", scale="heading")
page = c.node(150, 170, "手元のツール", emoji_cp="1f4c4", w=120, h=95)
tool = c.node(420, 170, "開発者ツール", emoji_cp="1f50d", shape="sticky", color="blue", w=185, h=74)
empty = c.node(700, 170, "通信 0 件", emoji_cp="2705", w=120, h=95)
c.link(page, tool, label="記録を見る")
c.link(tool, empty)
print(c.save("00-thumbnail.svg"))

# 01: 操作しても、通信の一覧は増えない
c = Canvas(880, 340)
c.text(440, 36, "何を操作しても、一覧は増えない", scale="heading")
a = c.node(130, 120, "名前を打つ", emoji_cp="2328", w=105, h=85)
b = c.node(130, 245, "ボタンを押す", emoji_cp="1f5b1", w=105, h=85)
d = c.node(330, 185, "CSV を保存", emoji_cp="1f4be", w=105, h=85)
c.sticky(520, 90, 320, 195, color="gray")
c.text(680, 118, "Network タブ", scale="label", fill="#475569")
empty = c.node(680, 200, "増えたもの 0 件", emoji_cp="2705", w=110, h=88)
for n in (a, b, d):
    c.link(n, empty, primary=False, dash="dashed", head=False)
c.text(440, 320, "アドレスバーが file:/// なら、自分の PC のファイル", scale="caption", fill="#475569")
print(c.save("01-nothing-added.svg"))

# 02: 一般的な Web ページと、手元のツールの違い
c = Canvas(880, 330)
c.text(440, 36, "同じブラウザでも、通信の量がまるで違う", scale="heading")

c.sticky(50, 78, 370, 210, color="orange")
c.text(235, 106, "インターネット上のページ", scale="label", fill="#c2410c")
c.node(145, 190, "画像・広告", emoji_cp="1f5bc", w=95, h=80)
c.node(325, 190, "何十件も通信", emoji_cp="2601", w=95, h=80)
c.text(235, 268, "開いただけで外とつながる", scale="caption", fill="#c2410c")

c.sticky(460, 78, 370, 210, color="green")
c.text(645, 106, "手元の HTML ファイル", scale="label", fill="#15803d")
c.node(555, 190, "同じフォルダ", emoji_cp="1f4c2", w=95, h=80)
c.node(735, 190, "外への通信 0", emoji_cp="2705", w=95, h=80)
c.text(645, 268, "PC の中で完結する", scale="caption", fill="#15803d")
print(c.save("02-compare.svg"))

# 03: 作るときは通信する。使うときはしない
c = Canvas(880, 350)
c.text(440, 36, "通信するのは「作るとき」だけ", scale="heading")

c.sticky(50, 78, 370, 220, color="orange")
c.text(235, 106, "作るとき", scale="label", fill="#c2410c")
c.node(140, 190, "条件の説明", emoji_cp="1f4d0", w=95, h=80)
c.node(325, 190, "OpenAI へ", emoji_cp="2601", w=95, h=80)
c.text(235, 272, "個人情報は入っていない", scale="caption", fill="#c2410c")

c.sticky(460, 78, 370, 220, color="green")
c.text(645, 106, "使うとき", scale="label", fill="#15803d")
c.node(550, 190, "実データ", emoji_cp="1f4cb", w=95, h=80)
c.node(735, 190, "通信しない", emoji_cp="26d4", w=95, h=80)
c.text(645, 272, "実データはここで初めて登場する", scale="caption", fill="#15803d")
print(c.save("03-build-vs-use.svg"))
