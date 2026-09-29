// 「図を描く」デモ。canvas に棒グラフを描く。
// 画像ファイルを読み込んでいるのではなく、線と四角をその場で描いている。

const sample = [
  '4月 120',
  '5月 185',
  '6月 96',
  '7月 210',
  '8月 164',
  '9月 232',
].join('\n');

const dataInput = document.querySelector('#data');
const canvas = document.querySelector('#canvas');
const context = canvas.getContext('2d');

dataInput.value = sample;

function draw() {
  const items = dataInput.value
    .split('\n')
    .map((line) => line.trim())
    .filter((line) => line !== '')
    .map((line) => {
      const parts = line.split(/\s+/);
      return { label: parts[0], value: Number(parts[1]) || 0 };
    });

  context.clearRect(0, 0, canvas.width, canvas.height);
  if (items.length === 0) return;

  const bottom = canvas.height - 28;
  const top = 16;
  const max = Math.max(...items.map((item) => item.value), 1);
  const slot = canvas.width / items.length;
  const barWidth = Math.min(48, slot * 0.6);

  // 目盛りの線
  context.strokeStyle = '#e3e8ee';
  context.lineWidth = 1;
  for (let i = 0; i <= 4; i += 1) {
    const y = bottom - (bottom - top) * (i / 4);
    context.beginPath();
    context.moveTo(0, y);
    context.lineTo(canvas.width, y);
    context.stroke();
  }

  items.forEach((item, index) => {
    const height = (bottom - top) * (item.value / max);
    const x = slot * index + (slot - barWidth) / 2;

    context.fillStyle = '#2b6cb0';
    context.fillRect(x, bottom - height, barWidth, height);

    context.fillStyle = '#1f2933';
    context.font = '12px system-ui, sans-serif';
    context.textAlign = 'center';
    context.fillText(String(item.value), x + barWidth / 2, bottom - height - 5);

    context.fillStyle = '#616e7c';
    context.fillText(item.label, x + barWidth / 2, bottom + 17);
  });
}

dataInput.addEventListener('input', draw);
draw();
