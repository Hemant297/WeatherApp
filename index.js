const userTab=document.querySelector("[data-userWeather]");
const searchTab=document.querySelector("[data-searchWeather]");
const userContainer=document.querySelector(".weather-container");

const grantAccessContainer=document.querySelector(".grant-location-container");
const searchForm=document.querySelector("[data-searchForm]");
const loadingScreen=document.querySelector(".loading-container");
const userInfoContainer=document.querySelector(".user-info-container");

// intially variables need
let oldTab=userTab;

const API_key="b80dd2ea73a237b647da127356f5679a";

oldTab.classList.add("current-tab");
getfromSessionStorage();
function switchTab(newTab)
{
    // apiErrorContainer.classList.remove("active");
    if(newTab!=oldTab)
    {
        oldTab.classList.remove("current-tab");
        oldTab=newTab;
        oldTab.classList.add("current-tab");
    }
    if(!searchForm.classList.contains("active"))
    {//kya search form wala container is invisible ,if yes than make it visible
        userInfoContainer.classList.remove("active");
        grantAccessContainer.classList.remove("active");
        searchForm.classList.add("active");
    }
    else{
        // main pehle seach wale tab pr tha, ab your weather tab visible karna hai
        searchForm.classList.remove("active");
        userInfoContainer.classList.remove("active");
        // ab mei your weather tab me aagya hu,toh weather bhi displat karna padega, so lets check local storage first for coordinates if we have saved them
        getfromSessionStorage();
    }
}

userTab.addEventListener("click",()=>{
    switchTab(userTab);
});

searchTab.addEventListener("click",()=>{
    switchTab(searchTab);
});

// check if coordinates are already present un sessiuoin storage
function getfromSessionStorage()
{
    const localCoordinates=sessionStorage.getItem("user-coordinates");
    if(!localCoordinates)
    {
        // agar local coordinates nahi mile
        grantAccessContainer.classList.add("active");
    }
    else
    {
        const coordinates=JSON.parse(localCoordinates);
        fetchUserWeatherInfo(coordinates);
    }
}

async function fetchUserWeatherInfo(coordinates)
{
    const{lat,lon}=coordinates;
    // make grant container invisible
    grantAccessContainer.classList.remove("active");
    // make loader visible
    loadingScreen.classList.add("remove");
    // api call 
    try{
        const response=await fetch(`https://api.openweathermap.org/data/2.5/weather?lat=${lat}&lon=${lon}&appid=${API_key}`);
        const data=await response.json();
        loadingScreen.classList.remove("active");
        userInfoContainer.classList.add("active");
        renderWeatherInfo(data);
    }
    catch(err){
        loadingScreen.classList.remove("active");
        alert("please allow location");
    }
}
function renderWeatherInfo(weatherInfo){
    //firstly we havr to fetch the ele
    const cityName=document.querySelector("[data-cityName]");
    const countryIcon=document.querySelector("[data-countryIcon]");
    const desc=document.querySelector("[data-weatherDesc]");
    const weatherIcon=document.querySelector("[data-weatherIcon]");
    const temp=document.querySelector("[data-temp]");
    const windspeed=document.querySelector("[data-windspeed]");
    const humidity=document.querySelector("[data-humidity]");
    const cloudiness=document.querySelector("[data-cloudiness]");

    cityName.textContent=weatherInfo?.name;
    countryIcon.src=`https://flagcdn.com/16x12/${weatherInfo?.sys?.country.toLowerCase()}.png`;
    desc.textContent=weatherInfo?.weather?.[0]?.description;
    weatherIcon.src=`https://openweathermap.org/img/wn/${weatherInfo?.weather?.[0]?.icon}.png`
    let a=parseFloat(weatherInfo?.main?.temp);
    let b=a-273.15;
    temp.textContent=`${b.toFixed(2)} °C`;
    windspeed.textContent=`${weatherInfo?.wind?.speed} m/s`;
    humidity.textContent=`${weatherInfo?.main?.humidity} %`;
    cloudiness.textContent=`${weatherInfo?.clouds?.all} %`;

}

function getLocation(){
    if(navigator.geolocation)
    {
        navigator.geolocation.getCurrentPosition(showPosition);
    }
    else{
        alert("no geolocation support available");
    }

}

function showPosition(position){

    const userCoordinates={
        lat: position.coords.latitude,
        lon: position.coords.longitude,
    }
    sessionStorage.setItem("user-coordinates",JSON.stringify(userCoordinates));
    fetchUserWeatherInfo(userCoordinates);
}

const grantAccessButton=document.querySelector("[data-grantAccess]");
grantAccessButton.addEventListener("click",getLocation);

const searchInput=document.querySelector("[data-searchInput]");
searchForm.addEventListener("submit",(e)=>{
    e.preventDefault();
    let cityName = searchInput.value;
    if(cityName==="")
        return ;
    else
        fetchSearchWeatherInfo(cityName);
});

async function fetchSearchWeatherInfo(city)
{
    loadingScreen.classList.add("active");
    userInfoContainer.classList.remove("active");
    grantAccessContainer.classList.remove("active");
    try{
        const response=await fetch(`https://api.openweathermap.org/data/2.5/weather?q=${city}&appid=${API_key}`);
        const data=await response.json();
        loadingScreen.classList.remove("active");
        userInfoContainer.classList.add("active");
        renderWeatherInfo(data);
    }
    catch(err)
    {
        alert("Error occured");
    }
}

















