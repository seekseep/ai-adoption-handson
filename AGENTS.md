# AGENTS.md - プロジェクト方針

## プロジェクト概要

「AI エージェント業務活用ハンズオン」の教材リポジトリ。Codex デスクトップアプリを使って座席表と
シフト表を作りながら、AI エージェントの使い方と、社内データの線引きを学ぶ半日（3〜4 時間）の教材。

**受講者は非エンジニア中心。Windows を主な想定**（Mac は補足として併記する）。コマンドを打つ手順は
原則として書かない。教材は「Codex に何と言うか」と「出てきたものをどう確かめるか」で構成する。

## 用語：セクションとレクチャー

| 用語 | 指すもの | 例 |
|---|---|---|
| **セクション** | テーマで束ねた親ディレクトリ（`sections/<section>/`） | `02-seating-chart/` |
| **レクチャー** | 1 つのステップ（`sections/<section>/<lecture>/`） | `02-seating-chart/01-room/` |

- レクチャーは `README.md`（プロジェクト説明）と `LECTURE.md`（教材本文, `docs: true`）を持つ
- ディレクトリ名は `NN-<slug>`。番号がサイト sidebar の並び順になる
- 説明図は各レクチャーの `images/` に SVG で置く（`00-thumbnail.svg` を先頭サムネに）

## 技術スタック：静的ブラウザアプリ（ビルドなし）

サンプルはすべて**ブラウザだけで動く静的アプリ**。npm・bundler・パッケージ管理を使わず、
レクチャーに `package.json` は置かない。

- 動くコードは `<lec>/example/`（`index.html` ＋ `main.js` ＋ 必要なら `style.css`）
- **`index.html` をダブルクリックして `file://` で開けば動く**ことを絶対条件にする。
  受講者に簡易サーバーを立てさせないため、`fetch()` でローカルファイルを読む実装は禁止。
  データの入力は `<textarea>` への貼り付けか `<input type="file">` で行う
- ライブラリは原則使わない。必要なら CDN（cdnjs）から `<script>` で読み、バージョンは
  `npm view <pkg> version` で確認して URL に固定する
- ES モジュールは使わず、`<script defer>` を読み込み順に並べる
- 前の節の `example/` をコピーして差分を足す。フォルダをまたぐ共有ファイルは作らない
- 解説用の小さなデモは `<lec>/demos/<name>/index.html`（複数可・ZIP には入らない）

### 外部通信をしない

**教材のサンプルは一切ネットワーク通信をしない。** これは実装の都合ではなく教材の芯で、
`05-shift-table/04-data-flow` で受講者が DevTools の Network タブを開いて
「通信が 0 件であること」を自分の目で確認する。CDN 読み込みもここでは通信として見えるので、
`05-shift-table/` 配下の `example/` では CDN も使わない。

### 配布 ZIP のルートフォルダ名

`site/scripts/libs/naming.mjs` の `EXAMPLE_ZIP_ROOTS` でセクションごとに決める
（`02-seating-chart` → `seating-chart/`、`05-shift-table` → `shift-table/`、既定は `app/`）。
同じセクション内のどの節を解凍しても同じ名前になるので、前のフォルダに上書き展開して育てられる。

### 共通

- **JavaScript で書く。TypeScript は使わない**
- サイト: @astrojs/starlight（`site/`）

## ディレクトリ構成

```text
/README.md              リポジトリ全体の説明（サイトのトップになる）
/AGENTS.md              本ファイル（プロジェクト方針・目次の単一の情報源）
/sections/              セクション群（教材本体, 単一の情報源）
  README.md             当日までの準備 → /getting-started/
  TOOLS.md              使う道具 → /tools/
/site/                  @astrojs/starlight の解説サイト（sections を取り込んで生成）
/.github/workflows/     GitHub Pages デプロイ
```

## サイトへの公開ルール

- frontmatter に `docs: true` を持つマークダウンだけが `site/scripts/sync-lectures.mjs` に拾われ、
  Starlight のページになる
- 文章は必ず `sections/` 側に書く。`site/src/content/docs/` は自動生成なので直接編集しない
- 相対リンクは sync スクリプトが自動変換する（他レクチャー → サイト内 URL、ソースコード → GitHub blob、
  画像 → GitHub raw）
- **コード（`::codeview`）はページに出さない。** `example/` を持つレクチャーは末尾に
  `:::download` で完成例の ZIP ボタンを置く（`[完成例をダウンロード](./project.zip)`）
- 成果物が画像になる教材（座席表など）は、アプリの画面（`::preview`）ではなく
  **保存される画像そのもの**を「できあがりの見本」として確認ポイントの前に載せる（`images/result.png`）
- セクションを追加したら `site/astro.config.mjs` の `sidebar` にも足す

## 教材本文の書き方

受講者は非エンジニア。次を守る。

- **コードを写させない・見せない。** 本文の主役は「Codex に投げるプロンプト」。コードは
  完成例の ZIP に任せ、本文では要点だけ日本語で説明する
- **プロンプトはコピーできる形で置く。** テキストのコードブロックにそのまま貼れる文面を書く
- **確認のしかたを必ず書く。** 「〜が見えれば成功」を各節に置く。AI の出力は毎回違うので、
  「同じ画面になる」ではなく「この条件を満たす」で判定させる
- **うまくいかないときの逃げ道を書く。** 完成例のプレビューと ZIP があることを示す
- `:::questions` の ◯✕ クイズは、セキュリティの理解確認に使う
- 専門用語を出すときは、初出でひとこと言い換えを添える

## コーディングルール

- JavaScript。TypeScript は使わない
- 過剰な抽象化をしない。設定オブジェクトを変数に切り出さず直書きし、上から手続き的に書く
- 1 ファイルを大きくしすぎない
- コメントは「なぜ」を書く。受講者が Codex に「ここ何してるの」と聞ける粒度にする
