let xhttp;
const new_button = document.querySelector("#new");
const save_button = document.querySelector("#save");
const save_status = document.querySelector("#save-status");
const to_do = document.querySelector("#to-do");
const doing = document.querySelector("#doing");
const done = document.querySelector("#done");
new_button.addEventListener("click", createNewCard);
save_button.addEventListener("click", save);
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
    card.dataset.tempId = uuid();   //give new cards a temp id before a real one is given by database as this will be used to link it to the new id
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

function writeCard(card) {
    const div = document.createElement("div");
    div.className = "card";
    div.id = card.id;
    let status = document.getElementById(card.status);
    status.append(div)
    if (card.status === "to-do") {
        to_do.insertBefore(div, new_button);
    }
    const title = document.createElement("h2");
    const description = document.createElement("p");
    const button = document.createElement("button");
    div.append(title);
    div.append(description);
    div.append(button);
    title.innerHTML = card.title;
    title.contentEditable = "true";
    description.innerHTML = card.description;
    description.contentEditable = "true";
    if (card.status === "to-do") {
        button.innerHTML = "mark as doing";
        button.addEventListener("click", markDoing); 
    } else if (card.status === "doing") {
        button.innerHTML = "mark as done";
        button.addEventListener("click", markDone); 
    } else {
        div.removeChild(button);
    }
}

function markDoing(event) {
    const mark_doing = event.target;
    const card = mark_doing.parentElement;
    doing.append(card);
    mark_doing.innerHTML = "mark as done";
    mark_doing.removeEventListener("click", markDoing);
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
            id: el.id || "",
            tempId: el.dataset.tempId,
            title: el.querySelector("h2").innerText,
            description: el.querySelector("p").innerText,
            status: el.parentElement.id
        }
        cards.push(card);
        console.log(card);
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
                    console.log(response.updated_cards)
                    setTimeout(() => {save_status.innerHTML = "saved.";}, 1000);
                    setTimeout(() => {save_status.innerHTML = "";}, 2000);

                    for (let updatedCard of response.updated_cards) {
                        let el = document.querySelector(`[data-temp-id="${updatedCard.tempId}"]`); //gets the element with that temp id and then assigns it its new actual id
                        console.log(el.id)
                        if (el) {
                            el.id = updatedCard.id;
                            el.removeAttribute("data-temp-id");
                            console.log(el.id)
                            console.log(updatedCard.id)
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