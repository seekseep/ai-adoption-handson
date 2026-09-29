// 座席表アプリ － ステップ 1: マップの文字から机を並べる
//
// ブラウザだけで動く。どこにも通信しない。
// 席の配置は画面の textarea に書いた文字から読み取る。

// 最初から入れておくサンプル。真ん中に通路がある部屋を想定している。
const sampleMap = [
  'A1 A2 . B1 B2',
  'A3 A4 . B3 B4',
  'A5 A6 . B5 B6',
  'C1 C2 . D1 D2',
  'C3 C4 . D3 D4',
].join('\n');

const mapInput = document.querySelector('#map');
const chart = document.querySelector('#chart');
const drawButton = document.querySelector('#draw');

mapInput.value = sampleMap;

function draw() {
  // 1 行を横 1 列として読み、空白区切りを 1 つの席として読む。
  // 空行は無視する（貼り付けたときに末尾に余分な改行が付きやすい）。
  const rows = mapInput.value
    .split('\n')
    .map((line) => line.trim())
    .filter((line) => line !== '')
    .map((line) => line.split(/\s+/));

  // 押すたびに描き直すので、前回の内容を消してから始める。
  chart.textContent = '';

  for (const cells of rows) {
    const rowElement = document.createElement('div');
    rowElement.className = 'row';

    for (const cell of cells) {
      if (cell === '.') {
        // 通路。席ではないが、幅をとらないと列がずれるので空の箱を置く。
        const aisle = document.createElement('div');
        aisle.className = 'aisle';
        rowElement.append(aisle);
        continue;
      }

      const seat = document.createElement('div');
      seat.className = 'seat';
      seat.textContent = cell;
      rowElement.append(seat);
    }

    chart.append(rowElement);
  }
}

drawButton.addEventListener('click', draw);

// 開いた時点で一度描いておく（ボタンを押さなくても結果が見えるように）。
draw();
