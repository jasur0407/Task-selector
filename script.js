/* More options btn */

let home_tasks_row = document.querySelector(".home_tasks-row");

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
        <div class="home_tasks_item-header">SAT</div>
        <div class="home_tasks_item-desc">English writing <br>Math statistics...</div>
    </div>
`;

home_tasks_add_btn.addEventListener("click", function () {
    let current_items = home_tasks_row.querySelectorAll(".home_tasks_item").length
    if (current_items >= home_tasks_max_item) {
        alert("Max reached");
    } else {
        let temp = document.createElement("div");
        temp.innerHTML = home_tasks_new_item.trim();
        let newTask = temp.firstElementChild;

        home_tasks_row.insertBefore(newTask, home_tasks_add_btn);
    }
});