// time.js
import { loadGroups } from './storage.js';

const hoursE = document.querySelector(".time-timer_hours");
const minutesE = document.querySelector(".time-timer_minutes");
const secondsE = document.querySelector(".time-timer_seconds");
const toggleBtn = document.querySelector(".time-play-pause-btn");
const toggleBtnImg = document.querySelector(".time-play-pause-btn-img");

if (hoursE && minutesE && secondsE && toggleBtn && toggleBtnImg) {
    let seconds = 0, minutes = 0, hours = 0;
    let isRunning = false;
    let intervalId = null;

    function updateDisplay() {
        hoursE.textContent = String(hours).padStart(2, "0");
        minutesE.textContent = String(minutes).padStart(2, "0");
        secondsE.textContent = String(seconds).padStart(2, "0");
    }

    function startTimer() {
        if (intervalId) clearInterval(intervalId);
        intervalId = setInterval(() => {
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
        clearInterval(intervalId);
        intervalId = null;
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

// Load tasks from chosen group
const urlParams = new URLSearchParams(window.location.search);
const chosenGroupId = urlParams.get("groupId");

const groups = loadGroups();
const chosenGroup = groups.find(g => g.id === chosenGroupId);
const time_tasks_content = document.querySelector(".time-tasks-content");

function addTask(task) {
    if (!task) return;
    const html = `
        <li class="time-tasks_item">
            <label class="time-tasks_item-label common-checkbox-label">
                <input type="checkbox" class="time-tasks_item-checkbox common-checkbox">
                <span class="time-tasks_item-check common-checkbox-check"></span>
                <span class="time-tasks_item-text common-checkbox-text">${task}</span>
            </label>
        </li>
    `;
    const temp = document.createElement("div");
    temp.innerHTML = html.trim();
    time_tasks_content?.appendChild(temp.firstElementChild);
}

if (!chosenGroup) {
    console.warn("Group not found for ID:", chosenGroupId);
    if (time_tasks_content) {
        time_tasks_content.innerHTML = "<li class='error'>No tasks available. Please go back and select a group.</li>";
    }
} else {
    chosenGroup.subgroups.forEach(subgroup => {
        (subgroup.tasks || []).forEach(task => {
            addTask(task);
        });
    });
}
