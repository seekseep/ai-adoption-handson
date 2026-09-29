import sys
sys.path.insert(0, "/Users/seekseep/.claude/skills/genfig")
from genfig import Canvas

# 00: ChatGPT は答えを返すだけ / Codex は手があってファイルを操作できる
c = Canvas(820, 320)
c.text(410, 40, "同じ AI でも、手があるかどうかが違う", scale="heading")

person = c.node(110, 180, "自分", emoji_cp="1f464")
chat = c.node(400, 120, "ChatGPT", emoji_cp="1f4ac", shape="sticky", color="blue", w=190, h=74)
codex = c.node(400, 250, "Codex", emoji_cp="2699", shape="sticky", color="green", w=190, h=74)
answer = c.node(700, 120, "答えの文章", emoji_cp="1f4dd")
files = c.node(700, 250, "実際のファイル", emoji_cp="1f4c1")

c.link(person, chat, label="質問")
c.link(person, codex, label="依頼")
c.link(chat, answer, label="表示する")
c.link(codex, files, label="作る・直す")

print(c.save("00-thumbnail.svg"))

# 01: コピーして保存する手間があるかどうか
c = Canvas(860, 340)
c.text(430, 36, "ファイルになるまでの道のりが違う", scale="heading")

c.sticky(50, 78, 360, 215, color="blue")
c.text(230, 106, "ChatGPT", scale="label", fill="#1d4ed8")
a1 = c.node(125, 185, "画面に出る", emoji_cp="1f4dd", w=95, h=80)
a2 = c.node(245, 185, "コピー", emoji_cp="1f4cb", w=95, h=80)
a3 = c.node(350, 185, "保存", emoji_cp="1f4be", w=85, h=75)
c.link(a1, a2)
c.link(a2, a3)
c.text(230, 268, "自分の手で 2 段階", scale="caption", fill="#1d4ed8")

c.sticky(450, 78, 360, 215, color="green")
c.text(630, 106, "Codex", scale="label", fill="#15803d")
b1 = c.node(545, 185, "依頼", emoji_cp="1f5e3", w=95, h=80)
b2 = c.node(690, 185, "ファイルができる", emoji_cp="1f4c4", w=105, h=85)
c.link(b1, b2)
c.text(630, 268, "手を動かすのは Codex", scale="caption", fill="#15803d")
print(c.save("01-copy-vs-create.svg"))

# 02: 相談は ChatGPT、作業は Codex
c = Canvas(840, 390)
c.text(420, 36, "成果物がファイルとして残るかどうかで選ぶ", scale="heading")
q = c.node(420, 130, "やりたいこと", shape="diamond", color="yellow", w=250, h=110, label_scale="heading")
chat = c.node(170, 310, "ChatGPT", emoji_cp="1f4ac", shape="sticky", color="blue", w=230, h=80)
codex = c.node(670, 310, "Codex", emoji_cp="2699", shape="sticky", color="green", w=230, h=80)
c.link(q, chat, label="ファイルは残らない")
c.link(q, codex, label="ファイルが残る")
print(c.save("02-which-to-use.svg"))
