// const User = require('./user');
// const Itinerary = require('./itinerary');
// const Place = require('./place');

// // User - Itinerary: One-to-Many Relationship
// User.hasMany(Itinerary);
// Itinerary.belongsTo(User);

// // Itinerary - Place: Many-to-Many Relationship
// Itinerary.belongsToMany(Place, { through: 'ItineraryPlace' });
// Place.belongsToMany(Itinerary, { through: 'ItineraryPlace' }); 

// module.exports = { User, Itinerary, Place };