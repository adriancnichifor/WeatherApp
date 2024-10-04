document
  .querySelector(".get-weather-btn")
  .addEventListener("click", getWeather);
document
  .querySelector(".city-input")
  .addEventListener("keydown", function (event) {
    if (event.key === "Enter") {
      getWeather();
    }
  });

async function getWeather(city = null) {
  const cityInput = document.querySelector(".city-input").value;
  const cityName = city || cityInput || "Bucharest";
  const apiKey = "e4aac7067992715018a24b34af12ae27";
  const urlCurrent = `https://api.openweathermap.org/data/2.5/weather?q=${cityName}&appid=${apiKey}&units=metric`;
  const urlForecast = `https://api.openweathermap.org/data/2.5/forecast?q=${cityName}&appid=${apiKey}&units=metric`;

  try {
    // Current weather
    const responseCurrent = await fetch(urlCurrent);
    const dataCurrent = await responseCurrent.json();

    if (dataCurrent.cod === 200) {
      const temperature = Math.round(dataCurrent.main.temp);
      const icon = dataCurrent.weather[0].icon;
      const iconUrl = `http://openweathermap.org/img/wn/${icon}@2x.png`;
      const weather = `
      <div id="clock" class=a"clock"></div>
                <h2 class="city">${dataCurrent.name}, ${
        dataCurrent.sys.country
      }</h2>
      <div class="row">
                <h3 class="description">${
                  dataCurrent.weather[0].description
                } </h3>
                <img class="icon" src="${iconUrl}" alt="${
        dataCurrent.weather[0].description
      }">
      </div>
                <p class="temp">Temperature: ${temperature}°C </p>
                <p class"humidity">Humidity: ${Math.round(
                  dataCurrent.main.humidity
                )}%</p>
                <p class"wind">Wind Speed: ${Math.round(
                  dataCurrent.wind.speed
                )} m/s</p>
            `;
      document.querySelector(".weather-container").innerHTML = weather;

      // Clock
      function showTime() {
        var date = new Date();
        var h = date.getHours(); // 0 - 23
        var m = date.getMinutes(); // 0 - 59
        var s = date.getSeconds(); // 0 - 59

        m = m < 10 ? "0" + m : m;
        s = s < 10 ? "0" + s : s;

        var time = h + ":" + m + ":" + s;
        document.getElementById("clock").innerText = time;
        document.getElementById("clock").textContent = time;

        setTimeout(showTime, 1000);
      }
      showTime();

      //change background
      const weatherDescription = dataCurrent.weather[0].main.toLowerCase();
      changeBackground(weatherDescription);
    } else {
      document.querySelector(
        ".weather-container"
      ).innerHTML = `<h2>Please check the location name</h2>`;
    }

    // Forecast weather
    const responseForecast = await fetch(urlForecast);
    const dataForecast = await responseForecast.json();

    if (dataForecast.cod === "200") {
      const forecastHeader = document.querySelector(".forecast-header");
      const descRow = document.querySelector(".desc-row");
      const tempRow = document.querySelector(".temp-row");
      const humidityRow = document.querySelector(".humidity-row");
      const windRow = document.querySelector(".wind-row");

      forecastHeader.innerHTML = "<th>Detail</th>";
      descRow.innerHTML = "<td>Description</td>";
      tempRow.innerHTML = "<td>Temperature</td>";
      humidityRow.innerHTML = "<td>Humidity</td>";
      windRow.innerHTML = "<td>Wind Speed</td>";

      const days = {};

      dataForecast.list.forEach((forecast) => {
        const date = new Date(forecast.dt * 1000);
        const formattedDate = `${date.getDate()}/${
          date.getMonth() + 1
        }/${date.getFullYear()}`;
        if (!days[formattedDate]) {
          days[formattedDate] = {
            description: forecast.weather[0].description,
            temp: Math.round(forecast.main.temp),
            humidity: Math.round(forecast.main.humidity),
            wind: Math.round(forecast.wind.speed),
          };
        }
      });

      for (const [date, values] of Object.entries(days)) {
        forecastHeader.innerHTML += `<th>${date}</th>`;
        descRow.innerHTML += `<td>${values.description}</td>`;
        tempRow.innerHTML += `<td>${values.temp}°C</td>`;
        humidityRow.innerHTML += `<td>${values.humidity}%</td>`;
        windRow.innerHTML += `<td>${values.wind} m/s</td>`;
      }
    } else {
      document.querySelector(
        ".weather-result"
      ).innerHTML = `<p>${dataForecast.message}</p>`;
    }
  } catch (error) {
    console.error("Error fetching weather data:", error);
    document.querySelector(
      ".weather-result"
    ).innerHTML = `<p>Error fetching weather data</p>`;
  }
}

function changeBackground(weatherDescription) {
  let imageUrl = "";
  switch (weatherDescription) {
    case "clear":
      imageUrl = "images/clear.jpg";
      break;
    case "clouds":
      imageUrl = "images/clouds.jpg";
      break;
    case "rain":
      imageUrl = "images/rain.jpg";
      break;
    case "drizzle":
      imageUrl = "images/drizzle.jpg";
      break;
    case "thunderstorm":
      imageUrl = "images/thunderstorm.jpg";
      break;
    case "snow":
      imageUrl = "images/snow.jpg";
      break;
    case "mist":
    case "fog":
    case "haze":
      imageUrl = "images/mist.jpg";
      break;
    default:
      imageUrl = "images/other.jpg";
  }
  document.body.style.backgroundImage = `url('${imageUrl}')`;
}

window.onload = function () {
  getWeather("Bucharest");
};
