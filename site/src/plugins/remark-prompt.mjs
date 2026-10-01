/**
 * `:::prompt` コンテナディレクティブを「Codex アプリの入力欄に貼った状態」の見た目に変換する
 * remark プラグイン。
 *
 * 受講者が「どこに・何を貼るのか」をひと目で分かるよう、Codex アプリの左のメニューと
 * プロジェクトの一覧を描き、その上に重ねた入力欄の中にプロンプトを置く。
 * 見た目は雰囲気だけで、ウィンドウの閉じるボタンなどは描かない（Windows と Mac で違うため）。
 * チャットのやりとりも描かない。主役は入力欄の中のプロンプト。
 * コピーボタンの動きは src/scripts/prompt-client.js、装飾は src/styles/prompt.css。
 *
 * 使い方（Markdown）:
 *   :::prompt{project="座席表"}
 *   ```text
 *   ここに Codex に貼る文
 *   ```
 *   :::
 *
 * project を省くと、プロジェクト名は「作業フォルダ」になる。
 */

/** 子ノードを再帰的にたどって最初の code ノードを返す。 */
function findFirstCode(node) {
  if (!node) return null;
  if (node.type === 'code') return node;
  if (!Array.isArray(node.children)) return null;
  for (const child of node.children) {
    const found = findFirstCode(child);
    if (found) return found;
  }
  return null;
}

/** containerDirective を再帰的に拾うシンプルな visitor。 */
function visit(node, callback) {
  if (!node || !Array.isArray(node.children)) return;
  for (const child of node.children) {
    callback(child);
    visit(child, callback);
  }
}

function escapeHtml(s) {
  return String(s)
    .replace(/&/g, '&amp;')
    .replace(/</g, '&lt;')
    .replace(/>/g, '&gt;')
    .replace(/"/g, '&quot;');
}

// 左端のアイコン列。Codex アプリの雰囲気が出れば十分なので、線だけの簡単な形にする。
const svg = (d) =>
  `<svg viewBox="0 0 24 24" aria-hidden="true" fill="none" stroke="currentColor" stroke-width="1.8" stroke-linecap="round" stroke-linejoin="round">${d}</svg>`;
const ICONS = {
  home: svg('<path d="M4 11l8-7 8 7v8a1 1 0 0 1-1 1h-4v-6h-6v6H5a1 1 0 0 1-1-1z"/>'),
  clock: svg('<circle cx="12" cy="12" r="8"/><path d="M12 8v4l3 2"/>'),
  books: svg('<path d="M5 4h3v16H5zM10 4h3v16h-3zM15 5l3-1 3 15-3 1z"/>'),
  plugin: svg('<rect x="4" y="9" width="8" height="8" rx="2"/><rect x="10" y="4" width="8" height="8" rx="2"/>'),
  at: svg('<circle cx="12" cy="12" r="3.5"/><path d="M15.5 12v1.5a2.5 2.5 0 0 0 5 0V12a8.5 8.5 0 1 0-3.4 6.8"/>'),
  more: svg('<circle cx="6" cy="12" r="1"/><circle cx="12" cy="12" r="1"/><circle cx="18" cy="12" r="1"/>'),
  branch: svg('<circle cx="7" cy="6" r="2"/><circle cx="7" cy="18" r="2"/><circle cx="17" cy="8" r="2"/><path d="M7 8v8M17 10c0 4-10 2-10 6"/>'),
  edit: svg('<path d="M12 20h8"/><path d="M16.5 3.5a2.1 2.1 0 0 1 3 3L7 19l-4 1 1-4z"/>'),
  folder: svg('<path d="M3 7a2 2 0 0 1 2-2h4l2 2h8a2 2 0 0 1 2 2v8a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2z"/>'),
  plus: svg('<path d="M12 5v14M5 12h14"/>'),
  shield: svg('<path d="M12 3l7 3v5c0 4.5-3 8-7 10-4-2-7-5.5-7-10V6z"/>'),
  mic: svg('<rect x="9" y="3" width="6" height="11" rx="3"/><path d="M5 11a7 7 0 0 0 14 0M12 18v3"/>'),
  send: svg('<path d="M12 19V5M5 12l7-7 7 7"/>'),
  copy: svg('<rect x="8" y="8" width="12" height="12" rx="2"/><path d="M16 8V6a2 2 0 0 0-2-2H6a2 2 0 0 0-2 2v8a2 2 0 0 0 2 2h2"/>'),
};

function buildHtml(text, project) {
  const rail = ['home', 'clock', 'books', 'plugin', 'at', 'more', 'branch']
    .map((name) => `<span class="codex-prompt__rail-icon">${ICONS[name]}</span>`)
    .join('');
  return (
    `<figure class="codex-prompt">` +
    `<div class="codex-prompt__app">` +
    `<div class="codex-prompt__rail" aria-hidden="true">${rail}</div>` +
    `<div class="codex-prompt__side" aria-hidden="true">` +
    `<div class="codex-prompt__brand">Codex <span class="codex-prompt__caret">⌄</span></div>` +
    `<div class="codex-prompt__item">${ICONS.edit}新しいチャット</div>` +
    `<div class="codex-prompt__label">プロジェクト</div>` +
    `<div class="codex-prompt__item codex-prompt__item--active">${ICONS.folder}${escapeHtml(project)}</div>` +
    `</div>` +
    `<div class="codex-prompt__main">` +
    `<div class="codex-prompt__composer">` +
    `<div class="codex-prompt__head">` +
    `<span class="codex-prompt__hint">この文を Codex の入力欄に貼ります</span>` +
    `<button type="button" class="codex-prompt__copy">${ICONS.copy}<span class="codex-prompt__copy-label">コピー</span></button>` +
    `</div>` +
    `<pre class="codex-prompt__text">${escapeHtml(text)}</pre>` +
    `<div class="codex-prompt__bar" aria-hidden="true">` +
    `<span class="codex-prompt__tool">${ICONS.plus}</span>` +
    `<span class="codex-prompt__chip">${ICONS.shield}確認してもらう</span>` +
    `<span class="codex-prompt__spacer"></span>` +
    `<span class="codex-prompt__tool">${ICONS.mic}</span>` +
    `<span class="codex-prompt__send">${ICONS.send}</span>` +
    `</div>` +
    `</div>` +
    `</div>` +
    `</div>` +
    `</figure>`
  );
}

export default function remarkPrompt() {
  return (tree) => {
    visit(tree, (node) => {
      if (node.type !== 'containerDirective') return;
      if (node.name !== 'prompt') return;
      const code = findFirstCode(node);
      if (!code) return;
      const project = (node.attributes && node.attributes.project) || '作業フォルダ';
      // 子を持たない html ノードに置き換える。中のコードブロックは Expressive Code に渡さない。
      node.type = 'html';
      node.value = buildHtml(code.value, project);
      delete node.children;
      delete node.name;
      delete node.attributes;
    });
  };
}
