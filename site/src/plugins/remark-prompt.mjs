/**
 * `:::prompt` コンテナディレクティブを「Codex アプリの入力欄に貼った状態」の見た目に変換する
 * remark プラグイン。
 *
 * 受講者が「どこに・何を貼るのか」をひと目で分かるよう、Codex アプリの左のアイコン列の上に
 * プロジェクトの一覧と本文を 1 枚のペインとして重ね、本文の入力欄の中にプロンプトを置く。
 * 見た目は雰囲気だけで、ウィンドウの閉じるボタンなどは描かない（Windows と Mac で違うため）。
 * チャットのやりとりも描かない。主役は入力欄の中のプロンプト。
 * 入力欄はその場で書き換えられ、書き換えた内容はブラウザ（localStorage）に一定間隔で保存される。
 * 右下の「元に戻す」で教材の文面に戻し、「コピー」でクリップボードに入れる。
 * 動きは src/scripts/prompt-client.js、装飾は src/styles/prompt.css。
 *
 * 使い方（Markdown）:
 *   :::prompt{project="座席表"}
 *   ```text
 *   ここに Codex に貼る文
 *   ```
 *   :::
 *
 * project を省くと、プロジェクト名は「作業フォルダ」になる。
 *
 * ファイルを添付して頼む場面では、attachments に「ファイル名とタイプ」の配列を JSON で書く。
 * 入力欄の上に、Codex アプリの添付と同じようなカードが並ぶ（中身は描かない。添付していることが分かれば十分）。
 *   :::prompt{project="座席表" attachments='[{"name":"names.csv","type":"csv"}]'}
 * type は csv / excel / image / pdf / text。それ以外はふつうのファイルのアイコンになる。
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
  folder: svg('<path d="M3 7a2 2 0 0 1 2-2h4l2 2h8a2 2 0 0 1 2 2v8a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2z"/>'),
  undo: svg('<path d="M9 14L4 9l5-5"/><path d="M4 9h10a6 6 0 0 1 0 12h-3"/>'),
  copy: svg('<rect x="8" y="8" width="12" height="12" rx="2"/><path d="M16 8V6a2 2 0 0 0-2-2H6a2 2 0 0 0-2 2v8a2 2 0 0 0 2 2h2"/>'),
};

// 添付ファイルのタイプごとのアイコンと色。Codex アプリの添付カードの雰囲気に合わせる
const FILE_TYPES = {
  csv: { color: '#16a34a', icon: svg('<rect x="4" y="4" width="16" height="16" rx="2"/><path d="M4 10h16M4 15h16M10 4v16"/>') },
  excel: { color: '#16a34a', icon: svg('<rect x="4" y="4" width="16" height="16" rx="2"/><path d="M4 10h16M4 15h16M10 4v16"/>') },
  image: { color: '#7c3aed', icon: svg('<rect x="4" y="5" width="16" height="14" rx="2"/><circle cx="9" cy="10" r="1.5"/><path d="M20 16l-5-5-8 8"/>') },
  pdf: { color: '#dc2626', icon: svg('<path d="M14 3H7a2 2 0 0 0-2 2v14a2 2 0 0 0 2 2h10a2 2 0 0 0 2-2V8z"/><path d="M14 3v5h5"/>') },
  text: { color: '#2563eb', icon: svg('<path d="M14 3H7a2 2 0 0 0-2 2v14a2 2 0 0 0 2 2h10a2 2 0 0 0 2-2V8z"/><path d="M14 3v5h5M9 13h6M9 17h4"/>') },
};
const FILE_DEFAULT = { color: '#6b7280', icon: FILE_TYPES.pdf.icon };

/** attachments 属性（JSON の配列）を読む。書き間違いはビルドを止めずに警告して無視する。 */
function parseAttachments(raw) {
  if (!raw) return [];
  try {
    const list = JSON.parse(raw);
    if (!Array.isArray(list)) throw new Error('配列ではありません');
    return list.filter((a) => a && typeof a.name === 'string');
  } catch (e) {
    console.warn(`[remark-prompt] attachments を読めませんでした: ${e.message} (${raw})`);
    return [];
  }
}

function buildAttachments(attachments) {
  if (attachments.length === 0) return '';
  const cards = attachments
    .map((a) => {
      const t = FILE_TYPES[String(a.type || '').toLowerCase()] || FILE_DEFAULT;
      return (
        `<div class="codex-prompt__file" style="--cp-file-color:${t.color}">` +
        // 上半分は中身のプレビューの代わり。何が入っているかは描かず、ファイルの形だけ見せる
        `<div class="codex-prompt__file-preview" aria-hidden="true"></div>` +
        `<div class="codex-prompt__file-name">${t.icon}<span>${escapeHtml(a.name)}</span></div>` +
        `</div>`
      );
    })
    .join('');
  return `<div class="codex-prompt__files" aria-label="添付ファイル">${cards}</div>`;
}

function buildHtml(text, project, attachments) {
  const rail = ['home', 'clock', 'books', 'plugin', 'at', 'more', 'branch']
    .map((name) => `<span class="codex-prompt__rail-icon">${ICONS[name]}</span>`)
    .join('');
  return (
    // not-content: Starlight が本文の要素どうしに付ける上の余白を、この部品の中では効かせない
    // （付くと「元に戻す」と「コピー」の高さがずれる）
    `<figure class="codex-prompt not-content">` +
    `<div class="codex-prompt__app">` +
    `<div class="codex-prompt__rail" aria-hidden="true">${rail}</div>` +
    // 一覧と本文は 1 枚のペインにまとめ、アイコン列の上に重ねる（Codex アプリと同じ重なり方）
    `<div class="codex-prompt__pane">` +
    `<div class="codex-prompt__side" aria-hidden="true">` +
    `<div class="codex-prompt__brand">Codex <span class="codex-prompt__caret">⌄</span></div>` +
    `<div class="codex-prompt__label">プロジェクト</div>` +
    `<div class="codex-prompt__item codex-prompt__item--active">${ICONS.folder}${escapeHtml(project)}</div>` +
    `</div>` +
    `<div class="codex-prompt__main">` +
    `<div class="codex-prompt__composer">` +
    buildAttachments(attachments) +
    // 教材の文面は textarea の初期値（defaultValue）として持ち、「元に戻す」で使う
    `<textarea class="codex-prompt__text" spellcheck="false" aria-label="Codex に貼るプロンプト（書き換えられます）">${escapeHtml(text)}</textarea>` +
    `<div class="codex-prompt__bar">` +
    `<button type="button" class="codex-prompt__button codex-prompt__reset" disabled>${ICONS.undo}元に戻す</button>` +
    `<button type="button" class="codex-prompt__button codex-prompt__copy">${ICONS.copy}<span class="codex-prompt__copy-label">コピー</span></button>` +
    `</div>` +
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
      const attachments = parseAttachments(node.attributes && node.attributes.attachments);
      node.value = buildHtml(code.value, project, attachments);
      delete node.children;
      delete node.name;
      delete node.attributes;
    });
  };
}
