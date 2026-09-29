// 「仕組みからデータを作る」の形を見せるデモ。
// 入力はデータではなく条件（人数・日数・1日あたりの人数）だけ。
// そこから当番表というデータが生まれる。

const names = ['A さん', 'B さん', 'C さん', 'D さん', 'E さん', 'F さん', 'G さん', 'H さん'];

const peopleInput = document.querySelector('#people');
const daysInput = document.querySelector('#days');
const perDayInput = document.querySelector('#per-day');
const rows = document.querySelector('#rows');
const note = document.querySelector('#note');

function render() {
  const peopleCount = Number(peopleInput.value);
  const dayCount = Number(daysInput.value);
  const perDay = Number(perDayInput.value);

  document.querySelector('#people-value').textContent = peopleCount;
  document.querySelector('#days-value').textContent = dayCount;
  document.querySelector('#per-day-value').textContent = perDay;

  const members = names.slice(0, peopleCount);
  const assignedCount = new Map(members.map((name) => [name, 0]));

  rows.textContent = '';

  // 名簿の先頭から順に、輪のように回して割り当てる。
  // こうすると全員の回数が自然にそろう（誰かに偏らない）。
  let cursor = 0;

  for (let day = 1; day <= dayCount; day += 1) {
    const todays = [];
    for (let slot = 0; slot < perDay && slot < members.length; slot += 1) {
      const name = members[cursor % members.length];
      todays.push(name);
      assignedCount.set(name, assignedCount.get(name) + 1);
      cursor += 1;
    }

    const tr = document.createElement('tr');
    const dayCell = document.createElement('td');
    dayCell.textContent = `${day} 日目`;
    const nameCell = document.createElement('td');
    nameCell.textContent = todays.join('、');
    tr.append(dayCell, nameCell);
    rows.append(tr);
  }

  const counts = [...assignedCount.values()];
  const min = Math.min(...counts);
  const max = Math.max(...counts);
  note.textContent = `1 人あたり ${min}〜${max} 回（合計 ${dayCount * perDay} 枠）`;
}

for (const input of [peopleInput, daysInput, perDayInput]) {
  input.addEventListener('input', render);
}

render();
