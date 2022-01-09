function initPage(pid){
    PID = pid;
    displayPhone(PID);
}
function addDetailTarget(){
    addTarget(PID);
}

function displayPhone(pid){


    if (phoneData == undefined){
        console.error("No phone Data found!");
        return;
    }

    const target = phoneData[pid];
    const name = target["title"] || "?????";
    const imgPath = target["profile image path"] || "./src/img/default_phone.jpg";
    const tags = target["tags"];
    const taglist = ['up-time', 'OS', 'cpu-brand', 'cpu-type', 'camera-pixel', 'screen-size', 'battery'];
    const details = target["details"] || "NAN";

    taglist.forEach(tag => {
        const tagDom = document.getElementById(tag);
        tagDom.innerHTML = getTags(tags, tag);
    });

    const title = document.getElementById('title');
    title.innerHTML = name;

    const img = document.getElementById('phone-img');
    img.src = imgPath;

    const colors = tags['colors'];

    colors.forEach(color => {
        const colorField = document.getElementById('detail-colors');
        const circle = document.createElement('span');
        circle.classList.add('color-circle');
        circle.style.backgroundColor = getColor(color);
        
        colorField.appendChild(circle);
    });

    const memoriesDom = document.getElementById('memories');
    const memPrices = target["prices"];

    let maxMemPrice = 0;

    for (const [memory, price] of Object.entries(memPrices)){

        const button = document.createElement('button');
        button.type = "button";
        button.classList.add('btn');
        button.classList.add('btn-secondary');
        button.classList.add('detail-memory');
        button.classList.add('me-3');
        button.classList.add('mt-2');
        button.classList.add('title');
        button.classList.add('fs-little');
        button.setAttribute('price', price);
        button.onclick = (e) => {changeMemory(e.path[0].getAttribute('price'))};
        
        button.innerHTML = memory;
        console.log(button);
        memoriesDom.appendChild(button);

        maxMemPrice = (price > maxMemPrice ? price : maxMemPrice);
    }

    changeMemory(maxMemPrice);

    const featureDetail = document.getElementById('feature-detail-text');
    featureDetail.innerHTML = details;

}

function getTags(tags, tagName){
    try{
        return tags[tagName] || "NAN";
    }catch(e){
        console.log(`No such tag <${tagName}> in ${PID}`);
        return "NAN"
    }
}

function getColor(color){
    try{
        return colorDescriptor[color];
    }catch(e){
        console.log(`No such color <${color}> in color descriptor`);
        return "#000000";
    }
}

function changeMemory(price){
    const priceDom = document.getElementById('price');
    priceDom.innerHTML = `$ ${price}`;
}