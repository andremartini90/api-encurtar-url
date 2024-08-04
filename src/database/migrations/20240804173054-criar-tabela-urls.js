'use strict';

/** @type {import('sequelize-cli').Migration} */
module.exports = {
  async up(queryInterface, Sequelize) {
    return queryInterface.createTable('urls',
    {
      id: {
        type: Sequelize.BIGINT,
        primaryKey: true,
        autoIncrement: true
      },
      usuarioId: {
        type: Sequelize.INTEGER,
        allowNull: true,
      },
      urlOriginal: {
        type: Sequelize.STRING,
        allowNull: false
      },
      urlEncurtada: {
        type: Sequelize.STRING,
        allowNull: false,
        unique: true
      },
      clicks: {
        type: Sequelize.INTEGER,
        defaultValue: 0
      },
      dataInativacao:{
        type: Sequelize.DATE,
        defaultValue: null,
        allowNull: true
      },
      criadoEm:{
        type: Sequelize.DATE,
        defaultValue: Sequelize.fn('NOW')
      },
      atualizadoEm:{
        type: Sequelize.DATE,
        defaultValue: null,
        allowNull: true
      }
    });
  },

  async down (queryInterface, Sequelize) {
    return queryInterface.dropTable('urls')
  }
};
