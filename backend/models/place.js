const { Sequelize, DataTypes } = require('sequelize');
const db = require('../db');

const Place = db.define('Place', {
    name: {
        type: DataTypes.STRING,
        allowNull: false
    },
    address: {
        type: DataTypes.STRING,
    },
    timeToVisit: {
        type: DataTypes.INTEGER, // Assuming time in minutes
    },
});

module.exports = Place;