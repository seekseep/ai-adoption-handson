// @ts-check
import { readFileSync } from 'node:fs';
import { fileURLToPath } from 'node:url';
import { defineConfig } from 'astro/config';
import starlight from '@astrojs/starlight';
import rehypeExternalLinks from 'rehype-external-links';
import remarkCallout from './src/plugins/remark-callout.mjs';
import remarkQuestions from './src/plugins/remark-questions.mjs';
import remarkDownload from './src/plugins/remark-download.mjs';
import remarkEditor from './src/plugins/remark-editor.mjs';
import remarkScript from './src/plugins/remark-script.mjs';
import remarkCode from './src/plugins/remark-code.mjs';
import remarkPrompt from './src/plugins/remark-prompt.mjs';
import ecLineNumbers from './src/plugins/ec-line-numbers.mjs';
import lectureSync from './src/integrations/lecture-sync.mjs';

// GitHub リポジトリ URL。sync-lectures.mjs / build-downloads.mjs が
// libs/astro-config.mjs 経由でここ（repoUrl）を読む。リポジトリを変えたらここだけ直す。
const repoUrl = 'https://github.com/seekseep/ai-adoption-handson';

// ◯✕クイズ（`:::questions`）の client スクリプト。全ページの <head> に inline で
// 注入し、`.quiz` が無いページでは何もしない。別ファイル参照だと base の解決や
// バンドルの都合が絡むので、内容をそのまま埋め込む。
const quizClient = readFileSync(
  fileURLToPath(new URL('./src/scripts/quiz-client.js', import.meta.url)),
  'utf8',
);

// 簡易エディタ UI（`.editor`）のファイル切り替え client。全ページに inline 注入。
const editorClient = readFileSync(
  fileURLToPath(new URL('./src/scripts/editor-client.js', import.meta.url)),
  'utf8',
);

// `:::script` の実行 client（<script type="text/plain" class="run-on-load"> を実行）。
const runScripts = readFileSync(
  fileURLToPath(new URL('./src/scripts/run-scripts.js', import.meta.url)),
  'utf8',
);

// `::preview` のライブプレビュー再読み込みボタンの client。全ページに inline 注入。
const previewClient = readFileSync(
  fileURLToPath(new URL('./src/scripts/preview-client.js', import.meta.url)),
  'utf8',
);

// `:::prompt` のコピーボタンの client。全ページに inline 注入。
const promptClient = readFileSync(
  fileURLToPath(new URL('./src/scripts/prompt-client.js', import.meta.url)),
  'utf8',
);

/**
 * カスタム callout（remark-callout.mjs）を Starlight 標準の asides より「前」に
 * 登録するためのインライン統合。Starlight は astro:config:setup で自身の remark
 * プラグインを processor へ push するため、それより先に走るこの統合で push して
 * おくことで、`:::danger` の名前衝突を Starlight に横取りされる前に解消する。
 * （directive のパース拡張は Starlight 側の remark-directive が供給するので、ここでは
 *  変換プラグインだけ登録すればよい。）
 */
function calloutIntegration() {
  return {
    name: 'handson-callout',
    hooks: {
      'astro:config:setup': ({ config }) => {
        config.markdown.processor?.options.remarkPlugins.push(remarkCallout);
        // `:::questions` の変換。名前衝突は無いので順序は問わない。
        config.markdown.processor?.options.remarkPlugins.push(remarkQuestions);
        // `:::download` を大きなダウンロードボタンに変換。名前衝突なし。
        config.markdown.processor?.options.remarkPlugins.push(remarkDownload);
        // `::::editor` を簡易エディタ UI（<section class="editor">）に変換。
        config.markdown.processor?.options.remarkPlugins.push(remarkEditor);
        // `:::script` を「表示＋このページで実行」に変換。
        config.markdown.processor?.options.remarkPlugins.push(remarkScript);
        // `:::code{filepath=... offset=...}` をファイル名 + 行番号つきコードに変換。
        config.markdown.processor?.options.remarkPlugins.push(remarkCode);
        // `:::prompt` を「Codex アプリの入力欄に貼った状態」の見た目に変換。
        config.markdown.processor?.options.remarkPlugins.push(remarkPrompt);
      },
    },
  };
}

export default defineConfig({
  site: 'https://seekseep.github.io',
  base: '/ai-adoption-handson',
  trailingSlash: 'always',
  markdown: {
    rehypePlugins: [
      [
        rehypeExternalLinks,
        {
          target: '_blank',
          rel: ['noopener', 'noreferrer'],
          // 外部リンクであることを示すアイコン用のクラス。装飾は external-links.css 側で付ける。
          properties: { class: 'external-link' },
        },
      ],
    ],
  },
  integrations: [
    // dev 中に sections/**・README.md を監視して src/content/docs を再生成（HMR 用）。
    lectureSync(),
    // starlight より前に登録して、callout 変換を asides より先に走らせる。
    calloutIntegration(),
    starlight({
      title: 'AI エージェント業務活用ハンズオン',
      description: 'Codex で座席表とシフト表を作りながら、AI エージェントの使い方と安全な線引きを身につける',
      customCss: [
        './src/styles/readability.css',
        './src/styles/external-links.css',
        './src/styles/callouts.css',
        './src/styles/quiz.css',
        './src/styles/download.css',
        './src/styles/editor.css',
        './src/styles/code.css',
        './src/styles/prompt.css',
      ],
      // `:::code` が付けた startLineNumber / startNewLineNumber を読んで
      // ガターに行番号を出す自作プラグイン。それ以外のコードブロックには何もしない。
      expressiveCode: {
        plugins: [ecLineNumbers()],
      },
      head: [
        // ◯✕クイズの client スクリプトを全ページに注入する。
        { tag: 'script', content: quizClient },
        // 簡易エディタ UI のファイル切り替え client。
        { tag: 'script', content: editorClient },
        // `:::script` の実行 client。
        { tag: 'script', content: runScripts },
        // `::preview` の再読み込みボタン client。
        { tag: 'script', content: previewClient },
        // `:::prompt` のコピーボタン client。
        { tag: 'script', content: promptClient },
      ],
      // 右側（スマホでは上）の「目次」は出さない。1 ページが短く、受講者が迷う要素を減らすため。
      tableOfContents: false,
      defaultLocale: 'root',
      locales: {
        root: { label: '日本語', lang: 'ja' },
      },
      social: [
        { icon: 'github', label: 'GitHub', href: repoUrl },
      ],
      sidebar: [
        { label: 'はじめに', link: '/' },
        {
          // セットアップ用ページ（sections/*.md）。
          label: '準備',
          items: [
            { label: '当日までの準備', link: '/getting-started/' },
            { label: '使う道具', link: '/tools/' },
          ],
        },
        // レクチャーのセクション。sections/<NN-name>/ を足したらここにも足す。
        // Starlight v0.39+ では autogenerate を items 配列に入れる（label と autogenerate を同階層に書けない）。
        { label: '01. 環境構築', items: [{ autogenerate: { directory: '01-setup' } }] },
        { label: '02. 座席表を作る', items: [{ autogenerate: { directory: '02-seating-chart' } }] },
        { label: '03. セキュリティの話', items: [{ autogenerate: { directory: '03-security' } }] },
        { label: '04. データと仕組み', items: [{ autogenerate: { directory: '04-data-and-logic' } }] },
        { label: '05. シフト表を作る', items: [{ autogenerate: { directory: '05-shift-table' } }] },
        { label: '06. 自分の業務に応用する', items: [{ autogenerate: { directory: '06-apply' } }] },
      ],
      editLink: {
        baseUrl: `${repoUrl}/edit/main/`,
      },
      lastUpdated: true,
    }),
  ],
});
