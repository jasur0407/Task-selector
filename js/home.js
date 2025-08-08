import { loadGroups, saveGroups, generateId } from './storage.js';

const home_tasks_start_btn = document.querySelector("#home_tasks_start-btn");
const home_tasks_add_btn = document.querySelector(".home_tasks_add-btn");
const home_tasks_row = document.querySelector(".home_tasks-row");
const home_tasks_edit_group_form = document.querySelector(".home_tasks_edit_group-form");
const home_tasks_edit_container = document.querySelector(".home_tasks_edit-container");
const home_tasks_random_btn = document.querySelector("#home_tasks_random-btn");
const home_tasks_edit_group_name = document.querySelector(".home_tasks_edit-group-name");
const home_tasks_edit_cross = document.querySelector(".home_tasks_edit-cross");
const home_tasks_max_item = 4;

// --- Helpers ---
function renderGroups() {
    document.querySelectorAll(".home_tasks_item").forEach(e => e.remove());
    const groups = loadGroups();
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

function addTask(block) {
    const html = `
        <div class="home_tasks_edit-group_subgroup_task">
            <label class="common-checkbox-label">
                <input type="checkbox" class="common-checkbox">
                <span class="common-checkbox-check"></span>
                <input type="text" class="home_tasks_edit-group_subgroup_task-checkbox-text common-text-input" placeholder="Task">
            </label>
        </div>`;
    const temp = document.createElement("div");
    temp.innerHTML = html.trim();
    block.insertBefore(temp.firstElementChild, block.querySelector(".home_tasks_edit-group_subgroup_add-task-btn"));
}

function addSource(block) {
    const html = `
        <div class="home_tasks_edit-group_subgroup_resource_item">
            <input type="text" class="home_tasks_edit-group_subgroup_resource_item-title common-text-input" placeholder="Title"/>
            <input type="text" class="home_tasks_edit-group_subgroup_resource_item-link common-text-input" placeholder="Link">
        </div>`;
    const temp = document.createElement("div");
    temp.innerHTML = html.trim();
    block.insertBefore(temp.firstElementChild, block.querySelector(".home_tasks_edit-group_subgroup_resource_add-btn"));
}

function addSubgroup() {
    const html = `
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
        </div>`;
    const temp = document.createElement("div");
    temp.innerHTML = html.trim();
    home_tasks_edit_group_form.insertBefore(temp.firstElementChild, document.querySelector(".home_tasks_edit_group_add-subgroup-btn"));
}

// --- Init ---
renderGroups();

// --- Event Listeners ---

// Select group
home_tasks_row?.addEventListener("click", e => {
    const item = e.target.closest(".home_tasks_item");
    if (item && !e.target.closest('.home_tasks_item_more-btn')) {
        document.querySelectorAll(".home_tasks_item").forEach(i => i.classList.remove("active"));
        item.classList.add("active");
        home_tasks_start_btn?.classList.remove("unavailable");
    }
});

// Random group
home_tasks_random_btn?.addEventListener("click", () => {
    const items = [...document.querySelectorAll(".home_tasks_item")];
    if (!items.length) return;
    items.forEach(i => i.classList.remove("active"));
    const rand = Math.floor(Math.random() * items.length);
    items[rand].classList.add("active");
    home_tasks_start_btn?.classList.remove("unavailable");
});

// More menu toggle
home_tasks_row?.addEventListener("click", e => {
    const clickedBtn = e.target.closest('.home_tasks_item_more-btn');
    if (clickedBtn) {
        document.querySelectorAll('.home_tasks_item_more-btn').forEach(btn => {
            if (btn !== clickedBtn) btn.classList.remove("active");
        });
        clickedBtn.classList.toggle("active");
    }
});

// Delete group
home_tasks_row?.addEventListener("click", e => {
    const deleteBtn = e.target.closest(".home_tasks_item_delete");
    if (deleteBtn) {
        const groupId = deleteBtn.dataset.groupId;
        const groups = loadGroups().filter(g => g.id !== groupId);
        saveGroups(groups);
        home_tasks_start_btn?.classList.add("unavailable");
        renderGroups();
    }
});

// Add group
home_tasks_add_btn?.addEventListener("click", () => {
    const count = document.querySelectorAll(".home_tasks_item").length;
    if (count >= home_tasks_max_item) {
        alert("Max groups reached");
        return;
    }

    // Reset all form inputs
    home_tasks_edit_group_form.reset();

    // Remove all existing subgroups from previous edits
    home_tasks_edit_group_form.querySelectorAll(".home_tasks_edit-group_subgroup").forEach(el => el.remove());

    // Optionally add one blank subgroup
    addSubgroup();

    // Show the form
    home_tasks_edit_container.classList.add("active");

    home_tasks_edit_group_form.onsubmit = e => {
        e.preventDefault();
        const name = home_tasks_edit_group_name.value.trim();
        if (!name) return;

        const subgroups = [];
        document.querySelectorAll(".home_tasks_edit-group_subgroup").forEach((subgroupEl, i) => {
            const subgroupName = subgroupEl.querySelector(".home_tasks_edit-group_subgroup-title")?.value.trim() || "";
            const tasks = [...subgroupEl.querySelectorAll(".home_tasks_edit-group_subgroup_task input[type='text']")]
                .map(el => el.value.trim()).filter(Boolean);

            const resources = [];
            const resEls = [...subgroupEl.querySelectorAll(".home_tasks_edit-group_subgroup_resource_item input[type='text']")];
            for (let j = 0; j < resEls.length; j += 2) {
                const title = resEls[j]?.value.trim();
                const link = resEls[j + 1]?.value.trim();
                if (title || link) resources.push({ title, link });
            }
            subgroups.push({ id: generateId("subgroup"), name: subgroupName, tasks, resources });
        });

        const groups = loadGroups();
        groups.push({ id: generateId("group"), name, subgroups });
        saveGroups(groups);
        home_tasks_edit_group_form.reset();
        home_tasks_edit_container.classList.remove("active");
        renderGroups();
    };
});


// Edit group
home_tasks_row?.addEventListener("click", e => {
    const editBtn = e.target.closest(".home_tasks_item_edit");
    if (!editBtn) return;

    const editingGroupId = editBtn.dataset.groupId;
    const editingGroup = loadGroups().find(g => g.id === editingGroupId);
    if (!editingGroup) return;

    home_tasks_edit_group_form.reset();
    home_tasks_edit_group_form.querySelectorAll(".home_tasks_edit-group_subgroup").forEach(el => el.remove());
    home_tasks_edit_container.classList.add("active");
    home_tasks_edit_group_name.value = editingGroup.name;

    editingGroup.subgroups.forEach((subgroup, i) => {
        addSubgroup();
        const subgroupEls = home_tasks_edit_group_form.querySelectorAll(".home_tasks_edit-group_subgroup");
        const currentEl = subgroupEls[i];
        currentEl.querySelector(".home_tasks_edit-group_subgroup-title").value = subgroup.name;

        subgroup.tasks.forEach(() => addTask(currentEl.querySelector(".home_tasks_edit-group_subgroup-block")));
        subgroup.resources.forEach(() => addSource(currentEl.querySelector(".home_tasks_edit-group_subgroup_resource-block")));

        currentEl.querySelectorAll(".home_tasks_edit-group_subgroup_task").forEach((taskEl, idx) => {
            taskEl.querySelector(".home_tasks_edit-group_subgroup_task-checkbox-text").value = subgroup.tasks[idx] || "";
        });
        currentEl.querySelectorAll(".home_tasks_edit-group_subgroup_resource_item").forEach((resEl, idx) => {
            resEl.querySelector(".home_tasks_edit-group_subgroup_resource_item-title").value = subgroup.resources[idx]?.title || "";
            resEl.querySelector(".home_tasks_edit-group_subgroup_resource_item-link").value = subgroup.resources[idx]?.link || "";
        });
    });
});

home_tasks_edit_cross?.addEventListener("click", function(){
    home_tasks_edit_container.classList.remove("active");
})

// Add UI elements inside form
home_tasks_edit_group_form?.addEventListener("click", e => {
    if (e.target.closest(".home_tasks_edit-group_subgroup_add-task-btn")) {
        addTask(e.target.closest(".home_tasks_edit-group_subgroup-block"));
    }
    if (e.target.closest(".home_tasks_edit-group_subgroup_resource_add-btn")) {
        addSource(e.target.closest(".home_tasks_edit-group_subgroup_resource-block"));
    }
    if (e.target.closest(".home_tasks_edit_group_add-subgroup-btn")) {
        addSubgroup();
    }
});

// Start button
window.start_btn = function () {
    const active = document.querySelector(".home_tasks_item.active");
    if (active) {
        home_tasks_start_btn.href = `set-up.html?groupId=${active.dataset.groupId}`;
    }
};
