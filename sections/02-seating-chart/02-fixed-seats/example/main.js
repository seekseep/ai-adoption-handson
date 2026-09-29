// 座席表アプリ － ステップ 2: 固定席と使用しない席を反映する
//
// ステップ 1 との違いは、席ごとの事情を書く欄が増えたこと。
// 配置（どこに机があるか）と事情（その席をどう扱うか）は別のデータなので、欄を分けている。

const sampleMap = [
  'A1 A2 . B1 B2',
  'A3 A4 . B3 B4',
  'A5 A6 . B5 B6',
  'C1 C2 . D1 D2',
  'C3 C4 . D3 D4',
].join('\n');

// 固定席＝毎回その人が座る席。使用しない席＝壊れている・物置になっている等で座れない席。
const sampleSeatInfo = [
  'A1 固定 田中',
  'B2 固定 佐藤',
  'C1 固定 渡辺',
  'B5 使用しない',
  'D4 使用しない',
].join('\n');

const mapInput = document.querySelector('#map');
const seatInfoInput = document.querySelector('#seat-info');
const chart = document.querySelector('#chart');
const drawButton = document.querySelector('#draw');

mapInput.value = sampleMap;
seatInfoInput.value = sampleSeatInfo;

function readSeatInfo() {
  // 席の名前をキーに、その席の事情を引ける形にしておく。
  // Map を使うのは、席の名前をそのままキーにできて取り違えが起きにくいから。
  const info = new Map();

  const lines = seatInfoInput.value
    .split('\n')
    .map((line) => line.trim())
    .filter((line) => line !== '');

  for (const line of lines) {
    const parts = line.split(/\s+/);
    const seatName = parts[0];
    const kind = parts[1];

    if (kind === '使用しない') {
      info.set(seatName, { kind: 'disabled' });
      continue;
    }

    if (kind === '固定') {
      // 3 つめが人の名前。書き忘れていても落とさず、名前なしの固定席として扱う。
      info.set(seatName, { kind: 'fixed', person: parts[2] || '' });
      continue;
    }

    // 知らない書き方の行は無視する。書き間違いで画面が真っ白になるのを防ぐため。
  }

  return info;
}

function draw() {
  const rows = mapInput.value
    .split('\n')
    .map((line) => line.trim())
    .filter((line) => line !== '')
    .map((line) => line.split(/\s+/));

  const seatInfo = readSeatInfo();

  chart.textContent = '';

  for (const cells of rows) {
    const rowElement = document.createElement('div');
    rowElement.className = 'row';

    for (const cell of cells) {
      if (cell === '.') {
        const aisle = document.createElement('div');
        aisle.className = 'aisle';
        rowElement.append(aisle);
        continue;
      }

      const seat = document.createElement('div');
      seat.className = 'seat';

      const info = seatInfo.get(cell);

      if (info && info.kind === 'disabled') {
        seat.classList.add('disabled');
        seat.textContent = cell;
      } else if (info && info.kind === 'fixed') {
        seat.classList.add('fixed');
        // 席の名前は小さく、人の名前を主役にする。誰の席かが一目で分かるほうが使える。
        seat.innerHTML = '';
        const label = document.createElement('span');
        label.className = 'seat-label';
        label.textContent = cell;
        const person = document.createElement('span');
        person.className = 'seat-person';
        person.textContent = info.person;
        seat.append(label, person);
      } else {
        seat.textContent = cell;
      }

      rowElement.append(seat);
    }

    chart.append(rowElement);
  }
}

drawButton.addEventListener('click', draw);

draw();
