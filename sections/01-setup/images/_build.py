import os
import sys
sys.path.insert(0, os.path.expanduser("~/.claude/skills/genfig"))
from genfig import Canvas

# overview: 使う道具は 3 つだけ。Codex がフォルダに作り、ブラウザで開く
c = Canvas(860, 330)
c.text(430, 38, "使う道具は 3 つだけ。コマンドは打たない", scale="heading")

c.sticky(40, 72, 780, 200, color="gray")
c.node(170, 165, "Codex アプリ", emoji_cp="1f916")
c.node(430, 165, "フォルダ", emoji_cp="1f4c1")
c.node(690, 165, "ブラウザ", emoji_cp="1f310")
c.connector(235, 150, 365, 150, label="ファイルを作る")
c.connector(495, 150, 625, 150, label="開いて使う")
c.text(170, 252, "言葉で頼む", scale="caption", fill="#475569")
c.text(430, 252, "できたものが置かれる", scale="caption", fill="#475569")
c.text(690, 252, "作ったツールが動く", scale="caption", fill="#475569")

c.text(430, 308, "当日までに Codex を入れて、サインインしておけば準備は完了", scale="caption", fill="#475569")
print(c.save("overview.svg"))
