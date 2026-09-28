/* =========================
   パズルデータ
========================= */

const puzzleData = {

  animal: {
    name: "どうぶつ",

    puzzles: [
      {
        name: "ねこ",
        image: "images/puzzle/animal/cat.png"
      },
      {
        name: "うさぎ",
        image: "images/puzzle/animal/rabbit.png"
      },
      {
        name: "パンダ",
        image: "images/puzzle/animal/panda.png"
      },
      {
        name: "ライオン",
        image: "images/puzzle/animal/lion.png"
      }
    ]
  },


  sea: {
    name: "うみのいきもの",

    puzzles: [
      {
        name: "イルカ",
        image: "images/puzzle/sea/dolphin.png"
      },
      {
        name: "シャチ",
        image: "images/puzzle/sea/orca.png"
      },
      {
        name: "ジンベエザメ",
        image: "images/puzzle/sea/whaleshark.png"
      },
      {
        name: "ウミガメ",
        image: "images/puzzle/sea/turtle.png"
      }
    ]
  },


  vehicle: {
    name: "のりもの",

    puzzles: [
      {
        name: "くるま",
        image: "images/puzzle/vehicle/car.png"
      },
      {
        name: "でんしゃ",
        image: "images/puzzle/vehicle/train.png"
      },
      {
        name: "ひこうき",
        image: "images/puzzle/vehicle/airplane.png"
      },
      {
        name: "バス",
        image: "images/puzzle/vehicle/bus.png"
      }
    ]
  },


  insect: {
    name: "むし",

    puzzles: [
      {
        name: "てんとうむし",
        image: "images/puzzle/insect/ladybug.png"
      },
      {
        name: "ちょうちょ",
        image: "images/puzzle/insect/butterfly.png"
      },
      {
        name: "カタツムリ",
        image: "images/puzzle/insect/snail.png"
      },
      {
        name: "カマキリ",
        image: "images/puzzle/insect/mantis.png"
      }
    ]
  },


  food: {
    name: "たべもの",

    puzzles: [
      {
        name: "くだもの",
        image: "images/puzzle/food/fruits.png"
      },
      {
        name: "やさい",
        image: "images/puzzle/food/vegetables.png"
      },
      {
        name: "ケーキ",
        image: "images/puzzle/food/cake.png"
      },
      {
        name: "ハンバーガー",
        image: "images/puzzle/food/hamburger.png"
      }
    ]
  }

};


/* =========================
   URLからテーマ・番号取得
========================= */

const params = new URLSearchParams(window.location.search);

const theme = params.get("theme") || "animal";
let puzzleIndex = Number(params.get("index") || 0);

const themeData = puzzleData[theme];
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

const totalPieces = 9;

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

  const numbers = [
  0, 1, 2,
  3, 4, 5,
  6, 7, 8
];

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
   画像を3×3に分割
========================= */

piece.style.backgroundImage =
  `url("${puzzle.image}")`;

piece.style.backgroundSize =
  "300% 300%";


/* 何列目・何行目かを計算 */

const col = index % 3;
const row = Math.floor(index / 3);


/* 0% / 50% / 100% */

const x = col * 50;
const y = row * 50;


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

  activePiece = piece;


  /* pointerを確保 */

  piece.setPointerCapture(e.pointerId);


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

  document.body.appendChild(piece);


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

  if (!activePiece) return;


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

  if (!activePiece) return;


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


  if (isCorrect) {

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

    pieceArea.appendChild(piece);


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
      `puzzle.html?theme=${theme}&index=${nextIndex}`;

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