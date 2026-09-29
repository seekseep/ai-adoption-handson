import sys
sys.path.insert(0, "/Users/seekseep/.claude/skills/genfig")
from genfig import Canvas

# 00: ChatGPT アプリの中に Codex があり、指定したフォルダの中だけを触る
c = Canvas(820, 300)
c.text(410, 38, "Codex は ChatGPT アプリの中にあり、渡したフォルダの中だけで働く", scale="heading")
box = c.sticky(60, 78, 300, 170, color="blue")
c.text(210, 106, "ChatGPT アプリ", scale="label", fill="#1d4ed8")
codex = c.node(210, 175, "Codex", emoji_cp="2699", shape="sticky", color="green", w=180, h=84)
folder = c.node(640, 165, "指定したフォルダ", emoji_cp="1f4c2", w=150, h=110)
c.link(codex, folder, label="ここだけを触る")
print(c.save("00-thumbnail.svg"))

# 01: Chat と Work の 2 モード
c = Canvas(820, 330)
c.text(410, 38, "同じアプリの中に、2 つのモードがある", scale="heading")
app = c.sticky(250, 66, 320, 232, color="gray")
c.text(410, 94, "ChatGPT アプリ", scale="label", fill="#475569")
chat = c.node(410, 150, "Chat", emoji_cp="1f4ac", shape="sticky", color="blue", w=230, h=64)
work = c.node(410, 250, "Work", emoji_cp="1f6e0", shape="sticky", color="green", w=230, h=64)
ask = c.node(90, 150, "質問する", emoji_cp="2753", w=110, h=88)
make = c.node(90, 250, "作らせる", emoji_cp="1f4c1", w=110, h=88)
out1 = c.node(730, 150, "答え", emoji_cp="1f4dd", w=110, h=88)
out2 = c.node(730, 250, "ファイル", emoji_cp="1f4c4", w=110, h=88)
c.link(ask, chat)
c.link(make, work)
c.link(chat, out1)
c.link(work, out2)
c.text(410, 314, "今日ずっと使うのは Work のほう", scale="caption", fill="#15803d")
print(c.save("01-chat-and-work.svg"))

# 02: 作業フォルダの内と外（対比で見せる。線を交差させない）
c = Canvas(860, 340)
c.text(430, 38, "Codex が触れるのは、渡したフォルダの中だけ", scale="heading")

c.sticky(50, 78, 360, 205, color="green")
c.text(230, 106, "渡したフォルダの中", scale="label", fill="#15803d")
codex = c.node(140, 190, "Codex", emoji_cp="2699", w=100, h=82)
doc = c.node(320, 190, "ファイル", emoji_cp="1f4c4", w=100, h=82)
c.link(codex, doc, label="自由に触れる", label_scale="caption")

c.sticky(450, 78, 360, 205, color="red")
c.text(630, 106, "フォルダの外", scale="label", fill="#b91c1c")
c.node(560, 190, "ほかのファイル", emoji_cp="1f5c4", w=100, h=82)
c.node(715, 190, "手が届かない", emoji_cp="26d4", w=100, h=82)

c.text(430, 316, "だから、作業用のフォルダは空の状態から新しく作る", scale="caption", fill="#b91c1c")
print(c.save("02-workspace.svg"))
