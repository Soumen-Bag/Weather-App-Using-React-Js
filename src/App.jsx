import { useEffect, useState } from "react";
import reactLogo from "./assets/react.svg";
import viteLogo from "/vite.svg";
import "./App.css";
import axios from "axios";
import clearImage from "./assets/clear.jpg";
import rainImage from "./assets/rain.jpg";
import snowImage from "./assets/snow.jpg";
import cloudImage from "./assets/cloudy.jpg";
import hazeImage from "./assets/haze.jpg";

function App() {
  const [city, setCity] = useState("");
  const [weather, setWeather] = useState(null);
  const [date, setDate] = useState("");
  const [error, setError] = useState("");
  const apiKey = "50bb17463008c267cf34640dccc91089";

  //detch search weather data
  const fetchData = async () => {
    if (!city) return;
    try {
      const response = axios.get(
        `https://api.openweathermap.org/data/2.5/weather?q=${city}&units=metric&appid=${apiKey}`
      );
      setWeather((await response).data);
      console.log((await response).data);
    } catch (err) {
      setWeather(null);
      console.error(err);
    }
  };
  const handelSearch = (e) => {
    e.preventDefault();
    fetchData();
    setCity("");
  };

  //fetch current location weather
  const fetchDataCurrentLocation = async (lat, lon) => {
    try {
      const response = await axios.get(
        `https://api.openweathermap.org/data/2.5/weather?lat=${lat}&lon=${lon}&units=metric&appid=${apiKey}`
      );
      setWeather(response.data);
      console.log(response.data);
      // setError
    } catch (err) {
      alert("Unable to fetch weather data for your location.");
    }
  };
  useEffect(() => {
    //get current locations latitude longitude
    const getCurrentLocation = () => {
      if (navigator.geolocation) {
        navigator.geolocation.getCurrentPosition(
          (position) => {
            const { latitude, longitude } = position.coords;
            fetchDataCurrentLocation(latitude, longitude);
          },
          (err) => {
            alert("Please enable location access to get current weather.");
          }
        );
      } else {
        alert("Geolocation is not supported by your browser.");
      }
    };
    getCurrentLocation();
  }, []);

  useEffect(() => {
    setInterval(() => {
      const newDate = new Date();
      setDate(
        `${newDate.toLocaleDateString()} ${newDate.toLocaleTimeString()}`
      );
    }, 1000);
  }, []);

  // Determine background image based on weather condition
  const getBackgroundImage = () => {
    if (!weather) return "";
    const weatherMain = weather.weather[0].main.toLowerCase();
    switch (weatherMain) {
      case "clear":
        return `url(${clearImage})`;
      case "clouds":
        return `url(${cloudImage})`;
      case "rain":
        return `url(${rainImage})`;
      case "snow":
        return `url(${snowImage})`;
      // case "thunderstorm":
      //   return "url('https://example.com/thunderstorm.jpg')";
      // case "mist":
      case "fog":
        return `url(${hazeImage})`;
      case "haze":
        return `url(${hazeImage})`;
      default:
        return "linear-gradient(150deg, rgb(114, 129, 141), rgb(85, 89, 128))";
    }
  };
  return (
    <div
      className="main"
      style={{
        backgroundImage: getBackgroundImage(),
        backgroundSize: "cover",
        backgroundPosition: "center",
        opacity: "0.9",
        transition: "background 0.5s ease-in-out",
      }}
    >
      <div>
        <h1 className="title">Weather App</h1>
      </div>
      <form onSubmit={handelSearch} className="from">
        <input
          className="input"
          placeholder="Enter the city"
          value={city}
          onChange={(e) => setCity(e.target.value)}
        />
        <button type="submit" className="search-btn">
          Submit
        </button>
      </form>
      {weather && (
        <div className="weather-container">
          <h2 className="city-name">{weather?.name}</h2>
          <h3 className="date-time">{date}</h3>
          <div className="temp-image-div">
            <div>
              <h2>{Math.floor(weather?.main.temp)}°C</h2>
              <p>Feeels Like: {weather?.main.feels_like}°C</p>
            </div>
            <div>
              <img
                src={`https://openweathermap.org/img/wn/${weather?.weather[0].icon}@2x.png`}
                alt={weather?.weather[0].description}
              />
              <p>{weather?.weather[0].description}</p>
            </div>
          </div>
          <div className="additional-details">
            <div>
              <p>
                Sunrise:{" "}
                {new Date(weather?.sys.sunrise * 1000).toLocaleTimeString()}
              </p>
              <p>
                Sunset:{" "}
                {new Date(weather?.sys.sunset * 1000).toLocaleTimeString()}
              </p>
            </div>
            <div>
              <p>Humidity: {weather?.main.humidity}%</p>
              <p>Wind Speed: {weather?.wind.speed} m/s</p>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}

export default App;
