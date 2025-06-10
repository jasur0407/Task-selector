/* More options btn */

let home_tasks_item_more_btn = document.querySelectorAll('.home_tasks_item_more-btn');

home_tasks_item_more_btn.forEach(button => {
    button.addEventListener('click', function() {
        home_tasks_item_more_btn.forEach(btn => {
            if (this.classList.contains('active')) {
                this.classList.remove("active");
            } else {
                this.classList.add("active");
            }
        })
    })
})
