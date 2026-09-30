// 座席表アプリ － ステップ 4: 席に人の名前を入れる
//
// ステップ 3 との違いは、TITLE（図の見出し）と NAMES（名簿）が増えたこと。
// NAMES の 1 人目を 1 番の席、2 人目を 2 番の席…と、番号の順に座らせる。
// 人より席が多いときは、残りの席は番号だけの空席になる。

// ---- 部屋とテーブル（単位は m） ----

// 部屋: 横 10m × 奥行き 8m。前（図の上側）の壁にホワイトボードがある
const ROOM_WIDTH = 10;
const ROOM_DEPTH = 8;

// テーブル: 直径 1.2m の丸テーブル。まわりに椅子を 6 脚、等間隔に置く
const TABLE_DIAMETER = 1.2;
const CHAIRS_PER_TABLE = 6;

// 並べ方: 横に 3 卓 × 前から 2 列。テーブルの中心どうしの間隔は、横 3.2m・縦 3m
const TABLE_COLUMNS = 3;
const TABLE_ROWS = 2;
const TABLE_GAP_X = 3.2;
const TABLE_GAP_Y = 3;

// 前の壁から、1 列目のテーブルの中心までの距離。ホワイトボードの前はあけておく
const FRONT_SPACE = 2.4;

// 椅子（＝1 人分の席）の大きさと、テーブルの中心から椅子の中心までの距離
const SEAT_WIDTH = 0.95;
const SEAT_DEPTH = 0.4;
const SEAT_DISTANCE = 1.15;

// 使えない席。table はテーブルの番号、chair は椅子の番号（前側から時計回りに 1〜6）
const UNAVAILABLE = [
  { table: 1, chair: 6 }, // テーブル 1 の左前: 出入口の前
  { table: 3, chair: 2 }, // テーブル 3 の右前: 出入口の前
  { table: 5, chair: 4 }, // テーブル 5 のいちばん後ろ: 柱がある
];

// 図のいちばん上に書く見出し
const TITLE = '新人研修 Aクラス 座席表';

// 名簿。上から順に 1 番、2 番…の席に座る（名前はすべて架空）
const NAMES = [
  '千葉 陸', '橋本 湊', '大野 千尋', '小川 陽太', '山口 湊', '三浦 樹',
  '上田 大翔', '平野 遥', '大野 蒼', '岡田 航', '平野 湊', '安田 悠真',
  '佐野 慎也', '遠藤 莉子', '山口 健', '遠藤 七海', '上田 航', '川口 凛',
  '浜田 陸', '村上 悠真', '安田 翔太', '森田 颯', '小川 慎也', '安田 心春',
];

// ---- 描き方 ----

const SCALE = 80; // 1m を何ピクセルで描くか
const MARGIN = 48; // 部屋のまわりの余白（px）。「前」の文字を置く場所
const TITLE_SPACE = 44; // 図の上に見出しを書くためにあける高さ（px）
const LEGEND_SPACE = 32; // 図の下に凡例を書くためにあける高さ（px）
const PIXEL_RATIO = 2; // 保存する PNG を何倍の細かさで描くか。印刷してもぼやけないように 2 倍

const canvas = document.querySelector('#room');
const saveButton = document.querySelector('#save');

// テーブルと椅子の位置（部屋の左上の角からの距離, m）を、並べ方の数字から計算する。
// テーブルは前の列の左から順に 1, 2, 3…。椅子はテーブルの前側から時計回りに 1〜6。
function layoutTables() {
  const tables = [];
  // テーブルのかたまり全体を、部屋の左右の真ん中に置く
  const left = ROOM_WIDTH / 2 - (TABLE_COLUMNS - 1) * TABLE_GAP_X / 2;

  for (let row = 0; row < TABLE_ROWS; row++) {
    for (let col = 0; col < TABLE_COLUMNS; col++) {
      const table = {
        number: tables.length + 1,
        x: left + col * TABLE_GAP_X,
        y: FRONT_SPACE + row * TABLE_GAP_Y,
        seats: [],
      };
      for (let i = 0; i < CHAIRS_PER_TABLE; i++) {
        // 真上（前側）から始めて、時計回りに等間隔。canvas は下向きが +y なので角度が増えると時計回り
        const angle = -Math.PI / 2 + (i * 2 * Math.PI) / CHAIRS_PER_TABLE;
        table.seats.push({
          table: table.number,
          chair: i + 1,
          x: table.x + Math.cos(angle) * SEAT_DISTANCE,
          y: table.y + Math.sin(angle) * SEAT_DISTANCE,
        });
      }
      tables.push(table);
    }
  }
  return tables;
}

// m で表した位置を、canvas 上のピクセルに直す
function toX(m) {
  return MARGIN + m * SCALE;
}

function toY(m) {
  return TITLE_SPACE + MARGIN + m * SCALE;
}

function draw() {
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
  ctx.fillText(TITLE, toX(0), 20);

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

  for (const table of numberSeats(layoutTables())) {
    drawTable(ctx, table);
    for (const seat of table.seats) {
      // 番号は 1 から、配列の位置は 0 から数えるので 1 ずらす。名簿より席が多ければ undefined（空席）
      const name = seat.number === null ? undefined : NAMES[seat.number - 1];
      drawSeat(ctx, toX(seat.x), toY(seat.y), seat.number, name);
    }
  }

  drawLegend(ctx, toY(ROOM_DEPTH) + 28);
}

// 使える席に、テーブルの番号順・椅子の番号順に通し番号を振る。
// layoutTables() はテーブル 1 から順に、椅子は前側から時計回りに返すので、その順に数えればよい
function numberSeats(tables) {
  let number = 0;
  for (const table of tables) {
    for (const seat of table.seats) {
      if (isUnavailable(seat)) {
        seat.number = null;
      } else {
        number++;
        seat.number = number;
      }
    }
  }
  return tables;
}

function isUnavailable(seat) {
  return UNAVAILABLE.some(function (u) {
    return u.table === seat.table && u.chair === seat.chair;
  });
}

// 丸テーブルを 1 卓描く。真ん中にテーブルの番号を書く
function drawTable(ctx, table) {
  ctx.fillStyle = '#fdf6e3';
  ctx.strokeStyle = '#52606d';
  ctx.lineWidth = 1.5;
  ctx.beginPath();
  ctx.arc(toX(table.x), toY(table.y), (TABLE_DIAMETER / 2) * SCALE, 0, Math.PI * 2);
  ctx.fill();
  ctx.stroke();

  ctx.fillStyle = '#7b8794';
  ctx.textAlign = 'center';
  ctx.textBaseline = 'middle';
  ctx.font = '12px sans-serif';
  ctx.fillText('テーブル ' + table.number, toX(table.x), toY(table.y));
}

// 椅子（席）を 1 脚描く。cx, cy は椅子の中心（px）。number が null なら使えない席。name が無ければ空席
function drawSeat(ctx, cx, cy, number, name) {
  const w = SEAT_WIDTH * SCALE;
  const h = SEAT_DEPTH * SCALE;
  const unavailable = number === null;
  ctx.fillStyle = unavailable ? '#e4e7eb' : '#ffffff';
  ctx.strokeStyle = '#52606d';
  ctx.lineWidth = 1.5;
  ctx.beginPath();
  ctx.roundRect(cx - w / 2, cy - h / 2, w, h, 6);
  ctx.fill();
  ctx.stroke();

  // 使えない席は × を付ける。白黒で印刷しても灰色と見分けられるように
  if (unavailable) {
    drawCross(ctx, cx, cy, h * 0.28);
    return;
  }

  if (!name) {
    ctx.fillStyle = '#1f2933';
    ctx.textAlign = 'center';
    ctx.textBaseline = 'middle';
    ctx.font = 'bold 16px sans-serif';
    ctx.fillText(String(number), cx, cy);
    return;
  }

  // 名前が入る席は、番号を左上に小さく、名前を真ん中に大きく書く
  ctx.fillStyle = '#616e7c';
  ctx.textAlign = 'left';
  ctx.textBaseline = 'top';
  ctx.font = '10px sans-serif';
  ctx.fillText(String(number), cx - w / 2 + 4, cy - h / 2 + 2);

  ctx.fillStyle = '#1f2933';
  ctx.textAlign = 'center';
  ctx.textBaseline = 'middle';
  ctx.font = 'bold ' + fitFontSize(ctx, name, w - 8, 14) + 'px sans-serif';
  ctx.fillText(name, cx, cy + 5);
}

// 長い名前が席からはみ出さないよう、幅に収まるまで文字を小さくする
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

// canvas の絵を PNG にして、リンクをクリックしたことにしてダウンロードさせる
function savePng(targetCanvas, fileName) {
  const link = document.createElement('a');
  link.href = targetCanvas.toDataURL('image/png');
  link.download = fileName;
  link.click();
}

saveButton.addEventListener('click', function () {
  savePng(canvas, TITLE + '.png');
});

draw();
