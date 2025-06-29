// Time tracker


let hoursE = document.querySelector(".time-timer_hours");
let minutesE = document.querySelector(".time-timer_minutes");
let secondsE = document.querySelector(".time-timer_seconds");
let toggleBtn = document.querySelector(".time-play-pause-btn");

if (hoursE && minutesE && secondsE && toggleBtn) {
    let toggleBtnImg = document.querySelector(".time-play-pause-btn-img");
    let seconds = 0;
    let minutes = 0;
    let hours = 0;
    let isRunning = false;
    let interval;   

    function updateDisplay() {
        hoursE.textContent = String(hours).padStart(2, "0");
        minutesE.textContent = String(minutes).padStart(2, "0");
        secondsE.textContent = String(seconds).padStart(2, "0");
    }

    function startTimer() {
        interval = setInterval(() => {
            seconds++;
            if (seconds >= 60) {
                seconds = 0;
                minutes++;
            }
            if (minutes >= 60) {
                minutes = 0;
                hours++;
            }
            updateDisplay();
        }, 1000);
    }

    function stopTimer() {
        clearInterval(interval);
    }

    toggleBtn.addEventListener("click", () => {
        if (!isRunning) {
            startTimer();
            isRunning = true;
            toggleBtnImg.src = "res/pause-btn.svg";
        } else {
            stopTimer();
            isRunning = false;
            toggleBtnImg.src = "res/play-btn.svg";
        }
    });

    updateDisplay();
}