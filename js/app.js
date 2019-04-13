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

  const phrases = [
    "Fake news",
    "Twice Baked Irish Potato",
    "Neap Tide",
    "Soup Sandwich",
    "Witcha Ditcha"
  ];

  const getRandomPhraseAsArray = arr =>
    arr[Math.floor(Math.random() * arr.length)].split("");

  const selectAllItems = (parent, item) => parent.querySelectorAll(item);

  const looperAction = {
    addPhrase: element => {
      const li = document.createElement("li");
      const char = document.createTextNode(element);
      li.appendChild(char);
      ul.appendChild(li);
      element !== " " ? li.classList.add("letter") : li.classList.add("space");
    },
    refillTries: element => (element.style.opacity = "1"),
    hideTries: element => (element.style.opacity = "0"),
    clearInput: element => {
      element.textContent = "";
      element.className = "";
    },
    resetKeys: element => {
      element.className = "";
    }
  };

  const looper = (arr, action) => {
    arr.forEach(element => {
      looperAction[action](element);
    });
  };

  const addPhraseToDisplay = charArr => {
    looper(charArr, "addPhrase");
  };

  addPhraseToDisplay(getRandomPhraseAsArray(phrases));

  const checkLetter = key => {
    let letterFound;
    const letterArr = selectAllItems(ul, ".letter");
    letterArr.forEach(element => {
      isMatch = element.textContent.toLowerCase() == key;
      isMatch ? element.classList.add("show") : null;
      letterFound = letterFound || isMatch;
    });

    return letterFound;
  };

  const styleOverlayDiv = (title, display, className) => {
    header.textContent = title;
    overlayDiv.style.display = display;
    overlayDiv.className = className;
  };

  qwerty.addEventListener("click", e => {
    if (e.target.tagName == "BUTTON") {
      const char = e.target.textContent;
      e.target.className = "chosen";

      if (!prevSelected.includes(char)) {
        prevSelected.push(char);
        const letterFound = checkLetter(char);

        const clearInput = () => {
          const ulToClear = selectAllItems(ul, ".letter");
          const keysToClear = selectAllItems(qwerty, "button");
          looper(ulToClear, "clearInput");
          looper(keysToClear, "resetKeys");
          missed = 0;
        };

        const checkWin = () =>
          selectAllItems(ul, ".letter").length ==
          selectAllItems(ul, ".show").length;

        const resetGame = () => {
          clearInput();
          looper(selectAllItems(ol, ".tries"), "hideTries");
          addPhraseToDisplay(getRandomPhraseAsArray(phrases));
          prevSelected = [];
        };

        if (!letterFound) {
          const tries = selectAllItems(ol, ".tries")[missed];
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
    const tries = selectAllItems(ol, ".tries");
    looper(tries, "refillTries");
    styleOverlayDiv("", "none", "");
  });
});
