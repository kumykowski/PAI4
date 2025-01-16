import { useState, useEffect } from 'react';
import { useForm } from 'react-hook-form';

export const Weather = () => {
    const [lat, setLat] = useState("");
    const [lon, setLon] = useState("");
    const [weatherData, setWeatherData] = useState(null);
    const [cityName, setCityName] = useState("");
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState(null);
    const { register, handleSubmit, reset } = useForm();

    const fetchWeatherByCoords = async (latitude, longitude) => {
        setLoading(true);
        setError(null);
        try {
            // Pobranie danych pogodowych
            const weatherResponse = await fetch(
                `https://api.openweathermap.org/data/3.0/onecall?lat=${latitude}&lon=${longitude}&appid=893f996d90a8bd90e8651621c3ffb805`
            );
            if (!weatherResponse.ok) {
                throw new Error("Failed to fetch weather data");
            }
            const weatherData = await weatherResponse.json();
            setWeatherData(weatherData);

            // Pobranie nazwy miasta
            const geoResponse = await fetch(
                `http://api.openweathermap.org/geo/1.0/reverse?lat=${latitude}&lon=${longitude}&limit=1&appid=893f996d90a8bd90e8651621c3ffb805`
            );
            if (!geoResponse.ok) {
                throw new Error("Failed to fetch city name");
            }
            const geoData = await geoResponse.json();
            setCityName(geoData[0]?.name || "Unknown location");
        } catch (err) {
            setError(err.message);
        } finally {
            setLoading(false);
        }
    };

    const fetchWeatherByCityName = async (city) => {
        setLoading(true);
        setError(null);
        try {
            // Pobranie współrzędnych miasta
            const geoResponse = await fetch(
                `http://api.openweathermap.org/geo/1.0/direct?q=${city}&limit=1&appid=893f996d90a8bd90e8651621c3ffb805`
            );
            if (!geoResponse.ok) {
                throw new Error("Failed to fetch coordinates for city");
            }
            const geoData = await geoResponse.json();
            if (geoData.length === 0) {
                throw new Error("City not found");
            }
            const { lat, lon, name } = geoData[0];
            setCityName(name);
            setLat(lat);
            setLon(lon);
            await fetchWeatherByCoords(lat, lon);
        } catch (err) {
            setError(err.message);
        } finally {
            setLoading(false);
        }
    };

    const onSubmitByCoords = (data) => {
        setLat(data.lat);
        setLon(data.lon);
        fetchWeatherByCoords(data.lat, data.lon);
    };

    const onSubmitByCity = (data) => {
        fetchWeatherByCityName(data.city);
        reset();
    };

    return (
        <>
            <form onSubmit={handleSubmit(onSubmitByCoords)}>
                <h3>Get Weather by Coordinates</h3>
                <div>
                    <label htmlFor="lat">Latitude:</label>
                    <input type="text" id="lat" {...register("lat", { required: true })} />
                </div>
                <div>
                    <label htmlFor="lon">Longitude:</label>
                    <input type="text" id="lon" {...register("lon", { required: true })} />
                </div>
                <button type="submit">Get Weather</button>
            </form>

            <form onSubmit={handleSubmit(onSubmitByCity)}>
                <h3>Get Weather by City Name</h3>
                <div>
                    <label htmlFor="city">City:</label>
                    <input type="text" id="city" {...register("city", { required: true })} />
                </div>
                <button type="submit">Get Weather</button>
            </form>

            {loading && <p>Loading...</p>}
            {error && <p style={{ color: "red" }}>{error}</p>}
            {weatherData && (
                <div>
                    <h3>Weather Data for {cityName}:</h3>
                    <pre>{JSON.stringify(weatherData, null, 2)}</pre>
                </div>
            )}
        </>
    );
};
