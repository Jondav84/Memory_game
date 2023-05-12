/** @format */
const FASTEST_TIME_KEY = "fastestTime";
const gameContainer = document.getElementById("game");
const timerEle = document.getElementById("timer");
const scoreCard = document.getElementById("lowestScore");

const resetButton = document.getElementById("reset-button");
resetButton.addEventListener("click", resetGame);

let clicks = 0;
let card1 = null;
let card2 = null;
let matchedCards = 0;
let intervalId;
let elapsedTimeInSeconds = 0;
let fastestTime = localStorage.getItem(FASTEST_TIME_KEY);

if (fastestTime) {
  fastestTime = parseInt(fastestTime);
  scoreCard.innerText = `Fastest Time: ${fastestTime} seconds!`;
} else {
  fastestTime = Infinity;
}

const COLORS = [
  "red",
  "blue",
  "green",
  "orange",
  "purple",
  "black",
  "brown",
  "yellow",
  "teal",
  "pink",
  "darkblue",
  "white",
  "red",
  "blue",
  "green",
  "orange",
  "purple",
  "black",
  "brown",
  "yellow",
  "teal",
  "pink",
  "darkblue",
  "white",
];
function shuffle(array) {
  let counter = array.length;

  while (counter > 0) {
    let index = Math.floor(Math.random() * counter);

    counter--;

    let temp = array[counter];
    array[counter] = array[index];
    array[index] = temp;
  }

  return array;
}

let shuffledColors = shuffle(COLORS);

function createDivsForColors(colorArray) {
  for (let color of colorArray) {
    const newDiv = document.createElement("div");

    newDiv.classList.add(color);
    newDiv.setAttribute("id", "card");

    newDiv.addEventListener("click", handleCardClick);

    newDiv.matched = false;
    gameContainer.append(newDiv);
  }
}

function handleCardClick(event) {
  let currentCard = event.target;
  if (
    !currentCard ||
    currentCard === card1 ||
    currentCard.matched ||
    clicks >= 2
  ) {
    return;
  }
  currentCard.style.backgroundColor = currentCard.className;
  clicks++;
  if (clicks === 1 && !intervalId) {
    intervalId = setInterval(function () {
      elapsedTimeInSeconds++;
      timerEle.innerText = `Time elapsed: ${elapsedTimeInSeconds} seconds`;
    }, 1000);
  }
  if (!card1 || !card2) {
    if (!card1) {
      card1 = currentCard;
    } else {
      card2 = currentCard;
    }
  }
  if (card1 && card2 && card1.className === card2.className) {
    card1.classList.add("matched");
    card2.classList.add("matched");
    card1.matched = true;
    card2.matched = true;
    card1 = null;
    card2 = null;
    clicks = 0;
    matchedCards += 2;

    if (matchedCards === COLORS.length) {
      clearInterval(intervalId);
      if (elapsedTimeInSeconds < fastestTime) {
        fastestTime = elapsedTimeInSeconds;
        localStorage.setItem(FASTEST_TIME_KEY, fastestTime.toString());
        alert(`NEW RECORD: ${fastestTime} seconds!`);
        gameContainer.classList.remove("playing");
      } else {
        gameContainer.classList.remove("playing");
        alert(`Your Time of: ${elapsedTimeInSeconds} seconds was too slow!`);
      }
    }
  } else {
    setTimeout(function () {
      if (card1 && card2) {
        card1.style.backgroundColor = "";
        card2.style.backgroundColor = "";
        card1 = null;
        card2 = null;
        clicks = 0;
      }
    }, 1500);
  }
}

function resetGame() {
  clicks = 0;
  card1 = null;
  card2 = null;
  matchedCards = 0;
  elapsedTimeInSeconds = 0;

  const cards = document.querySelectorAll("#game > div");
  cards.forEach((card) => {
    card.remove();
  });
  clearInterval(intervalId);
  intervalId = null;
  timerEle.innerText = "Time elapsed: 0 seconds";

  shuffledColors = shuffle(COLORS);
  createDivsForColors(shuffledColors);
  gameContainer.classList.add("playing");
}
