var APIkey = "feac6823ef10156c3b50861b18206856";
var currentConditionsEl = $("#currentConditions");
var fiveDayForecastTitleEl = $("#fiveDayForecastTitle");
var fiveDayForecastEl = $("#fiveDayForecast");
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

            currentConditionsEl.addClass("border border-primary");

            var cityNameEl = $("<h2>");
            cityNameEl.text(currentCity);
            currentConditionsEl.append(cityNameEl);

            var currentCityDate = dayjs().format('MM/DD/YYYY');
            var currentDateEl = $("<span>");
            currentDateEl.text("  " + currentCityDate);
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

            var fiveDayTitleEl = $("<h2>");
            fiveDayTitleEl.text("5-Day Forecast:");
            fiveDayForecastTitleEl.append(fiveDayTitleEl);

            for (var i = 0; i <= 4; i++) {

                var card = document.createElement("div");
                card.classList.add("card", "col-2", "m-1", "bg-primary", "text-white");
    
                var cardBody = document.createElement("div");
                cardBody.classList.add("card-body");

                var date = dayjs().add(i + 1, "days").format('MM/DD');
                var futureDateEl = document.createElement("h2");
                futureDateEl.classList.add("card-title");
                futureDateEl.append(date);
                cardBody.append(futureDateEl);

                var icon = data.daily[i].weather[0].icon;
                var futureIconEl = document.createElement("img");
                futureIconEl.setAttribute("src", "http://openweathermap.org/img/wn/" + icon + "@2x.png");
                cardBody.append(futureIconEl);

                var temp = data.daily[i].temp.day;
                var futureTempEl = document.createElement("p");
                futureTempEl.classList.add("card-text");
                futureTempEl.append("Temp: " + temp + "°");
                cardBody.append(futureTempEl);

                var wind = data.daily[i].wind_speed;
                var futureWindEl = document.createElement("p");
                futureWindEl.classList.add("card-text");
                futureWindEl.append("Wind: " + wind + " MPH");
                cardBody.append(futureWindEl);

                var humidity = data.daily[i].humidity;
                var futureHumidityEl = document.createElement("p");
                futureHumidityEl.classList.add("card-text");
                futureHumidityEl.append("Humidity: " + humidity + "%");
                cardBody.append(futureHumidityEl);

                card.append(cardBody);
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
    location.reload();
    return;
}

function clearCurrentCityWeather() {
    
    document.getElementById("currentConditions").innerHTML = '';

    document.getElementById("fiveDayForecastTitle").innerHTML = '';

    document.getElementById("fiveDayForecast").innerHTML = '';

    document.getElementById("pastSearches").innerHTML = '';

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
    displayPastSearches();
    return;
}

displayPastSearches();
searchButton.on("click", handleCityFormSubmit);
clearButton.on("click", handleClearHistory);
pastSearchCities.on("click", getPastCity);