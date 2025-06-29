let home_tasks_start_btn = document.querySelector("#home_tasks_start-btn");
let home_tasks_add_btn = document.querySelector(".home_tasks_add-btn");
let home_tasks_row = document.querySelector(".home_tasks-row");
let home_tasks_edit_group_form = document.querySelector(".home_tasks_edit_group-form");
let home_tasks_item = document.querySelectorAll(".home_tasks_item");
let home_tasks_edit_container = document.querySelector(".home_tasks_edit-container");

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

groups = loadGroups();
if (home_tasks_row){
    renderGroups();
}
console.log(localStorage)



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
        home_tasks_item = document.querySelectorAll(".home_tasks_item");
        let rand_group = Math.floor(Math.random() * home_tasks_item.length);
        home_tasks_item.forEach(item => {
            item.classList.remove("active");
        })
        home_tasks_item[rand_group].classList.add("active");
        home_tasks_start_btn.classList.remove("unavailable");
    })
}


/* More options btn */

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


let home_tasks_item_more_options_item_delete = document.querySelectorAll(".home_tasks_item_delete");

if (home_tasks_row) {
    home_tasks_row.addEventListener("click", function(e) {
        let deleteBtn = e.target.closest(".home_tasks_item_delete");
        if (deleteBtn) {
            let deletingItem = deleteBtn.closest(".home_tasks_item");
            let groupId = deletingItem.dataset.groupId;
            let groups = loadGroups();
            groups = groups.filter(group => group.id !== groupId);
            saveGroups(groups);
            home_tasks_start_btn.classList.remove();
            renderGroups();
        }
    })
}




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
        home_tasks_item = document.querySelectorAll(".home_tasks_item");
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
                    let subgroupName = subgroupEl.querySelector(".home_tasks_edit-group_subgroup-title").value.trim();

                    let taskEls = subgroupEl.querySelectorAll(".home_tasks_edit-group_subgroup_task input[type='text']");
                    let tasks = Array.from(taskEls).map(el => el.value.trim()).filter(v => v);

                    let resEls = subgroupEl.querySelectorAll(".home_tasks_edit-group_subgroup_resource_item input[type='text']");
                    let resources = [];
                    for (let j = 0; j < resEls.length; j += 2) {
                        let title = resEls[j].value.trim();
                        let link = resEls[j + 1]?.value.trim() || "";
                        if (title || link) resources.push({ title, link });
                    }

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

                home_tasks_edit_container.classList.remove("active");
                renderGroups();
                console.log(localStorage)
            })
        }
    });
}


// Add task

let home_tasks_edit_group_subgroup_add_task_btn = document.querySelector(".home_tasks_edit-group_subgroup_add-task-btn");

function addTask(taskAddingSubgroup) {
    let home_tasks_edit_group_subgroup_new_task = `
    <div class="home_tasks_edit-group_subgroup_task">
        <label class="common-checkbox-label">
            <input type="checkbox" class="common-checkbox">
            <span class="common-checkbox-check"></span>
            <input type="text" class="home_tasks_edit-group_subgroup_task-checkbox-text common-text-input" placeholder="Task">
        </label>
    </div>
    `;

    let temp = document.createElement("div");
    temp.innerHTML = home_tasks_edit_group_subgroup_new_task.trim();
    let newTask = temp.firstElementChild;
    home_tasks_edit_group_subgroup_add_task_btn = taskAddingSubgroup.querySelector(".home_tasks_edit-group_subgroup_add-task-btn");

    taskAddingSubgroup.insertBefore(newTask, home_tasks_edit_group_subgroup_add_task_btn);

}

if (home_tasks_edit_group_subgroup_add_task_btn) {
    home_tasks_edit_group_form.addEventListener("click", (e) => {
        if (e.target.closest(".home_tasks_edit-group_subgroup_add-task-btn")) {
            addTask(e.target.closest(".home_tasks_edit-group_subgroup-block"));
        }
    })
}


// Add new source

let home_tasks_edit_group_subgroup_resource_add_btn = document.querySelector(".home_tasks_edit-group_subgroup_resource_add-btn");

function addSource(resAddingSubgroup) {
    let home_tasks_edit_group_subgroup_resource_new_item = `
    <div class="home_tasks_edit-group_subgroup_resource_item">
        <input type="text" class="home_tasks_edit-group_subgroup_resource_item-title common-text-input" placeholder="Title"/>
        <input type="text" class="home_tasks_edit-group_subgroup_resource_item-link common-text-input" placeholder="Link">
    </div>
    `;
    
    let temp = document.createElement("div");
    temp.innerHTML = home_tasks_edit_group_subgroup_resource_new_item.trim();
    let newSource = temp.firstElementChild;
    let home_tasks_edit_group_subgroup_add_source_btn = resAddingSubgroup.querySelector(".home_tasks_edit-group_subgroup_resource_add-btn");

    resAddingSubgroup.insertBefore(newSource, home_tasks_edit_group_subgroup_add_source_btn);
}

if (home_tasks_edit_group_subgroup_resource_add_btn) {
    home_tasks_edit_group_form.addEventListener("click", (e) => {
        if (e.target.closest(".home_tasks_edit-group_subgroup_resource_add-btn")) {
            addSource(e.target.closest(".home_tasks_edit-group_subgroup_resource-block"));
        }
    })
}


// Add new subgroup

let home_tasks_edit_group_add_subgroup_btn = document.querySelector(".home_tasks_edit_group_add-subgroup-btn");

function addSubgroup() {
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

    
    let temp = document.createElement("div");
    temp.innerHTML = home_tasks_edit_group_new_subgroup.trim();
    let newSubgroup = temp.firstElementChild;

    home_tasks_edit_group_form.insertBefore(newSubgroup, home_tasks_edit_group_add_subgroup_btn);
}

if (home_tasks_edit_group_add_subgroup_btn) {
    home_tasks_edit_group_add_subgroup_btn.addEventListener("click", () => {
        addSubgroup();
    })
}



// Editing the group

if (home_tasks_row) {
    home_tasks_row.addEventListener("click", function(e) {
        let editBtn = e.target.closest(".home_tasks_item_edit");
        let tasksItem = e.target.closest(".home_tasks_item")
        if (editBtn) {
            let editingGroupId = editBtn.dataset.groupId;
            groups = loadGroups();
            let editingGroup = groups.find(g => g.id === editingGroupId);
            if (!editingGroup) return;

            // Load all the previous group info to the form from the localStorage
            home_tasks_edit_group_form.reset();
            home_tasks_edit_group_form.querySelectorAll(".home_tasks_edit-group_subgroup").forEach(subgroup => {subgroup.remove()})
            home_tasks_edit_container.classList.add("active");
            document.querySelector(".home_tasks_edit-group-name").value = editingGroup.name;

            subgroupsCount = editingGroup.subgroups.length;
            for (let i = 0; i < subgroupsCount; i++) {
                addSubgroup();
                
                home_tasks_edit_group_subgroups = home_tasks_edit_container.querySelectorAll(".home_tasks_edit-group_subgroup");
                home_tasks_edit_group_subgroups[i].querySelector(".home_tasks_edit-group_subgroup-title").value = editingGroup.subgroups[i].name;
                // Adding tasks
                let subgroupTasks = editingGroup.subgroups[i].tasks;    
                let subgroupTasksCount = subgroupTasks.length;
                for (let j = 0; j < subgroupTasksCount; j++) {
                    addTask(home_tasks_edit_group_subgroups[i].querySelector(".home_tasks_edit-group_subgroup-block"));
                }

                // Adding sources
                let subgroupSources = editingGroup.subgroups[i].resources;
                let subgroupSourcesCount = subgroupSources.length;
                for (let j = 0; j < subgroupSourcesCount; j++) {
                    addSource(home_tasks_edit_group_subgroups[i].querySelector(".home_tasks_edit-group_subgroup_resource-block"));
                    console.log('source added');
                }

                // Inserting content of tasks
                let home_tasks_edit_group_subgroup_tasks = home_tasks_edit_group_subgroups[i].querySelectorAll(".home_tasks_edit-group_subgroup_task");
                for (let j = 0; j < subgroupTasksCount; j++) {
                    home_tasks_edit_group_subgroup_tasks[j].querySelector(".home_tasks_edit-group_subgroup_task-checkbox-text").value = subgroupTasks[j];
                }
                // Inserting content of sources
                let home_tasks_edit_group_subgroup_resource_items = home_tasks_edit_group_subgroups[i].querySelectorAll(".home_tasks_edit-group_subgroup_resource_item");
                for (let j = 0; j < subgroupSourcesCount; j++) {
                    home_tasks_edit_group_subgroup_resource_items[j].querySelector(".home_tasks_edit-group_subgroup_resource_item-title").value = subgroupSources[j].title;
                    home_tasks_edit_group_subgroup_resource_items[j].querySelector(".home_tasks_edit-group_subgroup_resource_item-link").value = subgroupSources[j].link;
                }
            }

            tasksItem.classList.remove("active");
            document.querySelectorAll(".home_tasks_item_more-btn").forEach(btn => {btn.classList.remove("active")});
        }
    })
}


// Start button

function start_btn() {
    let home_tasks_items = document.querySelectorAll(".home_tasks_item");
    for(let i = 0; i < home_tasks_items.length; i++) {
        if (home_tasks_items[i].classList.contains("active")) {
            let chosenGroupId = home_tasks_items[i].dataset.groupId;
            home_tasks_start_btn.href = `set-up.html?groupId=${chosenGroupId}`
        }
    }
}





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