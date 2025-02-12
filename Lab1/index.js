// num of ms in 25 min
var time = 1_500_000;

var isPaused = true;
var intervalId;
var running = false;

function reset() {
    time = 1_500_000;
    document.getElementById('time').innerHTML = convertTime(time);
    isPaused = true;
}

function pause() {
    isPaused = true;
}

function start() {
    isPaused = false;
    // stops multiple intervals from running
    // aka if you spam start without this, the counter ticks down faster
    if (!running){
        intervalId = setInterval(tick, 1000);
        running = true;
    }
}

function tick() {
    if (isPaused) {
        return;
    } else {
        console.log('tick');
        time -= 1000;
    }
    
    document.getElementById('time').innerHTML = convertTime(time);
}

function convertTime(ms) {
    // returns the time in min:sec format using milliseconds as input
    var minutes = Math.floor(ms / 60000);
    var seconds = ((ms % 60000) / 1000).toFixed(0);
    return minutes + ":" + (seconds < 10 ? '0' : '') + seconds;
}