let xhttp;

const new_button = document.querySelector("#new");
new_button.addEventListener("click", createNewCard);

const save_button = document.querySelector("#save");
save_button.addEventListener("click", save);
const save_status = document.querySelector("#save-status");

const to_do = document.querySelector("#to-do");
to_do.addEventListener("dragover", dragoverHandler);
to_do.addEventListener("drop", dropHandler);

const doing = document.querySelector("#doing");
doing.addEventListener("dragover", dragoverHandler);
doing.addEventListener("drop", dropHandler);

const done = document.querySelector("#done");
done.addEventListener("dragover", dragoverHandler);
done.addEventListener("drop", dropHandler);

document.addEventListener("DOMContentLoaded", init);


function init() {
    xhttp = new XMLHttpRequest();
    xhttp.addEventListener("readystatechange", handle_response, false);
    xhttp.open("POST", "/init", true);
    xhttp.send();
}

function createNewCard() {
    const card = document.createElement("div");
    to_do.insertBefore(card, new_button);
    card.className = "card";
    card.dataset.tempId = uuid();  //give new cards a temp id before they are assigned an actual id by database

    const title = document.createElement("h2");
    const description = document.createElement("p");
    const dragHandle = document.createElement("div");

    title.innerHTML = "test";
    title.contentEditable = "true";

    description.innerHTML = "description";
    description.contentEditable = "true";

    dragHandle.innerHTML = "⋮⋮";
    dragHandle.className = "drag-handle";
    dragHandle.draggable = true;
    dragHandle.addEventListener("dragstart", dragstartHandler);

    card.append(title, description, dragHandle);
}

function writeCard(card) {
    const div = document.createElement("div");
    div.addEventListener("dragstart", dragstartHandler);
    div.className = "card";
    div.id = card.id;

    if (card.status === "to-do") {
        to_do.insertBefore(div, new_button);
    } else {
        document.getElementById(card.status).append(div);
    }

    const title = document.createElement("h2");
    title.innerHTML = card.title;
    title.contentEditable = "true";

    const description = document.createElement("p");
    description.innerHTML = card.description;
    description.contentEditable = "true";

    const dragHandle = document.createElement("div");
    dragHandle.innerHTML = "⋮⋮";
    dragHandle.className = "drag-handle";
    dragHandle.draggable = true;
    dragHandle.addEventListener("dragstart", dragstartHandler);

    div.append(title, description,dragHandle);
}



function save() {
    save_status.innerHTML = "saving...";
    let cards = [];
    let card_elements = document.querySelectorAll(".card");
    for (let el of card_elements) {
        let card = {
            id: el.id || "",
            tempId: el.dataset.tempId || "",
            title: el.querySelector("h2").innerText,
            description: el.querySelector("p").innerText,
            status: el.parentElement.id
        }
        cards.push(card);
    }
    const jsonData = JSON.stringify(cards);
    xhttp = new XMLHttpRequest();
    xhttp.addEventListener("readystatechange", handle_response, false);
    xhttp.open("POST", "/save", true);
    xhttp.setRequestHeader("Content-Type", "application/json");
    xhttp.send(jsonData);

}

function handle_response() {
    if (xhttp.readyState === 4) {
        if (xhttp.status === 200) {
            const responseText = xhttp.responseText;
            if (responseText) {
                const response = JSON.parse(responseText);
                if (response.status === "saved") {
                    setTimeout(() => { save_status.innerHTML = "saved."; }, 250);
                    setTimeout(() => { save_status.innerHTML = ""; }, 400);

                    for (let updatedCard of response.updated_cards) {
                        let el = document.querySelector(`[data-temp-id="${updatedCard.tempId}"]`); //gets the element with that temp id and then assigns it its new actual id
                        if (el) {
                            el.id = updatedCard.id;
                            el.removeAttribute("data-temp-id");
                            delete el.dataset.tempId;
                        }
                    };

                } else if (response.status === "initialised") {
                    for (let card of response.cards) {
                        writeCard(card);
                    }
                }
            } else {
                console.warn("Empty response text");
            }
        } else {
            console.error("Request failed with status:", xhttp.status);
            console.error("Response text:", xhttp.responseText);
        }
    }
}


function uuid() {
    return Math.random().toString(36).substring(2, 10);
}


function dragstartHandler(ev) {
    const card = ev.target.parentElement
    ev.dataTransfer.effectAllowed = "move";
    
    if (card.id) {
        ev.dataTransfer.setData("text/plain", card.id);
    } else {
        ev.dataTransfer.setData("text/plain", card.dataset.tempId);
    }
    ev.dataTransfer.setDragImage(card, 0, 0);
}

function dragoverHandler(ev) {
    ev.preventDefault();
    ev.dataTransfer.dropEffect = "move";
}

function dropHandler(ev) {
    ev.preventDefault();
    const elementId = ev.dataTransfer.getData("text/plain");
    let el = document.getElementById(elementId);
    if (el === null) {
        el = document.querySelector(`[data-temp-id="${elementId}"]`);
    }

    const target = document.getElementById(ev.target.id);
    move(target, el);
}

function move(target, el) {
    if (target.id === "doing") {
        doing.append(el);
    } else if (target.id === "to-do") {
        to_do.insertBefore(el, new_button);
    } else if (target.id === "done") {
        done.append(el);
    }
    save();
}