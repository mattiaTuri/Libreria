const api = "https://openlibrary.org";  
const key = "/subjects/";
const apiKey = ".json";

function searchBook(){
    let input = "";
    input = document. querySelector('input').value;
    let result = input.toLowerCase();
    const url = api + key + result + apiKey;
    
    if(input != ""){
        document.getElementById("error").style.visibility = "hidden";
        callAPI(url);
    }else{
        document.getElementById("error").style.visibility = "visible";
    }
}

function mostSearched(input){

    document.getElementById("error").style.visibility = "hidden";
    const url = api + key + input + apiKey;
    
    callAPI(url);
}

async function callAPI(url){

    document.querySelectorAll('button.btn').forEach(elem => {
        elem.disabled = true;
    });
    document.getElementById("loading").style.display = "block";
    document.body.style.opacity = "50%";
    const response = await fetch(url);

    //Trasforma la risposta in un json
    const data = await response.json();
    const defaultValue = _.get(data, "works.author", "Not present");
    createTable(data, defaultValue); 
}

function createTable(data,defaultValue){

    if(document.querySelector('table')){
        document.getElementById('one').removeChild(document.querySelector('table'));
    }
    
    let table = createTemplateTable();
    let tbody = document.createElement("tbody");
    let count = 0;

    //Creo la tabella
    for (let i = 0; i < data.works.length; i++) {
        let tr = document.createElement('tr');
        
        if(i == 0){
            let thead = document.createElement("thead");
            tr.setAttribute("scope","col");
            tr.insertCell(0).textContent = "TITLE";
            tr.insertCell(1).textContent = "AUTHOR";
            tr.insertCell(2).textContent = "DESCRIPTION";
            thead.appendChild(tr);
            table.appendChild(thead);

        }else if(i != 0){      
            let button = createButton();    
            tr.setAttribute("scope","row");
            tr.insertCell(0).textContent = data.works[count].title;

            if(data.works[count].authors[0] != undefined){          
                tr.insertCell(1).textContent = data.works[count].authors[0].name; 
            }else{
                tr.insertCell(1).textContent = defaultValue; 
            }
        
            button.setAttribute("key", data.works[count].key);
            tr.insertCell(2).appendChild(button);           
            tbody.appendChild(tr);           
            count++;
        }        
    }
    table.appendChild(tbody);
    document.getElementById('one').appendChild(table)
    document.getElementById("loading").style.display = "none";
    document.body.style.opacity = "100%";
    document.querySelectorAll('button.btn').forEach(elem => {
        elem.disabled = false;
    });
}

const description = document.createElement("p");

async function showDescription(id){
    
    description.textContent = '';
    
    url = api + id + apiKey;
    const response = await fetch(url);

    const data = await response.json();
    const defaultDescription = _.get(data, "description", "Description not present");

    /*if(data.description != undefined || data.has(description)){          
        description.textContent = data.description.value;
    }else{
        description.textContent = defaultDescription; 
    }*/

    if(data.description && data.description.value != undefined){
        description.textContent = data.description.value;
    }else{
        description.textContent = defaultDescription;
    }

    //description.textContent = data.description.value ?. data.description;
    document.getElementById('description').appendChild(description);
}

let createTemplateTable = () => {
    const table = document.createElement("table");
    table.classList.add("table");
    table.classList.add("align-middle");
    table.classList.add("text-center");
    table.classList.add("w-50");
    table.classList.add("p-3");
    return table;
}

let createButton = () => {
    const button = document.createElement("button");
    button.innerHTML = "DESCRIPTION";
    button.classList.add("btn");
    button.classList.add("btn-primary");
    button.classList.add("btn-sm");
    button.classList.add("px-3");
    button.setAttribute("onclick","showDescription(this.getAttribute('key'))");
    button.setAttribute("data-mdb-toggle","modal");
    button.setAttribute("data-mdb-target","#modal-description");
    return button;
}
