function initSideBar(data){
    const sidebar = document.getElementById('side-bar-selection');
    
    for (let item of data){

        const itemName = item["item-name"];
        
        const button = document.createElement('button');
        button.classList.add("btn");
        button.classList.add("btn-secondary");
        button.classList.add("btn-sidebar");
        button.classList.add("mt-2");
        button.classList.add("w-100");
        button.type = "button";
        button.setAttribute("data-bs-toggle", "collapse");
        button.setAttribute("data-bs-target", `#collapse${itemName}`);
        button.setAttribute("aria-expanded", "false");
        button.setAttribute("aria-controls", `collapse${itemName}`);
        button.innerHTML = itemName;

        const collapse = document.createElement('div');
        let collapseContent = "";
        collapse.id = `collapse${itemName}`;
        collapse.classList.add("collapse");
        collapseContent = `
        <div class="card card-body card-dark">
        `

        for (let selectItem of item["items"]){
            collapseContent += `
            <div class="form-check">
                <input class="form-check-input" type="checkbox" value="" id="${itemName}-${selectItem}">
                <label class="form-check-label" for="${itemName}-${selectItem}">
                    ${selectItem}
                </label>
            </div>
            `
        }

        collapseContent += `
        </div>
        `

        collapse.innerHTML = collapseContent;

        sidebar.append(button);
        sidebar.append(collapse);
    }
}

function initPhone(data){
    const resultCards = document.getElementById("result-cards");
    
    let index = 0;
    for (const phone of data){

        const name = phone["title"] || "????";        
        const price = phone["price"] || "NAN";
        const imgPath = phone["profile image path"] || "./src/img/default_phone.jpg";

        const col = document.createElement('div');
        col.classList.add("col-sm-3");
        col.classList.add("mb-3");
        col.classList.add("p-1");

        const card = document.createElement('div');
        card.classList.add("card");
        card.classList.add("d-flex");
        card.classList.add("align-items-center");
        card.classList.add("w-100");

        const image = document.createElement('img');
        image.src = imgPath;
        image.classList.add("card-img-top");
        image.classList.add("card-img");
        image.setAttribute("alt", `${name} Profile`);

        const cardBody = document.createElement('div');
        cardBody.classList.add("card-body");
        cardBody.innerHTML = `
        <h5 class="card-title text-center">${name}</h5>
        <div class="card-price">
            ${price}
        </div>
        `

        const addBtn = document.createElement('a');
        addBtn.classList.add("btn");
        addBtn.classList.add("btn-primary");
        addBtn.classList.add("w-100");
        addBtn.setAttribute('pid', index);
        addBtn.onclick = (e) => {addTarget(e.path[0].getAttribute('pid'))};
        addBtn.innerHTML = `<i class="fas fa-plus" pid='${index}'></i>`;

        card.appendChild(image);
        card.appendChild(cardBody);
        card.appendChild(addBtn);

        col.appendChild(card);
        resultCards.appendChild(col);

        index += 1;
    }
}

function addTarget(pid){
    const targetField = document.getElementById('target-field');

    console.log(pid);

    if (phoneData == undefined){
        console.error("No phone Data found!");
        return;
    }

    for (let item of targetField.childNodes){
        if (item.getAttribute('pid') == pid){
            console.warn("Already Added to comparison");
            return;
        }
    }

    const target = phoneData[pid];
    const name = target["title"] || "????";   
    const imgPath = target["profile image path"] || "./src/img/default_phone.jpg";

    const container = document.createElement('div');
    container.setAttribute("pid", pid);
    container.classList.add("target-container");
    container.innerHTML = `
        <i class="target-cross fas fa-times" onclick="removeTarget(${pid});"></i>
        <img src="${imgPath}" class="rounded-circle target-img" alt="${name} Profile Image">
    `

    targetField.appendChild(container);
}

function removeTarget(pid){
    const targetField = document.getElementById('target-field');

    let target = undefined;

    for (let item of targetField.childNodes){
        if (item.getAttribute('pid') == pid){
            target = item;
            break;
        }
    }

    if (target == undefined){
        console.error("Can't find pid");
        return;
    }

    targetField.removeChild(target);
}