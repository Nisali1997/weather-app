const express = require('express');
const axios = require('axios');
const cors = require('cors');
require('dotenv').config();

const app = express();
app.use(cors());

const port = process.env.PORT || 5000;

//get weather data by city name
app.get('/weather', async(req, res) =>{
    //res.send("<h1>Hello</h1>");
    const city = req.query.city;
    const apiKey = process.env.API_KEY; 
    const apiUrl = `https://api.openweathermap.org/data/2.5/weather?q=${city}&appid=${apiKey}&units=metric`;
    
    try{
        const response = await axios.get(apiUrl);
        res.json(response.data);
    }catch(error){
        res.status(500).json({ error: error.message });
    }
    
})

app.listen(port, () => {
    console.log(`Server running on port ${port}`);
});