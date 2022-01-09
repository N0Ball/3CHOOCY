let target_pids = undefined;

function initTarget(){
    const target = document.getElementById('target-bar');
    
    if (!target){
        console.error('Cannot find target bar');
    }

    target.innerHTML = `
    <p class="text-center mt-3 bg-transparent">比較清單</p>
    <div class="d-inline-block h-75 bg-transparent d-flex align-items-center flex-column overflow-auto" id="target-field"></div>
    <button class="btn btn-dark m-3 text fw-bold" onclick='location.href="./comparison.html"' style="border-radius: 5px !important">開始</button>
    `

    target_pids = JSON.parse(getCookie('target_pids') || "[]");

    target_pids.forEach( e => {
        addTarget(e);
    });

}

function initPage(pid){}

function addTarget(pid){
    const targetField = document.getElementById('target-field') || console.error("No target Field find!");

    if (phoneData == undefined){
        console.error("No phone Data found!");
        return;
    }

    let targetCount = 0;
    for (let item of targetField.childNodes){
        if (item.getAttribute('pid') == pid){
            console.warn(`Already Added pid < ${pid} > to comparison`);
            return;
        }
        targetCount += 1;
    }

    if (targetCount >= 4){
        removeTarget(targetField.childNodes[0].getAttribute('pid'));
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
    updateCookie();
}

function removeTarget(pid){
    const targetField = document.getElementById('target-field') || console.error("No target Field find!");

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
    updateCookie();
}

function updateCookie(){
    const targetField = document.getElementById('target-field') || console.error("No target Field find!");
    const targetPids = [];

    for (let item of targetField.childNodes){
        targetPids.push(item.getAttribute('pid'));
    }

    document.cookie = `target_pids=${JSON.stringify(targetPids)}`;
}

function getCookie(name) {
    const value = `; ${document.cookie}`;
    const parts = value.split(`; ${name}=`);
    if (parts.length === 2) return parts.pop().split(';').shift();
}

function addCookie(name, value){
    document.cookie = `${name}=${value}`;
}