// 座席表アプリ － ステップ 5: 名簿の CSV から、クラスごとの座席表をまとめて作る
//
// ステップ 4 との違いは、見出しと名簿をコードに書かず、CSV ファイルから読むようになったこと。
// CSV の「クラス」ごとに座席表を 1 枚ずつ描き、まとめて PNG で保存できる。
// CSV はこのページの中で読むだけで、どこにも送らない。名簿を Codex に見せる必要もない。

// 見出しの頭に付ける研修の名前。見出しは「新人研修 Aクラス 座席表」のようになる
const EVENT_NAME = '新人研修';

// CSV を選ぶ前に表示しておく短いサンプル（名前はすべて架空）
const SAMPLE_CSV = [
  'クラス,名前',
  'Aクラス,千葉 陸', 'Aクラス,橋本 湊', 'Aクラス,大野 千尋', 'Aクラス,小川 陽太',
  'Aクラス,山口 湊', 'Aクラス,三浦 樹', 'Aクラス,上田 大翔', 'Aクラス,平野 遥',
  'Bクラス,木村 結衣', 'Bクラス,高木 蓮', 'Bクラス,中島 美咲', 'Bクラス,福田 湊',
  'Bクラス,前田 葵', 'Bクラス,宮崎 大和',
  'Cクラス,吉田 花音', 'Cクラス,和田 拓海', 'Cクラス,今井 さくら', 'Cクラス,菊地 陽菜',
  'Cクラス,久保 誠', 'Cクラス,近藤 杏', 'Cクラス,酒井 翔太',
].join('\n');

// ---- 部屋と机（単位は m） ----

// 部屋: 横 10m × 奥行き 9m。前（図の上側）の壁にホワイトボードがある
const ROOM_WIDTH = 10;
const ROOM_DEPTH = 9;

// 机: 幅 1.2m × 奥行き 0.6m の 1 人用
const DESK_WIDTH = 1.2;
const DESK_DEPTH = 0.6;

// 並べ方: 真ん中に 1.2m の通路。左右それぞれ机を横に 3 台くっつけて、前から 5 列。列の間は 0.9m
const AISLE = 1.2;
const DESKS_PER_SIDE = 3;
const ROWS = 5;
const ROW_GAP = 0.9;

// 前の壁から 1 列目の机までの距離。ホワイトボードの前はあけておく
const FRONT_SPACE = 1.5;

// 使えない席。row は前から何列目、col は左から何台目（通路をまたいで 1〜6）
const UNAVAILABLE = [
  { row: 1, col: 1 }, // 1 列目の左端: 出入口の前
  { row: 1, col: 6 }, // 1 列目の右端: 出入口の前
  { row: 4, col: 3 }, // 4 列目の左のかたまりの通路側: 柱がある
];

// ---- 描き方 ----

const SCALE = 70; // 1m を何ピクセルで描くか
const MARGIN = 48; // 部屋のまわりの余白（px）。「前」の文字を置く場所
const LEGEND_SPACE = 32; // 図の下に凡例を書くためにあける高さ（px）
const TITLE_SPACE = 44; // 図の上に見出しを書くためにあける高さ（px）
const PIXEL_RATIO = 2; // 保存する PNG を何倍の細かさで描くか。印刷してもぼやけないように 2 倍


// 机の位置（部屋の左上の角からの距離, m）を、並べ方の数字から計算する。
// row は前から何列目、col は左から何台目（通路をまたいで 1〜6）。
function layoutDesks() {
  const desks = [];
  const blockWidth = DESK_WIDTH * DESKS_PER_SIDE;
  // 左右の机のかたまりと通路をまとめて、部屋の真ん中に置く
  const left = (ROOM_WIDTH - (blockWidth * 2 + AISLE)) / 2;

  for (let row = 0; row < ROWS; row++) {
    const y = FRONT_SPACE + row * (DESK_DEPTH + ROW_GAP);
    for (let i = 0; i < DESKS_PER_SIDE * 2; i++) {
      // 右側のかたまりは、通路の幅だけ右にずらす
      const x = left + i * DESK_WIDTH + (i >= DESKS_PER_SIDE ? AISLE : 0);
      desks.push({ x: x, y: y, row: row + 1, col: i + 1 });
    }
  }
  return desks;
}

// m で表した位置を、canvas 上のピクセルに直す
function toX(m) {
  return MARGIN + m * SCALE;
}

function toY(m) {
  return TITLE_SPACE + MARGIN + m * SCALE;
}

// 座席表を 1 枚、渡された canvas に描く。title は見出し、names は 1 番の席から順に座る人
function drawChart(canvas, title, names) {
  const width = ROOM_WIDTH * SCALE + MARGIN * 2;
  const height = ROOM_DEPTH * SCALE + MARGIN * 2 + LEGEND_SPACE + TITLE_SPACE;

  // canvas の中身は PIXEL_RATIO 倍の細かさで持ち、画面には元の大きさで見せる
  canvas.width = width * PIXEL_RATIO;
  canvas.height = height * PIXEL_RATIO;
  canvas.style.width = width + 'px';
  const ctx = canvas.getContext('2d');
  ctx.scale(PIXEL_RATIO, PIXEL_RATIO);

  // 背景を白で塗る。塗らないと PNG の背景が透明になり、開くソフトによっては真っ黒に見える
  ctx.fillStyle = '#ffffff';
  ctx.fillRect(0, 0, width, height);

  // 見出し
  ctx.fillStyle = '#1f2933';
  ctx.textAlign = 'left';
  ctx.textBaseline = 'top';
  ctx.font = 'bold 22px sans-serif';
  ctx.fillText(title, toX(0), 20);

  // 部屋の壁
  ctx.strokeStyle = '#334e68';
  ctx.lineWidth = 3;
  ctx.strokeRect(toX(0), toY(0), ROOM_WIDTH * SCALE, ROOM_DEPTH * SCALE);

  // ホワイトボード（前の壁の真ん中、幅 3m）
  ctx.fillStyle = '#334e68';
  ctx.fillRect(toX(ROOM_WIDTH / 2 - 1.5), toY(0) + 4, 3 * SCALE, 6);
  ctx.textAlign = 'center';
  ctx.textBaseline = 'top';
  ctx.font = '12px sans-serif';
  ctx.fillText('ホワイトボード', toX(ROOM_WIDTH / 2), toY(0) + 16);

  // どちらが前かを部屋の外に書いておく
  ctx.textBaseline = 'bottom';
  ctx.font = 'bold 14px sans-serif';
  ctx.fillText('前', toX(ROOM_WIDTH / 2), toY(0) - 10);

  for (const desk of numberSeats(layoutDesks())) {
    // 番号は 1 から、配列の位置は 0 から数えるので 1 ずらす。名簿より席が多ければ undefined（空席）
    const name = desk.number === null ? undefined : names[desk.number - 1];
    drawDesk(ctx, toX(desk.x), toY(desk.y), desk.number, name);
  }

  drawLegend(ctx, toY(ROOM_DEPTH) + 28);
}

// 使える席に、前の列の左から順に番号を振る。
// layoutDesks() は前の列から、同じ列の中は左から順に机を返すので、その順に数えればよい
function numberSeats(desks) {
  let number = 0;
  for (const desk of desks) {
    if (isUnavailable(desk)) {
      desk.number = null;
    } else {
      number++;
      desk.number = number;
    }
  }
  return desks;
}

function isUnavailable(desk) {
  return UNAVAILABLE.some(function (u) {
    return u.row === desk.row && u.col === desk.col;
  });
}

// 机を 1 台描く。x, y は机の左上の角（px）。number が null なら使えない席。name が無ければ空席
function drawDesk(ctx, x, y, number, name) {
  const w = DESK_WIDTH * SCALE;
  const h = DESK_DEPTH * SCALE;
  const unavailable = number === null;

  // 椅子は机の後ろ側に描く。どちらを向いて座るかが図でわかるように。使えない席には置かない
  if (!unavailable) {
    ctx.fillStyle = '#cbd2d9';
    ctx.beginPath();
    ctx.roundRect(x + w / 2 - 0.22 * SCALE, y + h + 0.08 * SCALE, 0.44 * SCALE, 0.3 * SCALE, 4);
    ctx.fill();
  }

  ctx.fillStyle = unavailable ? '#e4e7eb' : '#ffffff';
  ctx.strokeStyle = '#52606d';
  ctx.lineWidth = 1.5;
  ctx.fillRect(x, y, w, h);
  ctx.strokeRect(x, y, w, h);

  // 使えない席は × を付ける。白黒で印刷しても灰色と見分けられるように
  if (unavailable) {
    drawCross(ctx, x + w / 2, y + h / 2, h * 0.28);
    return;
  }

  if (!name) {
    ctx.fillStyle = '#1f2933';
    ctx.textAlign = 'center';
    ctx.textBaseline = 'middle';
    ctx.font = 'bold 16px sans-serif';
    ctx.fillText(String(number), x + w / 2, y + h / 2);
    return;
  }

  // 名前が入る席は、番号を左上に小さく、名前を真ん中に大きく書く
  ctx.fillStyle = '#616e7c';
  ctx.textAlign = 'left';
  ctx.textBaseline = 'top';
  ctx.font = '10px sans-serif';
  ctx.fillText(String(number), x + 4, y + 3);

  ctx.fillStyle = '#1f2933';
  ctx.textAlign = 'center';
  ctx.textBaseline = 'middle';
  ctx.font = 'bold ' + fitFontSize(ctx, name, w - 8, 15) + 'px sans-serif';
  ctx.fillText(name, x + w / 2, y + h / 2 + 5);
}

// 長い名前が机からはみ出さないよう、幅に収まるまで文字を小さくする
function fitFontSize(ctx, text, maxWidth, size) {
  while (size > 8) {
    ctx.font = 'bold ' + size + 'px sans-serif';
    if (ctx.measureText(text).width <= maxWidth) break;
    size--;
  }
  return size;
}

function drawCross(ctx, cx, cy, r) {
  ctx.strokeStyle = '#9aa5b1';
  ctx.lineWidth = 2;
  ctx.beginPath();
  ctx.moveTo(cx - r, cy - r);
  ctx.lineTo(cx + r, cy + r);
  ctx.moveTo(cx + r, cy - r);
  ctx.lineTo(cx - r, cy + r);
  ctx.stroke();
}

// 図の下に「どの印が何か」を書く。y は凡例の縦の真ん中（px）
function drawLegend(ctx, y) {
  const x = toX(0);
  ctx.fillStyle = '#e4e7eb';
  ctx.strokeStyle = '#52606d';
  ctx.lineWidth = 1.5;
  ctx.fillRect(x, y - 9, 30, 18);
  ctx.strokeRect(x, y - 9, 30, 18);
  drawCross(ctx, x + 15, y, 5);

  ctx.fillStyle = '#334e68';
  ctx.textAlign = 'left';
  ctx.textBaseline = 'middle';
  ctx.font = '13px sans-serif';
  ctx.fillText('使えない席', x + 40, y);
}

// ---- 画面の操作 ----

const fileInput = document.querySelector('#csv-file');
const statusText = document.querySelector('#status');
const saveAllButton = document.querySelector('#save-all');
const chartList = document.querySelector('#charts');

// 描いた座席表の一覧。「まとめて保存」でこの順に保存する
let charts = [];

// CSV の文字を読んで、クラスごとの名簿にまとめる。
// 返すのは [{ group: 'Aクラス', names: ['千葉 陸', ...] }, ...]（CSV に出てきた順）
function parseCsv(text) {
  const groups = new Map();
  // 先頭の BOM（Excel の「CSV UTF-8」形式が付ける目印）は取り除く
  const lines = text.replace(/^\uFEFF/, '').split(/\r?\n/);
  for (const line of lines) {
    const cells = line.split(',').map(function (cell) {
      return cell.trim();
    });
    const group = cells[0];
    const name = cells[1];
    // 空行・名前が空の行・見出しの行は飛ばす
    if (!group || !name || group === 'クラス') continue;
    if (!groups.has(group)) groups.set(group, []);
    groups.get(group).push(name);
  }
  return Array.from(groups, function (entry) {
    return { group: entry[0], names: entry[1] };
  });
}

// ファイルの中身を文字にする。Excel で普通に保存した CSV は Shift_JIS という文字コードなので、
// UTF-8 として読めなかったら Shift_JIS として読み直す（文字化けを防ぐため）
async function readCsvFile(file) {
  const buffer = await file.arrayBuffer();
  try {
    return new TextDecoder('utf-8', { fatal: true }).decode(buffer);
  } catch (e) {
    return new TextDecoder('shift_jis').decode(buffer);
  }
}

function countSeats() {
  return numberSeats(layoutDesks()).filter(function (desk) {
    return desk.number !== null;
  }).length;
}

// クラスごとに座席表を描いて、画面に並べる
function render(groups, sourceLabel) {
  chartList.innerHTML = '';
  charts = [];
  const seats = countSeats();
  const warnings = [];

  for (const g of groups) {
    const title = EVENT_NAME + ' ' + g.group + ' 座席表';
    const canvas = document.createElement('canvas');
    drawChart(canvas, title, g.names);

    const figure = document.createElement('figure');
    const caption = document.createElement('figcaption');
    caption.textContent = title + '（' + g.names.length + ' 人）';
    const button = document.createElement('button');
    button.type = 'button';
    button.className = 'secondary';
    button.textContent = 'この 1 枚を保存';
    button.addEventListener('click', function () {
      savePng(canvas, title + '.png');
    });
    figure.append(canvas, caption, button);
    chartList.append(figure);

    charts.push({ canvas: canvas, fileName: title + '.png' });
    // 席より人が多いと、あふれた人は図に載らない。気づけるように知らせる
    if (g.names.length > seats) {
      warnings.push(g.group + ' は ' + (g.names.length - seats) + ' 人分の席が足りません');
    }
  }

  statusText.textContent =
    sourceLabel + ' から ' + groups.length + ' 枚の座席表を作りました（使える席は ' + seats + ' 席）。' +
    (warnings.length > 0 ? ' ⚠ ' + warnings.join('、') : '');
  statusText.classList.toggle('warn', warnings.length > 0);
  saveAllButton.textContent = 'まとめて PNG で保存（' + charts.length + ' 枚）';
  saveAllButton.disabled = charts.length === 0;
}

// canvas の絵を PNG にして、リンクをクリックしたことにしてダウンロードさせる
function savePng(targetCanvas, fileName) {
  const link = document.createElement('a');
  link.href = targetCanvas.toDataURL('image/png');
  link.download = fileName;
  link.click();
}

fileInput.addEventListener('change', async function () {
  const file = fileInput.files[0];
  if (!file) return;
  const groups = parseCsv(await readCsvFile(file));
  if (groups.length === 0) {
    statusText.textContent = '「クラス,名前」の形の行が見つかりませんでした。CSV の中身を確かめてください。';
    statusText.classList.add('warn');
    return;
  }
  render(groups, file.name);
});

saveAllButton.addEventListener('click', async function () {
  for (const chart of charts) {
    savePng(chart.canvas, chart.fileName);
    // 立て続けに保存するとブラウザが取りこぼすことがあるので、1 枚ごとに少し待つ
    await new Promise(function (resolve) {
      setTimeout(resolve, 400);
    });
  }
});

render(parseCsv(SAMPLE_CSV), 'サンプル');
