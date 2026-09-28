const themeCards = document.querySelectorAll(".theme-card");

themeCards.forEach(card => {

  card.addEventListener("click", () => {

    const theme = card.dataset.theme;

    window.location.href =
      `puzzle.html?theme=${theme}&index=0`;

  });

});
