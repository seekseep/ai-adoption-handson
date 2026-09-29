// 自分の業務ツールを作るためのひな形。
//
// 「入力 → 処理 → 出力」の骨組みだけが入っている。
// このファイルごと Codex に渡して、「これをもとに〜を作って」と頼むのが速い。
//
// ブラウザだけで動く。通信は一切しない。この性質は必ず保つこと
// （Codex に頼むときも「通信しないでください」と毎回書く）。

// ---------------------------------------------------------------------------
// 最初から入れておくサンプル。自分の業務のデータに置き換える。
// ---------------------------------------------------------------------------

const sampleData = [
  '10/01 営業部 備品購入 4800',
  '10/03 総務部 会議室利用 0',
  '10/08 営業部 名刺作成 3200',
  '10/12 開発部 書籍購入 5600',
  '10/15 営業部 交通費 1980',
  '10/22 総務部 備品購入 2400',
].join('\n');

const sampleRules = ['並び順 金額'].join('\n');

const dataInput = document.querySelector('#data');
const rulesInput = document.querySelector('#rules');
const stepsList = document.querySelector('#steps');
const head = document.querySelector('#head');
const rows = document.querySelector('#rows');
const problemsList = document.querySelector('#problems');
const runButton = document.querySelector('#run');
const downloadButton = document.querySelector('#download');

dataInput.value = sampleData;
rulesInput.value = sampleRules;

// CSV に書き出すときに使い回すので、最後の結果を覚えておく。
let lastColumns = [];
let lastRows = [];

function readLines(textarea) {
  return textarea.value
    .split('\n')
    .map((line) => line.trim())
    .filter((line) => line !== '');
}

function addStep(text, detail) {
  const item = document.createElement('li');
  item.textContent = text;
  if (detail) {
    const span = document.createElement('span');
    span.className = 'detail';
    span.textContent = detail;
    item.append(span);
  }
  stepsList.append(item);
}

// ---------------------------------------------------------------------------
// ▼ ここから下が「処理」。自分の業務に合わせて書き換えるのはこの関数だけ。
//
//   いまの中身: 「日付 部署 内容 金額」の行を読んで、部署ごとに合計する。
//
//   Codex に頼むときは、この関数が何をすべきかを日本語で説明する。
//   例:「process の中を、部署ごとではなく月ごとの合計を出すように変えてください」
// ---------------------------------------------------------------------------

function process(lines, rules) {
  const problems = [];
  const totals = new Map();

  for (const line of lines) {
    const parts = line.split(/\s+/);
    const amount = Number(parts[parts.length - 1]);

    // 読み取れない行は捨てずに集めておく。黙って減らさないのが大事。
    if (parts.length < 4 || !Number.isFinite(amount)) {
      problems.push(line);
      continue;
    }

    const department = parts[1];
    const current = totals.get(department) || { count: 0, amount: 0 };
    current.count += 1;
    current.amount += amount;
    totals.set(department, current);
  }

  addStep('部署ごとにまとめる', `${totals.size} 部署`);

  let result = [...totals.entries()].map(([department, value]) => ({
    部署: department,
    件数: value.count,
    金額: value.amount,
  }));

  // 条件欄の「並び順」を見て並べ替える。条件の使い方の例として置いてある。
  if (rules.includes('並び順 金額')) {
    result.sort((one, other) => other.金額 - one.金額);
    addStep('金額の多い順に並べる');
  }

  return { columns: ['部署', '件数', '金額'], rows: result, problems };
}

// ---------------------------------------------------------------------------
// ▲ 書き換えるのはここまで。下は表示と保存なので、そのままで使えることが多い。
// ---------------------------------------------------------------------------

function run() {
  stepsList.textContent = '';
  head.textContent = '';
  rows.textContent = '';
  problemsList.textContent = '';

  const lines = readLines(dataInput);
  addStep('データを 1 行ずつに分ける', `${lines.length} 行`);

  const rules = readLines(rulesInput);
  const { columns, rows: resultRows, problems } = process(lines, rules);

  lastColumns = columns;
  lastRows = resultRows;

  const headerRow = document.createElement('tr');
  for (const column of columns) {
    const th = document.createElement('th');
    th.textContent = column;
    headerRow.append(th);
  }
  head.append(headerRow);

  for (const row of resultRows) {
    const tr = document.createElement('tr');
    for (const column of columns) {
      const td = document.createElement('td');
      const value = row[column];
      td.textContent = typeof value === 'number' ? value.toLocaleString() : String(value ?? '');
      tr.append(td);
    }
    rows.append(tr);
  }

  for (const line of problems) {
    const item = document.createElement('li');
    item.textContent = `読み取れませんでした: ${line}`;
    problemsList.append(item);
  }
}

function download() {
  if (lastRows.length === 0) return;

  const header = lastColumns.join(',');
  const body = lastRows.map((row) => lastColumns.map((column) => row[column]).join(',')).join('\n');

  // ブラウザの中でファイルを組み立てて、その場で保存する。サーバーは関わらない。
  const blob = new Blob([`${header}\n${body}`], { type: 'text/csv;charset=utf-8' });
  const url = URL.createObjectURL(blob);

  const link = document.createElement('a');
  link.href = url;
  link.download = '結果.csv';
  link.click();

  URL.revokeObjectURL(url);
}

runButton.addEventListener('click', run);
downloadButton.addEventListener('click', download);

run();
