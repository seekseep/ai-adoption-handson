import sys
sys.path.insert(0, "/Users/seekseep/.claude/skills/genfig")
from genfig import Canvas

# 00: 送信と学習は別の段階。止められるのは後半だけ
c = Canvas(880, 290)
c.text(440, 38, "止められるのは「学習」だけ。「送信」は止まらない", scale="heading")
me = c.node(110, 175, "入力", emoji_cp="1f4dd", w=110, h=92)
server = c.node(400, 175, "OpenAI のサーバー", emoji_cp="1f5a5", w=135, h=100)
train = c.node(740, 175, "モデルの改善", emoji_cp="1f9e0", w=120, h=95)
c.link(me, server, label="送信（止まらない）")
c.link(server, train, label="学習（止められる）", dash="dashed", primary=False)
print(c.save("00-thumbnail.svg"))

# 01: 2 段階のうち、設定が効くのはどこか
c = Canvas(880, 320)
c.text(440, 36, "設定のスイッチが効くのは 2 段階目だけ", scale="heading")

c.sticky(60, 80, 360, 190, color="red")
c.text(240, 108, "1. 送信", scale="label", fill="#b91c1c")
c.node(175, 178, "必ず起きる", emoji_cp="1f4e4", w=100, h=82)
c.node(320, 178, "止められない", emoji_cp="26d4", w=100, h=82)
c.text(240, 248, "社外秘は設定に関係なく貼らない", scale="caption", fill="#b91c1c")

c.sticky(480, 80, 360, 190, color="green")
c.text(660, 108, "2. 学習", scale="label", fill="#15803d")
c.node(595, 178, "既定でオン", emoji_cp="1f9e0", w=100, h=82)
c.node(740, 178, "オフにできる", emoji_cp="2705", w=100, h=82)
c.text(660, 248, "設定 → データ制御 から切る", scale="caption", fill="#15803d")
print(c.save("01-send-vs-train.svg"))

# 02: 前からあるクラウドサービスと同じ判断でよい
c = Canvas(840, 290)
c.text(420, 38, "判断のしかたは、前からあるサービスと同じ", scale="heading")
a = c.node(150, 160, "クラウド保存", emoji_cp="2601", w=115, h=95)
b = c.node(420, 160, "チャットツール", emoji_cp="1f4ac", w=115, h=95)
d = c.node(690, 160, "生成 AI", emoji_cp="2699", w=115, h=95)
c.sticky(60, 228, 720, 46, color="gray")
c.text(420, 258, "どれも「社外のサービスにデータを預ける」。まず自社のルールを見る", scale="body", fill="#475569")
print(c.save("02-same-as-cloud.svg"))
