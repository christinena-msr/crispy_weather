var city = document.getElementById("search").value;

const cityName = "seattle";
const scale = "metric";
// seattle's lat & lon
const lat = "47.61";
const lon = "-122.33";
const apiKey = "ff97cd2016a7d31a541fa1023beaf384";
const queryURL = `https://api.openweathermap.org/data/2.5/weather?q=${cityName}&units=${scale}&appid=${apiKey}`;

const UVurl = `http://api.openweathermap.org/data/2.5/uvi?appid=${apiKey}&lat=${lat}&lon=${lon}`;

const cnt = "5";

const forecastURL = `https://api.openweathermap.org/data/2.5/forecast?q=${cityName}&units=${scale}&appid=${apiKey}`;

// var today = Date.prototype.getDate();
var date = moment().format("L");

$.ajax({
    url: queryURL,
    method: "GET"
})
    .then(function(response) {
        console.log(date);
        console.log(queryURL);
        console.log(response);
        //displays city name, date & weather icon
        var col = $(".current");
        col.attr("class", "col-sm-12");
        $(".city").html("<h1>" + response.name + " (" + date + ")</h1>");
        //pulled code from stack overflow
        var iconcode = response.weather[0].icon;
        var iconurl = "http://openweathermap.org/img/w/" + iconcode + ".png";
        $('#wicon').attr('src', iconurl);
        //displays wind speed
        $(".wind").text("Wind Speed: " + response.wind.speed);
        //humidity %
        $(".humidity").text("Humidity: " + response.main.humidity);
        //temperature
        $(".temp").text("Temperature: " + response.main.temp + " C");
        //  jQuery AJAX call to weatherAPI
        $.ajax({
            url: UVurl,
            method: "GET"
        })
            .then(function(response) {
                console.log(UVurl);
                console.log(response);
                $(".uvIndex").text("UV Index: " + response.value);
            });
});

$.ajax({
    url: forecastURL,
    method: "GET"
})
    .then(function(response) {
        console.log(response);
        for (let i=0; i<40; i=i+8) {
            console.log(i);
            var forecastBox = $(".forecast");
            var box = $("<div>");
            box.attr("class", "col-sm-2");
            var dateArr = response.list[0].dt_txt.split(" ");
            console.log(dateArr);
            var dateBW = dateArr[0].split("-");
            console.log(dateBW);
            var date = $("<p>");
            date.text(`${dateBW[1]}/${dateBW[2]}/${dateBW[0]}`);
            box.append(date);
            var iconCode = response.list[i].weather[0].icon;
            var iconURL = "http://openweathermap.org/img/w/" + iconCode + ".png";
            var icon = $("<img>");
            icon.attr("src", iconURL);
            box.append(icon);
            var temp = $("<p>");
            temp.text("Temperature: " + response.list[i].main.temp + " C")
            box.append(temp);
            var humid = $("<p>");
            humid.text("Humidity: " + response.list[i].main.humidity + "%");
            box.append(humid);
            forecastBox.append(box);
        }
    });