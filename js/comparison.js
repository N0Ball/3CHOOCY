function initPage(){
    
    if (target_pids == undefined){
        console.error("No target find to compare");
    }

    createTable(target_pids);

}

let priceLen = 1; 
function createTable(pids){

    const nameList = [];
    const imgList = [];
    const pricesList = [];
    const uptimeList = [];
    const tagsList = [];

    pids.forEach(pid => {
        let phone = phoneData[pid];
        let len = Object.keys(phone['prices']).length;
        if (priceLen % len != 0){
            priceLen *= len;
        }
        
        nameList.push(phone["title"] || "??????");
        imgList.push(phone["profile image path"] || "./src/img/default_phone.jpg");
        pricesList.push(phone["prices"] || []);
        uptimeList.push(phone['tags']["up-time"] || "NAN");
        tagsList.push(phone["tags"] || []);
    });

    createHead(imgList);
    createName(nameList);
    createPrice(pricesList);
    createUptime(uptimeList);
    createDetailComparison(tagsList, pricesList);
}

function createHead(imgList){
    const tr = document.getElementById('thead');
    const firstTh = document.createElement('th');
    firstTh.scope = 'col';
    firstTh.classList.add('border-dark-end');
    tr.appendChild(firstTh);
    
    imgList.forEach(img => {
        const th = document.createElement('th');
        th.colSpan = priceLen;
        th.scope = "col";
        th.classList.add('text-center');
        th.classList.add('border-light-start');
        th.innerHTML = `<img src="${img}" alt="image profile">`
        tr.appendChild(th);
    })
}

function createName(nameList){
    const tr = document.getElementById('name');
    const th = document.createElement('th');
    th.scope = "row";
    th.classList.add('text-center');
    th.classList.add('border-dark-end');
    th.innerHTML = '名稱';

    tr.appendChild(th);

    nameList.forEach(name => {
        const td = document.createElement('td');
        td.colSpan = priceLen;
        td.classList.add('text-center');
        td.classList.add('border-item');

        td.innerHTML = name;

        tr.appendChild(td)
    });

}

function createPrice(pricesList){
    const tr = document.getElementById('price');
    const th = document.createElement('th');
    th.scope = "row";
    th.classList.add('text-center');
    th.classList.add('border-dark-end');
    th.innerHTML = "價格";

    tr.appendChild(th);

    pricesList.forEach(prices => {

        for (const [_, price] of Object.entries(prices)){

            const td = document.createElement('td');
            td.classList.add('text-center');
            td.classList.add('border-item');
            td.classList.add('red');
            td.colSpan = priceLen / Object.keys(prices).length;

            td.innerHTML = `$${price}`;

            tr.appendChild(td);
        }

    })

}

function createUptime(uptimeList){
    const tr = document.getElementById('up-time');
    const th = document.createElement('th');
    th.scope = "row";
    th.classList.add('text-center');
    th.classList.add('border-dark-end');
    th.classList.add('border-dark-bottom');
    th.innerHTML = "上市日期";

    tr.appendChild(th);

    uptimeList.forEach(uptime => {
        const td = document.createElement('td');
        td.classList.add('text-center');
        td.classList.add('border-item');
        td.classList.add('border-dark-bottom');
        td.colSpan = priceLen;

        td.innerHTML = uptime;
        tr.appendChild(td);

    });

}

function createDetailComparison(tagsList, pricesList){
    const table = document.getElementById('comparison-table');
    
    for (const [target, name] of Object.entries(comparisonData)){

        let tr = document.createElement('tr');
        tr.id = target;

        const th = document.createElement('th');
        th.scope = "row";
        th.classList.add('text-center');
        th.classList.add('border-dark-end');

        th.innerHTML = `
        <div class="form-check">
            <input class="form-check-input" type="checkbox" value="" id="${target}-check" checked onclick="hide('${target}');">
            <label class="form-check-label w-100" for="${target}-check">
                ${name}
            </label>
        </div>
        `
        tr.appendChild(th);

        if (target == 'ROM'){

            tr = createDetailROM(tr, pricesList);

        }else if (target == 'RAM'){

            tr = createDetailRAM(tr, pricesList);

        }else{

            tagsList.forEach(tags => {
    
                const td = document.createElement('td');
                td.colSpan = priceLen;
                td.classList.add('text-center');
                td.classList.add('border-item');
    
                if (target in tags){
                    td.innerHTML = tags[target];
                }else{
                    td.innerHTML = "NAN";
                }
    
                tr.appendChild(td);
            })

        }


        table.appendChild(tr);
    }

}

function createDetailROM(tr, pricesList){

    pricesList.forEach(prices => {
        for (const [type, _] of Object.entries(prices)){
            const ROM = type.split('/')[0];

            const td = document.createElement('td');
            td.colSpan = priceLen / Object.keys(prices).length;
            td.classList.add('text-center');
            td.classList.add('border-item');

            td.innerHTML = ROM;

            tr.appendChild(td);
        }
    })

    return tr;
}

function createDetailRAM(tr, pricesList){

    pricesList.forEach(prices => {
        for (const [type, _] of Object.entries(prices)){
            const RAM = type.split('/')[1];

            const td = document.createElement('td');
            td.colSpan = priceLen / Object.keys(prices).length;
            td.classList.add('text-center');
            td.classList.add('border-item');

            td.innerHTML = RAM;

            tr.appendChild(td);
        }
    })

    return tr;
}

function hide(rowName){
    const targetRow = document.getElementById(rowName);
    targetRow.classList.add('hidden');
}