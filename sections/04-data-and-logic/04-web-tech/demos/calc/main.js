// 「計算する」デモ。入力が変わるたびに計算し直す。

const priceInput = document.querySelector('#price');
const rateInput = document.querySelector('#rate');
const peopleInput = document.querySelector('#people');
const out = document.querySelector('#out');

function render() {
  const price = Number(priceInput.value) || 0;
  const rate = Number(rateInput.value) || 0;
  const people = Math.max(1, Number(peopleInput.value) || 1);

  const tax = Math.floor(price * rate / 100);
  const total = price + tax;
  const each = Math.ceil(total / people); // 割り切れない分は多めに集める

  out.innerHTML =
    `消費税 ${tax.toLocaleString()} 円 ／ 税込 <strong>${total.toLocaleString()} 円</strong>` +
    `<br />${people} 人で割ると 1 人 <strong>${each.toLocaleString()} 円</strong>` +
    `（集まる合計 ${(each * people).toLocaleString()} 円）`;
}

for (const input of [priceInput, rateInput, peopleInput]) {
  input.addEventListener('input', render);
}

render();
