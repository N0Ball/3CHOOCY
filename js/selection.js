const toIntList = ['RAM', 'ROM', 'screen-size', 'sim-number', 'weight', 'battery', 'fast-charge-W', 'screen-refresh-rate', 'camera-pixel', 'cpu-type'];

function initSideBar(data){
    const sidebar = document.getElementById('side-bar-selection');
    
    for (let item of data){

        const itemName = item["item-name"];
        const itemTarget = item["item-target"];
        
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
        collapse.style = "background: rgba(240, 224, 192, 0.5);";
        collapseContent = `
        <div class="card card-body card-dark px-3">
        `

        let selectIndex = 0;
        for (let selectItem of item["items"]){
            collapseContent += `
            <div class="form-check">
                <input class="form-check-input filter-select" type="checkbox" data-value="${itemTarget}|${selectIndex}" id="${itemName}-${selectItem}" onclick="updateFilter();">
                <label class="form-check-label" for="${itemName}-${selectItem}">
                    ${selectItem}
                </label>
            </div>
            `

            selectIndex += 1;
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
    resultCards.innerHTML = "";
    
    let index = 0;
    for (const phone of data){

        const name = phone["title"] || "????";        
        const prices = phone["prices"] || "{'NAN / NAN'}";
        const imgPath = phone["profile image path"] || "./src/img/default_phone.jpg";

        let maxPrice = 0;
        let minPrice = 100000;

        for (const [_, price] of Object.entries(prices)){
            maxPrice = (price > maxPrice ? price : maxPrice);
            minPrice = (price < minPrice ? price : minPrice);
        }

        let price = "";
        if (maxPrice == minPrice){
            price = `$${maxPrice}`;
        }else{
            price = `$${maxPrice} ~ $${minPrice}`;
        }

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
        image.classList.add("phone-img");
        image.setAttribute("alt", `${name} Profile`);

        const cardBody = document.createElement('div');
        cardBody.classList.add("card-body");
        cardBody.setAttribute("pid", index);
        cardBody.onclick = (e) => {viewDetail(e.path[0].getAttribute('pid'))};
        cardBody.innerHTML = `
        <h5 class="card-title text-center title" pid='${index}'>${name}</h5>
        <div class="card-price" pid='${index}'>
            ${price}
        </div>
        `

        const addBtn = document.createElement('a');
        addBtn.classList.add("btn");
        addBtn.classList.add("btn-primary");
        addBtn.classList.add("w-100");
        addBtn.setAttribute("pid", index);
        addBtn.setAttribute("data-bs-toggle", 'tooltip');
        addBtn.setAttribute("data-bs-placement", 'top');
        addBtn.setAttribute("title", '加入比較清單');
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

function searchText(){
    const text = document.getElementById('product-input').value;

    const newPhoneData = [];
    let count = 0;

    phoneData.forEach( phone => {
        if (phone['title'].includes(text)){
            newPhoneData.push(phone);
            count += 1;
        }
    });

    initPhone(newPhoneData);

    const searchText = document.getElementById('search-text');
    const searchCount = document.getElementById('search-count');

    searchText.innerHTML = text;
    searchCount.innerHTML = count;
    
}

function changeFilter(target){

    let filter = new Filter();

    switch (parseInt(target.value)) {
        case filter.DATESORT:
            filter = new SortFilter('up-time');
            break;

        case filter.REV_PRICESORT:
            filter = new SortFilter('max-price', true);
            break;

        case filter.PRICESORT:
            filter = new SortFilter('max-price');
            break;

        case filter.CAMERASORT:
            filter = new SortFilter('camera-pixel');

        case filter.BATTERYSORT:
            filter = new SortFilter('battery');
    
        default:
            break;
    }
    

    let newData = filter.filterData(phoneData);
    initPhone(newData);
    
}

const filterSelections = document.getElementsByClassName('filter-select');
function updateFilter(){

    const filterTargets = {};

    for (const filterSelection of filterSelections){

        if (filterSelection.checked){

            key = filterSelection.getAttribute('data-value').split('|')[0];
            value = filterSelection.getAttribute('data-value').split('|')[1];

            if (key in filterTargets){
                filterTargets[key].push(value);
            }else{
                filterTargets[key] = [value];
            }

        }
    }

    let newData = [];
    for (const [target, values] of Object.entries(filterTargets)){

        const itemTargets = getSelectionData(target);
        let filter = new TypeFilter(target, values, itemTargets);
        newData = filter.filterData(phoneData);
    }

    // newData.forEach(data=>{
    //     console.log(data['tags']['cpu-type']);
    // })

    // console.log("======================");
    
    // phoneData.forEach(data=>{

    //     if (data != true){
    //         console.log(data['tags']['cpu-type']);
    //     }

    // })

    initPhone(newData);
    
}

function getSelectionData(target){

    let targets = undefined;

    selectionData.forEach( data => {

        if (data['item-target'] == target){
            targets = data['targets'];
            return;
        }

    })

    return targets;
}

function viewDetail(pid){
    location.href = `./detail.html?pid=${pid}`;
}

class Filter{
    constructor(){
        this.DATESORT = 1;
        this.REV_PRICESORT = 2;
        this.PRICESORT = 3;
        this.CAMERASORT = 4;
        this.BATTERYSORT = 5;
    };

    filterFunc(_){}

    preFilterData(data){

        if (data[0] == true){
            return data;
        }
        
        data.forEach( e => {

            e['tags']['max-price'] = Object.entries(e['prices']);

            for (const [key, values] of Object.entries(e['tags'])){

                
                if (toIntList.includes(key)){

                    let transValue = [];
                    let unit = [];

                    values.forEach( value => {

                        transValue.push(value.match(/([0-9.]+)/)[0]);
                        unit.push((value.match(/[^0-9.]+/) || [''])[0]);

                    })

                    
                    e['tags'][key] = transValue.map( (e, i) => [e, unit[i]]);
                }
                
                e['tags'][key] = this.specialCase(key, e['tags'][key]);

            }

        });

        data.unshift(true);

        return data;
    }

    specialCase(key, values){

        let newValue = [];

        values.forEach( value => {
    
            if (key == 'up-time'){
                value = value.split(' / ');
            }
    
            if (key == 'max-price'){

                value = [value[1]];

                if (newValue.length > 0){

                    if (newValue[0] > value[0]){
                        value = newValue[0];
                    }
                    
                    newValue.shift()
                }

            }
    
            if (key == 'camera-pixel'){
                if (value[1].includes('億')){
                    value = [(parseInt(value[0])*10000).toString(), value[1].replace('億', '萬')];
                }
            }

            if (key == 'ROM'){
                if (value[1].includes('T')){
                    value = [(parseInt(value[0])*1024).toString(), value[1].replace('T', 'G')];
                }
            }

            newValue.push(value);

        })

        return newValue;
    }
    
    filterData(phoneData) {

        let data = this.preFilterData(phoneData);
        return this.filterFunc(data);

    }

}

class SortFilter extends Filter{

    constructor(filter_by, reverse=false){
        super();
        this.filter_by = filter_by;
        this.reverse = reverse
    }

    filterFunc(data){

        data = data.slice(1);
        
        data.sort( (first, second) => {
            
            first = first['tags'][this.filter_by][0];
            second = second['tags'][this.filter_by][0];
            
            if (this.reverse){
                let tmp = first;
                first = second;
                second = tmp;
            }
            
            if  (first[0] == second[0]){
                
                if (first.length == 1) return 0;
                
                return second[1] - first[1];
            }
            
            return second[0] - first[0];
            
        });
        
        return data;

    }

}

class TypeFilter extends Filter{

    constructor(target, values, itemTargets){
        super();
        self.filterTarget = target;
        self.values = values;
        self.itemTargets = itemTargets;
    }

    filterFunc(data){

        data = data.slice(1);
        
        data = data.filter( e => {
            let targets = e['tags'][self.filterTarget];
            
            const returnList = {};
            for(let i = 0; i < self.itemTargets.length; i++){

                let shouldBeFilter = false;

                if (self.values.includes(i.toString())){
                    shouldBeFilter = true;
                }

                targets.forEach(target => {
                    if (isNaN(target)){
    
                        if(target == self.itemTargets[i]){
                            if (!(target in returnList)){
                                returnList[target] = shouldBeFilter;
                                return;
                            }
                        }
    
                    }else{
    
                        if (target >= self.itemTargets[i]){
                            if (!(target in returnList)){
                                returnList[target] = shouldBeFilter;
                                return;
                            }
                        }
    
                    }
                })

                if (Object.keys(returnList).length == targets.length){
                    for(const status of Object.values(returnList)){
                        if (status){
                            return true;
                        }
                    }
                    return false;
                }


            }

            return false;
        })

        return data;
    }

    specialCase(key, values){
        let newValues = super.specialCase(key, values);
        let modifyValues = [];
        

        if (toIntList.includes(key) || key == 'up-time'){
            newValues.forEach( newValue => {
                modifyValues.push(newValue[0]);
            });
        }

        if (modifyValues.length == 0){
            modifyValues = newValues;
        }

        return modifyValues;
    }

}