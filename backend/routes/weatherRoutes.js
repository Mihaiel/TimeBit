import express from 'express';
import axios from 'axios';
import { config } from '../config/env.js';

const router = express.Router();

const API_KEY = config.openWeatherApiKey;
const BASE_URL = 'https://api.openweathermap.org/data/2.5/weather';

router.get('/', async (req, res) => {
    const city = req.query.city || 'Vienna'; // Default to Vienna if no city is provided

    const url = `${BASE_URL}?q=${city}&appid=${API_KEY}&units=metric`;

    try {
        const response = await axios.get(url);
        const weatherData = response.data;

        // Extract relevant data
        const weatherInfo = {
            temperature: weatherData.main.temp,
            description: weatherData.weather[0].description,
            icon: `https://openweathermap.org/img/wn/${weatherData.weather[0].icon}@2x.png`
        };

        res.json(weatherInfo);
    } catch (error) {
        console.error('Error fetching weather data:', error);
        res.status(500).json({ error: 'Failed to fetch weather data' });
    }
});

// Export the router to be used in the main app
export default router;