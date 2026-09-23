// ================================
// メニューカード
// ================================

const menuCards = document.querySelectorAll(".menu-card");

menuCards.forEach((card) => {

  card.addEventListener("click", () => {

    const page = card.dataset.page;

    // ページが指定されていれば移動
    if (page) {
      window.location.href = page;
    }

  });

});


// ================================
// 音 ON / OFF
// ================================

const soundButton = document.getElementById("soundButton");

let soundEnabled = true;

soundButton.addEventListener("click", () => {

  soundEnabled = !soundEnabled;

  if (soundEnabled) {
    soundButton.innerHTML = "🔊 <span>おと</span>";
  } else {
    soundButton.innerHTML = "🔇 <span>おと</span>";
  }

});


// ================================
// 設定
// ================================

const settingsButton =
  document.getElementById("settingsButton");

settingsButton.addEventListener("click", () => {

  alert("設定画面はこれから作るよ♪");

});
if ("serviceWorker" in navigator) {
  navigator.serviceWorker.register("./service-worker.js");
}