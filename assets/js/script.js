var APIkey = "feac6823ef10156c3b50861b18206856";

var cityInput = $("#cityInput")
var searchButton = $("#searchButton")
var clearButton = $("#clearHistoryBtn")
var pastSearchCities = $("#pastSearches")

function getWeather(data) {
    var openWeatherUrl = "https://api.openweathermap.org/data/2.5/onecall?lat=${data.lat}&lon=${data.lon}&exclude=minutely,hourly,alerts&appid=${APIkey}"
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

            var currentCityDate = data.current.dt;
            currentCityDate = dayjs().get('date').format(MM/DD/YYYY);
            var currentDateEl = $("<span>");
            currentDateEl.text("(currentCityDate)");
            cityNameEl.append(currentDateEl);

            var currentCityWeatherIcon = data.current.weather[0].icon;
            var currentWeatherIconEl = $("<img>");
            currentWeatherIconEl.attr("src", "http://openweathermap.org/img/wn/" + currentCityWeatherIcon + ".png");
            cityNameEl.append(currentWeatherIconEl);

            var currentCityTemp = data.current.temp;
            var currentTempEl = $("<p>");
            currentTempEl.text("Temp: ${currentCityTemp}°F");
            currentConditionsEl.append(currentTempEl);

            var currentCityWind = data.current.wind_speed;
            var currentWindEl = $("<p>");
            currentWindEl.text("Wind: ${currentCityWind} MPH");
            currentConditionsEl.append(currentWindEl);

            var currentCityHumidity = data.current.humidity;
            var currentHumidityEl = $("<p>");
            currentHumidityEl.text("Humidity: ${currentCityHumidity}%");
            currentConditionsEl.append(currentHumidityEl);

            var currentCityUv = data.current.uvi;
            var currentUvEl = $("<p>");
            var currentUvSpanEl = $("<span>");
            currentUvEl.append(currentUvSpanEl);
            currentUvSpanEl.text("UV: ${currentCityUv}");

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
                var date;
                var temp;
                var icon;
                var humidity;

                date = data.daily[i].dt;
                date = dayjs().get('date').format('MM/DD/YYYY');
                temp = data.daily[i].temp.day;
                icon = data.daily[i].weather[0].icon;
                wind = data.daily[i].wind_speed;
                humidity = data.daily[i].humidity;

                var card = document.createElement("div");
                card.classList.add("card", "col-2", "m-1", "bg-primary", "text-white");

                var cardBody = document.createElement("div");
                cardBody.classList.add("card-body");
                cardBody.innerHTML = "<h6>${date}</h6><img src='http://openweathermap.org/img/wn${icon}.png></><br>${temp}°F<br>${wind} MPH<br>${humidity}%"
                card.appendChild(cardBody);
                fiveDayForecastEl.append(card);
            }
        })
    return;
}

