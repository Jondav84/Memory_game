/** @format */
const FASTEST_TIME_KEY = "fastestTime";
$("#reset-button").on("click", resetGame);
let clicks = 0;
let card1 = null;
let card2 = null;
let matchedCards = 0;
let intervalId;
let elapsedTimeInSeconds = 0;
let fastestTime = parseInt(localStorage.getItem(FASTEST_TIME_KEY)) || Infinity;
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
    let index = Math.floor(Math.random() * counter--);
    [array[counter], array[index]] = [array[index], array[counter]];
  }
  return array;
}
let shuffledColors = shuffle(COLORS);
function createDivsForColors(colorArray) {
  for (let color of colorArray) {
    $("<div></div>")
      .addClass(color)
      .attr("id", "card")
      .on("click", handleCardClick)
      .data("matched", false)
      .appendTo("#game");
  }
}
function handleCardClick() {
  const currentCard = $(this);
  if (
    !currentCard ||
    currentCard.is(card1) ||
    currentCard.data("matched") ||
    clicks >= 2
  ) {
    return;
  }
  currentCard.css("background-color", currentCard.attr("class"));
  clicks++;
  if (clicks === 1 && !intervalId) {
    intervalId = setInterval(() => {
      $("#timer").text(`Time elapsed: ${++elapsedTimeInSeconds} seconds`);
    }, 1000);
  }
  if (!card1 || !card2) {
    if (!card1) {
      card1 = currentCard;
    } else {
      card2 = currentCard;
    }
  }
  if (card1 && card2 && card1.attr("class") === card2.attr("class")) {
    card1.add(card2).addClass("matched").data("matched", true);
    card1 = null;
    card2 = null;
    clicks = 0;
    if ((matchedCards += 2) === COLORS.length) {
      clearInterval(intervalId);
      if (elapsedTimeInSeconds < fastestTime) {
        fastestTime = elapsedTimeInSeconds;
        localStorage.setItem(FASTEST_TIME_KEY, fastestTime.toString());
        alert(`NEW RECORD: ${fastestTime} seconds!`);
      } else {
        alert(`Your Time of: ${elapsedTimeInSeconds} seconds was too slow!`);
      }
      $("#game").removeClass("playing");
    }
  } else {
    setTimeout(() => {
      if (card1 && card2) {
        card1.add(card2).css("background-color", "");
        card1 = null;
        card2 = null;
        clicks = 0;
      }
    }, 1500);
  }
}
if (fastestTime !== Infinity) {
  $("#lowestScore").text(`Fastest Time: ${fastestTime} seconds!`);
}
function resetGame() {
  clicks = 0;
  card1 = null;
  card2 = null;
  matchedCards = 0;
  elapsedTimeInSeconds = 0;
  $("#game > div").remove();
  clearInterval(intervalId);
  intervalId = null;
  $("#timer").text("Time elapsed: 0 seconds");
  shuffledColors = shuffle(COLORS);
  createDivsForColors(shuffledColors);
  $("#game").addClass("playing");
}
