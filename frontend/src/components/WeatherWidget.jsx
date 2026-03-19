import React, { useState, useEffect } from 'react';
import { Cloud, Sun, CloudRain, Wind, Droplets, Thermometer, AlertCircle, CloudLightning, Snowflake, CloudFog } from 'lucide-react';

const WeatherWidget = ({ location }) => {
    const [weatherData, setWeatherData] = useState(null);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);

    useEffect(() => {
        const fetchWeather = async () => {
            if (!location) return;

            // Extract just the city name in case it's in "City, Country" format
            const city = location.split(',')[0].trim();
            const apiKey = import.meta.env.VITE_OPENWEATHER_API_KEY;

            if (!apiKey) {
                setError("Weather API key not configured.");
                setLoading(false);
                return;
            }

            try {
                const response = await fetch(`https://api.openweathermap.org/data/2.5/weather?q=${encodeURIComponent(city)}&appid=${apiKey}&units=metric`);
                const data = await response.json();

                if (!response.ok) {
                    throw new Error(data.message || 'Failed to fetch weather data');
                }

                setWeatherData(data);
                setError(null);
            } catch (err) {
                setError(err.message === 'Invalid API key. Please see https://openweathermap.org/faq#error401 for more info.' ? 'Invalid API Key' : 'Weather data unavailable');
            } finally {
                setLoading(false);
            }
        };

        fetchWeather();
    }, [location]);

    const getWeatherIcon = (condition) => {
        // Map OpenWeather conditions to Lucide icons
        const main = condition?.main?.toLowerCase() || '';
        if (main.includes('clear')) return <Sun className="text-yellow-400" size={32} />;
        if (main.includes('cloud')) return <Cloud className="text-gray-400" size={32} />;
        if (main.includes('rain') || main.includes('drizzle')) return <CloudRain className="text-blue-400" size={32} />;
        if (main.includes('thunderstorm')) return <CloudLightning className="text-purple-400" size={32} />;
        if (main.includes('snow')) return <Snowflake className="text-blue-200" size={32} />;
        return <CloudFog className="text-gray-300" size={32} />;
    };

    if (loading) {
        return (
            <div className="bg-white/5 border border-white/10 rounded-3xl p-6 backdrop-blur-md animate-pulse">
                <div className="h-6 w-32 bg-white/10 rounded mb-4"></div>
                <div className="flex items-center space-x-4">
                    <div className="w-12 h-12 bg-white/10 rounded-full"></div>
                    <div className="space-y-2">
                        <div className="h-8 w-16 bg-white/10 rounded"></div>
                        <div className="h-4 w-24 bg-white/10 rounded"></div>
                    </div>
                </div>
            </div>
        );
    }

    if (error) {
        return (
            <div className="bg-white/5 border border-white/10 rounded-3xl p-6 backdrop-blur-md">
                <div className="flex items-center space-x-3 text-gray-400">
                    <AlertCircle className="text-yellow-500/70" size={20} />
                    <div className="text-sm">
                        <p className="font-semibold text-white/80">Weather Info</p>
                        <p className="text-xs text-rose-400/80">{error}</p>
                    </div>
                </div>
            </div>
        );
    }

    if (!weatherData) return null;

    const currentTemp = Math.round(weatherData.main.temp);
    const condition = weatherData.weather[0];

    return (
        <div className="bg-white/5 border border-white/10 rounded-3xl p-6 backdrop-blur-md transition-all hover:bg-white/10">
            <h3 className="font-bold text-white mb-4 flex items-center justify-between">
                <span>Current Weather</span>
                <span className="text-xs font-normal text-gray-400 uppercase tracking-wider">{weatherData.name}</span>
            </h3>
            
            <div className="flex items-center justify-between">
                <div className="flex items-center space-x-4">
                    <div className="p-3 bg-white/5 rounded-2xl">
                        {getWeatherIcon(condition)}
                    </div>
                    <div>
                        <div className="text-4xl font-black text-white">{currentTemp}°</div>
                        <div className="text-sm text-gray-300 capitalize">{condition.description}</div>
                    </div>
                </div>
                
                <div className="space-y-2 text-right">
                    <div className="flex items-center justify-end space-x-2 text-xs text-gray-400">
                        <Thermometer size={14} className="text-primary/70" />
                        <span>Feels like {Math.round(weatherData.main.feels_like)}°</span>
                    </div>
                    <div className="flex items-center justify-end space-x-2 text-xs text-gray-400">
                        <Droplets size={14} className="text-blue-400/70" />
                        <span>{weatherData.main.humidity}% Humidity</span>
                    </div>
                    <div className="flex items-center justify-end space-x-2 text-xs text-gray-400">
                        <Wind size={14} className="text-gray-300/70" />
                        <span>{Math.round(weatherData.wind.speed * 3.6)} km/h</span>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default WeatherWidget;
