// ===============================
// ぬりえデータ
// ===============================

const coloringItems = [
  {
    id: "elephant",
    name: "ぞう",
    image: "images/coloring/elephant.png"
  },
  {
    id: "panda",
    name: "ぱんだ",
    image: "images/coloring/panda.png"
  },
  {
    id: "lion",
    name: "らいおん",
    image: "images/coloring/lion.png"
  },
  {
    id: "rabbit",
    name: "うさぎ",
    image: "images/coloring/rabbit.png"
  },
  {
    id: "dolphin",
    name: "いるか",
    image: "images/coloring/dolphin.png"
  },
  {
    id: "whale-shark",
    name: "ジンベイザメ",
    image: "images/coloring/whale-shark.png"
  },
  {
    id: "penguin",
    name: "ぺんぎん",
    image: "images/coloring/penguin.png"
  },
  {
    id: "orca",
    name: "しゃち",
    image: "images/coloring/orca.png"
  },
  {
    id: "cherry-blossom",
    name: "さくら",
    image: "images/coloring/cherry-blossom.png"
  },
  {
    id: "sunflower",
    name: "ひまわり",
    image: "images/coloring/sunflower.png"
  },
  {
    id: "snowman",
    name: "ゆきだるま",
    image: "images/coloring/snowman.png"
  },
  {
    id: "car",
    name: "くるま",
    image: "images/coloring/car.png"
  },
  {
    id: "train",
    name: "でんしゃ",
    image: "images/coloring/train.png"
  },
  {
    id: "fruit",
    name: "くだもの",
    image: "images/coloring/fruit.png"
  },
  {
    id: "vegetables",
    name: "やさい",
    image: "images/coloring/vegetables.png"
  },
  {
    id: "mickey",
    name: "ミッキー",
    image: "images/coloring/mickey.png"
  },
   {
    id: "mickeyfriends",
    name: "ミッキーフレンズ",
    image: "images/coloring/mickeyfriends.png"
  },
   {
    id: "mickeyfriends2",
    name: "ミッキーフレンズ２",
    image: "images/coloring/mickeyfriends2.png"
  },
   {
    id: "pooh",
    name: "プーさん",
    image: "images/coloring/pooh.png"
  },
   {
    id: "rapunzel",
    name: "ラプンツェル",
    image: "images/coloring/rapunzel.png"
  },
   {
    id: "sofia",
    name: "ソフィア",
    image: "images/coloring/sofia.png"
  },
   {
    id: "toystory",
    name: "トイストーリー",
    image: "images/coloring/toystory.png"
  },
];


// ===============================
// HTMLの要素を取得
// ===============================

const gallery = document.getElementById("gallery");

const prevButton = document.getElementById("prevButton");

const nextButton = document.getElementById("nextButton");

const pageDots = document.getElementById("pageDots");

const homeButton = document.getElementById("homeButton");


// ===============================
// ページ設定
// ===============================

// 1ページに15個表示
const itemsPerPage = 15;

// 現在のページ
let currentPage = 0;

// 全ページ数
const totalPages = Math.ceil(
  coloringItems.length / itemsPerPage
);


// ===============================
// カードを表示する
// ===============================

function renderGallery() {

  // 一度中身を空にする
  gallery.innerHTML = "";


  // このページで表示する範囲
  const start =
    currentPage * itemsPerPage;

  const end =
    start + itemsPerPage;


  const pageItems =
    coloringItems.slice(start, end);


  // カードを作る
  pageItems.forEach((item, index) => {

    const button =
      document.createElement("button");

    button.type = "button";

    button.className =
      `coloring-choice color-${(index % 5) + 1}`;


    // 画像部分
    const imageBox =
      document.createElement("div");

    imageBox.className =
      "coloring-choice-image";


    const img =
      document.createElement("img");

    img.src = item.image;

    img.alt = `${item.name}のぬりえ`;


    // 名前
    const name =
      document.createElement("span");

    name.className =
      "coloring-choice-name";

    name.textContent =
      item.name;


    // 組み立て
    imageBox.appendChild(img);

    button.appendChild(imageBox);

    button.appendChild(name);


    // タップしたらぬりえ画面へ
    button.addEventListener(
      "click",
      () => {

        window.location.href =
          `coloring.html?picture=${encodeURIComponent(item.id)}`;

      }
    );


    gallery.appendChild(button);

  });


  renderDots();

  updateButtons();
}


// ===============================
// ページの●を表示
// ===============================

function renderDots() {

  pageDots.innerHTML = "";


  for (
    let i = 0;
    i < totalPages;
    i++
  ) {

    const dot =
      document.createElement("span");

    dot.className = "page-dot";


    if (i === currentPage) {

      dot.classList.add("active");

    }


    dot.addEventListener(
      "click",
      () => {

        currentPage = i;

        renderGallery();

      }
    );


    pageDots.appendChild(dot);

  }
}


// ===============================
// 左右ボタン
// ===============================

function updateButtons() {

  prevButton.disabled =
    currentPage === 0;

  nextButton.disabled =
    currentPage === totalPages - 1;

}


// 前へ
prevButton.addEventListener(
  "click",
  () => {

    if (currentPage > 0) {

      currentPage--;

      renderGallery();

    }

  }
);


// 次へ
nextButton.addEventListener(
  "click",
  () => {

    if (
      currentPage < totalPages - 1
    ) {

      currentPage++;

      renderGallery();

    }

  }
);


// ===============================
// ホームへ戻る
// ===============================

homeButton.addEventListener(
  "click",
  () => {

    window.location.href =
      "index.html";

  }
);


// ===============================
// 最初に表示
// ===============================

renderGallery();