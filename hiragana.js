// ================================
// ひらがなブロックを全部取得
// ================================

const hiraganaBlocks =
  document.querySelectorAll(".hiragana-block");


// ================================
// 音声を再生する関数
// ================================

let currentAudio = null;

function speak(audioFile) {

  // 今再生している音声があれば止める
  if (currentAudio) {
    currentAudio.pause();
    currentAudio.currentTime = 0;
  }

  // 新しい音声を読み込む
  currentAudio = new Audio(audioFile);

  // 再生
  currentAudio.play();

}


// ================================
// ひらがなブロックをタップ
// ================================

hiraganaBlocks.forEach((block) => {

  block.addEventListener("click", () => {

    const audioFile = block.dataset.audio;

    speak(audioFile);

  });

});


// ================================
// ホーム
// ================================

const homeButton =
  document.getElementById("homeButton");

homeButton.addEventListener("click", () => {

  window.location.href = "index.html";

});
// ================================
// 長い言葉の文字サイズを自動調整
// ================================

function adjustWordSize() {

  const words = document.querySelectorAll(".word");

  words.forEach((word) => {

    // まず元の文字サイズに戻す
    word.style.fontSize = "";

    // CSSで設定された文字サイズを取得
    let fontSize = parseFloat(
      window.getComputedStyle(word).fontSize
    );

    // 文字が入る横幅を取得
    const availableWidth = word.parentElement.clientWidth;

    // 枠に収まるまで少しずつ小さくする
    while (
      word.scrollWidth > availableWidth &&
      fontSize > 9
    ) {

      fontSize -= 1;

      word.style.fontSize = fontSize + "px";

    }

  });

}


// ページを開いたとき
window.addEventListener("load", adjustWordSize);

// 画面サイズが変わったとき
window.addEventListener("resize", adjustWordSize);