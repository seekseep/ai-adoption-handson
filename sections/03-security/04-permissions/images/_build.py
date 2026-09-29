import sys
sys.path.insert(0, "/Users/seekseep/.claude/skills/genfig")
from genfig import Canvas

# 00: 柵の内側と外側で、手の届く範囲が違う
c = Canvas(860, 330)
c.text(430, 38, "どこまで手を伸ばさせるかは、自分で決められる", scale="heading")

c.sticky(60, 78, 340, 200, color="green")
c.text(230, 106, "作業フォルダの中", scale="label", fill="#15803d")
c.node(160, 185, "自由に触る", emoji_cp="2699", w=100, h=82)
c.node(305, 185, "確認なし", emoji_cp="2705", w=100, h=82)

c.sticky(470, 78, 340, 200, color="orange")
c.text(640, 106, "フォルダの外・ネット", scale="label", fill="#c2410c")
c.node(570, 185, "止まって聞く", emoji_cp="270b", w=100, h=82)
c.node(715, 185, "自分が決める", emoji_cp="1f464", w=100, h=82)

c.text(430, 310, "既定は「確認してもらう」。変えるときは理由を持つ", scale="caption", fill="#475569")
print(c.save("00-thumbnail.svg"))

# 01: チャットは情報が出るだけ、エージェントは手元も変わる
c = Canvas(860, 340)
c.text(430, 36, "事故が起きたとき、何が変わるかが違う", scale="heading")

c.sticky(50, 78, 360, 215, color="blue")
c.text(230, 106, "Web でチャットする", scale="label", fill="#1d4ed8")
c.node(160, 190, "情報が出る", emoji_cp="1f4e4", w=105, h=85)
c.node(310, 190, "PC は無事", emoji_cp="1f4bb", w=105, h=85)
c.text(230, 270, "起きるのは情報の流出だけ", scale="caption", fill="#1d4ed8")

c.sticky(450, 78, 360, 215, color="red")
c.text(630, 106, "AI エージェント", scale="label", fill="#b91c1c")
c.node(560, 190, "情報が出る", emoji_cp="1f4e4", w=105, h=85)
c.node(710, 190, "ファイルも変わる", emoji_cp="1f5d1", w=105, h=85)
c.text(630, 270, "作る・書き換える・消せる", scale="caption", fill="#b91c1c")
print(c.save("01-chat-vs-agent.svg"))

# 02: 作業フォルダに紛れ込んだものは全部読まれる
c = Canvas(860, 330)
c.text(430, 38, "作業フォルダに置いてあるものは、全部読める範囲にある", scale="heading")
c.sticky(230, 80, 400, 200, color="orange")
c.text(430, 108, "デスクトップを作業フォルダにすると", scale="label", fill="#c2410c")
c.node(320, 185, "顧客リスト", emoji_cp="1f4d2", w=100, h=82)
c.node(445, 185, "見積書", emoji_cp="1f4c4", w=100, h=82)
c.node(560, 185, "画面写真", emoji_cp="1f5bc", w=100, h=82)
codex = c.node(95, 180, "Codex", emoji_cp="2699", w=105, h=88)
c.link(codex, (230, 180), label="全部読める", label_scale="caption")
c.text(430, 310, "頼んでいなくても「参考にしますね」で読まれうる", scale="caption", fill="#b91c1c")
print(c.save("02-folder-contents.svg"))

# 03: 部屋の鍵ではなく作業台を渡す
c = Canvas(860, 330)
c.text(430, 36, "渡すのは「作業台」であって「部屋の鍵」ではない", scale="heading")

c.sticky(50, 78, 360, 210, color="red")
c.text(230, 106, "部屋の鍵を渡す", scale="label", fill="#b91c1c")
c.node(160, 188, "全部の部屋", emoji_cp="1f3e2", w=105, h=85)
c.node(310, 188, "どこでも開く", emoji_cp="1f511", w=105, h=85)
c.text(230, 266, "何が起きたか追えなくなる", scale="caption", fill="#b91c1c")

c.sticky(450, 78, 360, 210, color="green")
c.text(630, 106, "作業台を渡す", scale="label", fill="#15803d")
c.node(555, 188, "必要なものだけ", emoji_cp="1f4e6", w=100, h=85)
c.node(710, 188, "終わったら片付け", emoji_cp="2705", w=100, h=85)
c.text(630, 266, "範囲が見えている", scale="caption", fill="#15803d")
print(c.save("03-workbench.svg"))
