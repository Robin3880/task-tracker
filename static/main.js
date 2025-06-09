
const new_button = document.querySelector("#new");
const to_do = document.querySelector("#to-do");
const doing = document.querySelector("#doing");
const done = document.querySelector("#done");
new_button.addEventListener("click", createCard);

function createCard() {
    const card = document.createElement("div");
    to_do.insertBefore(card, new_button);
    card.className = "card";
    const title = document.createElement("h2");
    const description = document.createElement("p");
    const mark_doing = document.createElement("button");
    card.append(title);
    card.append(description);
    card.append(mark_doing);
    title.innerHTML = "test";
    title.contentEditable = "true";
    description.innerHTML = "description";
    description.contentEditable = "true";
    mark_doing.innerHTML = "mark as doing";
    mark_doing.addEventListener("click", markDoing);
}

function markDoing(event) {
    const mark_doing = event.target;
    const card = mark_doing.parentElement;
    doing.append(card);
    mark_doing.innerHTML = "mark as done"
    mark_doing.addEventListener("click", markDone);
}

function markDone(event) {
    const mark_done = event.target;
    const card = mark_done.parentElement;
    done.append(card);
    card.removeChild(mark_done);
}
