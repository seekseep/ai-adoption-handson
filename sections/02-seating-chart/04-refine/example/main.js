// 座席表アプリ － ステップ 4: 「離す」「となり」などの条件を効かせる
//
// ステップ 3 との違いは、条件の欄が増えたこと。
//
// 条件をすべて同時に満たす配置を一発で計算するのは難しい。ここでは
// 「何通りか席順を作ってみて、条件を破る数がいちばん少ないものを採用する」という
// 素直な方法をとっている。押すたびに結果が変わるのはそのため。

const TRY_COUNT = 400; // 試す席順の数。多いほど良い配置が見つかるが、待ち時間が増える。

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

const sampleRules = [
  '離す 高橋 伊藤',
  'となり 山本 小林',
  '前の方 加藤',
].join('\n');

const mapInput = document.querySelector('#map');
const seatInfoInput = document.querySelector('#seat-info');
const attendanceInput = document.querySelector('#attendance');
const rulesInput = document.querySelector('#rules');
const chart = document.querySelector('#chart');
const summary = document.querySelector('#summary');
const ruleResults = document.querySelector('#rule-results');
const drawButton = document.querySelector('#draw');

mapInput.value = sampleMap;
seatInfoInput.value = sampleSeatInfo;
attendanceInput.value = sampleAttendance;
rulesInput.value = sampleRules;

function readLines(textarea) {
  return textarea.value
    .split('\n')
    .map((line) => line.trim())
    .filter((line) => line !== '');
}

function readSeatInfo() {
  const info = new Map();
  for (const line of readLines(seatInfoInput)) {
    const parts = line.split(/\s+/);
    if (parts[1] === '使用しない') {
      info.set(parts[0], { kind: 'disabled' });
    } else if (parts[1] === '固定') {
      info.set(parts[0], { kind: 'fixed', person: parts[2] || '' });
    }
  }
  return info;
}

function readAttendance() {
  const present = [];
  const absent = [];
  for (const line of readLines(attendanceInput)) {
    const parts = line.split(/\s+/);
    if (parts[1] === '欠席') absent.push(parts[0]);
    else present.push(parts[0]);
  }
  return { present, absent };
}

function readRules() {
  const rules = [];
  for (const line of readLines(rulesInput)) {
    const parts = line.split(/\s+/);
    const kind = parts[0];
    if (kind === '離す' || kind === 'となり') {
      if (parts[1] && parts[2]) rules.push({ kind, a: parts[1], b: parts[2], text: line });
    } else if (kind === '前の方' || kind === '後ろの方') {
      if (parts[1]) rules.push({ kind, a: parts[1], text: line });
    }
    // 知らない書き方の行は無視する。
  }
  return rules;
}

/** 席と席が隣同士か。通路をはさんでいたら隣ではない（通路も 1 マス分あるため）。 */
function isNeighbor(one, other) {
  if (one.row === other.row) return Math.abs(one.col - other.col) === 1;
  if (one.col === other.col) return Math.abs(one.row - other.row) === 1;
  return false;
}

/** ある配置が条件を破っている数を数える。少ないほど良い配置。 */
function countViolations(placement, rules, rowCount) {
  let violations = 0;

  for (const rule of rules) {
    const a = placement.get(rule.a);
    const b = rule.b ? placement.get(rule.b) : null;

    // 条件に出てくる人が今日いない場合、その条件は数えない。
    if (!a) continue;

    if (rule.kind === '離す') {
      if (b && isNeighbor(a, b)) violations += 1;
    } else if (rule.kind === 'となり') {
      if (!b || !isNeighbor(a, b)) violations += 1;
    } else if (rule.kind === '前の方') {
      if (a.row >= rowCount / 2) violations += 1;
    } else if (rule.kind === '後ろの方') {
      if (a.row < rowCount / 2) violations += 1;
    }
  }

  return violations;
}

/** 配列の順番をランダムに入れ替えた新しい配列を返す。 */
function shuffled(items) {
  const copy = items.slice();
  for (let i = copy.length - 1; i > 0; i -= 1) {
    const j = Math.floor(Math.random() * (i + 1));
    [copy[i], copy[j]] = [copy[j], copy[i]];
  }
  return copy;
}

function draw() {
  const rows = readLines(mapInput).map((line) => line.split(/\s+/));
  const seatInfo = readSeatInfo();
  const { present, absent } = readAttendance();
  const rules = readRules();

  // 席を「固定席」「使用しない席」「割り当てに使える空き席」に分ける。
  const freeSeats = [];
  const fixedPlacement = new Map();

  rows.forEach((cells, rowIndex) => {
    cells.forEach((cell, colIndex) => {
      if (cell === '.') return;
      const info = seatInfo.get(cell);
      const position = { row: rowIndex, col: colIndex, seat: cell };

      if (info && info.kind === 'disabled') return;
      if (info && info.kind === 'fixed') {
        // 固定席の人が欠席なら、その席は空けたままにする（割り当てにも使わない）。
        if (info.person && !absent.includes(info.person)) {
          fixedPlacement.set(info.person, position);
        }
        return;
      }
      freeSeats.push(position);
    });
  });

  const fixedPeople = new Set(fixedPlacement.keys());
  const waiting = present.filter((name) => !fixedPeople.has(name));

  // 席順を何通りか試して、条件を破る数がいちばん少ないものを採用する。
  let best = null;
  let bestViolations = Infinity;

  for (let attempt = 0; attempt < TRY_COUNT; attempt += 1) {
    const order = shuffled(waiting);
    const placement = new Map(fixedPlacement);
    order.forEach((name, index) => {
      if (index < freeSeats.length) placement.set(name, freeSeats[index]);
    });

    const violations = countViolations(placement, rules, rows.length);
    if (violations < bestViolations) {
      best = placement;
      bestViolations = violations;
      if (violations === 0) break; // これ以上良くならないので打ち切る
    }
  }

  const placement = best || new Map(fixedPlacement);

  // 席から人を引けるようにしておく（描くときはこちらの向きが要る）。
  const personBySeat = new Map();
  for (const [name, position] of placement) personBySeat.set(position.seat, name);

  chart.textContent = '';

  rows.forEach((cells) => {
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
      const person = personBySeat.get(cell);

      if (info && info.kind === 'disabled') {
        seat.classList.add('disabled');
        seat.textContent = cell;
      } else if (info && info.kind === 'fixed') {
        const isAbsent = absent.includes(info.person);
        seat.classList.add(isAbsent ? 'empty' : 'fixed');
        seat.append(makeLabel(cell), makePerson(isAbsent ? '（欠席）' : info.person));
      } else if (person) {
        seat.classList.add('assigned');
        seat.append(makeLabel(cell), makePerson(person));
      } else {
        seat.textContent = cell;
      }

      rowElement.append(seat);
    }

    chart.append(rowElement);
  });

  const shortage = Math.max(0, waiting.length - freeSeats.length);
  summary.textContent =
    `出席 ${present.length} 人 / 欠席 ${absent.length} 人` +
    (shortage > 0 ? ` — 席が ${shortage} 席足りません` : ' — 全員に席があります');
  summary.classList.toggle('warn', shortage > 0);

  // どの条件が通ってどの条件が通らなかったかを出す。
  // 「なぜこの配置なのか」が見えないと、条件を足しても直したことにならない。
  ruleResults.textContent = '';
  for (const rule of rules) {
    const single = new Map(placement);
    const ok = countViolations(single, [rule], rows.length) === 0;
    const inToday = placement.has(rule.a) && (!rule.b || placement.has(rule.b));

    const item = document.createElement('li');
    item.className = inToday ? (ok ? 'rule-ok' : 'rule-ng') : 'rule-skip';
    item.textContent = inToday
      ? `${ok ? '満たした' : '満たせなかった'}：${rule.text}`
      : `対象者が今日いません：${rule.text}`;
    ruleResults.append(item);
  }
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
