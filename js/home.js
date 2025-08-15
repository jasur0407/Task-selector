function loadGroups() {
    return JSON.parse(localStorage.getItem("groups") || "[]");
}
function saveGroups(groups) {
    localStorage.setItem("groups", JSON.stringify(groups));
}
function generateId(prefix) {
    return `${prefix}-${Date.now()}-${Math.floor(Math.random() * 1000)}`;
}

//  Elements 
let header_right_coins_count = document.querySelector(".header_right_coins-count");
let home_tasks_start_btn = document.querySelector("#home_tasks_start-btn");
let home_tasks_add_btn = document.querySelector(".home_tasks_add-btn");
let home_tasks_row = document.querySelector(".home_tasks-row");
let home_tasks_edit_group_form = document.querySelector(".home_tasks_edit_group-form");
let home_tasks_edit_container = document.querySelector(".home_tasks_edit-container");
let home_tasks_edit_cross = document.querySelector(".home_tasks_edit-cross");
let home_tasks_max_item = 4;

// Render points

function renderPoints() {
    let totalPoints = Number(localStorage.getItem("totalPoints")) || 0;
    document.querySelector(".header_right_coins").textContent = totalPoints;
}
renderPoints();

//  Render Groups 
function renderGroups() {
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
renderGroups();

//  Select group 
home_tasks_row?.addEventListener("click", e => {
    let item = e.target.closest(".home_tasks_item");
    if (item && !e.target.closest('.home_tasks_item_more-btn')) {
        document.querySelectorAll(".home_tasks_item").forEach(i => i.classList.remove("active"));
        item.classList.add("active");
        home_tasks_start_btn.classList.remove("unavailable");
    }
});

//  Random group selection 
document.querySelector("#home_tasks_random-btn")?.addEventListener("click", () => {
    let items = document.querySelectorAll(".home_tasks_item");
    let rand_group = Math.floor(Math.random() * items.length);
    items.forEach(item => item.classList.remove("active"));
    items[rand_group].classList.add("active");
    home_tasks_start_btn.classList.remove("unavailable");
});

//  More options toggle 
home_tasks_row?.addEventListener("click", e => {
    if (e.target.closest('.home_tasks_item_more-btn')) {
        let clickedBtn = e.target.closest('.home_tasks_item_more-btn');
        document.querySelectorAll('.home_tasks_item_more-btn').forEach(btn => {
            if (btn !== clickedBtn) btn.classList.remove("active");
        });
        clickedBtn.classList.toggle("active");
    }
});

//  Delete group 
home_tasks_row?.addEventListener("click", e => {
    let deleteBtn = e.target.closest(".home_tasks_item_delete");
    if (deleteBtn) {
        let groupId = deleteBtn.dataset.groupId;
        let groups = loadGroups().filter(g => g.id !== groupId);
        saveGroups(groups);
        renderGroups();
        home_tasks_start_btn.classList.add("unavailable")
    }
});

//  Add Task with Due Date & Points 
function addTask(taskAddingSubgroup) {
    let html = `
    <div class="home_tasks_edit-group_subgroup_task">
        <div class="home_tasks_edit-group-subgroup_task_inner">
            <input type="text" class="home_tasks_edit-group_subgroup_task-checkbox-text common-text-input" placeholder="Task">
            <input type="date" class="home_tasks_edit-group_subgroup_task-date common-text-input">
            <input type="number" min="0" class="home_tasks_edit-group_subgroup_task-points common-text-input" placeholder="Points">
        </div>
    </div>
    `;
    let temp = document.createElement("div");
    temp.innerHTML = html.trim();
    let newTask = temp.firstElementChild;
    let btn = taskAddingSubgroup.querySelector(".home_tasks_edit-group_subgroup_add-task-btn");
    taskAddingSubgroup.insertBefore(newTask, btn);
}

//  Add Source 
function addSource(resAddingSubgroup) {
    let html = `
    <div class="home_tasks_edit-group_subgroup_resource_item">
        <input type="text" class="home_tasks_edit-group_subgroup_resource_item-title common-text-input" placeholder="Title"/>
        <input type="text" class="home_tasks_edit-group_subgroup_resource_item-link common-text-input" placeholder="Link">
    </div>
    `;
    let temp = document.createElement("div");
    temp.innerHTML = html.trim();
    let newSource = temp.firstElementChild;
    let btn = resAddingSubgroup.querySelector(".home_tasks_edit-group_subgroup_resource_add-btn");
    resAddingSubgroup.insertBefore(newSource, btn);
}

//  Add Subgroup 
function addSubgroup() {
    let html = `
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
    let temp = document.createElement("div");
    temp.innerHTML = html.trim();
    home_tasks_edit_group_form.insertBefore(temp.firstElementChild, document.querySelector(".home_tasks_edit_group_add-subgroup-btn"));
}

home_tasks_edit_group_form?.addEventListener("click", (e) => {
  // Add new task
  const addTaskBtn = e.target.closest(".home_tasks_edit-group_subgroup_add-task-btn");
  if (addTaskBtn) {
    const subgroupBlock = addTaskBtn.closest(".home_tasks_edit-group_subgroup-block");
    if (subgroupBlock) addTask(subgroupBlock);
    return;
  }

  // + Add new source
  const addSourceBtn = e.target.closest(".home_tasks_edit-group_subgroup_resource_add-btn");
  if (addSourceBtn) {
    const resBlock = addSourceBtn.closest(".home_tasks_edit-group_subgroup_resource-block");
    if (resBlock) addSource(resBlock);
    return;
  }

  // + Add new subgroup
  const addSubgroupBtn = e.target.closest(".home_tasks_edit_group_add-subgroup-btn");
  if (addSubgroupBtn) {
    addSubgroup();
    return;
  }
});


// Add Group Button
home_tasks_add_btn?.addEventListener("click", () => {
    if (document.querySelectorAll(".home_tasks_item").length >= home_tasks_max_item) {
        alert("Max groups reached");
        return;
    }
    home_tasks_edit_group_form.reset();
    home_tasks_edit_group_form.querySelectorAll(".home_tasks_edit-group_subgroup").forEach(el => el.remove());
    addSubgroup();
    home_tasks_edit_container.classList.add("active");

    home_tasks_edit_group_form.onsubmit = e => {
        e.preventDefault();
        const groupName = document.querySelector(".home_tasks_edit-group-name").value.trim();
        if (!groupName) return;

        const subgroups = [];
        document.querySelectorAll(".home_tasks_edit-group_subgroup").forEach((subEl, i) => {
            const subgroupName = subEl.querySelector(".home_tasks_edit-group_subgroup-title")?.value.trim() || "";
            const tasks = Array.from(subEl.querySelectorAll(".home_tasks_edit-group_subgroup_task")).map(taskEl => ({
                name: taskEl.querySelector(".home_tasks_edit-group_subgroup_task-checkbox-text").value.trim(),
                dueDate: taskEl.querySelector(".home_tasks_edit-group_subgroup_task-date").value,
                points: parseInt(taskEl.querySelector(".home_tasks_edit-group_subgroup_task-points").value) || 0
            })).filter(t => t.name);

            const resources = [];
            const resInputs = Array.from(subEl.querySelectorAll(".home_tasks_edit-group_subgroup_resource_item input[type='text']"));
            for (let j = 0; j < resInputs.length; j += 2) {
                const title = resInputs[j]?.value.trim();
                const link = resInputs[j + 1]?.value.trim();
                if (title || link) resources.push({ title, link });
            }

            subgroups.push({ id: generateId("subgroup"), name: subgroupName, tasks, resources });
        });

        const groups = loadGroups();
        groups.push({ id: generateId("group"), name: groupName, subgroups });
        saveGroups(groups);
        home_tasks_edit_container.classList.remove("active");
        renderGroups();
    };
});

// Edit Group
home_tasks_row?.addEventListener("click", e => {
    let editBtn = e.target.closest(".home_tasks_item_edit");
    if (!editBtn) return;
    let groupId = editBtn.dataset.groupId;
    let group = loadGroups().find(g => g.id === groupId);
    if (!group) return;

    home_tasks_edit_group_form.reset();
    home_tasks_edit_group_form.querySelectorAll(".home_tasks_edit-group_subgroup").forEach(el => el.remove());
    home_tasks_edit_container.classList.add("active");
    document.querySelector(".home_tasks_edit-group-name").value = group.name;

    group.subgroups.forEach(sub => {
        addSubgroup();
        let subgroupEl = home_tasks_edit_group_form.querySelectorAll(".home_tasks_edit-group_subgroup");
        subgroupEl = subgroupEl[subgroupEl.length - 1];
        subgroupEl.querySelector(".home_tasks_edit-group_subgroup-title").value = sub.name;

        sub.tasks.forEach(task => {
            addTask(subgroupEl.querySelector(".home_tasks_edit-group_subgroup-block"));
            let tEls = subgroupEl.querySelectorAll(".home_tasks_edit-group_subgroup_task");
            let tEl = tEls[tEls.length - 1];
            tEl.querySelector(".home_tasks_edit-group_subgroup_task-checkbox-text").value = task.name;
            tEl.querySelector(".home_tasks_edit-group_subgroup_task-date").value = task.dueDate;
            tEl.querySelector(".home_tasks_edit-group_subgroup_task-points").value = task.points;
        });

        sub.resources.forEach(res => {
            addSource(subgroupEl.querySelector(".home_tasks_edit-group_subgroup_resource-block"));
            let rEls = subgroupEl.querySelectorAll(".home_tasks_edit-group_subgroup_resource_item");
            let rEl = rEls[rEls.length - 1];
            rEl.querySelector(".home_tasks_edit-group_subgroup_resource_item-title").value = res.title;
            rEl.querySelector(".home_tasks_edit-group_subgroup_resource_item-link").value = res.link;
        });
    });

    home_tasks_edit_group_form.onsubmit = e2 => {
        e2.preventDefault();
        group.name = document.querySelector(".home_tasks_edit-group-name").value.trim();
        group.subgroups = [];
        document.querySelectorAll(".home_tasks_edit-group_subgroup").forEach(subEl => {
            const subgroupName = subEl.querySelector(".home_tasks_edit-group_subgroup-title").value.trim();
            const tasks = Array.from(subEl.querySelectorAll(".home_tasks_edit-group_subgroup_task")).map(taskEl => ({
                name: taskEl.querySelector(".home_tasks_edit-group_subgroup_task-checkbox-text").value.trim(),
                dueDate: taskEl.querySelector(".home_tasks_edit-group_subgroup_task-date").value,
                points: parseInt(taskEl.querySelector(".home_tasks_edit-group_subgroup_task-points").value) || 0
            })).filter(t => t.name);

            const resources = [];
            const resInputs = Array.from(subEl.querySelectorAll(".home_tasks_edit-group_subgroup_resource_item input[type='text']"));
            for (let j = 0; j < resInputs.length; j += 2) {
                const title = resInputs[j]?.value.trim();
                const link = resInputs[j + 1]?.value.trim();
                if (title || link) resources.push({ title, link });
            }
            group.subgroups.push({ id: generateId("subgroup"), name: subgroupName, tasks, resources });
        });
        let groups = loadGroups();
        let idx = groups.findIndex(g => g.id === group.id);
        groups[idx] = group;
        saveGroups(groups);
        home_tasks_edit_container.classList.remove("active");
        renderGroups();
    };
});

home_tasks_edit_cross.addEventListener("click", function() {
    home_tasks_edit_container.classList.remove("active");
})

// Start Button Link
function start_btn() {
    let active = document.querySelector(".home_tasks_item.active");
    if (active) {
        home_tasks_start_btn.href = `set-up.html?groupId=${active.dataset.groupId}`;
    }
}

home_tasks_start_btn?.addEventListener("click", (e) => {
    start_btn();
});