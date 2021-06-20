mapboxgl.accessToken =
  "pk.eyJ1IjoianVibW4iLCJhIjoiY2twcGMyZHZlMDBrbjJ2bzFoa2F0Zml4diJ9.SMLkdOXnlGGXssJ1sqpZ9w";

// Initialate map
var map = new mapboxgl.Map({
  container: "map",
  style: "mapbox://styles/jubmn/ckppcvjoq0u2v17qui59fk6eq",
  center: [4.9041, 52.3676],
  zoom: 10,
});

function getAPIdata() {
  // construct request
  var city = document.getElementById("cityNameInput").value;
  var request =
    "https://api.openweathermap.org/data/2.5/weather?appid=b1fa3d2f35e9c04f28d02e585aa1389a&q=" +
    city;

  // get current weather
  fetch(request)
    // response to JSON format
    .then(function (response) {
      if (!response.ok) {
        throw Error(response.statusText);
      }
      return response.json();
    })

    // do something with response
    .then(function (response) {
      // console.log(response);

      map.flyTo({
        center: [response.coord.lon, response.coord.lat],
        zoom: 11,
        essential: true,
        speed: 0.85,
        easing: function (t) {
          return t;
        },
      });
      //Change weather parameters
      document.getElementById("cityName").innerHTML =
        "City: <span>" + response.name + "</span>";
      document.getElementById("temp").innerHTML =
        "Temperature: <span>" +
        Math.floor(response.main.temp - 273.15) +
        " °C </span>";
      document.getElementById("humidity").innerHTML =
        "Humidity: <span>" + response.main.humidity + " % </span>";
      document.getElementById("visibility").innerHTML =
        "Weather conditions: <span>" +
        response.weather[0].description +
        "<span>";

      var landingAdvice = document.getElementById("landingAdvice");
      var enableLandingButton = document.getElementById("enableLanding");

      //Landing advice based on Visibility parameters
      if (response.weather[0].description === "clear sky") {
        landingAdvice.innerHTML =
          "The sky is clear, this is a great spot to land!";
        enableLandingButton.disabled = false;
        enableLandingButton.classList.remove("faded_button");
        landingAdvice.classList.remove("advise_red");
      } else {
        landingAdvice.innerHTML =
          "Sky is not fully clear, better to find another spot";
        enableLandingButton.disabled = true;
        enableLandingButton.classList.add("faded_button");
        landingAdvice.classList.add("advise_red");
      }
    })

    //error if city is incorrect
    .catch(function () {
      alert("Please insert correct city");
    });
}

document.getElementById("checkWeather").onclick = function () {
  getAPIdata();
};

//start landing and countdown if landing button is pressed
document.getElementById("enableLanding").onclick = function () {
  var timeLeft = 30;
  var timer = setInterval(countdown, 1000);
  document.getElementById("enableLanding").disabled = true;

  function countdown() {
    //stop countdown after 0 and give a message "landed"
    if (timeLeft < 0) {
      clearTimeout(timer);
      document.getElementById("landingAdvice").innerHTML =
        "You successfully landed! Welcome to " +
        document.getElementById("cityNameInput").value;
      document.getElementById("enableLanding").value = "You landed!";
    }

    //continue countdown
    else {
      document.getElementById("landingAdvice").innerHTML =
        "Landing started. " + timeLeft + " seconds till landing";
      document.getElementById("enableLanding").value = "Landing...";
      timeLeft--;
      zoom -= 0.5;
    }
  }
};
