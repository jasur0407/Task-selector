function loadGroups() {
    return JSON.parse(localStorage.getItem("groups") || "[]");
}

const urlParams = new URLSearchParams(window.location.search);
const chosenGroupId = urlParams.get("groupId");

const groups = loadGroups();
const chosenGroup = groups.find(g => g.id === chosenGroupId);

const set_up_res_content = document.querySelector(".set-up-res-content");
const set_up_next_btn = document.querySelector("#set-up-next-btn");

// Render resources for the chosen group
function addSource(title, link) {
    if (!title && !link) return;
    const html = `
        <div class="set-up-res_item">
            <span class="text">${title || "Untitled"}</span>
            ${link ? `<span class="dash"> - </span><a href="${link}" class="link" target="_blank">${link}</a>` : ""}
        </div>
    `;
    const temp = document.createElement("div");
    temp.innerHTML = html.trim();
    set_up_res_content?.appendChild(temp.firstElementChild);
}

if (!chosenGroup) {
    console.warn("Group not found for ID:", chosenGroupId);
    if (set_up_res_content) {
        set_up_res_content.innerHTML = "<div class='error'>No group found. Please go back and select a group.</div>";
    }
} else {
    chosenGroup.subgroups.forEach(subgroup => {
        (subgroup.resources || []).forEach(res => {
            addSource(res.title, res.link);
        });
    });

    window.nextBtn = function () {
        if (set_up_next_btn) {
            set_up_next_btn.href = `time-track.html?groupId=${chosenGroupId}`;
        }
    };
}
