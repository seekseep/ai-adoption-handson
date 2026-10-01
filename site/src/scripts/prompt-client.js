// `:::prompt`（remark-prompt.mjs が生成する `.codex-prompt`）のコピーボタン。
// 押すと入力欄の中のプロンプトをクリップボードに入れ、少しのあいだ「コピーしました」と出す。
// `.codex-prompt` が無いページでは何もしない。全ページの <head> に inline 注入される。
(function () {
  // navigator.clipboard が使えない環境（古いブラウザ・http）向けに、選択してコピーする方法も持つ
  function fallbackCopy(text) {
    var ta = document.createElement('textarea');
    ta.value = text;
    ta.setAttribute('readonly', '');
    ta.style.position = 'fixed';
    ta.style.opacity = '0';
    document.body.appendChild(ta);
    ta.select();
    try {
      document.execCommand('copy');
    } finally {
      document.body.removeChild(ta);
    }
  }

  function copy(text) {
    if (navigator.clipboard && window.isSecureContext) {
      return navigator.clipboard.writeText(text).catch(function () {
        fallbackCopy(text);
      });
    }
    fallbackCopy(text);
    return Promise.resolve();
  }

  function setup() {
    document.querySelectorAll('.codex-prompt').forEach(function (fig) {
      var btn = fig.querySelector('.codex-prompt__copy');
      var text = fig.querySelector('.codex-prompt__text');
      var label = fig.querySelector('.codex-prompt__copy-label');
      if (!btn || !text || !label) return;
      btn.addEventListener('click', function () {
        copy(text.textContent).then(function () {
          btn.setAttribute('data-copied', '');
          label.textContent = 'コピーしました';
          setTimeout(function () {
            btn.removeAttribute('data-copied');
            label.textContent = 'コピー';
          }, 2000);
        });
      });
    });
  }

  if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', setup);
  } else {
    setup();
  }
})();
