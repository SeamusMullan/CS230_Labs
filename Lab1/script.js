// num of ms in 25 min
var time = 1_500_000;

var isPaused = true;
var intervalId;
var running = false;

function reset() {
    clearInterval(intervalId);
    running = false;
    time = 1_500_000;
    document.getElementById('timer').innerHTML = convertTime(time);
    isPaused = true;
    document.getElementById('msg').innerHTML = 'Timer ready!';
    
    // document.getElementById('timer').style.color = '#ffffff';
    document.getElementById('timer').classList.remove('timer-finished');
    document.getElementById('timer').classList.add('timer');
}

function pause() {
    isPaused = !isPaused;
    if (isPaused){
        document.getElementById('pause').innerHTML = 'Resume';
        document.getElementById('msg').innerHTML = 'Timer paused!';
    } else {
        document.getElementById('pause').innerHTML = 'Pause';
        document.getElementById('msg').innerHTML = 'Keep on workin!';
    }
}

function start() {
    isPaused = false;
    // stops multiple intervals from running
    // aka if you spam start without this, the counter ticks down faster
    if(time <= 0) {
        reset();
    }

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
        if (time < 0) {
            clearInterval(intervalId);
            running = false;
            time = 0; // to prevent negative time from displaying
            document.getElementById('timer').innerHTML = '0:00';
            document.getElementById('msg').innerHTML = 'Take a break!';
            alert('Time is up!');
            return;
        } else {
            document.getElementById('msg').innerHTML = 'Keep on workin!';
        }
    }
    
    if (time <= 60_000) {
        console.log("bingus");
        // document.getElementById('timer').style.color = '#ff0000';
        document.getElementById('timer').classList.remove('timer');
        document.getElementById('timer').classList.add('timer-finished');
    }
    
    document.getElementById('timer').innerHTML = convertTime(time);
}

function convertTime(ms) {
    // returns the time in min:sec format using milliseconds as input
    var minutes = Math.floor(ms / 60000);
    var seconds = ((ms % 60000) / 1000).toFixed(0);
    return minutes + ":" + (seconds < 10 ? '0' : '') + seconds;
}