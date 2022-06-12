///LOCAL STORAGE INIT///
let tickets = []
///Ternario para cargar tickets///
localStorage.getItem('tickets') ? tickets = JSON.parse(localStorage.getItem('tickets')) : localStorage.setItem('tickets',JSON.stringify(tickets)); 

///CLASES Y CONSTRUCTORES///
class ticket{
    constructor(pasajero,tramTime,tramDate,origin,destination,id){        
        this.pasajero=pasajero;
        this.tramTime=tramTime;
        this.tramDate=tramDate;
        this.origin=origin;
        this.destination=destination;
        this.id=id;        
    }
}

///DOM GENERAL///
let blueTram            = document.getElementById("blueTram");
let redTram             = document.getElementById("redTram");
let greenTram           = document.getElementById("greenTram");
let yellowTram          = document.getElementById("yellowTram");
let tituloLinea         = document.getElementById("tituloLinea");
let detalleLinea        = document.getElementById("detalleLinea");
let tramTicket          = document.getElementById("requestTicket");
let tramSelect          = document.getElementById("tramSelect")
let tramOrigin          = document.getElementById("tramOrigin");
let tramDestination     = document.getElementById("tramDestination");
let myTickets           = document.getElementById("myTickets");
let showTickets         = document.getElementById("showTickets");
let showPassenger       = document.getElementById("myPassenger");
let ticketsEmpty        = document.getElementById("ticketsEmpty");
let thead               = document.getElementById('thead');
let weatherNav          = document.getElementById('weather');

///EVENTS LISTENERS///

///los siguientes muestran información de la línea de Tram.
blueTram.addEventListener('submit', (event) => {    
    event.preventDefault(); 
    blueLine();    
})
redTram.addEventListener('submit', (event) => {    
    event.preventDefault(); 
    redLine();    
})
greenTram.addEventListener('submit', (event) => {    
    event.preventDefault(); 
    greenLine();    
})
yellowTram.addEventListener('submit', (event) => {    
    event.preventDefault(); 
    yellowLine();    
})

//crear ticket nuevo
tramTicket.addEventListener('submit', (event) => {
    event.preventDefault();
    let id = Math.ceil(Math.random()*10000);
    let tramTime = new Date().toLocaleTimeString();
    let tramDate = getDate();
    let formData = new FormData(event.target);   

    if(formData.get('origin')==formData.get('ending')){
        Toastify({
            text: "Origin can't be the same as Destination",
            duration: 2500,            
            close: false,
            gravity: "top",
            position: "center",
            stopOnFocus: true,
            style: {
            background: "#d9534f",
            }
        }).showToast();
        }else if(!checkPassenger(formData.get('pasajero'))){
            Toastify({
                text: "Passenger name not Valid.",
                duration: 2500,            
                close: false,
                gravity: "top",
                position: "center",
                stopOnFocus: true,
                style: {
                background: "#d9534f",
                }
            }).showToast();
        }else{        
            const ordenTicket = new ticket (formData.get('pasajero'),tramTime,tramDate,formData.get('origin'),
            formData.get('ending'),id)
            tickets.push(ordenTicket);
            localStorage.setItem('tickets',JSON.stringify(tickets));   
            tramTicket.reset();
            
            Toastify({
                text: "Your transport request has been generated.",
                duration: 2500,            
                close: false,
                gravity: "top",
                position: "center",
                stopOnFocus: true,
                style: {
                background: "#4bbf73",
                }
            }).showToast();}
})

//Ver tickets generados
myTickets.addEventListener('click', () => { 
    seeTickets();
})
//ver listado de pasajeros
showPassenger.addEventListener('click',()=>{
    seePassengers();
})

function seeTickets(){
    thead.innerHTML=`
                    <tr>
                        <th scope="col">Passenger</th>
                        <th scope="col">Time</th>
                        <th scope="col">Date</th>
                        <th scope="col">Origin</th>
                        <th scope="col">Destination</th>
                        <th scope="col">ID</th>
                        <th scope="col">Option</th>
                    </tr>
                    `
    showTickets.innerHTML=``
        tickets.length > 0 ? tickets.forEach((ticket,index) => {
            showTickets.innerHTML+=`
                                    <tr class="table-success">
                                        <th scope="row">${ticket.pasajero}</th>
                                        <td>${ticket.tramTime}</td>
                                        <td>${ticket.tramDate}</td>
                                        <td>${ticket.origin}</td>
                                        <td>${ticket.destination}</td>
                                        <td>${ticket.id}</td>
                                        <td><button type="button" onclick="deleteTicket(${index})" class="btn btn-danger">Delete</button> </td>                    
                                    </tr>        
                                    `
                                    })  
                                    : showTickets.innerHTML=`<td>No recent tickets</td>`;  
}

///elimina elementos del local storage///
function deleteTicket(index){
    tickets.splice(index,1);
    localStorage.setItem('tickets',JSON.stringify(tickets));
    Toastify({
        text: "Your ticket has been deleted",
        duration: 2500,            
        close: false,
        gravity: "top",
        position: "center", // `left`, `center` or `right`
        stopOnFocus: true, // Prevents dismissing of toast on hover
        style: {
        background: "#d9534f",
        }
    }).showToast();
    seeTickets();    
}

///listado de pasajeros///
function seePassengers(){
    let passengers=[];
    tickets.forEach(ticket => {
        const {pasajero} = ticket;
        passengers.push(pasajero);              
    }); 

    thead.innerHTML=`
                    <tr>
                        <th scope="col">Recent Passengers</th>                       
                    </tr>
                    `
    showTickets.innerHTML=``
        passengers.length > 0 ? passengers.forEach((element) => {
            showTickets.innerHTML+=`
                                    <tr class="table-success">
                                        <th scope="row">${element}</th>                                                                                                  
                                    </tr>        
                                    `
                                    })  
                                    : showTickets.innerHTML=`<td>No recent Passengers</td>`;    
}

///VALIDACIONES////
function checkPassenger(str) {
    return /^[A-Za-z\s]*$/.test(str);
}

/// Función para completar el listado de líneas existentes y su color correspondiente.
function populateTram(){    
    fetch('json/tramLines.json')
    .then( (response) => response.json())
    .then( (tramLinesData) => {
        tramLinesData.forEach((tramLine)=>{
            let {sector,line,color} = tramLine;
            tramOrigin.innerHTML+=`<option style="color:${color}" value="${sector}">${sector} - ${line}</option>`
            tramDestination.innerHTML+=`<option style="color:${color}" value="${sector}">${sector} - ${line}</option>`
        })
    })
}

///Función llamando API de clima de Nuevo México, lugar donde existia de forma ficticia Black Mesa para mostrar en Index///
function weather(){
    let time = new Date().toLocaleTimeString();
    fetch('http://api.weatherapi.com/v1/current.json?key=dd36b1141ba5462aad100554223105&q=36.16810550788181, -108.45484522473032&aqi=yes')
    .then( (response) => response.json())
    .then( (weatherData) => {
        weatherNav.innerHTML=`
        <h6 style="color:white">Surface Temperature (F): ${weatherData.current.temp_f}</h6>
        <h6 style="color:white">Condition: ${weatherData.current.condition.text} <img style="height: 20px" src="${weatherData.current.condition.icon}"/></h6>
        <h6 style="color:white">Winds: ${weatherData.current.wind_mph} mph - Direction: ${weatherData.current.wind_dir} </h6>
        <h6 style="color:white">${getDate()}</h6>
        `
    })
}

function getDate(){
    let today = new Date();
    let dd = today.getDate();
    let mm = today.getMonth()+1;
    let yyyy = today.getFullYear();
    let date = dd+"/"+mm+"/"+yyyy;
    return date;
}

function blueLine(){    
    tituloLinea.innerText=`Blue Line Tram`
    tituloLinea.className=`text-info`
    detalleLinea.innerText=`Blue Line Tram runs between:
    1. Sector C Test Labs
    2. Sector B Coolant Reserve
    3. Area 9 Central Transit Hub`
}

function redLine(){    
    tituloLinea.innerText=`Red Line Tram`
    tituloLinea.className=`text-danger`
    detalleLinea.innerText=`Red Line Tram runs between:
    1. Level 3 Dormitories
    2. Sector G Hydro Electric
    3. Area 3 Medium Security Facilities
    4. Freight Yard`
}

function greenLine(){
    tituloLinea.innerText=`Blue Line Tram`
    tituloLinea.className=`text-success`
    detalleLinea.innerText=`Green Line Tram runs between:
    1. Level 1 Main Facility Entrance
    2. Sector E Biodome Complex
    3. Area 7 Recreational Facilities
    4. Sector A Training Facility`

}

function yellowLine(){    
    tituloLinea.innerText=`Yellow Line Tram`
    tituloLinea.className=`text-warning`
    detalleLinea.innerText=`Yellow Line Tram runs between:
    1. Sector D Administration
    2. High Altitude Launch Center
    3. Sector F Lambda Complex`
}

///EJECUCION///
populateTram();
weather();



