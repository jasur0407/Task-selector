// Taking group ID from the URL

let urlParams = new URLSearchParams(window.location.search);
chosenGroupId = urlParams.get("groupId");
groups = JSON.parse(localStorage.getItem("groups") || "[]");


let chosenGroup = groups.find(g => g.id === chosenGroupId);

set_up_res_content = document.querySelector(".set-up-res-content");

// Function to add sources to the page
function addSource(title, link) {
    let set_up_res_new_source = `
    <div class="set-up-res_item"><span class="text">${title}</span> <span class="dash">-</span> <a href="${link}" class="link">${link}</a></div>
    `

    let temp = document.createElement("div");
    temp.innerHTML = set_up_res_new_source.trim();
    let newSource = temp.firstElementChild;
    set_up_res_content.appendChild(newSource)
}

// Taking all the info from group
chosenGroupSubgroupsCount = chosenGroup.subgroups.length;
for(let i = 0; i < chosenGroupSubgroupsCount; i++) {
    chosenGroupSubgroupResCount = chosenGroup.subgroups[i].resources.length;
    for(let j = 0; j < chosenGroupSubgroupResCount; j++) {
        chosenGroupSubgroupRes = chosenGroup.subgroups[i].resources[j];
        addSource(chosenGroupSubgroupRes.title, chosenGroupSubgroupRes.link)
    }
}

// Passing URL

set_up_next_btn = document.querySelector("#set-up-next-btn");

function nextBtn() {
    set_up_next_btn.href = `time-track.html?groupId=${chosenGroupId}`;
}