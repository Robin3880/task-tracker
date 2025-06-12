let xhttp;
const new_button = document.querySelector("#new");
const save_button = document.querySelector("#save");
const save_status = document.querySelector("#save-status");
const to_do = document.querySelector("#to-do");
const doing = document.querySelector("#doing");
const done = document.querySelector("#done");
new_button.addEventListener("click", createCard);
save_button.addEventListener("click", save);

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
    mark_doing.innerHTML = "mark as done";
    mark_doing.addEventListener("click", markDone);
}

function markDone(event) {
    const mark_done = event.target;
    const card = mark_done.parentElement;
    done.append(card);
    card.removeChild(mark_done);
}

function save() { 
    save_status.innerHTML = "saving...";
    let cards = [];
    let card_elements = document.querySelectorAll(".card");
    for (let el of card_elements) {
        let card = {
            id: el.id,
            title: el.querySelector("h2").innerText,
            description: el.querySelector("p").innerText,
            status: el.parentElement.id
        }
        cards.push(card);
        console.log(card)
    }
    const jsonData = JSON.stringify(cards);

    xhttp = new XMLHttpRequest();
    xhttp.addEventListener("readystatechange", handle_response, false);
    xhttp.open("POST", "/save", true);
    xhttp.setRequestHeader("Content-Type", "application/json");
    xhttp.send(jsonData);
    
}
function handle_response() {
    if (xhttp.readyState === 4 && xhttp.status === 200) {
        setTimeout(() => {save_status.innerHTML = "saved.";}, 1000);
        setTimeout(() => {save_status.innerHTML = "";}, 2000);
    } else {
        console.log("save not successful");
    }
    
}