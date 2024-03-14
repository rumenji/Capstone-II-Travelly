const axios = require("axios");
require('dotenv').config()
const API_KEY = process.env.API_KEY;
const BASE_URL = "https://api.tomtom.com/search/2/poiSearch/"

async function axiosFindPlace(query, lon, lat){
    
    const response = await axios.get(`${BASE_URL}${query}.json?key=${API_KEY}&lat=${lat}&lon=${lon}`);
    const places = response.data.results.map( place => ({id:place.id, 
                                                        name:place.poi.name, 
                                                        category:place.poi.categories, 
                                                        address:place.address.freeformAddress, 
                                                        position:place.position }))
    return places;
}

module.exports = { axiosFindPlace };