// ================================
// もどるボタン
// ================================

const backButton =
  document.getElementById("backButton");

backButton.addEventListener("click", () => {
  window.location.href = "index.html";
});


// ================================
// カードをタップしたとき
// ================================

const selectCards =
  document.querySelectorAll(".select-card");

selectCards.forEach((card) => {

  card.addEventListener("click", () => {

    const page = card.dataset.page;

    window.location.href = page;

  });

});