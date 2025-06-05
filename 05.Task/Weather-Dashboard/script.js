const myapiKey = '4283fea570f1791a0da8ec708eaabf60';

let serachBtn = document.getElementById('searchBtn');
let cityInput = document.getElementById('cityInput');
let weatherInfo = document.getElementById('weatherInfo');



serachBtn.addEventListener('click',() => {
    const city = cityInput.value.trim();
    if(city){
        getWeather(city);
        getForecast(city);
    }else{
        alert('Enter a city name or zip code.');
    }
});

// For getting the weather

async function getWeather(city){
    try {
        const res = await fetch(`https://api.openweathermap.org/data/2.5/weather?q=${city}&appid=${myapiKey}&units=metric`);
        if(!res.ok) throw new Error('City is not found.');
        const data = await res.json();

        weatherInfo.innerHTML = `
        <h2>${data.name}</h2>
        <p>Temperature: ${data.main.temp}°C</p>
        <p>Wind Speed: ${data.wind.speed} m/s</p>
        <img src="http://openweathermap.org/img/wn/${data.weather[0].icon}@2x.png" alt="Weather Icon">
        `;
    } catch (error) {
        weatherInfo.innerHTML = `
        <p>${error.message}</p>
        `;
    }
}

async function getForecast(city) {
    try {
        const res = await fetch(`https://api.openweathermap.org/data/2.5/forecast?q=${city}&appid=${myapiKey}&units=metric`);
        if (!res.ok) throw new Error("Forecast data not available");
        const data = await res.json();
        console.log(res);
    
        const forecast = data.list.filter(item => item.dt_txt.includes("12:00:00"));
        let forecastHTML = `<h3>5-Day Forecast</h3><div class="forecast-cards">`;
    
        forecast.forEach(item => {
        forecastHTML += `
            <div class="forecast-day">
            <p>${new Date(item.dt_txt).toLocaleDateString()}</p>
            <img src="http://openweathermap.org/img/wn/${item.weather[0].icon}@2x.png">
            <p>${item.main.temp}°C</p>
            </div>
        `;
        });
    
        forecastHTML += `</div>`;
        document.getElementById('forecast').innerHTML = forecastHTML;
    } catch (error) {
        document.getElementById('forecast').innerHTML = `<p>${error.message}</p>`;
    }
    
}