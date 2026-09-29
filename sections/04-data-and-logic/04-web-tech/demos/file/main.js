// 「ファイルを読む・書き出す」デモ。
//
// ブラウザは勝手にフォルダを見に行けない。人が選んだファイルだけを読める。
// 読んだ内容も、保存し直す内容も、このページの中だけで完結する。

const picker = document.querySelector('#picker');
const head = document.querySelector('#head');
const rows = document.querySelector('#rows');
const status = document.querySelector('#status');
const sampleButton = document.querySelector('#sample');
const saveButton = document.querySelector('#save');

let loadedText = '';

function saveText(text, filename) {
  // Blob はブラウザの中だけで作られるファイルの中身。サーバーは関わらない。
  const blob = new Blob([text], { type: 'text/csv;charset=utf-8' });
  const url = URL.createObjectURL(blob);
  const link = document.createElement('a');
  link.href = url;
  link.download = filename;
  link.click();
  URL.revokeObjectURL(url);
}

function showTable(text) {
  const lines = text
    .split(/\r?\n/)
    .map((line) => line.trim())
    .filter((line) => line !== '');

  head.textContent = '';
  rows.textContent = '';
  if (lines.length === 0) return;

  const headerRow = document.createElement('tr');
  for (const cell of lines[0].split(',')) {
    const th = document.createElement('th');
    th.textContent = cell;
    headerRow.append(th);
  }
  head.append(headerRow);

  for (const line of lines.slice(1)) {
    const tr = document.createElement('tr');
    for (const cell of line.split(',')) {
      const td = document.createElement('td');
      td.textContent = cell;
      tr.append(td);
    }
    rows.append(tr);
  }

  status.textContent = `${lines.length - 1} 行を読み込みました（この PC の中だけで処理しています）`;
  saveButton.disabled = false;
}

picker.addEventListener('change', () => {
  const file = picker.files[0];
  if (!file) return;

  const reader = new FileReader();
  reader.addEventListener('load', () => {
    loadedText = String(reader.result);
    showTable(loadedText);
  });
  reader.readAsText(file, 'utf-8');
});

sampleButton.addEventListener('click', () => {
  const csv = [
    '日付,件名,金額',
    '10/01,備品の発注,4800',
    '10/03,会議室の予約,0',
    '10/08,名刺の手配,3200',
  ].join('\n');
  saveText(csv, 'サンプル.csv');
});

saveButton.addEventListener('click', () => {
  if (!loadedText) return;
  saveText(loadedText, '保存し直した.csv');
});
