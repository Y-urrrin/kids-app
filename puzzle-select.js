/* 選択されたレベルを取得 */
const params = new URLSearchParams(
  window.location.search
);

const allowedLevels = ["4", "9", "16"];

const requestedLevel = params.get("level");

const level = allowedLevels.includes(requestedLevel)
  ? requestedLevel
  : "9";

/* テーマを選択 */
const themeCards =
  document.querySelectorAll(".theme-card");

themeCards.forEach(card => {

  if (level === "16" && !["animal", "vehicle", "food"].includes(card.dataset.theme)) {
    card.hidden = true;
    card.style.display = "none";
    return;
  }
  card.addEventListener("click", () => {

    const theme = card.dataset.theme;

    const page = level === "16" ? "puzzle-hard.html" : "puzzle.html";
    window.location.href =
      `${page}?theme=${theme}&index=0&level=${level}`;

  });

});
