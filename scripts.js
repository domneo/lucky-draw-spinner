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

  // ---- Win celebration: sparkle burst + paparazzi camera flashes ---------
  var fxLayer = document.getElementById("fx");
  var reduceMotion = window.matchMedia("(prefers-reduced-motion: reduce)");

  function randomBetween(min, max) {
    return Math.random() * (max - min) + min;
  }

  // Small stars thrown outward from the number
  function buildBurst(originX, originY) {
    var fragment = document.createDocumentFragment();
    var reach = Math.max(window.innerWidth, window.innerHeight) * 0.6;

    for (var i = 0; i < 80; i++) {
      var star = document.createElement("div");
      var angle = randomBetween(0, Math.PI * 2);
      var distance = reach * randomBetween(0.25, 1);

      star.className = "sparkle";
      star.style.setProperty("--x", originX + "px");
      star.style.setProperty("--y", originY + "px");
      star.style.setProperty("--dx", Math.cos(angle) * distance + "px");
      star.style.setProperty("--dy", Math.sin(angle) * distance + "px");
      star.style.setProperty(
        "--size",
        randomBetween(0.5, 1.8).toFixed(2) + "rem",
      );
      star.style.setProperty(
        "--spin",
        Math.round(randomBetween(-540, 540)) + "deg",
      );
      star.style.setProperty(
        "--life",
        Math.round(randomBetween(900, 1800)) + "ms",
      );
      star.style.setProperty(
        "--delay",
        Math.round(randomBetween(0, 260)) + "ms",
      );
      fragment.appendChild(star);
    }

    return fragment;
  }

  // Big stars that pop somewhere on screen like a bulb going off in the crowd.
  // WCAG 2.3.1 allows three flashes per second; spacing these out keeps us
  // under half that, so they never build into a strobe.
  var FLASH_COUNT = 6;
  var FLASH_GAP = 560;

  function buildFlashes() {
    var fragment = document.createDocumentFragment();

    for (var i = 0; i < FLASH_COUNT; i++) {
      var x = randomBetween(8, 92);
      var y = randomBetween(8, 92);
      // Evenly spaced with a little jitter, never closer than FLASH_GAP - 160ms
      var delay = Math.round(i * FLASH_GAP + randomBetween(0, 160)) + "ms";
      var life = Math.round(randomBetween(560, 760)) + "ms";

      var glare = document.createElement("div");
      glare.className = "flash";
      glare.style.setProperty("--x", x + "%");
      glare.style.setProperty("--y", y + "%");
      glare.style.setProperty("--delay", delay);
      glare.style.setProperty("--life", life);
      fragment.appendChild(glare);

      var bulb = document.createElement("div");
      bulb.className = "sparkle sparkle--flash";
      bulb.style.setProperty("--x", x + "%");
      bulb.style.setProperty("--y", y + "%");
      bulb.style.setProperty("--size", randomBetween(4, 8).toFixed(2) + "rem");
      bulb.style.setProperty(
        "--spin",
        Math.round(randomBetween(-120, 120)) + "deg",
      );
      bulb.style.setProperty("--delay", delay);
      bulb.style.setProperty("--life", life);
      fragment.appendChild(bulb);
    }

    return fragment;
  }

  var celebrationTimer = null;

  function celebrate() {
    if (reduceMotion.matches) {
      return;
    }

    // A fresh spin cancels whatever is still on screen
    window.clearTimeout(celebrationTimer);
    fxLayer.replaceChildren();

    var box = odometer.getBoundingClientRect();
    fxLayer.appendChild(
      buildBurst(box.left + box.width / 2, box.top + box.height / 2),
    );
    fxLayer.appendChild(buildFlashes());

    // Longest delay plus longest life, rounded up
    celebrationTimer = window.setTimeout(
      function () {
        fxLayer.replaceChildren();
      },
      FLASH_COUNT * FLASH_GAP + 1000,
    );
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
      celebrate();
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
