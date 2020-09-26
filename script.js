var searchBtn = document.getElementById("search-button");
var cityCache = document.getElementById("search-bar");
var valid_input = true;

const searchedCities = {};
// add each city's data into local storage
// add event Listener for each button with class "city-button"
// pull from local storage to repopulate the page 

function fetchAJAX(cityName) {
    const scale = "metric";
    const apiKey = "ff97cd2016a7d31a541fa1023beaf384";
    const queryURL = `https://api.openweathermap.org/data/2.5/weather?q=${cityName}&units=${scale}&appid=${apiKey}`;


    const forecastURL = `https://api.openweathermap.org/data/2.5/forecast?q=${cityName}&units=${scale}&appid=${apiKey}`;

    var date = moment().format("L");

    // current weather conditions for one city
    $.ajax({
        url: queryURL,
        method: "GET"
    })
    // on success
    .then(function(response) {
        const lon = response.coord.lon;
        const lat = response.coord.lat;
        //displays city name, date & weather icon
        $(".city").html("<h1>" + response.name + "</h1>");
        $(".date").html("<h2>" + date + "</h2>");

        let response_description = response.weather[0].description;
        let description = response_description[0].toUpperCase();
        for(let i = 1; i < response_description.length; i++) {
            if (response_description[i - 1] === " ") {
                description += response_description[i].toUpperCase();
            } else {
                description += response_description[i];
            }
        }
        console.log(description);
        $(".description").text(description);
        $("#icon").empty();
        var iconcode = response.weather[0].icon;
        console.log(response);
        var iconurl = "http://openweathermap.org/img/wn/" + iconcode + "@2x.png";
        var icon = document.createElement("img");
        icon.setAttribute('src', iconurl);
        $("#icon").append(icon);
        
        //displays wind speed
        $(".wind").text("Wind Speed: " + response.wind.speed + " kph");
        
        //humidity %
        $(".humidity").text("Humidity: " + response.main.humidity + "%");
        
        //temperature
        $(".temp").text("Temperature: " + response.main.temp + " °C");
        
        const UVurl = `http://api.openweathermap.org/data/2.5/uvi?appid=${apiKey}&lat=${lat}&lon=${lon}`;
        //  jQuery AJAX call to weatherAPI for UV index
        $.ajax({
            url: UVurl,
            method: "GET"
        })
        .then(function(response) {
            $(".uvIndex").text("UV Index: " + response.value);
        });
    })

    // on error
    .fail(function() {
        alert("please enter a valid city name");
        valid_input = false;
    });

    // 5 day forecast for one city AJAX call
    $.ajax({
        url: forecastURL,
        method: "GET"
    })
        .then(function(response) {
            // console.log(response);
            $(".forecast-header").text("5 Day Forecast");
            var forecastBox = $(".forecast-row");
            forecastBox.empty();

            for (let i=0; i<40; i=i+8) {
                var box = $("<div>");
                box.attr("class", "tile rounded");

                var dateArr = response.list[i].dt_txt.split(" ");
                var dateBW = dateArr[0].split("-");
                var date = $("<p>");
                date.text(`${dateBW[1]}/${dateBW[2]}`);
                box.append(date);

                var iconCode = response.list[i].weather[0].icon;
                var iconURL = "http://openweathermap.org/img/wn/" + iconCode + ".png";
                var icon = $("<img>");
                icon.attr("src", iconURL);
                box.append(icon);

                var temp = $("<p>");
                temp.text(response.list[i].main.temp + " °C")
                box.append(temp);

                var humid = $("<p>");
                humid.text(response.list[i].main.humidity + "%");
                box.append(humid);

                forecastBox.append(box);
            }
        });
}

searchBtn.addEventListener("click", function(event) {
    event.preventDefault();
    // grabs user input city
    var city = document.getElementById("search").value.trim();

    // need to add some type of async/await functionality in order to check API
    // do not want to add saved city if invalid input
    fetchAJAX(city);
    if (!searchedCities[city]) {
        searchedCities[city] = true;
        var searchedCity = document.createElement("button");
        searchedCity.setAttribute("type", "button");
        searchedCity.setAttribute("class", "btn btn-info");
        searchedCity.textContent = city;
        cityCache.appendChild(searchedCity);
        searchedCity.addEventListener("click", function(event) {
            event.preventDefault();
            const city = searchedCity.textContent;
            fetchAJAX(city);
        })
    }
});