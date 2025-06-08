
const new_button = document.querySelector("#new");
const to_do = document.querySelector("#to-do");
new_button.addEventListener("click", createCard);

function createCard() {
    const card = document.createElement("div");
    to_do.insertBefore(card, new_button);
    card.className = "card";
    const title = document.createElement("h2");
    const description = document.createElement("p");
    card.append(title);
    card.append(description);
    title.innerHTML = "test";
    title.contentEditable = "true";
    description.innerHTML = "description";
    description.contentEditable = "true";
    
    

}

