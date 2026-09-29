// 権限モードのちがいを見せるデモ。
// 実際の Codex を動かしているわけではなく、モードごとの扱いを表に描いているだけ。

// 作業フォルダは「デスクトップ/handson」だとする。
const targets = [
  { name: 'handson / index.html', where: '作業フォルダの中', inside: true },
  { name: 'handson / 座席データ.csv', where: '作業フォルダの中', inside: true },
  { name: 'デスクトップ / 顧客リスト.xlsx', where: '作業フォルダの外', inside: false },
  { name: 'ドキュメント / 給与明細.pdf', where: '作業フォルダの外', inside: false },
  { name: 'PC の設定ファイル', where: '作業フォルダの外', inside: false },
  { name: 'インターネットへの通信', where: '外部', inside: false, network: true },
];

const notes = {
  ask: '既定のモード。作業フォルダの中は自由に触りますが、外に出るときは必ず止まって「これをしていいですか」と聞いてきます。',
  auto: '作業フォルダの中は自由。外に出る操作は、止まらずに自動のチェックにかけて進めます。手は止まりませんが、触れる範囲そのものは広がりません。',
  full: '境界がなくなります。PC のどのファイルでも読み書きでき、インターネットにもつながります。確認も入りません。',
};

const rows = document.querySelector('#rows');
const note = document.querySelector('#note');

function verdictFor(target, mode) {
  if (mode === 'full') {
    return { text: '確認なしでできる', kind: 'none' };
  }

  if (target.inside) {
    return { text: '自由にできる', kind: 'free' };
  }

  if (mode === 'ask') {
    return { text: '止まって確認を求める', kind: 'ask' };
  }

  return { text: '自動チェックを通して進む', kind: 'auto' };
}

function render() {
  const mode = document.querySelector('input[name="mode"]:checked').value;
  note.textContent = notes[mode];

  rows.textContent = '';

  for (const target of targets) {
    const tr = document.createElement('tr');

    const nameCell = document.createElement('td');
    nameCell.textContent = target.name;
    const where = document.createElement('div');
    where.className = 'where';
    where.textContent = target.where;
    nameCell.append(where);

    const verdict = verdictFor(target, mode);
    const verdictCell = document.createElement('td');
    verdictCell.className = `verdict ${verdict.kind}`;
    verdictCell.textContent = verdict.text;

    tr.append(nameCell, verdictCell);
    rows.append(tr);
  }
}

for (const input of document.querySelectorAll('input[name="mode"]')) {
  input.addEventListener('change', render);
}

render();
