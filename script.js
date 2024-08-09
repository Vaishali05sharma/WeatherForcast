const userTab = document.querySelector("[data-userWeather]");
const searchTab = document.querySelector("[data-searchWeather]");

const userContainer = document.querySelector(".weather-container");
const grantAccessContainer = document.querySelector(".grant-location-container");
const userInfoContainer = document.querySelector(".user-info-container");

const searchForm = document.querySelector("[data-searchForm]");
const loadingScreen = document.querySelector(".loading-container");
const errorContainer = document.querySelector(".error-container");

console.log("writing code");
// api used to find current location
const API_KEY = "d1845658f92b31c64bd94f06f7188c9c";


let oldTab=userTab;
oldTab.classList.add("current-tab");
getfromSessionStorage();


userTab.addEventListener("click",()=>{
    switchTab(userTab);
});

searchTab.addEventListener("click", ()=>{
    switchTab(searchTab);
});


// switching tab 
function switchTab(newTab){
    if(newTab != oldTab){
        oldTab.classList.remove("current-tab");
        oldTab=newTab;
        oldTab.classList.add("current-tab");
    }

    if(!searchForm.classList.contains("active")){
        userInfoContainer.classList.remove("active");
        grantAccessContainer.classList.remove("active");
        searchForm.classList.add("active");
        console.log("searchform added")
    }
    else{
        searchForm.classList.remove("active");
        console.log("searchform removed");
        // ?
        userInfoContainer.classList.remove("active");
        errorContainer.classList.remove("active");
        // console.log("info container added");
        getfromSessionStorage();
    }
}
function getfromSessionStorage(){
    const localCoorinates = sessionStorage.getItem("user-coordinates");
    if(!localCoorinates){
        grantAccessContainer.classList.add("active");
    }
    else{
        const coordinates = JSON.parse(localCoorinates);
        fetchUserWeatherInfo(coordinates);
    }
}
async function fetchUserWeatherInfo(coordinates){
     const {lat , lon} = coordinates;
     grantAccessContainer.classList.remove("active");
     loadingScreen.classList.add("active");

     // api call
     try {
        const response = await fetch(
            `https://api.openweathermap.org/data/2.5/weather?lat=${lat}&lon=${lon}&appid=${API_KEY}&units=metric`
          );
        const  data = await response.json();

        loadingScreen.classList.remove("active");
        userInfoContainer.classList.add("active");
        renderWeatherInfo(data);
    }
    catch(e){
        loadingScreen.classList.remove("active");
        // last me handle karenge 
    }
}
// function renderWeatherInfo(weatherInfo){

//     // fetching the html 
//     const cityName = document.querySelector("[data-cityName]");
//     const countryIcon = document.querySelector("[data-countryIcon]");
//     const desc = document.querySelector("[data-weatherDesc]");
//     const weatherIcon = document.querySelector("[data-weatherIcon]");
//     const temp = document.querySelector("[data-temp]");
//     const windspeed = document.querySelector("[data-windspeed]");
//     const humidity = document.querySelector("[data-humidity]");
//     const cloudiness = document.querySelector("[data-cloudiness]");
//     console.log("insid render function");
//     console.log(" here" ,weatherInfo);
//     console.log("hey");

//     cityName.innerText = weatherInfo?.name;
//     countryIcon.src= `https://flagcdn.com/144x108/${weatherInfo?.sys?.country.toLowerCase()}.png`;
//     desc.innerText= weatherIcon?.weather?.[0]?.description;
//     weatherIcon.src=`http://openweathermap.org/img/w/${weatherInfo?.weather?.[0]?.icon}.png`;
//     temp.innerText = `${weatherInfo?.main?.temp} °C`;
//     windspeed.innerText = `${weatherInfo?.wind?.speed} %`;
//     humidity.innerText = `${weatherInfo?.main?.humidity} %`
//     cloudiness.innerText = `${weatherInfo?.clouds?.all} %`;
// }

function renderWeatherInfo(weatherInfo) {
    //fistly, we have to fethc the elements 

    const cityName = document.querySelector("[data-cityName]");
    const countryIcon = document.querySelector("[data-countryIcon]");
    const desc = document.querySelector("[data-weatherDesc]");
    const weatherIcon = document.querySelector("[data-weatherIcon]");
    const temp = document.querySelector("[data-temp]");
    const windspeed = document.querySelector("[data-windspeed]");
    const humidity = document.querySelector("[data-humidity]");
    const cloudiness = document.querySelector("[data-cloudiness]");

    console.log(weatherInfo);

    //fetch values from weatherINfo object and put it UI elements
    cityName.innerText = weatherInfo?.name;
    countryIcon.src = `https://flagcdn.com/144x108/${weatherInfo?.sys?.country.toLowerCase()}.png`;
    desc.innerText = weatherInfo?.weather?.[0]?.description;
    weatherIcon.src = `http://openweathermap.org/img/w/${weatherInfo?.weather?.[0]?.icon}.png`;
    temp.innerText = `${weatherInfo?.main?.temp} °C`;
    windspeed.innerText = `${weatherInfo?.wind?.speed} m/s`;
    humidity.innerText = `${weatherInfo?.main?.humidity}%`;
    cloudiness.innerText = `${weatherInfo?.clouds?.all}%`;


}

function getLocation(){
    if(navigator.geolocation) {
        navigator.geolocation.getCurrentPosition(showPosition);
        console.log("granted")
    }
    else {
        alert("No geolocation support available");
    }
}
function showPosition(position){
    const userCoordinates = {
        lat: position.coords.latitude,
        lon: position.coords.longitude,
    }
    sessionStorage.setItem("user-coordinates", JSON.stringify(userCoordinates));
    fetchUserWeatherInfo(userCoordinates);
}

const grantAccessButton = document.querySelector("[data-grantAccess]");
grantAccessButton.addEventListener("click" , getLocation);

const searchInput = document.querySelector("[data-searchInput]");

searchForm.addEventListener("submit" , (e)=>{
    e.preventDefault(e);
     let cityName = searchInput.value;

     if(cityName === "") 
        return;
    else{
        fetchSearchWeatherInfo(cityName);
        console.log("fetch fn call");
    }
});

async function fetchSearchWeatherInfo(city){
    loadingScreen.classList.add("active");
    userInfoContainer.classList.remove("active");
    grantAccessContainer.classList.remove("active");


    try {
        const response = await fetch(
            `https://api.openweathermap.org/data/2.5/weather?q=${city}&appid=${API_KEY}&units=metric`
          );
          if (!response.ok) {
            // Handle HTTP errors (like 404, 500, etc.)
            throw new Error(`HTTP error! Status: ${response.status}`);
        }
        const data = await response.json();
        loadingScreen.classList.remove("active");
        userInfoContainer.classList.add("active");
        renderWeatherInfo(data);
        console.log("inside try box of search");
    }
    catch(err) {
        
            console.log(" i have not city not found");
            loadingScreen.classList.remove("active");
            userInfoContainer.classList.remove("add");
            errorContainer.classList.add("active");
    }
}