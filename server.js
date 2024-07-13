const express = require('express');
const axios = require('axios');
const cors = require('cors');
const countryList = require('country-list');
require('dotenv').config();

const app = express();
app.use(cors());

const port = process.env.PORT || 5000;
app.use(express.static("public"));
const defaultCity = 'Colombo';

// Function to get the current time in a city
function getCurrentTime(timezone){
    const date = new Date();
    const localTime = date.getTime();
    const localOffset = date.getTimezoneOffset() * 60000;
    const utc = localTime + localOffset;
    const cityTime = utc + (timezone * 1000);
    return new Date(cityTime).toLocaleString();    
};

//console.log(getCurrentTime(19800));

//to get the weather details of the default city(Colombo)
app.get("/", async (req, res) => {
    
    try {    
        const city = defaultCity;
        const apiKey = process.env.API_KEY;
        const apiUrl = `https://api.openweathermap.org/data/2.5/weather?q=${city}&appid=${apiKey}&units=metric`;
        
        const response = await axios.get(apiUrl);

        // to display full name of the country
        const weatherData = response.data;
        const countryCode = weatherData.sys.country;
        const countryName = countryList.getName(countryCode);
        weatherData.sys.countryName = countryName;

        // Calculate current time in the city
        const currentTime = getCurrentTime(weatherData.timezone);
        weatherData.sys.currentTime = currentTime;

        // Round the temperature
        const roundedTemp = Math.floor(weatherData.main.temp);
        weatherData.sys.roundedTemp = roundedTemp;

        res.render('index.ejs', { weatherData});
    } catch (error) {
        res.render('index', { errorMessage: 'City not found or API error' });

    }
});


//get weather data by searching city name
app.get('/weather', async(req, res) => {
    
    try{
        const city = req.query.city;
        const apiKey = process.env.API_KEY; 
        const apiUrl = `https://api.openweathermap.org/data/2.5/weather?q=${city}&appid=${apiKey}&units=metric`;
        
        const response = await axios.get(apiUrl);

        // to display full name of the country
        const weatherData = response.data;
        const countryCode = weatherData.sys.country;
        const countryName = countryList.getName(countryCode);
        weatherData.sys.countryName = countryName;

        // Calculate current time in the city
        const currentTime = getCurrentTime(weatherData.timezone);
        weatherData.sys.currentTime = currentTime;

        // Round the temperature
        const roundedTemp = Math.floor(weatherData.main.temp);
        weatherData.sys.roundedTemp = roundedTemp;

        res.render('index.ejs', { weatherData });
    }catch(error){
        res.render('index.ejs', { errorMessage: 'City not found' });
    }    
});

app.listen(port, () => {
    console.log(`Server running on port ${port}`);
});