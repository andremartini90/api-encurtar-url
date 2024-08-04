const Sequelize = require('sequelize');
const dbConfig = require('../config/database');
const connection = new Sequelize(dbConfig);

const Usuario = require('../models/Usuario');
const Url = require('../models/Url');

Usuario.init(connection);
Url.init(connection);

module.exports = connection;