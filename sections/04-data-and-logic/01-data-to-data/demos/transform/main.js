// 「データからデータを作る」の形を見せるデモ。
// 左に貼ったばらばらの名簿を、右の表の形にそろえる。書き換えるとすぐ反映される。

const sample = [
  '山田太郎（営業部）内線1234',
  '佐藤 花子  総務部  内線 2345',
  'すずき　一郎（開発部）内線3456',
  '',
  '高橋 次郎（営業部）内線 4567',
  'たなか みどり  開発部  内線5678',
].join('\n');

const input = document.querySelector('#input');
const rows = document.querySelector('#rows');
const count = document.querySelector('#count');

input.value = sample;

function render() {
  const lines = input.value
    .split('\n')
    .map((line) => line.trim())
    .filter((line) => line !== '');

  rows.textContent = '';

  for (const line of lines) {
    // 全角のカッコ・空白がまざっているので、まず半角にそろえてから切り分ける。
    const normalized = line
      .replace(/[（）]/g, (c) => (c === '（' ? '(' : ')'))
      .replace(/　/g, ' ');

    const extension = (normalized.match(/内線\s*(\d+)/) || [])[1] || '';
    const withoutExtension = normalized.replace(/内線\s*\d+/, '').trim();

    // 「名前(部署)」の形と「名前 部署」の形の両方が来るので、どちらでも拾う。
    const paren = withoutExtension.match(/^(.+?)\s*\((.+?)\)$/);
    const name = paren ? paren[1].trim() : withoutExtension.split(/\s{2,}|\s(?=\S+部$)/)[0].trim();
    const department = paren
      ? paren[2].trim()
      : (withoutExtension.match(/(\S+部)$/) || [])[1] || '';

    const tr = document.createElement('tr');
    for (const value of [name.replace(/\s+/g, ' '), department, extension]) {
      const td = document.createElement('td');
      td.textContent = value;
      tr.append(td);
    }
    rows.append(tr);
  }

  count.textContent = `${lines.length} 件を読み取りました`;
}

input.addEventListener('input', render);
render();
