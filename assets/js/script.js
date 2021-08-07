$(document).ready(function () {
  var inputValue = "";
  var appId = "4ac85294a1cca26751b7ff12a8b24f89";

  $("#currentDate").text(moment().format("MMMM DD, YYYY"));

  var cityLocalStorage = JSON.parse(localStorage.getItem("cityLocalStorage")) || [];

  cityLocalStorage.forEach(function (city) {
    $("#list-city").prepend(
      `<li class="list-group-item previousSearch") ">${city}</li>`
    );
  });

  doAjaxCall(cityLocalStorage[cityLocalStorage.length - 1], false);

  function doAjaxCall(text, newSearch) {
    $("#weatherResults").html("");

    $.ajax({
      type: "GET",
      url: `https://api.openweathermap.org/data/2.5/weather?q=${text}&appid=4ac85294a1cca26751b7ff12a8b24f89`,
      dataType: "json",
    }).then(function (res) {
      console.log(res);
      var cityName = res.name;

      if (newSearch) {
        cityLocalStorage.push(cityName);
        window.localStorage.setItem("cityLocalStorage", JSON.stringify(cityLocalStorage));

        if (cityLocalStorage != null) {
          `<li class="btn list-group-item"
        ) ">${cityName}</li>`;
        }

        $("#list-city").prepend(
          `<li class="list-group-item previousSearch") ">${cityName}</li>`
        );
      }

      $.ajax({
        type: "GET",
        url: `https://api.openweathermap.org/data/2.5/onecall?lat=${res.coord.lat}&lon=${res.coord.lon}&appid=4ac85294a1cca26751b7ff12a8b24f89`,
        dataTye: "json",
      }).then(function (res) {
        console.log(res);
        var uvIndex = res.current.uvi;

        $("#weatherResults").append(
          `<div class="ml-3 mb-3">
          <div class="card-body">
          <h4>${cityName} <img src="https://openweathermap.org/img/wn/${
            res.current.weather[0].icon
          }@2x.png" alt=""></h4>
          <p>Temperature: ${(
            (res.current.temp - 273.15) * (9 / 5) +
            32
          ).toFixed(0)} °F</p>
          <p>Humidity: ${res.current.humidity}%</p>
          <p>Wind Speed: ${res.current.wind_speed} MPH</p>
          <p>UV Index: <span class = "uvIndexColor">${uvIndex}</span></p>
          <br>
          <h4>Five Day Forecast:<h4>
          <div class="row" id="fiveDay">`
        );

        for (var i = 1; i < 6; i++) {
          $("#fiveDay").append(
            `<div class="card">
              <div class="card-body bg-primary text-light">
              <p class="card-text">${new Date(
                res.daily[i].dt * 1000
              ).toLocaleDateString()}</p>
              <p><img src="https://openweathermap.org/img/wn/${
                res.daily[i].weather[0].icon
              }@2x.png"/></p>
              <p class="card-text">Daily high temp:
              ${((res.daily[i].temp.max - 273.15) * (9 / 5) + 32).toFixed(
                0
              )}°F</p>
              <p class="card-text">Daily low temp:
              ${((res.daily[i].temp.min - 273.15) * (9 / 5) + 32).toFixed(
                0
              )}°F</p>
            <p class="card-text">Humidity: ${res.daily[i].humidity}%</p>
            </div>
            </div>`
          );
        }
      });
    });
  }

  $("#searchBtn").on("click", function (e) {
    e.preventDefault();
    inputValue = $("#inputValue").val();
    $("#inputValue").val("");
    console.log(inputValue);
    doAjaxCall(inputValue, true);
  });

  $(document).on("click", ".previousSearch", function () {
    $("#weatherResults").html("");
    var text = $(this).text();
    console.log(text);
    doAjaxCall(text, false);
  });
});
