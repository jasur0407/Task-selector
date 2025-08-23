function renderPoints() {
    let totalPoints = Number(localStorage.getItem("totalPoints")) || 0;
    document.querySelector(".header_right_coins-count").textContent = totalPoints;
}

renderPoints();

console.log(localStorage)