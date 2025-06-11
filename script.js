let home_tasks_start_btn = document.querySelector("#home_tasks_start-btn");


/* More options btn */

let home_tasks_row = document.querySelector(".home_tasks-row");
let home_tasks_item = document.querySelectorAll(".home_tasks_item");

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



/* Add new group btn */

let home_tasks_add_btn = document.querySelector(".home_tasks_add-btn");
let home_tasks_max_item = 4;

let home_tasks_new_item = `
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
`;

home_tasks_add_btn.addEventListener("click", function () {
    let home_tasks_item_length = home_tasks_item.length;
    if (home_tasks_item_length >= home_tasks_max_item) {
        alert("Max reached");
    } else {
        let temp = document.createElement("div");
        temp.innerHTML = home_tasks_new_item.trim();
        let newTask = temp.firstElementChild;

        home_tasks_row.insertBefore(newTask, home_tasks_add_btn);
        home_tasks_item = document.querySelectorAll(".home_tasks_item");
    }
});


// Select group


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



// Random group selection

let home_tasks_random_btn = document.querySelector("#home_tasks_random-btn");

home_tasks_random_btn.addEventListener("click", function() {
    let rand_group = Math.floor(Math.random() * home_tasks_item.length);
    home_tasks_item.forEach(item => {
        item.classList.remove("active");
    })
    home_tasks_item[rand_group].classList.add("active");
    home_tasks_start_btn.classList.remove("unavailable");
})


// Delete group btn


let home_tasks_item_more_options_item_delete = document.querySelectorAll("#home_tasks_item_more-options_item-delete");

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


// Edit group btn


let home_tasks_edit_btn = document.querySelector("#home_tasks_item_more-options_item-edit");
let home_tasks_edit_container = document.querySelector(".home_tasks_edit-container");

home_tasks_row.addEventListener("click", function(e) {
    editBtn = e.target.closest("#home_tasks_item_more-options_item-edit");
    if (editBtn) {
        home_tasks_edit_container.classList.add("active");
    }
})



// Close editing window


let home_tasks_editWindow_cross = document.querySelector(".home_tasks_edit-cross");

home_tasks_editWindow_cross.addEventListener("click", function() {
    home_tasks_edit_container.classList.remove("active");
})