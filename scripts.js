window.onload = function () {
  var STORAGE_KEYS = {
    winners: "luckyDraw.winners",
    min: "luckyDraw.min",
    max: "luckyDraw.max",
  };

  var minField = document.getElementById("min");
  var maxField = document.getElementById("max");
  var winnersBox = document.getElementById("winners-field");

  // localStorage is unavailable in some privacy modes, so never let it throw
  function readStored(key) {
    try {
      return window.localStorage.getItem(key);
    } catch (error) {
      return null;
    }
  }

  function writeStored(key, value) {
    try {
      window.localStorage.setItem(key, value);
    } catch (error) {
      /* storage full or blocked: keep running without persistence */
    }
  }

  // Restore the saved state before anything reads the fields
  function restoreState() {
    var storedWinners = readStored(STORAGE_KEYS.winners);
    var storedMin = readStored(STORAGE_KEYS.min);
    var storedMax = readStored(STORAGE_KEYS.max);

    if (storedWinners !== null) {
      winnersBox.value = storedWinners;
    }
    if (storedMin !== null) {
      minField.value = storedMin;
    }
    if (storedMax !== null) {
      maxField.value = storedMax;
    }
  }

  function saveWinners() {
    writeStored(STORAGE_KEYS.winners, winnersBox.value);
  }

  function saveRange() {
    writeStored(STORAGE_KEYS.min, minField.value);
    writeStored(STORAGE_KEYS.max, maxField.value);
  }

  // Get random number
  function getRandomInt() {
    var min = minField.value;
    var max = maxField.value;

    var newMin = Math.ceil(min);
    var newMax = Math.floor(max);

    var rolledNum = Math.floor(Math.random() * (newMax - newMin + 1)) + newMin;

    return rolledNum;
  }

  // Get numbers from Winners textarea
  function getWinners() {
    var winnersField = winnersBox.value;
    var winnersArr = winnersField.split("\n").map(Number);

    return winnersArr;
  }

  // Run the spinner
  function runSpinner() {
    var rolled = getRandomInt();
    var winners = getWinners();
    var duration = 3000;

    // Roll again if rolled number matches any number in Winners textarea
    var counter = 0;
    while (winners.includes(rolled) === true && counter <= 50) {
      var rolled = getRandomInt();
      counter++;
    }
    if (counter > 50) {
      alert("No more unique numbers!");
    }

    // Spinner options
    window.odometerOptions = {
      duration: duration, // Change how long the javascript expects the CSS animation to take
    };

    // Execute spinner
    setTimeout(function () {
      odometer.innerHTML = rolled;
    }, 0);

    // Update Winners textarea with new numbers
    var oldString = winnersBox.value;
    setTimeout(function () {
      winnersBox.value = oldString + "\n" + rolled;
      saveWinners();
    }, duration);
  }

  // Run spinner function on button click
  document.getElementById("run").onclick = runSpinner;

  // Persist manual edits too
  winnersBox.oninput = saveWinners;
  minField.oninput = saveRange;
  maxField.oninput = saveRange;

  document.getElementById("clear-winners").onclick = function () {
    if (!confirm("Clear the winners list? This cannot be undone.")) {
      return;
    }
    winnersBox.value = "";
    saveWinners();
  };

  // Independent toggles for each panel
  function setupToggle(buttonId, panelId, openLabel, closeLabel) {
    var button = document.getElementById(buttonId);
    var panel = document.getElementById(panelId);

    function setOpen(open) {
      panel.classList.toggle("hide", !open);
      button.textContent = open ? closeLabel : openLabel;
      button.setAttribute("aria-expanded", String(open));
    }

    button.onclick = function () {
      setOpen(panel.classList.contains("hide"));
    };
  }

  setupToggle("toggle-settings", "inputs", "Show settings", "Hide settings");
  setupToggle("toggle-winners", "winners", "Show winners", "Hide winners");

  restoreState();
};
