// 座席表アプリ － ステップ 3: 出席している人だけを席に割り当てる
//
// ステップ 2 との違いは、出欠の欄が増えて「誰を座らせるか」が決まるようになったこと。
// 固定席の人が欠席なら、その席は空いたままにする（他の人を入れない）。

const sampleMap = [
  'A1 A2 . B1 B2',
  'A3 A4 . B3 B4',
  'A5 A6 . B5 B6',
  'C1 C2 . D1 D2',
  'C3 C4 . D3 D4',
].join('\n');

const sampleSeatInfo = [
  'A1 固定 田中',
  'B2 固定 佐藤',
  'C1 固定 渡辺',
  'B5 使用しない',
  'D4 使用しない',
].join('\n');

const sampleAttendance = [
  '田中 出席',
  '佐藤 出席',
  '渡辺 欠席',
  '高橋 出席',
  '伊藤 出席',
  '山本 出席',
  '中村 欠席',
  '小林 出席',
  '加藤 出席',
].join('\n');

const mapInput = document.querySelector('#map');
const seatInfoInput = document.querySelector('#seat-info');
const attendanceInput = document.querySelector('#attendance');
const chart = document.querySelector('#chart');
const summary = document.querySelector('#summary');
const drawButton = document.querySelector('#draw');

mapInput.value = sampleMap;
seatInfoInput.value = sampleSeatInfo;
attendanceInput.value = sampleAttendance;

function readSeatInfo() {
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
      info.set(seatName, { kind: 'fixed', person: parts[2] || '' });
    }
  }

  return info;
}

function readAttendance() {
  // 出席している人の名前だけを順番どおりに集める。
  // 「欠席」と書いていない行は出席として扱う（書き忘れても止まらないように）。
  const present = [];
  const absent = [];

  const lines = attendanceInput.value
    .split('\n')
    .map((line) => line.trim())
    .filter((line) => line !== '');

  for (const line of lines) {
    const parts = line.split(/\s+/);
    const name = parts[0];
    if (parts[1] === '欠席') {
      absent.push(name);
    } else {
      present.push(name);
    }
  }

  return { present, absent };
}

function draw() {
  const rows = mapInput.value
    .split('\n')
    .map((line) => line.trim())
    .filter((line) => line !== '')
    .map((line) => line.split(/\s+/));

  const seatInfo = readSeatInfo();
  const { present, absent } = readAttendance();

  // 固定席の人は最初から座る場所が決まっているので、割り当ての対象から外す。
  const fixedPeople = new Set();
  for (const info of seatInfo.values()) {
    if (info.kind === 'fixed' && info.person) fixedPeople.add(info.person);
  }
  const waiting = present.filter((name) => !fixedPeople.has(name));

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
        // 固定席。本人が欠席なら、席は空けたままにする。
        const isAbsent = absent.includes(info.person);
        seat.classList.add(isAbsent ? 'empty' : 'fixed');
        seat.append(makeLabel(cell), makePerson(isAbsent ? '（欠席）' : info.person));
      } else if (waiting.length > 0) {
        // 空き席には、待っている人を上から順に入れていく。
        seat.classList.add('assigned');
        seat.append(makeLabel(cell), makePerson(waiting.shift()));
      } else {
        seat.textContent = cell;
      }

      rowElement.append(seat);
    }

    chart.append(rowElement);
  }

  // 座れなかった人が出るのは「席が足りない」という業務上の問題なので、必ず画面に出す。
  const seatShortage = waiting.length;
  summary.textContent =
    `出席 ${present.length} 人 / 欠席 ${absent.length} 人` +
    (seatShortage > 0 ? ` — 席が足りません（${waiting.join('、')}）` : ' — 全員に席があります');
  summary.classList.toggle('warn', seatShortage > 0);
}

function makeLabel(text) {
  const label = document.createElement('span');
  label.className = 'seat-label';
  label.textContent = text;
  return label;
}

function makePerson(text) {
  const person = document.createElement('span');
  person.className = 'seat-person';
  person.textContent = text;
  return person;
}

drawButton.addEventListener('click', draw);

draw();
