// 座席表アプリ － ステップ 3: 使える席に番号を振る
//
// ステップ 2 との違いは、numberSeats() が増えたこと。
// 前の列の左から順に 1, 2, 3… と振り、使えない席は飛ばす。
// 番号は描くたびに数え直すので、使えない席や机の数を変えても振り直しは要らない。

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
const PIXEL_RATIO = 2; // 保存する PNG を何倍の細かさで描くか。印刷してもぼやけないように 2 倍

const canvas = document.querySelector('#room');
const saveButton = document.querySelector('#save');

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
  return MARGIN + m * SCALE;
}

function draw() {
  const width = ROOM_WIDTH * SCALE + MARGIN * 2;
  const height = ROOM_DEPTH * SCALE + MARGIN * 2 + LEGEND_SPACE;

  // canvas の中身は PIXEL_RATIO 倍の細かさで持ち、画面には元の大きさで見せる
  canvas.width = width * PIXEL_RATIO;
  canvas.height = height * PIXEL_RATIO;
  canvas.style.width = width + 'px';
  const ctx = canvas.getContext('2d');
  ctx.scale(PIXEL_RATIO, PIXEL_RATIO);

  // 背景を白で塗る。塗らないと PNG の背景が透明になり、開くソフトによっては真っ黒に見える
  ctx.fillStyle = '#ffffff';
  ctx.fillRect(0, 0, width, height);

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
    drawDesk(ctx, toX(desk.x), toY(desk.y), desk.number);
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

// 机を 1 台描く。x, y は机の左上の角（px）。number が null なら使えない席
function drawDesk(ctx, x, y, number) {
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

  ctx.fillStyle = '#1f2933';
  ctx.textAlign = 'center';
  ctx.textBaseline = 'middle';
  ctx.font = 'bold 16px sans-serif';
  ctx.fillText(String(number), x + w / 2, y + h / 2);
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

// canvas の絵を PNG にして、リンクをクリックしたことにしてダウンロードさせる
function savePng(targetCanvas, fileName) {
  const link = document.createElement('a');
  link.href = targetCanvas.toDataURL('image/png');
  link.download = fileName;
  link.click();
}

saveButton.addEventListener('click', function () {
  savePng(canvas, '座席表.png');
});

draw();
