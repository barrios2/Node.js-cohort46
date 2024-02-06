import express from 'express';
import fetch from 'node-fetch';
import { keys } from './sources/keys.js';

const app = express();
const PORT = 3000;

app.use(express.json());
app.use(express.urlencoded({ extended: true }));

app.get('/', (req, res) => {
  res.send('<h1>Hello from backend to frontend!</h1>');
});

app.post('/weather', async (req, res) => {
  const { cityName } = req.body; // accessing cityName

  try {
    if (!cityName) {
      res.send('Please enter a city name');
      res.end();
    } else {
      const response = await fetch(`https://api.openweathermap.org/data/2.5/weather?units=metric&q=${cityName}&appid=${keys.API_KEY}`); // includes temp in celsius
      
      if (response.ok) {
        const data = await response.json();
        const temperature = data.main.temp.toFixed() + '°C';
        res.send({ weatherText: `The temperature in ${cityName} is ${temperature}` });
        res.end();
      } else {
        res.send({ weatherText: 'City is not found!' });
        res.end();
      }
    }
  } catch (error) {
    res.status(500).send({ error: 'Internal Server Error' });
    res.end();
  }
});

app.listen(PORT, () => console.log(`Server started on port ${PORT}`));