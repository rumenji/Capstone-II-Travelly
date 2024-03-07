const { Sequelize, DataTypes } = require('sequelize');
const db = require('../db');

const Itinerary = db.define('Itinerary', {
    name: {
        type: DataTypes.STRING,
        allowNull: false
    },
});

module.exports = Itinerary;