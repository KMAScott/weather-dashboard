var APIkey = "feac6823ef10156c3b50861b18206856";

var cityInput = $("#cityInput")
var searchButton = $("#searchButton")
var clearButton = $("#clearHistoryBtn")
var pastSearchCities = $("#pastSearches")

function getWeather(data) {
    var openWeatherUrl = "https://api.openweathermap.org/data/2.5/onecall?lat=" + data.lat + "&lon=" + data.lon + "&units=imperial&exclude=minutely,hourly,alerts&appid=" + APIkey
    fetch(openWeatherUrl)
        .then(function(response) {
            return response.json();
        })
        .then(function(data) {
            var currentConditionsEl = $("#currentConditions");
            currentConditionsEl.addClass("border border-primary");

            var cityNameEl = $("<h2>");
            cityNameEl.text(currentCity);
            currentConditionsEl.append(cityNameEl);

            var currentCityDate = dayjs().format('MM/DD/YYYY');
            var currentDateEl = $("<span>");
            currentDateEl.text(currentCityDate);
            cityNameEl.append(currentDateEl);

            var currentCityWeatherIcon = data.current.weather[0].icon;
            var currentWeatherIconEl = $("<img>");
            currentWeatherIconEl.attr("src", "http://openweathermap.org/img/wn/" + currentCityWeatherIcon + "@2x.png");
            cityNameEl.append(currentWeatherIconEl);

            var currentCityTemp = data.current.temp;
            var currentTempEl = $("<p>");
            currentTempEl.text("Temp: " + currentCityTemp + "°F");
            currentConditionsEl.append(currentTempEl);

            var currentCityWind = data.current.wind_speed;
            var currentWindEl = $("<p>");
            currentWindEl.text("Wind: " + currentCityWind + "MPH");
            currentConditionsEl.append(currentWindEl);

            var currentCityHumidity = data.current.humidity;
            var currentHumidityEl = $("<p>");
            currentHumidityEl.text("Humidity: " + currentCityHumidity + "%");
            currentConditionsEl.append(currentHumidityEl);

            var currentCityUv = data.current.uvi;
            var currentUvEl = $("<p>");
            var currentUvSpanEl = $("<span>");
            currentUvEl.append(currentUvSpanEl);
            currentUvSpanEl.text("UV: " + currentCityUv);

            if (currentCityUv < 3) {
                currentUvSpanEl.css({"background-color":"green", "color":"white"});
            } else if (currentCityUv < 6) {
                currentUvSpanEl.css({"background-color":"yellow", "color":"black"});
            } else if (currentCityUv < 8) {
                currentUvSpanEl.css({'background-color':'orange', 'color':'white'});
            } else if (currentCityUv < 11) {
                currentUvSpanEl.css({'background-color':'red', 'color':'white'});
            } else {
                currentUvSpanEl.css({'background-color':'violet', 'color':'white'});
            }

            currentConditionsEl.append(currentUvEl);

            var fiveDayForecastTitleEl = $("#fiveDayForecastTitle");
            var fiveDayTitleEl = $("<h2>");
            fiveDayTitleEl.text("5-Day Forecast:");
            fiveDayForecastTitleEl.append(fiveDayTitleEl);

            var fiveDayForecastEl = $("#fiveDayForecast");

            for (var i = 1; i <= 5; i++) {
                var date = dayjs().add(i + 1, "days").format('MM/DD');
                var temp = data.daily[i].temp.day;
                var icon = data.daily[i].weather[0].icon;
                var wind = data.daily[i].wind_speed;
                var humidity = data.daily[i].humidity;

                var card = document.createElement("div");
                card.classList.add("card", "col-2", "m-1", "bg-primary", "text-white");

                var cardBody = document.createElement("div");
                cardBody.classList.add("card-body");
                cardBody.innerHTML = "<h4>" + date + "</h4>, <img src='http://openweathermap.org/img/wn/" + icon + "@2x.png>, <br>, <p>" + temp + "°F</p>, <br>, <p>" + wind + "MPH</p>, <br>, <p>" + humidity + "%</p>"
                card.appendChild(cardBody);
                fiveDayForecastEl.append(card);
            }
        })
    return;
}

function displayPastSearches() {
    var pastCities = JSON.parse(localStorage.getItem("cities")) || [];
    var pastSearchesEl = $("#pastSearches");

    pastSearchesEl.innerHTML = "";

    for (i = 0; i < pastCities.length; i++) {
        var pastCityBtn = document.createElement("button");
        pastCityBtn.classList.add("btn", "btn-primary", "my-2", "past-city");
        pastCityBtn.setAttribute("style", "width: 100%");
        pastCityBtn.textContent = pastCities[i].city;
        pastSearchesEl.append(pastCityBtn);
    }
    return;
}

function getLatLon() {
    var requestUrl = "https://api.openweathermap.org/data/2.5/weather?q=" + currentCity + "&appid=" + APIkey;
    var pastCities = JSON.parse(localStorage.getItem("cities")) || [];

    fetch(requestUrl)
    .then(function(response) {
        if (response.status >= 200 && response.status <= 299) {
            return response.json();
        } else {
            throw Error(response.statusText);
        }
    })
    .then(function(data) {
        var cityInfo = {
            city: currentCity,
            lon: data.coord.lon,
            lat: data.coord.lat
        }

        pastCities.push(cityInfo);
        localStorage.setItem("cities", JSON.stringify(pastCities));

        displayPastSearches();

        return cityInfo;
    })
    .then(function(data) {
        getWeather(data);
    })
    return;
}

function handleClearHistory(event) {
    event.preventDefault();
    var pastSearchesEl = $("#pastSearches");
    localStorage.removeItem("cities");
    pastSearchesEl.innerHTML = ('');
    return;
}

function clearCurrentCityWeather() {
    var currentConditionsEl = $("#currentConditions");
    currentConditionsEl.innerHTML = "";

    var fiveDayForecastTitleEl = $("#fivedayForecastTitle");
    fiveDayForecastTitleEl.innerHTML = "";

    var fiveDayForecastEl = $("#fiveDayForecast");
    fiveDayForecastEl.innerHTML = "";

    return;
}

function handleCityFormSubmit (event) {
    event.preventDefault();
    currentCity = cityInput.val().trim();

    clearCurrentCityWeather();
    getLatLon();

    return;
}

function getPastCity (event) {
    var element = event.target;

    if (element.matches(".past-city")) {
        currentCity = element.textContent;
        clearCurrentCityWeather();

        var requestUrl = "https://api.openweathermap.org/data/2.5/weather?q=" + currentCity + "&appid=" + APIkey;
        fetch(requestUrl)
            .then(function(response) {
                if (response.status >= 200 && response.status <= 299) {
                    return response.json();
                } else {
                    throw Error(response.statusText);
                }
            })
            .then(function(data) {
                var cityInfo = {
                    city: currentCity,
                    lon: data.coord.lon,
                    lat: data.coord.lat
                }
                return cityInfo;
            })
            .then(function(data) {
                getWeather(data);
            })
    }
    return;
}

displayPastSearches();
searchButton.on("click", handleCityFormSubmit);
clearButton.on("click", handleClearHistory);
pastSearchCities.on("click", getPastCity);