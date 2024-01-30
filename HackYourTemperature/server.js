import express from 'express';

const app = express();
app.use(express.json()); // for parsing application/json
app.use(express.urlencoded({ extended: true })); // for parsing application/x-www-form-urlencoded

app.get('/', (req, res) => {
  res.send('<h1>hello from backend to frontend!</h1>');
});

app.post('/weather', (req, res) => {
  const cityName = req.body.cityName;
  res.end(`The city name you entered is: ${cityName}`);
});

const PORT = 3000;

app.listen(PORT, () => console.log(`Server started on port ${PORT}`));