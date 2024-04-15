const axios = require("axios");
require('dotenv').config()
const API_KEY = process.env.API_KEY;
const BASE_URL = "https://api.tomtom.com/search/2/"

async function axiosFindPlace(query, lon, lat){
    
    const response = await axios.get(`${BASE_URL}poiSearch/${query}.json?key=${API_KEY}&lat=${lat}&lon=${lon}`);
    const places = response.data.results.map( place => ({id:place.id, 
                                                        name:place.poi.name, 
                                                        category:place.poi.categories, 
                                                        address:place.address.freeformAddress, 
                                                        position:place.position }))
    return places;
}

async function axiosFindGeoCode(query){
    const response = await axios.get(`${BASE_URL}geocode/${query}.json?key=${API_KEY}`);
    const locations = response.data.results.map(location => ({id: location.id,
                                                            name: location.address.freeformAddress,
                                                            position: location.position
                                                            }))
    return locations
}

module.exports = { axiosFindPlace, axiosFindGeoCode };