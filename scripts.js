window.onload = function() {

    // Get random number
    function getRandomInt() {
        var min = document.getElementById('min').value;
        var max = document.getElementById('max').value;

        var newMin = Math.ceil(min);
        var newMax = Math.floor(max);

        var rolledNum = Math.floor(Math.random() * (newMax - newMin + 1)) + newMin;

        return rolledNum;
    }


    // Get numbers from Winners textarea
    function getWinners() {
        var winnersField = document.getElementById('winners-field').value;
        var winnersArr = winnersField.split("\n").map(Number);

        return winnersArr;
    }


    // Run the spinner
    function runSpinner() {
        var rolled = getRandomInt();
        var winners = getWinners();
        var duration = 5000;

        // Roll again if rolled number matches any number in Winners textarea
        var counter = 0;
        while ((winners.includes(rolled) === true) && (counter <= 50)) {
            var rolled = getRandomInt();
            counter++;
        }
        if (counter > 50) {
            alert('No more unique numbers!');
        }

        // Spinner options
        window.odometerOptions = {
            duration: duration, // Change how long the javascript expects the CSS animation to take
        };

        // Execute spinner
        setTimeout(function() {
            odometer.innerHTML = rolled;
        }, 0);

        // Update Winners textarea with new numbers
        var winnersBox = document.getElementById('winners-field');
        var oldString = winnersBox.value;
        setTimeout(function() {
            winnersBox.value = oldString + "\n" + rolled;
        }, duration);
    }


    // Run spinner function on button click
    document.getElementById('run').onclick = runSpinner;


    // Show settings on Settings button click
    function showSettings() {
        document.getElementById('inputs').classList.add('show');
        document.getElementById('inputs').classList.remove('hide');
        document.getElementById('winners').classList.add('show');
        document.getElementById('winners').classList.remove('hide');
        document.getElementById('open-settings').classList.add('hide');
        document.getElementById('open-settings').classList.remove('show');
        document.getElementById('close-settings').classList.add('show');
        document.getElementById('close-settings').classList.remove('hide');
    }

    function hideSettings() {
        document.getElementById('inputs').classList.add('hide');
        document.getElementById('inputs').classList.remove('show');
        document.getElementById('winners').classList.add('hide');
        document.getElementById('winners').classList.remove('show');
        document.getElementById('open-settings').classList.add('show');
        document.getElementById('open-settings').classList.remove('hide');
        document.getElementById('close-settings').classList.add('hide');
        document.getElementById('close-settings').classList.remove('show');
    }
    document.getElementById('open-settings').onclick = showSettings;
    document.getElementById('close-settings').onclick = hideSettings;
}