// 交通費の集計 － 「入力 → 処理 → 出力」を画面から操作できる形にした最小の例。
//
// ブラウザだけで動く。貼り付けた明細はこのページの中だけで処理され、どこにも送られない。

const sampleEntries = [
  '10/1 新宿→品川 199',
  '10/1 品川→新宿 199',
  '10/3 新宿→横浜 483',
  '10/3 横浜→新宿 483',
  '10/8 新宿→大宮 570',
  '10/8 大宮→新宿 570',
  '10/8 大宮→浦和 157',
  '10/15 新宿→品川 199',
  '10/15 品川→新宿 199',
  '10/22 新宿→千葉 748',
].join('\n');

const entriesInput = document.querySelector('#entries');
const stepsList = document.querySelector('#steps');
const rows = document.querySelector('#rows');
const totalCell = document.querySelector('#total');
const problemsList = document.querySelector('#problems');
const runButton = document.querySelector('#run');
const downloadButton = document.querySelector('#download');

entriesInput.value = sampleEntries;

// 出力した結果を CSV にするときに使い回すので、最後の集計結果を覚えておく。
let lastResult = [];

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

function run() {
  stepsList.textContent = '';
  problemsList.textContent = '';
  rows.textContent = '';

  // ── 手順 1: 1 行ずつに分ける
  const lines = entriesInput.value
    .split('\n')
    .map((line) => line.trim())
    .filter((line) => line !== '');
  addStep('明細を 1 行ずつに分ける', `${lines.length} 行`);

  // ── 手順 2: 日付・区間・金額に切り分ける
  const entries = [];
  const problems = [];

  for (const line of lines) {
    const parts = line.split(/\s+/);
    const amount = Number(parts[parts.length - 1]);

    // 金額が数字として読めない行は、黙って捨てずに後で見せる。
    if (!Number.isFinite(amount) || parts.length < 3) {
      problems.push(line);
      continue;
    }

    entries.push({ date: parts[0], route: parts.slice(1, -1).join(' '), amount });
  }
  addStep('日付・区間・金額に切り分ける', `${entries.length} 件を読み取り`);

  // ── 手順 3: 日付ごとにまとめる
  const byDate = new Map();
  for (const entry of entries) {
    const current = byDate.get(entry.date) || { count: 0, amount: 0 };
    current.count += 1;
    current.amount += entry.amount;
    byDate.set(entry.date, current);
  }
  addStep('日付ごとにまとめる', `${byDate.size} 日分`);

  // ── 手順 4: 合計する
  const total = entries.reduce((sum, entry) => sum + entry.amount, 0);
  addStep('合計を出す', `${total.toLocaleString()} 円`);

  // ── 出力
  lastResult = [...byDate.entries()].map(([date, value]) => ({ date, ...value }));

  for (const row of lastResult) {
    const tr = document.createElement('tr');
    const dateCell = document.createElement('td');
    dateCell.textContent = row.date;
    const countCell = document.createElement('td');
    countCell.textContent = `${row.count} 件`;
    const amountCell = document.createElement('td');
    amountCell.className = 'num';
    amountCell.textContent = `${row.amount.toLocaleString()} 円`;
    tr.append(dateCell, countCell, amountCell);
    rows.append(tr);
  }

  totalCell.textContent = `${total.toLocaleString()} 円`;

  // 読み取れなかった行は必ず見せる。黙って減らすのが一番こわい。
  for (const line of problems) {
    const item = document.createElement('li');
    item.textContent = `読み取れませんでした: ${line}`;
    problemsList.append(item);
  }
}

function download() {
  if (lastResult.length === 0) return;

  const header = '日付,件数,金額\n';
  const body = lastResult.map((row) => `${row.date},${row.count},${row.amount}`).join('\n');

  // Blob はブラウザの中だけで作られるファイルのようなもの。
  // サーバーに送ってから受け取るのではなく、この場で作ってこの場で保存する。
  const blob = new Blob([header + body], { type: 'text/csv;charset=utf-8' });
  const url = URL.createObjectURL(blob);

  const link = document.createElement('a');
  link.href = url;
  link.download = '交通費集計.csv';
  link.click();

  URL.revokeObjectURL(url);
}

runButton.addEventListener('click', run);
downloadButton.addEventListener('click', download);

run();
