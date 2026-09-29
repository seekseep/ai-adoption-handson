/**
 * レクチャーのパス・配布物の命名規約を一元管理するモジュール。
 *
 *   sections/<sec>/<lec>/example        … 動くコード（配布 ZIP / プレビューの元）
 *   sections/<sec>/<lec>/demos/<name>   … 解説用の小さなデモ（プレビューのみ。ZIP 化しない）
 *   downloads/<sec>-<lec>.zip           … 配布 ZIP（build-downloads.mjs）
 *   downloads/<sec>-<lec>-assets.zip    … 素材だけの ZIP（example/assets/ がある節のみ）
 *   preview/<sec>-<lec>/                … ライブプレビュー（build-previews.mjs）
 *   preview/<sec>-<lec>--<name>/        … デモのライブプレビュー（同上）
 *
 * 配布 ZIP を解凍したときのルートフォルダ名は「作っているアプリの名前」にそろえる
 * （EXAMPLE_ZIP_ROOTS）。同じセクション内のどの節を解凍しても同じ名前になるので、
 * 前の節のフォルダに上書き展開すればそのままアプリを育てていける。
 */

const LECTURE_REL_RE = /^sections\/([\w-]+)\/([\w-]+)$/;

/**
 * 配布 ZIP を解凍したときのルートフォルダ名。セクション単位で決める。
 * ここに無いセクションは 'app' になる。
 */
const EXAMPLE_ZIP_ROOTS = {
  '02-seating-chart': 'seating-chart',
  '05-shift-table': 'shift-table',
};
const DEFAULT_EXAMPLE_ZIP_ROOT = 'app';

/** 配布 ZIP／素材 ZIP を解凍したときに置くフォルダ名（`seating-chart` など）。 */
export function exampleZipRootFor(sec) {
  return EXAMPLE_ZIP_ROOTS[sec] ?? DEFAULT_EXAMPLE_ZIP_ROOT;
}

/** `sections/<sec>/<lec>` を { sec, lec } に分解する。一致しなければ null。 */
export function parseLectureRel(lectureRel) {
  const m = lectureRel.match(LECTURE_REL_RE);
  return m ? { sec: m[1], lec: m[2] } : null;
}

/** レクチャーの動くコードのディレクトリ（`sections/<sec>/<lec>/example`）。 */
export function exampleDirOf(lectureRel) {
  return `${lectureRel}/example`;
}

/** レクチャーの解説用デモのディレクトリ（`sections/<sec>/<lec>/demos`）。 */
export function demosDirOf(lectureRel) {
  return `${lectureRel}/demos`;
}

/**
 * デモ 1 つのディレクトリ（`sections/<sec>/<lec>/demos/<name>`）。
 * `::codeview{path="demos/<name>"}` に書く相対パスもこの形。
 */
export function demoDirOf(lectureRel, name) {
  return `${demosDirOf(lectureRel)}/${name}`;
}

/**
 * プレビュー配置名。public/preview/ 配下のフォルダ名。
 * demo 名を渡すとデモ用の名前（`<sec>-<lec>--<demo>`）になる。
 */
export function previewNameOf(sec, lec, demo) {
  return demo ? `${sec}-${lec}--${demo}` : `${sec}-${lec}`;
}

/** 配布 ZIP のファイル名（`<sec>-<lec>.zip`）。 */
export function zipBasenameFor(sec, lec) {
  return `${sec}-${lec}.zip`;
}

/** サイト上の配布 ZIP への URL（`<base>/downloads/<sec>-<lec>.zip`）。 */
export function downloadUrlFor(base, sec, lec) {
  return `${base}/downloads/${zipBasenameFor(sec, lec)}`;
}

/** 素材だけの ZIP のファイル名（`<sec>-<lec>-assets.zip`）。 */
export function assetsZipBasenameFor(sec, lec) {
  return `${sec}-${lec}-assets.zip`;
}

/** サイト上の素材 ZIP への URL（`<base>/downloads/<sec>-<lec>-assets.zip`）。 */
export function assetsDownloadUrlFor(base, sec, lec) {
  return `${base}/downloads/${assetsZipBasenameFor(sec, lec)}`;
}

/** サイト上のライブプレビュー URL（`<base>/preview/<sec>-<lec>[--<demo>]/index.html`）。 */
export function previewUrlFor(base, sec, lec, demo) {
  return `${base}/preview/${previewNameOf(sec, lec, demo)}/index.html`;
}
