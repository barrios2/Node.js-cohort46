import express from 'express';
import fetch from 'node-fetch';
import { keys } from './sources/keys.js';

const app = express();

app.use(express.json());
app.use(express.urlencoded({ extended: true }));

app.get('/', (req, res) => {
  res.send('<h1>Hello from backend to frontend!</h1>');
});

app.post('/weather', async (req, res) => {
  const { cityName } = req.body;

  try {
    if (!cityName) {
      res.status(400)
      res.send({ error: 'Please enter a city name'});
    } else {
      const WEATHER_BASE_URL = 'https://api.openweathermap.org/data/2.5/weather';
      const response = await fetch(`${WEATHER_BASE_URL}?units=metric&q=${cityName}&appid=${keys.API_KEY}`); // includes temp in celsius
      
      if (response.ok) {
        const data = await response.json();
        const { main: { temp } } = data;
        res.send({ weatherText: `The temperature in ${cityName} is ${temp.toFixed()}°C` });
      } else {
        res.status(400)
        res.send({ error: 'Please enter a valid city name!' });
      }
    }
  } catch (error) {
    res.status(500).send({ error: 'Internal Server Error' });
  }
  res.end();
});

export default app;
