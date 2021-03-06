'use strict';
document.addEventListener("DOMContentLoaded", () => {
  const overlayDiv = document.getElementById("overlay");
  const header = document.querySelector("#overlay h2");
  const startButton = document.querySelector(".btn__reset");
  const phrase = document.getElementById("phrase");
  const qwerty = document.getElementById("qwerty");
  const ul = phrase.querySelector("ul");
  const ol = document.querySelector("#scoreboard ol");

  let missed = 0;
  let prevSelected = [];

  const phrases = Object.freeze([
    "Fake news",
    "Twice Baked Irish Potato",
    "Neap Tide",
    "Soup Sandwich",
    "Witcha Ditcha"
  ]);

  const getRandomPhraseAsArray = arr =>
    arr[Math.floor(Math.random() * arr.length)].split("");

  const selectItems = (parent, item) => parent.querySelectorAll(item);

  const looperAction = {
    addPhrase: element => {
      const li = document.createElement("li");
      const char = document.createTextNode(element);
      li.appendChild(char);
      ul.appendChild(li);
      li.classList.add(element == " " ? "space" : "letter");
      console.log(element);
    },
    refillTries: element => (element.style.opacity = "1"),
    hideTries: element => (element.style.opacity = "0"),
    resetKeys: element => (element.className = ""),
    clearInput: element => element.parentNode.removeChild(element)
  };

  const looper = (arr, action) => {
    arr.forEach(element => looperAction[action](element));
  };

  const addPhraseToDisplay = charArr => looper(charArr, "addPhrase");

  addPhraseToDisplay(getRandomPhraseAsArray(phrases));

  const styleOverlayDiv = (title, display, className) => {
    header.textContent = title;
    overlayDiv.style.display = display;
    overlayDiv.className = className;
  };

  const checkLetter = key => {
    let letterFound, isMatch;
    selectItems(ul, ".letter").forEach(element => {
      isMatch = element.textContent.toLowerCase() == key;
      isMatch ? element.classList.add("show") : null;
      letterFound = letterFound || isMatch;
    });
    return letterFound;
  };

  qwerty.addEventListener("click", e => {
    if (e.target.tagName == "BUTTON") {
      const char = e.target.textContent;
      e.target.className = "chosen";

      if (!prevSelected.includes(char)) {
        const letterFound = checkLetter(char);
        prevSelected.push(char);

        const clearInput = () => {
          looper(selectItems(ul, "li"), "clearInput");
          looper(selectItems(qwerty, "button"), "resetKeys");
          missed = 0;
        };

        const checkWin = () =>
          selectItems(ul, ".letter").length == selectItems(ul, ".show").length;

        const resetGame = () => {     
          clearInput();
          looper(selectItems(ol, ".tries"), "hideTries");
          addPhraseToDisplay(getRandomPhraseAsArray(phrases));         
          prevSelected = [];
        };

        if (!letterFound) {
          const tries = selectItems(ol, ".tries")[missed];
          tries.style.opacity = ".5";
          missed += 1;
        }

        if (missed >= 5) {
          styleOverlayDiv("You've Lost !!!", "", "lose");
          startButton.textContent = "Reset Game";
          resetGame();
        }

        if (checkWin()) {
          styleOverlayDiv("Congrats, You won!!!", "", "win");
          startButton.textContent = "Play Again";
          resetGame();
        }
      }
    }
  });

  startButton.addEventListener("click", () => {
    looper(selectItems(ol, ".tries"), "refillTries");
    styleOverlayDiv("", "none", "");
  });
});
