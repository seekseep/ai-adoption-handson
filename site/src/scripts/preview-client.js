// `::preview` のライブプレビュー（sentinels.mjs が生成する `.lecture-preview`）の
// 「↻ 再読み込み」ボタン。押すと iframe を読み直し、ゲームを最初からやり直せる。
// `.lecture-preview` が無いページでは何もしない。全ページの <head> に inline 注入される。
(function () {
  function reload(iframe) {
    // src を入れ直すことで確実に読み直す（location.reload はタイミングで空振りするため）。
    var src = iframe.getAttribute('src');
    iframe.setAttribute('src', src);
  }

  // width 指定のプレビューは、枠の実幅に合わせて縮小率を決め直す（スマホなど 720px 未満の画面用）。
  // 縮小前の高さは据え置くので、見た目の高さも幅と同じ比率で縮む。
  function fit(fig, iframe) {
    var w = Number(iframe.dataset.width);
    if (!w) return;
    iframe.style.zoom = String(Math.min(1, 720 / w, fig.clientWidth / w));
  }

  function setup() {
    document.querySelectorAll('.lecture-preview').forEach(function (fig) {
      var btn = fig.querySelector('.lecture-preview__reload');
      var iframe = fig.querySelector('.lecture-preview__frame');
      if (!btn || !iframe) return;
      if (iframe.dataset.width) {
        fit(fig, iframe);
        window.addEventListener('resize', function () {
          fit(fig, iframe);
        });
      }
      btn.addEventListener('click', function () {
        reload(iframe);
      });
    });
  }

  if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', setup);
  } else {
    setup();
  }
})();
