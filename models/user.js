const Sequelize = require('sequelize');

const sequelize = require('./../util/database');

const User = sequelize.define('user', {
    id: {
        type: Sequelize.INTEGER,
        autoIncrement: true,
        allowNull: false,
        primaryKey: true
    },
    name: {
        type: Sequelize.STRING(40),
        allowNull: false
    },
    email: {
        type: Sequelize.STRING(100),
        allowNull: false
    }
});

module.exports = User;
