import os
import sys
sys.path.insert(0, os.path.expanduser("~/.claude/skills/genfig"))
from genfig import Canvas

# overview: 自分の業務から課題を見つけ、相談し、作ってみて、持ち帰る
c = Canvas(860, 300)
c.text(430, 38, "自分の仕事を題材に、1 つ作ってみる", scale="heading")

steps = [
    ("1f50d", "課題を見つける", "毎月の面倒な手作業"),
    ("1f4ac", "Codex と相談", "何を入れて何を出すか"),
    ("1f6e0", "作ってみる", "完成しなくてよい"),
    ("1f64b", "質疑応答", "職場に持ち帰る"),
]
for i, (cp, label, note) in enumerate(steps):
    x = 115 + i * 210
    c.node(x, 150, label, emoji_cp=cp, w=150, h=90)
    c.text(x, 232, note, scale="caption", fill="#475569")
    if i < len(steps) - 1:
        c.connector(x + 60, 135, x + 150, 135)

c.text(430, 278, "「これはいける」「これは無理」が分かれば成功", scale="label", fill="#15803d")
print(c.save("overview.svg"))
