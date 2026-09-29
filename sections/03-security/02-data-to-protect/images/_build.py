import sys
sys.path.insert(0, "/Users/seekseep/.claude/skills/genfig")
from genfig import Canvas

# 00: 入力した文字は必ず社外のサーバーへ行く
c = Canvas(900, 290)
c.text(450, 38, "入力欄に書いた文字は、必ず社外のサーバーに届く", scale="heading")
me = c.node(115, 175, "入力する", emoji_cp="1f464", w=115, h=95)
app = c.node(340, 175, "Codex", emoji_cp="2699", w=110, h=90)
net = c.node(565, 175, "インターネット", emoji_cp="2601", w=115, h=95)
server = c.node(785, 175, "OpenAI のサーバー", emoji_cp="1f5a5", w=115, h=95)
c.link(me, app)
c.link(app, net)
c.link(net, server)
print(c.save("00-thumbnail.svg"))

# 01: 判断に迷ったときの 3 つの問い
c = Canvas(880, 330)
c.text(440, 36, "迷ったら、この 3 つを自分に聞く", scale="heading")
q1 = c.node(160, 145, "自社サイトに\n載っていても平気か", shape="sticky", color="yellow", w=230, h=90, label_scale="body")
q2 = c.node(440, 145, "他社に見られて\n困る人がいるか", shape="sticky", color="yellow", w=230, h=90, label_scale="body")
q3 = c.node(720, 145, "上司に説明\nできるか", shape="sticky", color="yellow", w=230, h=90, label_scale="body")
ok = c.node(280, 268, "渡してよい", emoji_cp="2705", shape="sticky", color="green", w=210, h=66)
ng = c.node(610, 268, "渡さない", emoji_cp="26d4", shape="sticky", color="red", w=210, h=66)
c.link(q1, ok, primary=False)
c.link(q2, ng, primary=False)
c.link(q3, ng, primary=False)
print(c.save("01-three-questions.svg"))
