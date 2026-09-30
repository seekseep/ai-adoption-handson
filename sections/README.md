---
docs: true
title: 当日までの準備
sidebar:
  label: 当日までの準備
  order: 0
---

# 当日までの準備

当日は 3〜4 時間しかありません。インストールでつまずくと、それだけで時間が溶けてしまいます。
**次の 3 つだけは、当日までに済ませておいてください。**

## 1. ChatGPT のプランを確認する

Codex を使うには **ChatGPT Plus 以上**のプラン（Plus / Pro / Business / Enterprise / Edu）が必要です。
無料プランでも触れますが、途中で使用量の上限に当たって止まります。

<https://chatgpt.com/> にサインインして、左下のアカウント名から現在のプランを確認してください。
会社の Business / Enterprise プランを使う場合は、**管理者側で Codex が有効になっているか**も
確認しておくと確実です。

:::warning[会社のアカウントを使うとき]
Business / Enterprise プランでは、管理者が Codex の利用や外部への送信を制限していることがあります。
「使えると思っていたら当日ブロックされていた」が一番多い事故です。事前に情報システム部門に
確認してください。
:::

## 2. Codex アプリをインストールする

**Windows の場合** — Microsoft Store で「Codex」を検索してインストールします。

**Mac の場合** — <https://openai.com/codex/> から `.dmg` をダウンロードし、Codex を
アプリケーションフォルダにドラッグします。

インストールできたら起動して、ChatGPT アカウントでサインインし、**チャット画面が表示されるところまで**
確認してください。詳しい手順とつまずきどころは [Codex をインストールする](./01-setup/01-codex-app/LECTURE.md)
にあります。

:::notice[Mac で「開けません」と出たら]
公式サイトのトップにあるダウンロードは Apple Silicon（M1 以降）向けです。Intel の Mac だと
インストールできても起動に失敗します。その場合は当日サポートしますので、無理せず
そのまま来てください。
:::

## 3. 作業用のフォルダを 1 つ作る

Codex は「このフォルダの中で作業してください」とフォルダを指定して使います。デスクトップに
`handson` という名前の空フォルダを 1 つ作っておいてください。中身は当日作ります。

## 当日のセクション一覧

### 01. 環境構築

- [Codex をインストールする](./01-setup/01-codex-app/LECTURE.md)
- [Python をインストールする（参考）](./01-setup/02-python/LECTURE.md)
- [Node.js をインストールする（参考）](./01-setup/03-nodejs/LECTURE.md)

### 02. 座席表を作る

- [部屋と机を描く](./02-seating-chart/01-room/LECTURE.md)
- [使えない席を指定する](./02-seating-chart/02-unavailable/LECTURE.md)
- [席に番号を振る](./02-seating-chart/03-numbering/LECTURE.md)
- [席に名前を入れる](./02-seating-chart/04-names/LECTURE.md)
- [名簿の CSV からまとめて作る](./02-seating-chart/05-csv/LECTURE.md)

### 03. セキュリティの話

- [AI エージェントってなに？](./03-security/01-what-is-agent/LECTURE.md)
- [外に出してはいけないデータ](./03-security/02-data-to-protect/LECTURE.md)
- [学習されない設定](./03-security/03-training-optout/LECTURE.md)
- [AI エージェントに与える権限](./03-security/04-permissions/LECTURE.md)

### 04. データと仕組み

- [データからデータを作る](./04-data-and-logic/01-data-to-data/LECTURE.md)
- [仕組みからデータを作る](./04-data-and-logic/02-logic-to-data/LECTURE.md)
- [仕組みを Web アプリケーションにする](./04-data-and-logic/03-web-app/LECTURE.md)
- [Web 技術ってなに？](./04-data-and-logic/04-web-tech/LECTURE.md)

### 05. シフト表を作る

- [データをそのまま使う](./05-shift-table/01-raw-data/LECTURE.md)
- [データを隠して使う](./05-shift-table/02-masked-data/LECTURE.md)
- [データを渡さない仕組みを作る](./05-shift-table/03-local-logic/LECTURE.md)
- [データの行き先を確認する](./05-shift-table/04-data-flow/LECTURE.md)

### 06. 自分の業務に応用する

- [面倒な作業を探す](./06-apply/01-find-tasks/LECTURE.md)
- [Codex に相談しながら考える](./06-apply/02-design-with-codex/LECTURE.md)
- [題材カタログ](./06-apply/03-examples/LECTURE.md)
- [小さなツールを作ってみる](./06-apply/04-build/LECTURE.md)
- [質疑応答と持ち帰り](./06-apply/05-qa/LECTURE.md)

## 当日使う道具

ブラウザとフォルダの操作だけです。詳しくは [使う道具](./TOOLS.md) を見てください。
