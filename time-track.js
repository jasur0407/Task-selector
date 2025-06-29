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


// Take all the info


let urlParams = new URLSearchParams(window.location.search);
chosenGroupId = urlParams.get("groupId");
groups = JSON.parse(localStorage.getItem("groups") || "[]");
chosenGroup = groups.find(g => g.id === chosenGroupId);

time_tasks_content = document.querySelector(".time-tasks-content");

// Function to add tasks into content
function addTask(task) {
    time_tasks_new_task = `
    <li class="time-tasks_item">
        <label class="time-tasks_item-label common-checkbox-label">
            <input type="checkbox" class="time-tasks_item-checkbox common-checkbox">
            <span class="time-tasks_item-check common-checkbox-check"></span>
            <span class="time-tasks_item-text common-checkbox-text">${task}</span>
        </label>
    </li>
    `
    let temp = document.createElement("div");
    temp.innerHTML = time_tasks_new_task.trim();
    let newTask = temp.firstElementChild;
    time_tasks_content.appendChild(newTask);
}

// Taking all the tasks
chosenGroupSubgroupsCount = chosenGroup.subgroups.length;
for(let i = 0; i < chosenGroupSubgroupsCount; i++) {
    chosenGroupSubgroupTaskCount = chosenGroup.subgroups[i].tasks.length;
    for(let j = 0; j < chosenGroupSubgroupTaskCount; j++) {
        chosenGroupSubgroupTask = chosenGroup.subgroups[i].tasks[j];
        addTask(chosenGroupSubgroupTask);
    }
}