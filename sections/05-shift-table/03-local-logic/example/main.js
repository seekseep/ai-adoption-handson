// シフト表を組む － 勤務できる曜日と条件から、1 週間のシフトを作る。
//
// このページは外部と一切通信しない。
// ・読み込んでいるファイルは同じフォルダの style.css と main.js だけ
// ・入力した名前や勤務希望は、この画面の中だけで処理される
// ・CSV も、サーバーに作ってもらうのではなくブラウザの中で組み立てて保存する
//
// ブラウザの開発者ツール（F12）の Network タブを開いた状態でボタンを押しても、
// 新しい通信は 1 件も出ない。

const DAYS = ['月', '火', '水', '木', '金', '土', '日'];

const sampleStaff = [
  'Aさん 月 火 木 金',
  'Bさん 火 水 金 土',
  'Cさん 月 水 木 土 日',
  'Dさん 月 火 水 木 金',
  'Eさん 金 土 日',
  'Fさん 火 木 土 日',
].join('\n');

const sampleRules = [
  '1日の人数 2',
  '最大勤務日数 4',
  '連勤上限 3',
].join('\n');

const staffInput = document.querySelector('#staff');
const rulesInput = document.querySelector('#rules');
const shiftRows = document.querySelector('#shift-rows');
const countsList = document.querySelector('#counts');
const checksList = document.querySelector('#checks');
const buildButton = document.querySelector('#build');
const downloadButton = document.querySelector('#download');

staffInput.value = sampleStaff;
rulesInput.value = sampleRules;

// CSV を書き出すときに使い回すので、最後に組んだ結果を覚えておく。
let lastShift = [];

function readLines(textarea) {
  return textarea.value
    .split('\n')
    .map((line) => line.trim())
    .filter((line) => line !== '');
}

function readStaff() {
  // 「名前 出られる曜日…」の形。曜日は DAYS に含まれるものだけ拾う。
  return readLines(staffInput).map((line) => {
    const parts = line.split(/\s+/);
    return {
      name: parts[0],
      available: parts.slice(1).filter((day) => DAYS.includes(day)),
    };
  });
}

function readRules() {
  // 書かれていない条件には無理のない既定値を入れておく。
  const rules = { perDay: 2, maxDays: 7, maxStreak: 7 };

  for (const line of readLines(rulesInput)) {
    const parts = line.split(/\s+/);
    const value = Number(parts[1]);
    if (!Number.isFinite(value)) continue;

    if (parts[0] === '1日の人数') rules.perDay = value;
    else if (parts[0] === '最大勤務日数') rules.maxDays = value;
    else if (parts[0] === '連勤上限') rules.maxStreak = value;
  }

  return rules;
}

function build() {
  const staff = readStaff();
  const rules = readRules();

  const assignedDays = new Map(staff.map((person) => [person.name, 0]));
  const lastWorkedIndex = new Map(staff.map((person) => [person.name, -99]));
  const currentStreak = new Map(staff.map((person) => [person.name, 0]));

  lastShift = [];

  DAYS.forEach((day, dayIndex) => {
    // その日に出られて、まだ上限に達していない人を候補にする。
    const candidates = staff.filter((person) => {
      if (!person.available.includes(day)) return false;
      if (assignedDays.get(person.name) >= rules.maxDays) return false;

      // 前日も入っているなら連勤が伸びる。上限を超えるなら今日は外す。
      const isContinuing = lastWorkedIndex.get(person.name) === dayIndex - 1;
      const streak = isContinuing ? currentStreak.get(person.name) : 0;
      return streak < rules.maxStreak;
    });

    // 勤務日数が少ない人から先に選ぶ。こうすると自然に人数がならされる。
    candidates.sort((one, other) => assignedDays.get(one.name) - assignedDays.get(other.name));

    const picked = candidates.slice(0, rules.perDay).map((person) => person.name);

    for (const name of picked) {
      assignedDays.set(name, assignedDays.get(name) + 1);
      const isContinuing = lastWorkedIndex.get(name) === dayIndex - 1;
      currentStreak.set(name, isContinuing ? currentStreak.get(name) + 1 : 1);
      lastWorkedIndex.set(name, dayIndex);
    }

    lastShift.push({ day, names: picked, shortage: rules.perDay - picked.length });
  });

  // ── シフト表を描く
  shiftRows.textContent = '';
  for (const row of lastShift) {
    const tr = document.createElement('tr');

    const dayCell = document.createElement('td');
    dayCell.textContent = row.day;

    const nameCell = document.createElement('td');
    nameCell.textContent = row.names.length > 0 ? row.names.join('、') : '—';

    const countCell = document.createElement('td');
    countCell.className = 'num';
    countCell.textContent = `${row.names.length} 人`;

    if (row.shortage > 0) {
      tr.className = 'short';
      countCell.textContent += `（${row.shortage} 人不足）`;
    }

    tr.append(dayCell, nameCell, countCell);
    shiftRows.append(tr);
  }

  // ── 1 人あたりの勤務日数
  countsList.textContent = '';
  for (const person of staff) {
    const item = document.createElement('li');
    item.textContent = `${person.name}：${assignedDays.get(person.name)} 日`;
    countsList.append(item);
  }

  // ── 条件の確認。満たせたかどうかを必ず出す。
  checksList.textContent = '';

  const shortDays = lastShift.filter((row) => row.shortage > 0).map((row) => row.day);
  addCheck(
    shortDays.length === 0,
    shortDays.length === 0
      ? `毎日 ${rules.perDay} 人を確保できました`
      : `人数が足りない日があります：${shortDays.join('、')}`,
  );

  const overWorked = staff.filter((person) => assignedDays.get(person.name) > rules.maxDays);
  addCheck(
    overWorked.length === 0,
    overWorked.length === 0
      ? `勤務日数は全員 ${rules.maxDays} 日以内です`
      : `勤務日数の上限を超えた人がいます：${overWorked.map((p) => p.name).join('、')}`,
  );

  const unused = staff.filter((person) => assignedDays.get(person.name) === 0);
  addCheck(
    unused.length === 0,
    unused.length === 0
      ? '全員が 1 日以上入っています'
      : `1 日も入っていない人がいます：${unused.map((p) => p.name).join('、')}`,
  );
}

function addCheck(ok, text) {
  const item = document.createElement('li');
  item.className = ok ? 'ok' : 'ng';
  item.textContent = text;
  checksList.append(item);
}

function download() {
  if (lastShift.length === 0) return;

  const header = '曜日,担当\n';
  const body = lastShift.map((row) => `${row.day},${row.names.join(' ')}`).join('\n');

  // ブラウザの中でファイルの中身を組み立てて、そのまま保存する。
  // サーバーに送って作ってもらっているわけではない。
  const blob = new Blob([header + body], { type: 'text/csv;charset=utf-8' });
  const url = URL.createObjectURL(blob);

  const link = document.createElement('a');
  link.href = url;
  link.download = 'シフト表.csv';
  link.click();

  URL.revokeObjectURL(url);
}

buildButton.addEventListener('click', build);
downloadButton.addEventListener('click', download);

build();
