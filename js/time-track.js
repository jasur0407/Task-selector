    function loadGroups() {
        return JSON.parse(localStorage.getItem("groups") || "[]");
    }

    // ====== Points handling ======
    let totalPoints = parseInt(localStorage.getItem("totalPoints")) || 0;
    const totalPointsEl = document.getElementById("totalPoints");

    function updatePointsDisplay() {
        if (totalPointsEl) totalPointsEl.textContent = totalPoints;
        localStorage.setItem("totalPoints", totalPoints);
    }

    function saveTaskCheckedState(groupId, subgroupId, taskName, isChecked) {
        let checkedTasks = JSON.parse(localStorage.getItem("checkedTasks") || "{}");
        if (!checkedTasks[groupId]) checkedTasks[groupId] = {};
        if (!checkedTasks[groupId][subgroupId]) checkedTasks[groupId][subgroupId] = {};
        checkedTasks[groupId][subgroupId][taskName] = isChecked;
        localStorage.setItem("checkedTasks", JSON.stringify(checkedTasks));
    }

    function isTaskChecked(groupId, subgroupId, taskName) {
        let checkedTasks = JSON.parse(localStorage.getItem("checkedTasks") || "{}");
        return checkedTasks[groupId]?.[subgroupId]?.[taskName] || false;
    }

    updatePointsDisplay();

    // ====== Timer ======
    const hoursE = document.querySelector(".time-timer_hours");
    const minutesE = document.querySelector(".time-timer_minutes");
    const secondsE = document.querySelector(".time-timer_seconds");
    const toggleBtn = document.querySelector(".time-play-pause-btn");
    const toggleBtnImg = document.querySelector(".time-play-pause-btn-img");

    let seconds = 0, minutes = 0, hours = 0, isRunning = false, intervalId = null;

    function updateDisplay() {
        hoursE.textContent = String(hours).padStart(2, "0");
        minutesE.textContent = String(minutes).padStart(2, "0");
        secondsE.textContent = String(seconds).padStart(2, "0");
    }

    function startTimer() {
        if (intervalId) clearInterval(intervalId);
        intervalId = setInterval(() => {
            seconds++;
            if (seconds >= 60) { seconds = 0; minutes++; }
            if (minutes >= 60) { minutes = 0; hours++; }
            updateDisplay();
        }, 1000);
    }

    function stopTimer() { clearInterval(intervalId); intervalId = null; }

    toggleBtn?.addEventListener("click", () => {
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

    // ====== Add task with layout & persistence ======
    function addTask(task, ul, groupId, subgroupId) {
        const html = `
        <li class="time-tasks_item">
            <label class="time-tasks_item-label common-checkbox-label">
                <input type="checkbox" class="time-tasks_item-checkbox common-checkbox">
                <span class="time-tasks_item-check common-checkbox-check"></span>
                <span class="time-tasks_item-text common-checkbox-text">
                    <div class="time-task-due-date">${task.dueDate || ""}</div>
                    <div class="time-task-main-row">
                        <span class="time-task-name">${task.name}</span>
                        <span class="time-task-points">
                            ${task.points || 0}
                            <img src="res/point-icon.png" alt="points" class="time-task-points-icon">
                        </span>
                    </div>
                </span>
            </label>
        </li>`;
        
        const temp = document.createElement("div");
        temp.innerHTML = html.trim();
        const li = temp.firstElementChild;
        const checkbox = li.querySelector("input");

        // Restore checked state
        checkbox.checked = isTaskChecked(groupId, subgroupId, task.name);

        checkbox.addEventListener("change", function() {
            li.classList.add("moving");  // start animation

            setTimeout(() => {
                if (this.checked) {
                    totalPoints += task.points || 0;
                    ul.appendChild(li);  // move to bottom
                } else {
                    totalPoints -= task.points || 0;
                    ul.insertBefore(li, ul.firstChild);  // move to top
                }
                updatePointsDisplay();
                saveTaskCheckedState(groupId, subgroupId, task.name, this.checked);
                
                li.classList.remove("moving");  // remove animation class after move
            }, 200); // same duration as CSS transition
        });


        // Place initially based on checked state
        if (checkbox.checked) {
            ul.appendChild(li);
        } else {
            ul.insertBefore(li, ul.firstChild);
        }
    }

    // ====== Render tasks by subgroup ======
    const chosenGroupId = new URLSearchParams(window.location.search).get("groupId");
    const group = loadGroups().find(g => g.id === chosenGroupId);
    const container = document.querySelector(".time-tasks-content");

    if (group && container) {
        container.innerHTML = "";
        group.subgroups.forEach(sub => {
            const subEl = document.createElement("div");
            subEl.classList.add("time-subgroup");

            const titleEl = document.createElement("div");
            titleEl.classList.add("time-subgroup-title");
            titleEl.textContent = sub.name || "Untitled Subgroup";
            subEl.appendChild(titleEl);

            const ul = document.createElement("ul");
            ul.classList.add("time-tasks-list");
            subEl.appendChild(ul);

            sub.tasks.forEach(t => addTask(t, ul, group.id, sub.id));
            container.appendChild(subEl);
        });
    } else if (container) {
        container.innerHTML = "<li>No tasks found for this group.</li>";
    }
    