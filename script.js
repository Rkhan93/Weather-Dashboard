var todayEl = moment().format('MM/DD/YYYY')

// Major Cities that show up 
var cityList = ["Dallas", "Los Angeles", "Miami", "Chicago", "New York City"]

//Adding Cities on the side
function addCities() {

    // empties previously added cities
    $("#cities").empty();

    // Looping through the array of cities
    for (var i = 0; i < cityList.length; i++) {

        // Then dynamicaly generating buttons for each city in the array.
        var a = $("<row>");
        // Adding a class
        a.addClass("city-btn btn btn-outline-secondary");
        // Adding a data-attribute with a value of the city at index i
        a.attr("data-name", cityList[i]);
        // Providing the button's text with a value of the city at index i
        a.text(cityList[i]);
        // Adding the button to the HTML
        $("#cities").append(a);
    }
}

addCities()

$("#search-button").on("click", function (event) {
   
    event.preventDefault();
   
    var city = $("input").val().trim();
    
    cityList.push(city);
   
    addCities();

});

//get data from openweather 
var getCity = function () {
    var city = $(this).attr("data-name");
    var coordURL = "https://api.openweathermap.org/data/2.5/weather?&units=imperial&appid=88f3ebac0aabaa0bea9e67e3203ea958&q=" + city;
    $("#forecast").empty()
    // Creating an AJAX call
    $.ajax({
        url: coordURL,
        method: "GET"
    }).then(function (response) {
        console.log(response)
        var showCity = response.name;
        var icon = "https://openweathermap.org/img/wn/" + response.weather[0].icon + ".png";
        var showIcon = $("<img>").attr("src", icon);
        console.log("City: " + response.name);
        console.log("icon: " + response.weather[0].icon)
        $("#city").text(showCity + " " + todayEl);
        $("#city").append(showIcon)


        var lonlat = "&lat=" + response.coord.lat + "&lon=" + response.coord.lon
        console.log(lonlat)
        var queryURL = "https://api.openweathermap.org/data/2.5/onecall?&units=imperial&appid=88f3ebac0aabaa0bea9e67e3203ea958&q=" + lonlat;

        $.ajax({
            url: queryURL,
            method: "GET"
        }).then(function (response) {
            console.log(response);
            //weather results
            $("#temp").text("Temperature: " + response.current.feels_like) + "F";
            $("#humid").text("Humidity: " + response.current.humidity + "%");
            $("#wind").text("Wind Speed: " + response.current.wind_speed + " mph");


            // UV Index
            var UVIndex = response.current.uvi
            $("#uvIndex").text("UV Index: " + UVIndex)

            function addForecast() {

                var days = response.daily
                // Looping through array of cities
                for (var i = 1; i < 6; i++) {
                    console.log(response.daily.length)
                    //var to create a div
                    var a = $("<div>");
                    //format into MM/DD/YYY
                    var unix = response.daily[i].dt
                    var dates = moment.unix(unix).format('MM/DD/YYYY')
                    //gets value into image
                    var icon = "https://openweathermap.org/img/wn/" + response.daily[i].weather[0].icon + ".png";
                    var showIcon = $("<img>").attr("src", icon);
                    //temperature data
                    var temp = response.daily[i].feels_like.day
                    var fTemp = "Temp: " + temp + " F"
                    //humidity data
                    var humid = response.daily[i].humidity
                    var fHumid = "Humidity: " + humid + "%"
                    console.log(dates)
                    a.addClass("col-2");
                    
                    a.text(dates);
                    a.append(showIcon);
                    a.append(fTemp);
                    a.append(" " + fHumid);
                    $("#forecast").append(a);
                }
            }
            addForecast()
        })

    });
};

$(document).on("click", ".city-btn", getCity);