/* =========================
   パズルデータ
========================= */

const puzzleData = {
  "animal": {
    "name": "どうぶつ",
    "puzzles": [
      {
        "name": "どうぶつえん",
        "image": "images/puzzle/hard/zoo_hard.png"
      },
      {
        "name": "うみのせかい",
        "image": "images/puzzle/hard/ocean_hard.png"
      },
      {
        "name": "のはらのどうぶつ",
        "image": "images/puzzle/hard/meadow_hard.png"
      },
      {
        "name": "こおりのせかい",
        "image": "images/puzzle/hard/antarctic_hard.png"
      }
    ]
  },
  "vehicle": {
    "name": "のりもの",
    "puzzles": [
      {
        "name": "しょうぼうしょ",
        "image": "images/puzzle/hard/firedepartment_hard.png"
      },
      {
        "name": "くうこう",
        "image": "images/puzzle/hard/airport_hard.png"
      },
      {
        "name": "うみののりもの",
        "image": "images/puzzle/hard/sea_vehicles_hard.png"
      },
      {
        "name": "こうじげんば",
        "image": "images/puzzle/hard/construction_hard.png"
      }
    ]
  },
  "food": {
    "name": "たべもの",
    "puzzles": [
      {
        "name": "ケーキやさん",
        "image": "images/puzzle/hard/cake_hard.png"
      },
      {
        "name": "パンやさん",
        "image": "images/puzzle/hard/bread_hard.png"
      },
      {
        "name": "ハンバーガーショップ",
        "image": "images/puzzle/hard/fastfood_hard.png"
      },
      {
        "name": "おすしやさん",
        "image": "images/puzzle/hard/sushi_hard.png"
      }
    ]
  }
};

/* =========================
   URLからテーマ・番号取得
========================= */

const params = new URLSearchParams(window.location.search);

const requestedTheme = params.get("theme");
const theme = Object.hasOwn(puzzleData, requestedTheme) ? requestedTheme : "animal";
let puzzleIndex = Number(params.get("index") || 0);

const themeData = puzzleData[theme];
if (!Number.isInteger(puzzleIndex) || puzzleIndex < 0 || puzzleIndex >= themeData.puzzles.length) puzzleIndex = 0;
const puzzle = themeData.puzzles[puzzleIndex];


/* =========================
   HTML取得
========================= */

const board = document.getElementById("puzzleBoard");
const pieceArea = document.getElementById("pieceArea");

const title = document.getElementById("puzzleName");

const completeModal =
  document.getElementById("completeModal");

const completeImage =
  document.getElementById("completeImage");

const nextButton =
  document.getElementById("nextButton");

const allCompleteModal =
  document.getElementById("allCompleteModal");



title.textContent = puzzle.name;


/* =========================
   基本設定
========================= */

const gridSize = 4;
const totalPieces = gridSize ** 2;

let completedPieces = 0;

/* 今動かしているピース */

let activePiece = null;

let startX = 0;
let startY = 0;

let originalX = 0;
let originalY = 0;


/* =========================
   パズル生成
========================= */

function createPuzzle() {

  /* 完成形のガイド画像を設定 */
board.style.setProperty(
  "--guide-image",
  `url("${puzzle.image}")`
);

  board.innerHTML = "";
  pieceArea.innerHTML = "";

  completedPieces = 0;


  /* 置き場所 */

  for (let i = 0; i < totalPieces; i++) {

    const slot =
      document.createElement("div");

    slot.className = "slot";

    slot.dataset.index = i;

    board.appendChild(slot);
  }


  /* ピースをシャッフル */

  const numbers = Array.from({length: totalPieces}, (_, i) => i);

  shuffle(numbers);


  numbers.forEach(index => {

    const piece = createPiece(index);

    pieceArea.appendChild(piece);

  });

}


/* =========================
   ピース生成
========================= */

function createPiece(index) {

  const piece =
    document.createElement("div");

  piece.className = "puzzle-piece";

  piece.dataset.index = index;



  /* =========================
   画像を4×4に分割
========================= */

piece.style.backgroundImage =
  `url("${puzzle.image}")`;

piece.style.backgroundSize =
  `${gridSize * 100}% ${gridSize * 100}%`;


/* 何列目・何行目かを計算 */

const col = index % gridSize;
const row = Math.floor(index / gridSize);


/* 各ピースの画像位置 */

const x = col * 100 / (gridSize - 1);
const y = row * 100 / (gridSize - 1);


piece.style.backgroundPosition =
  `${x}% ${y}%`;

  /* Pointer Events */

  piece.addEventListener(
    "pointerdown",
    startDrag
  );


  return piece;
}


/* =========================
   ドラッグ開始
========================= */

function startDrag(e) {

  const piece = e.currentTarget;

  if (activePiece || piece.classList.contains("returning") || e.button !== 0) return;
  activePiece = piece;


  /* pointerを確保 */




  /* 現在位置 */

  const rect =
    piece.getBoundingClientRect();


  startX = e.clientX;
  startY = e.clientY;

  originalX = rect.left;
  originalY = rect.top;


  /*
    pieceAreaからbodyへ移動。

    これをすることで
    親要素の範囲を超えて
    自由に動かせる。
  */

  const placeholder = document.createElement("div");
  placeholder.className = "piece-placeholder";
  piece.before(placeholder);
  piece.placeholder = placeholder;
  document.body.appendChild(piece);
  piece.setPointerCapture(e.pointerId);
  piece.pointerId = e.pointerId;


  /* 固定配置にする */

  piece.style.position = "fixed";

  piece.style.left =
    `${rect.left}px`;

  piece.style.top =
    `${rect.top}px`;

  piece.style.width =
    `${rect.width}px`;

  piece.style.height =
    `${rect.height}px`;

  piece.style.zIndex = "1000";

  piece.style.margin = "0";

  piece.classList.add("dragging");


  /* イベント */

  piece.addEventListener(
    "pointermove",
    moveDrag
  );

  piece.addEventListener(
    "pointerup",
    endDrag
  );

  piece.addEventListener(
    "pointercancel",
    endDrag
  );

}


/* =========================
   ドラッグ中
========================= */

function moveDrag(e) {

  if (!activePiece || e.pointerId !== activePiece.pointerId) return;


  const moveX =
    e.clientX - startX;

  const moveY =
    e.clientY - startY;


  activePiece.style.left =
    `${originalX + moveX}px`;

  activePiece.style.top =
    `${originalY + moveY}px`;

}


/* =========================
   指を離した
========================= */

function endDrag(e) {

  if (!activePiece || e.pointerId !== activePiece.pointerId) return;


  const piece = activePiece;

  const pieceIndex =
    Number(piece.dataset.index);


  /* ピース中央位置 */

  const pieceRect =
    piece.getBoundingClientRect();

  const centerX =
    pieceRect.left +
    pieceRect.width / 2;

  const centerY =
    pieceRect.top +
    pieceRect.height / 2;


  /* 正しいslot */

  const correctSlot =
    document.querySelector(
      `.slot[data-index="${pieceIndex}"]`
    );


  const slotRect =
    correctSlot.getBoundingClientRect();


  /*
    ピースの中心が
    正しいslotの中に入っているか
  */

  const isCorrect =

    centerX >= slotRect.left &&
    centerX <= slotRect.right &&

    centerY >= slotRect.top &&
    centerY <= slotRect.bottom;


  if (isCorrect && e.type !== "pointercancel") {

    /* 正解 */

    snapPiece(
      piece,
      correctSlot
    );

  } else {

    /* 不正解 */

    returnPiece(piece);

  }


  /* イベント解除 */

  piece.removeEventListener(
    "pointermove",
    moveDrag
  );

  piece.removeEventListener(
    "pointerup",
    endDrag
  );

  piece.removeEventListener(
    "pointercancel",
    endDrag
  );


  activePiece = null;

}


/* =========================
   正しい場所にはめる
========================= */

function snapPiece(piece, slot) {

  /* slotの中へ */

  slot.appendChild(piece);
  piece.placeholder.remove();


  /* ドラッグ用CSS解除 */

  piece.style.position =
    "static";

  piece.style.left =
    "";

  piece.style.top =
    "";

  piece.style.width =
    "100%";

  piece.style.height =
    "100%";

  piece.style.zIndex =
    "";

  piece.style.margin =
    "";

  piece.style.border =
    "none";

  piece.style.borderRadius =
    "0";

  piece.style.boxShadow =
    "none";

  piece.style.cursor =
    "default";


  piece.classList.remove(
    "dragging"
  );

  piece.classList.add(
    "correct"
  );


  /* もう動かさない */

  piece.removeEventListener(
    "pointerdown",
    startDrag
  );


  completedPieces++;


  /* 全部完成 */

  if (
    completedPieces ===
    totalPieces
  ) {

    setTimeout(
      showComplete,
      700
    );

  }

}


/* =========================
   元の場所へ戻す
========================= */

function returnPiece(piece) {

  piece.classList.add(
    "returning"
  );


  /* 元の場所へアニメーション */

  piece.style.left =
    `${originalX}px`;

  piece.style.top =
    `${originalY}px`;


  setTimeout(() => {

    piece.placeholder.replaceWith(piece);


    piece.style.position =
      "";

    piece.style.left =
      "";

    piece.style.top =
      "";

    piece.style.width =
      "";

    piece.style.height =
      "";

    piece.style.zIndex =
      "";

    piece.style.margin =
      "";


    piece.classList.remove(
      "dragging",
      "returning"
    );

  }, 250);

}


/* =========================
   完成
========================= */

function showComplete() {

  completeImage.src =
    puzzle.image;

  completeModal
    .classList
    .remove("hidden");

}


/* =========================
   次のパズル
========================= */

nextButton.addEventListener("click", () => {

  const nextIndex = puzzleIndex + 1;


  /* =========================
     次のパズルがある
  ========================= */

  if (nextIndex < themeData.puzzles.length) {

    window.location.href =
      `puzzle-hard.html?theme=${theme}&index=${nextIndex}&level=16`;

    return;
  }


  /* =========================
     このテーマを全部クリア！
  ========================= */

  completeModal.classList.add("hidden");

  allCompleteModal.classList.remove("hidden");

});


/* =========================
   シャッフル
========================= */

function shuffle(array) {

  for (
    let i = array.length - 1;
    i > 0;
    i--
  ) {

    const j =
      Math.floor(
        Math.random() *
        (i + 1)
      );


    [
      array[i],
      array[j]
    ] =
    [
      array[j],
      array[i]
    ];

  }

}


/* =========================
   START
========================= */

createPuzzle();