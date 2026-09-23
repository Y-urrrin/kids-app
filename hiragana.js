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