// storage.js
export function loadGroups() {
    try {
        return JSON.parse(localStorage.getItem("groups")) || [];
    } catch {
        return [];
    }
}

export function saveGroups(groups) {
    localStorage.setItem("groups", JSON.stringify(groups));
}

export function generateId(prefix = "id") {
    return `${prefix}-${Date.now()}-${Math.random().toString(36).slice(2)}`;
}
