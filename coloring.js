// ===============================
// HTML要素
// ===============================

const canvas =
  document.getElementById("drawingCanvas");

const ctx =
  canvas.getContext("2d");

const coloringImage =
  document.getElementById("coloringImage");

const backButton =
  document.getElementById("backButton");

const clearButton =
  document.getElementById("clearButton");

const eraserButton =
  document.getElementById("eraserButton");

const colorButtons =
  document.querySelectorAll(".color-button");

const sizeButtons =
  document.querySelectorAll(".size-button");



// ===============================
// URLから絵を取得
// ===============================

const params =
  new URLSearchParams(
    window.location.search
  );


const picture =
  params.get("picture") || "elephant";



// ===============================
// 使用できる画像
// ===============================

const pictures = {

  elephant:
    "images/coloring/elephant.png",

  panda:
    "images/coloring/panda.png",

  lion:
    "images/coloring/lion.png",

  rabbit:
    "images/coloring/rabbit.png",

  dolphin:
    "images/coloring/dolphin.png",

  "whale-shark":
    "images/coloring/whale-shark.png",

  penguin:
    "images/coloring/penguin.png",

  orca:
    "images/coloring/orca.png",

  sunflower:
    "images/coloring/sunflower.png",

  "cherry-blossom":
    "images/coloring/cherry-blossom.png",

  snowman:
    "images/coloring/snowman.png",

  car:
    "images/coloring/car.png",

  train:
    "images/coloring/train.png",

  fruit:
    "images/coloring/fruit.png",

  vegetables:
    "images/coloring/vegetables.png",

  mickey:
    "images/coloring/mickey.png",
  
  "mickeyfriends":
    "images/coloring/mickeyfriends.png",

  "mickeyfriends2":
    "images/coloring/mickeyfriends2.png",

  pooh:
    "images/coloring/pooh.png",

  rapunzel:
    "images/coloring/rapunzel.png",

  sofia:
    "images/coloring/sofia.png",

  toystory:
    "images/coloring/toystory.png",


};


// 存在しないpictureだったら
// elephantを表示
console.log("picture =", picture);
console.log("pictures =", pictures);
console.log("選ばれた画像 =", pictures[picture]);

coloringImage.src =
  pictures[picture] ||
  pictures.elephant;



// ===============================
// 描画設定
// ===============================

let drawing = false;

let currentColor =
  "#ff6b81";

let brushSize =
  25;

let eraserMode =
  false;



// ===============================
// Canvasサイズ
// ===============================

function resizeCanvas() {

  const rect =
    canvas.getBoundingClientRect();


  const oldCanvas =
    document.createElement("canvas");


  oldCanvas.width =
    canvas.width;

  oldCanvas.height =
    canvas.height;


  oldCanvas
    .getContext("2d")
    .drawImage(canvas, 0, 0);


  canvas.width =
    rect.width;

  canvas.height =
    rect.height;


  // リサイズ前の絵を戻す
  ctx.drawImage(
    oldCanvas,
    0,
    0,
    oldCanvas.width,
    oldCanvas.height,
    0,
    0,
    canvas.width,
    canvas.height
  );


  ctx.lineCap =
    "round";

  ctx.lineJoin =
    "round";

}


window.addEventListener(
  "resize",
  resizeCanvas
);


resizeCanvas();



// ===============================
// 座標取得
// ===============================

function getPosition(event) {

  const rect =
    canvas.getBoundingClientRect();


  return {

    x:
      event.clientX -
      rect.left,

    y:
      event.clientY -
      rect.top

  };

}



// ===============================
// 描き始め
// ===============================

function startDrawing(event) {

  console.log("描き始め！");

  event.preventDefault();

  drawing = true;

  canvas.setPointerCapture(event.pointerId);

  const pos = getPosition(event);

  ctx.beginPath();

  ctx.moveTo(pos.x, pos.y);

  // クリックしただけでも点が描けるようにする
  ctx.lineWidth = brushSize;
  ctx.lineCap = "round";
  ctx.lineJoin = "round";

  if (eraserMode) {

    ctx.globalCompositeOperation =
      "destination-out";

  } else {

    ctx.globalCompositeOperation =
      "source-over";

    ctx.strokeStyle =
      currentColor;

    // インクを半透明にする
  ctx.globalAlpha = 0.05;
  }

  ctx.lineTo(
    pos.x + 0.1,
    pos.y + 0.1
  );

  ctx.stroke();
}



// ===============================
// 描く
// ===============================

function draw(event) {

  if (!drawing) {
    return;
  }

  event.preventDefault();

  const pos = getPosition(event);

  ctx.lineWidth = brushSize;
  ctx.lineCap = "round";
  ctx.lineJoin = "round";

  if (eraserMode) {

    ctx.globalCompositeOperation =
      "destination-out";

  } else {

    ctx.globalCompositeOperation =
      "source-over";

    ctx.strokeStyle =
      currentColor;
  }

  ctx.lineTo(
    pos.x,
    pos.y
  );

  ctx.stroke();

  ctx.beginPath();

  ctx.moveTo(
    pos.x,
    pos.y
  );
}



// ===============================
// 描き終わり
// ===============================

function stopDrawing(event) {

  if (!drawing) {
    return;
  }

  drawing = false;

  ctx.beginPath();

  if (
    event &&
    canvas.hasPointerCapture(event.pointerId)
  ) {

    canvas.releasePointerCapture(
      event.pointerId
    );
  }
}


// ===============================
// Pointerイベント
// ===============================

// PointerEventを使うことで
// マウス・指・Apple Pencilなどを
// まとめて扱える

canvas.addEventListener(
  "pointerdown",
  startDrawing
);


canvas.addEventListener(
  "pointermove",
  draw
);


canvas.addEventListener(
  "pointerup",
  stopDrawing
);


canvas.addEventListener(
  "pointercancel",
  stopDrawing
);




// ===============================
// 色選択
// ===============================

colorButtons.forEach(
  button => {

    button.addEventListener(
      "click",
      () => {

        currentColor =
          button.dataset.color;


        eraserMode =
          false;


        // 選択表示を解除
        colorButtons.forEach(
          item =>
            item.classList.remove(
              "active"
            )
        );


        button.classList.add(
          "active"
        );


        eraserButton.classList.remove(
          "active"
        );

      }
    );

  }
);



// ===============================
// 太さ選択
// ===============================

sizeButtons.forEach(
  button => {

    button.addEventListener(
      "click",
      () => {

        brushSize =
          Number(
            button.dataset.size
          );


        sizeButtons.forEach(
          item =>
            item.classList.remove(
              "active"
            )
        );


        button.classList.add(
          "active"
        );

      }
    );

  }
);



// ===============================
// 消しゴム
// ===============================

eraserButton.addEventListener(
  "click",
  () => {

    eraserMode =
      true;


    colorButtons.forEach(
      item =>
        item.classList.remove(
          "active"
        )
    );


    eraserButton.classList.add(
      "active"
    );

  }
);



// ===============================
// 全部消す
// ===============================

clearButton.addEventListener(
  "click",
  () => {

    ctx.clearRect(
      0,
      0,
      canvas.width,
      canvas.height
    );

  }
);



// ===============================
// 戻る
// ===============================

backButton.addEventListener(
  "click",
  () => {

    window.location.href =
      "coloring-select.html";

  }
);