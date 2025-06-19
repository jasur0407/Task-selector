let home_tasks_start_btn = document.querySelector("#home_tasks_start-btn");
let home_tasks_add_btn = document.querySelector(".home_tasks_add-btn");
let home_tasks_row = document.querySelector(".home_tasks-row");
let home_tasks_edit_group_form = document.querySelector(".home_tasks_edit_group-form")

function loadGroups() {
    return JSON.parse(localStorage.getItem("groups") || "[]");
}

function saveGroups(groups) {
    localStorage.setItem("groups", JSON.stringify(groups));
}

function renderGroups() {
    // Remove all except the add button
    document.querySelectorAll(".home_tasks_item").forEach(e => e.remove());
    let groups = loadGroups();
    groups.forEach(group => {
        const div = document.createElement("div");
        div.className = "home_tasks_item";
        div.dataset.groupId = group.id;
        div.innerHTML = `
            <div class="home_tasks_item_header">${group.name}</div>
            <div class="home_tasks_item_more">
                <div class="home_tasks_item_more-btn">
                    <img src="res/multidot.svg" alt="more">
                </div>
                <div class="home_tasks_item_more-options">
                    <div class="home_tasks_item_more-options_item home_tasks_item_edit" data-group-id="${group.id}">
                        <div class="home_tasks_item_more-options_item-text">Edit</div>
                    </div>
                    <div class="home_tasks_item_more-options_item home_tasks_item_delete" data-group-id="${group.id}">
                        <div class="home_tasks_item_more-options_item-text">Delete</div>
                    </div>
                </div>
            </div>
        `;
        home_tasks_row.insertBefore(div, home_tasks_add_btn);
    });
}



// Select group

if (home_tasks_row) {
    home_tasks_row.addEventListener("click", function(e) {
        let item = e.target.closest(".home_tasks_item");
        if (item && !e.target.closest('.home_tasks_item_more-btn')) {
            if (item.classList.contains("active")) {
                item.classList.remove("active");
                home_tasks_start_btn.classList.add("unavailable");
            } else {
                document.querySelectorAll(".home_tasks_item").forEach(i => i.classList.remove("active"));
                item.classList.add("active");
                home_tasks_start_btn.classList.remove("unavailable");
            }
        }
    })
}



// Random group selection

let home_tasks_random_btn = document.querySelector("#home_tasks_random-btn");

if (home_tasks_random_btn) {
    home_tasks_random_btn.addEventListener("click", function() {
        let rand_group = Math.floor(Math.random() * home_tasks_item.length);
        home_tasks_item.forEach(item => {
            item.classList.remove("active");
        })
        home_tasks_item[rand_group].classList.add("active");
        home_tasks_start_btn.classList.remove("unavailable");
    })
}


/* More options btn */

let home_tasks_item = document.querySelectorAll(".home_tasks_item");

if (home_tasks_row)  {
    home_tasks_row.addEventListener("click", function(e) {
        if (e.target.closest('.home_tasks_item_more-btn')) {
            let clickedBtn = e.target.closest('.home_tasks_item_more-btn');

            document.querySelectorAll('.home_tasks_item_more-btn').forEach(btn => {
                if (btn !== clickedBtn) {
                    btn.classList.remove("active");
                }
            });

            clickedBtn.classList.toggle("active");
        }
    });
}


// Delete group btn


let home_tasks_item_more_options_item_delete = document.querySelectorAll("#home_tasks_item_more-options_item-delete");

if (home_tasks_item_more_options_item_delete && home_tasks_row) {
    home_tasks_row.addEventListener("click", function(e) {
        let deleteBtn = e.target.closest("#home_tasks_item_more-options_item-delete");
        if (deleteBtn) {
            let deletingItem = deleteBtn.closest(".home_tasks_item");
            deletingItem.remove();
            home_tasks_item = document.querySelectorAll(".home_tasks_item")
            home_tasks_item.forEach(item => {
                item.classList.remove("active");
                home_tasks_start_btn.classList.add("unavailable")
            })
        }
    })
}


// Edit group btn


let home_tasks_edit_container = document.querySelector(".home_tasks_edit-container");

if (home_tasks_item && home_tasks_edit_container && home_tasks_row) {
    home_tasks_row.addEventListener("click", function(e) {
        let editBtn = e.target.closest("#home_tasks_item_more-options_item-edit");
        let tasksItem = e.target.closest(".home_tasks_item");
        let tasksMore = e.target.closest(".home_tasks_item_more-btn");
        if (editBtn && tasksItem) {
            home_tasks_edit_container.classList.add("active");
            tasksItem.classList.remove("active");
            document.querySelectorAll(".home_tasks_item_more-btn").forEach(btn => {btn.classList.remove("active")});
        }
    })
}


renderGroups();


/* Add new group btn */

let home_tasks_max_item = 4;

if (home_tasks_add_btn) {
    /*let home_tasks_new_item = `
        <div class="home_tasks_item">
            <div class="home_tasks_item_more">
                <div class="home_tasks_item_more-btn">
                    <img src="res/multidot.svg" alt="more">
                </div>
                <div class="home_tasks_item_more-options">
                    <div class="home_tasks_item_more-options_item" id="home_tasks_item_more-options_item-edit">
                        <img src="res/edit-icon.svg" alt="Edit" class="home_tasks_item_more-options_item-icon">
                        <div class="home_tasks_item_more-options_item-text">Edit</div>
                    </div>
                    <div class="home_tasks_item_more-options_item" id="home_tasks_item_more-options_item-delete">
                        <img src="res/delete-icon.svg" alt="Delete" class="home_tasks_item_more-options_item-icon">
                        <div class="home_tasks_item_more-options_item-text">Delete</div>
                    </div>
                </div>
            </div>
            <div class="home_tasks_item-header">New group</div>
            <div class="home_tasks_item-desc"></div>
        </div>
    `;*/
    let home_tasks_edit_group_name = document.querySelector(".home_tasks_edit-group-name");
    let home_tasks_edit_container = document.querySelector(".home_tasks_edit-container");
    let groups = JSON.parse(localStorage.getItem("groups")) || [];
    

    home_tasks_add_btn.addEventListener("click", function() {
        let home_tasks_item_length = home_tasks_item.length;
        if (home_tasks_item_length >= home_tasks_max_item) {
            alert("Max reached");
        } else {
            home_tasks_edit_group_form.reset();
            home_tasks_edit_container.classList.add("active");
            home_tasks_edit_group_form.addEventListener("submit", function(e) {
                e.preventDefault();

                let groupName = home_tasks_edit_group_name.value.trim();
                if (!groupName) return;

                let subgroupEls = document.querySelectorAll(".home_tasks_edit-group_subgroup");
                subgroups = [];

                subgroupEls.forEach((subgroupEl, i) => {
                    let subgroupName = subgroupEl.querySelector(".home_tasks_edit-group_subgroup-title");

                    let taskEls = document.querySelectorAll(".home_tasks_edit-group_subgroup-block input[type='text']");
                    let tasks = Array.from(taskEls).map(el => el.value.trim()).filter(v => v);

                    let resEls = document.querySelectorAll(".home_tasks_edit-group_subgroup_resource-block input[type='text']");
                    let resources = Array.from(resEls).map(el => el.value.trim()).filter(v => v);
                    
                    subgroups.push({
                        id: `subgroup-${Date.now()}-${i}`,
                        name: subgroupName,
                        tasks: tasks,
                        resources: resources
                    });
                });

                newGroup = {
                    id: `group-${Date.now()}`,
                    name: groupName,
                    subgroups: subgroups
                };

                groups.push(newGroup);
                localStorage.setItem("groups", JSON.stringify(groups));
                home_tasks_edit_group_form.reset();

                console.log(localStorage);
                home_tasks_edit_container.classList.remove("active");
                renderGroups();
            })
        }
    });
}


// Add task

let home_tasks_edit_group_subgroup_add_task_btn = document.querySelector(".home_tasks_edit-group_subgroup_add-task-btn");

if (home_tasks_edit_group_subgroup_add_task_btn) {
    let home_tasks_edit_group_subgroup_block = document.querySelector(".home_tasks_edit-group_subgroup-block");
    let home_tasks_edit_group_subgroup_new_task = `
    <div class="home_tasks_edit-group_subgroup_task">
        <label class="common-checkbox-label">
            <input type="checkbox" class="common-checkbox">
            <span class="common-checkbox-check"></span>
            <input type="text" class="home_tasks_edit-group_subgroup_task-checkbox-text common-text-input" placeholder="Task">
        </label>
    </div>
    `;

    home_tasks_edit_group_subgroup_add_task_btn.addEventListener("click", () => {
        let temp = document.createElement("div");
        temp.innerHTML = home_tasks_edit_group_subgroup_new_task.trim();
        let newTask = temp.firstElementChild;

        home_tasks_edit_group_subgroup_block.insertBefore(newTask, home_tasks_edit_group_subgroup_add_task_btn);
    }) 
}


// Add new source

let home_tasks_edit_group_subgroup_resource_add_btn = document.querySelector(".home_tasks_edit-group_subgroup_resource_add-btn");

if (home_tasks_edit_group_subgroup_resource_add_btn) {
    let home_tasks_edit_group_subgroup_resource_new_item = `
    <div class="home_tasks_edit-group_subgroup_resource_item">
        <input type="text" class="home_tasks_edit-group_subgroup_resource_item-title common-text-input" placeholder="Title"/>
        <input type="text" class="home_tasks_edit-group_subgroup_resource_item-link common-text-input" placeholder="Link">
    </div>
    `;
    
    home_tasks_edit_group_subgroup_resource_add_btn.addEventListener("click", () => {
        let home_tasks_edit_group_subgroup_resource_block = document.querySelector(".home_tasks_edit-group_subgroup_resource-block");
        let temp = document.createElement("div");
        temp.innerHTML = home_tasks_edit_group_subgroup_resource_new_item.trim();
        let newSource = temp.firstElementChild;

        home_tasks_edit_group_subgroup_resource_block.insertBefore(newSource, home_tasks_edit_group_subgroup_resource_add_btn);
    })
}


// Add new subgroup

let home_tasks_edit_group_add_subgroup_btn = document.querySelector(".home_tasks_edit_group_add-subgroup-btn");

if (home_tasks_edit_group_add_subgroup_btn) {
    let home_tasks_edit_group_new_subgroup = `
    <div class="home_tasks_edit-group_subgroup">
        <input type="text" placeholder="Subgroup name" class="home_tasks_edit-group_subgroup-title">
        <div class="home_tasks_edit-group_subgroup-block">
            <div class="home_tasks_edit-group_subgroup_add-task-btn common-add-btn">+ Add new task</div>

            <div class="home_tasks_edit-group_subgroup_resource">
                <div class="home_tasks_edit-group_subgroup_resource-title">Resources</div>
                <div class="home_tasks_edit-group_subgroup_resource-block">
                    <div class="home_tasks_edit-group_subgroup_resource_add-btn common-add-btn">+ Add new source</div>
                </div>
            </div>
        </div>
    </div>
    `;
    let home_tasks_edit_group_form = document.querySelector(".home_tasks_edit_group-form");

    home_tasks_edit_group_add_subgroup_btn.addEventListener("click", () => {
        let temp = document.createElement("div");
        temp.innerHTML = home_tasks_edit_group_new_subgroup.trim();
        let newSubgroup = temp.firstElementChild;

        home_tasks_edit_group.insertBefore(newSubgroup, home_tasks_edit_group_add_subgroup_btn);
    })
}

/*
// Save all the tasks in localStorage

let groups = JSON.parse(localStorage.getItem("groups")) || [];

let home_tasks_edit_group_form = document.querySelector(".home_tasks_edit_group-form");
let home_tasks_edit_group_name = document.querySelector(".home_tasks_edit-group-name");

home_tasks_edit_group_form.addEventListener("submit", function(e) {
    e.preventDefault();

    let groupName = home_tasks_edit_group_name.value.trim();
    if (!groupName) return;

    let subgroupEls = document.querySelectorAll(".home_tasks_edit-group_subgroup");
    subgroups = [];

    subgroupEls.forEach((subgroupEl, i) => {
        let subgroupName = subgroupEl.querySelector(".home_tasks_edit-group_subgroup-title");

        let taskEls = document.querySelectorAll(".home_tasks_edit-group_subgroup-block input[type='text']");
        let tasks = Array.from(taskEls).map(el => el.value.trim()).filter(v => v);

        let resEls = document.querySelectorAll(".home_tasks_edit-group_subgroup_resource-block input[type='text']");
        let resources = Array.from(resEls).map(el => el.value.trim()).filter(v => v);
        
        subgroups.push({
            id: `subgroup-${Date.now()}-${i}`,
            name: subgroupName,
            tasks: tasks,
            resources: resources
        });
    });

    newGroup = {
        id: `group-${Date.now()}`,
        name: groupName,
        subgroups: subgroups
    };

    groups.push(newGroup);
    localStorage.setItem("groups", JSON.stringify(groups));
    home_tasks_edit_group_form.reset();
});
*/


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