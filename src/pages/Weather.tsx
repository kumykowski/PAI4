import { useState, useEffect } from "react";
import { useParams } from "react-router-dom";
import Player from "lottie-react";
import { useForm } from "react-hook-form";
import animationData from "../assets/loading.json";
import { countries } from "../constants/countries";
import { MdMyLocation } from 'react-icons/md';
import { 
  WiDaySunny, 
  WiCloud, 
  WiRain, 
  WiSnow, 
  WiThunderstorm, 
  WiDust,
  WiCloudy,
  WiDayCloudyHigh,
  WiFog,
  WiNightClear,
  WiNightAltCloudy,
  WiNightAltRain,
  WiNightAltSnow,
  WiNightAltThunderstorm,
  WiNightFog,
  WiNightAltCloudyHigh
} from 'react-icons/wi';

type FormData = {
  city: string;
  country: string;
  lat: string;
  lon: string;
  useCoordinates: boolean;
};

const isNightTime = (dt: number, sunrise: number, sunset: number) => {
  return dt < sunrise || dt > sunset;
};

const getWeatherIcon = (weatherCode: string, dt?: number, sunrise?: number, sunset?: number) => {
  const isNight = dt && sunrise && sunset ? isNightTime(dt, sunrise, sunset) : false;
  
  const icons: { [key: string]: { day: JSX.Element; night: JSX.Element } } = {
    'clear sky': {
      day: <WiDaySunny className="text-4xl text-yellow-400" />,
      night: <WiNightClear className="text-4xl text-gray-200" />
    },
    'few clouds': {
      day: <WiDayCloudyHigh className="text-4xl text-gray-300" />,
      night: <WiNightAltCloudyHigh className="text-4xl text-gray-300" />
    },
    'scattered clouds': {
      day: <WiCloud className="text-4xl text-gray-400" />,
      night: <WiNightAltCloudy className="text-4xl text-gray-400" />
    },
    'broken clouds': {
      day: <WiCloudy className="text-4xl text-gray-500" />,
      night: <WiNightAltCloudy className="text-4xl text-gray-500" />
    },
    'shower rain': {
      day: <WiRain className="text-4xl text-blue-400" />,
      night: <WiNightAltRain className="text-4xl text-blue-400" />
    },
    'rain': {
      day: <WiRain className="text-4xl text-blue-500" />,
      night: <WiNightAltRain className="text-4xl text-blue-500" />
    },
    'thunderstorm': {
      day: <WiThunderstorm className="text-4xl text-yellow-600" />,
      night: <WiNightAltThunderstorm className="text-4xl text-yellow-600" />
    },
    'snow': {
      day: <WiSnow className="text-4xl text-white" />,
      night: <WiNightAltSnow className="text-4xl text-white" />
    },
    'mist': {
      day: <WiFog className="text-4xl text-gray-400" />,
      night: <WiNightFog className="text-4xl text-gray-400" />
    },
    'overcast clouds': {
      day: <WiCloudy className="text-4xl text-gray-600" />,
      night: <WiNightAltCloudy className="text-4xl text-gray-600" />
    }
  };
  
  const iconSet = icons[weatherCode.toLowerCase()] || icons['clear sky'];
  return isNight ? iconSet.night : iconSet.day;
};

export const WeatherPage = () => {
  const { city } = useParams<{ city: string }>();
  const [cityName, setCityName] = useState<string>("Unknown");
  const [country, setCountry] = useState<string>("Unknown");
  const [weatherData, setWeatherData] = useState<any>(null);
  const [loading, setLoading] = useState<boolean>(false);
  const [error, setError] = useState<string | null>(null);

  const { register, handleSubmit, watch, setValue } = useForm<FormData>({
    defaultValues: {
      city: city || "",
      country: "",
      lat: "",
      lon: "",
      useCoordinates: false,
    },
  });

  const watchUseCoordinates = watch("useCoordinates");

  useEffect(() => {
    if (city) {
      fetchCityCoords(city, "");
    }
  }, [city]);

  useEffect(() => {
    if (watchUseCoordinates) {
      setValue("city", "");
      setValue("country", "");
    } else {
      setValue("lat", "");
      setValue("lon", "");
    }
  }, [watchUseCoordinates, setValue]);

  const fetchCityNameByCoords = async (latitude: string, longitude: string) => {
    try {
      const geoResponse = await fetch(
        `https://api.openweathermap.org/geo/1.0/reverse?lat=${latitude}&lon=${longitude}&limit=1&appid=893f996d90a8bd90e8651621c3ffb805`
      );
      if (!geoResponse.ok) throw new Error("Failed to fetch city name");
      const geoData = await geoResponse.json();
      if (Array.isArray(geoData) && geoData.length > 0) {
        return { name: geoData[0].name, country: geoData[0].country || "Unknown" };
      } else {
        return null;
      }
    } catch {
      return null;
    }
  };

  const fetchWeatherByCoords = async (latitude: string, longitude: string) => {
    try {
      setLoading(true);
      setWeatherData(null);
      setError(null);
      const weatherResponse = await fetch(
        `https://api.openweathermap.org/data/3.0/onecall?lat=${latitude}&lon=${longitude}&units=metric&appid=893f996d90a8bd90e8651621c3ffb805`
      );
      if (!weatherResponse.ok) throw new Error("Failed to fetch weather data");
      const data = await weatherResponse.json();
      const cityInfo = await fetchCityNameByCoords(latitude, longitude);
      if (cityInfo) {
        setCityName(cityInfo.name);
        setCountry(cityInfo.country);
      } else {
        setCityName("Unknown location");
        setCountry("");
      }
      console.log(data)
      setWeatherData(data);
    } catch {
      setError("Failed to fetch weather data. Please try again.");
    } finally {
      setLoading(false);
    }
  };

  const fetchCityCoords = async (city: string, countryCode: string) => {
    try {
      setLoading(true);
      setWeatherData(null);
      setError(null);
      const geoResponse = await fetch(
        `https://api.openweathermap.org/geo/1.0/direct?q=${city}${countryCode ? `,${countryCode}` : ""}&limit=1&appid=893f996d90a8bd90e8651621c3ffb805`
      );
      if (!geoResponse.ok) throw new Error("Failed to fetch city coordinates");
      const geoData = await geoResponse.json();
      if (Array.isArray(geoData) && geoData.length > 0) {
        const { lat, lon, country } = geoData[0];
        setCityName(city);
        setCountry(country || "Unknown");
        fetchWeatherByCoords(String(lat), String(lon));
      } else {
        setError("No results found for the given city.");
        setLoading(false);
      }
    } catch {
      setError("Error fetching city coordinates. Please try again.");
      setLoading(false);
    }
  };

  const onSubmit = (data: FormData) => {
    if (data.useCoordinates) {
      if (data.lat.trim() && data.lon.trim()) {
        fetchWeatherByCoords(data.lat.trim(), data.lon.trim());
      } else {
        setError("Please enter valid coordinates.");
      }
    } else {
      if (data.city.trim()) {
        fetchCityCoords(data.city.trim(), data.country.trim());
      } else {
        setError("Please enter a valid city name.");
      }
    }
  };

  const fetchUserLocation = () => {
    if (!navigator.geolocation) {
      setError("Geolocation is not supported by this browser.");
      return;
    }
    setLoading(true);
    setError(null);
    navigator.geolocation.getCurrentPosition(
      (position) => {
        const { latitude, longitude } = position.coords;
        fetchWeatherByCoords(String(latitude), String(longitude));
      },
      () => {
        setError("Failed to get your location. Please allow location access.");
        setLoading(false);
      }
    );
  };

  return (
    <div className="min-h-screen pt-24 bg-slate-800 text-white flex flex-col items-center">
      <h1 className="text-4xl font-bold mb-4">Weather Finder</h1>
      <form onSubmit={handleSubmit(onSubmit)} className="mb-4 flex flex-col items-center gap-4">
        <label className="flex items-center gap-2">
          <input
            type="checkbox"
            className="w-4 h-4"
            {...register("useCoordinates")}
          />
          <span>Search by coordinates</span>
        </label>
        <input
          type="text"
          placeholder="Enter city name"
          className="px-4 py-2 rounded bg-slate-700 text-white outline-none w-full max-w-md"
          disabled={watchUseCoordinates}
          {...register("city")}
        />
        <select
          className="px-4 py-2 rounded bg-slate-700 text-white outline-none w-full max-w-md"
          disabled={watchUseCoordinates}
          {...register("country")}
        >
          <option value="">Select Country (Optional)</option>
          {countries.map((country) => (
            <option key={country.code} value={country.code}>
              {country.name} ({country.code})
            </option>
          ))}
        </select>
        <div className="flex gap-2 w-full max-w-md">
          <input
            type="text"
            placeholder="Latitude"
            className="px-4 py-2 rounded bg-slate-700 text-white outline-none w-1/2"
            disabled={!watchUseCoordinates}
            {...register("lat")}
          />
          <input
            type="text"
            placeholder="Longitude"
            className="px-4 py-2 rounded bg-slate-700 text-white outline-none w-1/2"
            disabled={!watchUseCoordinates}
            {...register("lon")}
          />
        </div>
        <div className="flex gap-4 mt-4">
          <button type="submit" className="px-4 py-2 rounded bg-logoYellow text-black font-semibold">
            Search
          </button>
          <button
            type="button"
            onClick={fetchUserLocation}
            className="w-12 h-12 flex items-center justify-center rounded-full bg-blue-500 text-white hover:bg-blue-600 shadow-lg"
          >
            <MdMyLocation size={24} />
          </button>
        </div>
      </form>
      {loading ? (
        <div className="flex flex-col items-center">
          <div className="w-40 h-40">
            <Player autoplay loop animationData={animationData} />
          </div>
          <p className="mt-2 text-lg">Loading...</p>
        </div>
      ) : weatherData && weatherData.current ? (
        <div className="w-full max-w-4xl">
          {/* Current Weather Section */}
          <div className="p-4 bg-slate-700 rounded-lg shadow-md mb-6">
            <p className="text-2xl font-semibold mb-2">
              City: {cityName} ({country})
            </p>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div>
                <div className="flex items-center gap-2">
                  <p className="text-2xl font-semibold">
                    {Math.floor(weatherData.current.temp)}°C
                  </p>
                  {getWeatherIcon(
                    weatherData.current.weather[0].description, 
                    weatherData.current.dt,
                    weatherData.current.sunrise,
                    weatherData.current.sunset
                  )}
                </div>
                <p className="text-lg">
                  Feels like: {Math.floor(weatherData.current.feels_like)}°C
                </p>
                <p className="text-lg capitalize">
                  {weatherData.current.weather[0].description}
                </p>
              </div>
              <div>
                <p className="text-lg">Humidity: {weatherData.current.humidity}%</p>
                <p className="text-lg">Wind Speed: {weatherData.current.wind_speed} m/s</p>
                <p className="text-lg">UV Index: {weatherData.current.uvi}</p>
              </div>
            </div>
          </div>

          {/* Hourly Forecast Section */}
          <h2 className="text-2xl font-bold mb-4">24-Hour Forecast</h2>
          <div className="overflow-x-auto mb-8">
            <div className="flex gap-4 pb-4">
              {weatherData.hourly.slice(0, 24).map((hour: any, index: number) => (
                <div key={index} className="flex-shrink-0 w-32 p-4 bg-slate-700 rounded-lg shadow-md">
                  <p className="font-semibold">
                    {new Date(hour.dt * 1000).toLocaleTimeString('en-US', {
                      hour: '2-digit',
                      minute: '2-digit',
                      hour12: false
                    })}
                  </p>
                  <div className="flex items-center justify-between my-2">
                    <p className="text-xl">{Math.floor(hour.temp)}°C</p>
                    {getWeatherIcon(
                      hour.weather[0].description,
                      hour.dt,
                      weatherData.current.sunrise,
                      weatherData.current.sunset
                    )}
                  </div>
                  <div className="mt-2 text-sm">
                    <p>Humidity: {hour.humidity}%</p>
                    <p>Wind: {hour.wind_speed} m/s</p>
                  </div>
                </div>
              ))}
            </div>
          </div>

        

          {/* 7-Day Forecast Section */}
          <h2 className="text-2xl font-bold mb-4">7-Day Forecast</h2>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
            {weatherData.daily.slice(1, 8).map((day: any, index: number) => (
              <div key={index} className="p-4 bg-slate-700 rounded-lg shadow-md">
                <p className="font-semibold">
                  {new Date(day.dt * 1000).toLocaleDateString('en-US', { weekday: 'short' })}
                </p>
                <div className="flex items-center justify-between my-2">
                  <p className="text-xl">
                    {Math.floor(day.temp.max)}°C / {Math.floor(day.temp.min)}°C
                  </p>
                  {getWeatherIcon(
                    day.weather[0].description,
                    day.dt,
                    day.sunrise,
                    day.sunset
                  )}
                </div>
                <p className="capitalize text-sm">
                  {day.weather[0].description}
                </p>
                <div className="mt-2 text-sm">
                  <p>Humidity: {day.humidity}%</p>
                  <p>Wind: {day.wind_speed} m/s</p>
                </div>
              </div>
            ))}
          </div>
        </div>
      ) : (
        error && <p className="text-lg text-red-500">{error}</p>
      )}
    </div>
  );
};