import React, { useState } from 'react';

const WeatherData = ({ theme }) => {
  const apiKey = "e935c09c00e2825fb6012b95ef0fe7f4";
  const [weather, setWeather] = useState(null);
  const [city, setCity] = useState("");
  const [searchQuery, setSearchQuery] = useState("");
  const [suggestions, setSuggestions] = useState([]);

  const fetchWeatherData = async (cityName) => {
    if (!cityName) return;

    try {
      const response = await fetch(
        `https://api.openweathermap.org/data/2.5/weather?q=${cityName}&appid=${apiKey}&units=metric`
      );
      const data = await response.json();
      setWeather(data);
    } catch (error) {
      console.error("Error fetching weather data:", error);
    }
  };

  const fetchCitySuggestions = async (query) => {
    try {
      const response = await fetch(
        `https://api.openweathermap.org/geo/1.0/direct?q=${query}&limit=5&appid=${apiKey}`
      );
      const data = await response.json();
      setSuggestions(data);
    } catch (error) {
      console.error("Error fetching city suggestions:", error);
    }
  };

  const handleSearch = () => {
    if (searchQuery) {
      setCity(searchQuery);
      fetchWeatherData(searchQuery);
      setSearchQuery("");
      setSuggestions([]);
    }
  };

  const handleInputChange = (e) => {
    const value = e.target.value;
    setSearchQuery(value);

    if (value) {
      fetchCitySuggestions(value);
    } else {
      setSuggestions([]);
    }
  };

  const handleSuggestionClick = (suggestedCity) => {
    const cityName = suggestedCity.name;
    setCity(cityName);
    setSearchQuery(cityName);
    setSuggestions([]);
    fetchWeatherData(cityName);
  };

  const handleGetCurrentLocation = () => {
    if (navigator.geolocation) {
      navigator.geolocation.getCurrentPosition(
        async (position) => {
          const { latitude, longitude } = position.coords;
          try {
            const response = await fetch(
              `https://api.openweathermap.org/data/2.5/weather?lat=${latitude}&lon=${longitude}&appid=${apiKey}&units=metric`
            );
            const data = await response.json();
            setWeather(data);
            setCity(`${data.name}, ${data.sys.country}`);
          } catch (error) {
            console.error("Error fetching weather data for current location:", error);
          }
        },
        (error) => {
          console.error("Error getting location:", error);
        }
      );
    } else {
      alert("Geolocation is not supported by this browser.");
    }
  };

  return (
    <div className={`m-4 md:m-8 font-sans ${theme === 'light' ? 'text-black' : 'text-white'}`}>
      {/* Search Input */}
      <div className="flex flex-col md:flex-row justify-center mb-6 gap-2">
        <input
          type="text"
          value={searchQuery}
          onChange={handleInputChange}
          placeholder="Search for a city..."
          className={`p-2 rounded-l-md border w-full md:w-72 ${theme === 'light' ? 'border-gray-300 bg-white' : 'border-gray-600 bg-gray-800'}`}
        />
        <button
          onClick={handleSearch}
          className={`p-2 rounded-md border ${theme === 'light' ? 'border-gray-300 bg-blue-500 text-white hover:bg-blue-600' : 'border-blue-500 bg-blue-600 text-white hover:bg-blue-700'}`}
        >
          Search
        </button>
      </div>

      {/* Get Current Location Button */}
      <div className="text-center mb-6">
        <button
          onClick={handleGetCurrentLocation}
          className={`p-2 rounded-md border ${theme === 'light' ? 'border-gray-300 bg-green-500 text-white hover:bg-green-600' : 'border-green-500 bg-green-600 text-white hover:bg-green-700'}`}
        >
          Use Current Location
        </button>
      </div>

      {/* Suggestions List */}
      {suggestions.length > 0 && (
        <ul className={`list-none p-0 text-center mx-auto max-w-md ${theme === 'light' ? 'bg-white' : 'bg-gray-800'}`}>
          {suggestions.map((suggestedCity, index) => (
            <li
              key={index}
              onClick={() => handleSuggestionClick(suggestedCity)}
              className={`p-2 border-b cursor-pointer ${theme === 'light' ? 'border-gray-300 hover:bg-gray-200' : 'border-gray-700 bg-gray-900 hover:bg-gray-700'}`}
            >
              {suggestedCity.name}, {suggestedCity.country}
            </li>
          ))}
        </ul>
      )}

      {/* Weather Information */}
      {weather && weather.main && (
        <div className="flex flex-col md:flex-row justify-center mt-6 space-y-4 md:space-y-0 md:space-x-4">
          {/* Weather Box */}
          <div className={`flex flex-col items-center p-4 border rounded-lg shadow-md ${theme === 'light' ? 'border-gray-300 bg-white' : 'border-gray-700 bg-gray-900'}`}>
            <p className="text-xl md:text-2xl font-bold mb-2">{weather.name}</p>
            <p className="text-lg md:text-xl">Temperature: {weather.main.temp}°C</p>
            <p className="text-base md:text-lg">Weather: {weather.weather[0].description}</p>
            <p className="text-base md:text-lg">Humidity: {weather.main.humidity}%</p>
            <p className="text-base md:text-lg">Wind Speed: {weather.wind.speed} m/s</p>
          </div>

          {/* Weather Icon Box */}
          <div className={`flex items-center p-4 border rounded-lg shadow-md ${theme === 'light' ? 'border-gray-300 bg-white' : 'border-gray-700 bg-gray-900'}`}>
            <img
              src={`https://openweathermap.org/img/wn/${weather.weather[0].icon}.png`}
              alt={weather.weather[0].description}
              className="w-24 h-24 md:w-32 md:h-32"
            />
          </div>
        </div>
      )}

      {/* No Weather Data Yet */}
      {!weather && (
        <p className={`text-center mt-6 italic ${theme === 'light' ? 'text-black' : 'text-white'}`}>
          Please enter a city to get weather data.
        </p>
      )}
    </div>
  );
};

export default WeatherData;
