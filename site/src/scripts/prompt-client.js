// `:::prompt`（remark-prompt.mjs が生成する `.codex-prompt`）の動き。
// - 入力欄はその場で書き換えられ、高さは中身に合わせて伸びる
// - 書き換えた内容は一定間隔でブラウザ（localStorage）に保存し、次に開いたときに戻す
// - 「元に戻す」で教材の文面（textarea の初期値）に戻し、「コピー」でクリップボードに入れる
// `.codex-prompt` が無いページでは何もしない。全ページの <head> に inline 注入される。
(function () {
  var SAVE_INTERVAL = 2000; // 保存する間隔（ミリ秒）

  // localStorage はプライベートウィンドウなどで使えないことがあるので、失敗しても止まらないようにする
  function load(key) {
    try {
      return localStorage.getItem(key);
    } catch (e) {
      return null;
    }
  }

  function save(key, value) {
    try {
      localStorage.setItem(key, value);
    } catch (e) {
      // 保存できなくても、ページ上での書き換えはそのまま使える
    }
  }

  function remove(key) {
    try {
      localStorage.removeItem(key);
    } catch (e) {
      // 同上
    }
  }

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

  // 中身が全部見えるよう、高さを文章の量に合わせる
  function fitHeight(text) {
    text.style.height = 'auto';
    text.style.height = text.scrollHeight + 2 + 'px';
  }

  function setup() {
    var prompts = document.querySelectorAll('.codex-prompt');
    prompts.forEach(function (fig, index) {
      var text = fig.querySelector('.codex-prompt__text');
      var reset = fig.querySelector('.codex-prompt__reset');
      var copyBtn = fig.querySelector('.codex-prompt__copy');
      var label = fig.querySelector('.codex-prompt__copy-label');
      if (!text || !reset || !copyBtn || !label) return;

      // ページごと・何個目のプロンプトかで保存先を分ける
      var key = 'codex-prompt:' + location.pathname + ':' + index;
      var lastSaved = load(key);
      if (lastSaved !== null) text.value = lastSaved;

      function refresh() {
        fitHeight(text);
        reset.disabled = text.value === text.defaultValue;
      }

      text.addEventListener('input', refresh);
      window.addEventListener('resize', function () {
        fitHeight(text);
      });

      // 打つたびに保存すると重いので、一定間隔で「変わっていたら」保存する
      function flush() {
        if (text.value === lastSaved) return;
        if (text.value === text.defaultValue) {
          remove(key);
          lastSaved = null;
        } else {
          save(key, text.value);
          lastSaved = text.value;
        }
      }
      setInterval(flush, SAVE_INTERVAL);
      // 間隔の途中でページを閉じても、最後の書き換えを失わないように
      window.addEventListener('pagehide', flush);

      reset.addEventListener('click', function () {
        text.value = text.defaultValue;
        remove(key);
        lastSaved = null;
        refresh();
      });

      copyBtn.addEventListener('click', function () {
        copy(text.value).then(function () {
          copyBtn.setAttribute('data-copied', '');
          label.textContent = 'コピーしました';
          setTimeout(function () {
            copyBtn.removeAttribute('data-copied');
            label.textContent = 'コピー';
          }, 2000);
        });
      });

      refresh();
    });
  }

  if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', setup);
  } else {
    setup();
  }
})();
