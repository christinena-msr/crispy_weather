var city = document.getElementById("search").value;

const cityName = "seattle";
const scale = "metric";
const lat = "47.61";
const lon = "-122.33";
const apiKey = "ff97cd2016a7d31a541fa1023beaf384";
const queryURL = `https://api.openweathermap.org/data/2.5/weather?q=${cityName}&units=${scale}&appid=${apiKey}`;

const UVurl = `http://api.openweathermap.org/data/2.5/uvi?appid=${apiKey}&lat=${lat}&lon=${lon}`;

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
        $(".city").html("<h1>" + response.name + " (" + date + ")</h1>");
        //pulled code from stack overflow
        var iconcode = response.weather[0].icon;
        var iconurl = "http://openweathermap.org/img/w/" + iconcode + ".png";
        $('#wicon').attr('src', iconurl);
        $(".wind").text("Wind Speed: " + response.wind.speed);
        $(".humidity").text("Humidity: " + response.main.humidity);
        $(".temp").text("Temperature (F) " + response.main.temp);

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