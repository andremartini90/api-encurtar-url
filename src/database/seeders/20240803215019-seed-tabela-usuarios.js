'use strict';

module.exports = {
  up: async (queryInterface, Sequelize) => {
    await queryInterface.bulkInsert('usuarios', 
    [
        {
          nome: 'Administrador',
          email:"administrador@gmail.com",
          senha: "86b29aa4132e97f87e0fc92b3630776e",
          dataInativacao: null
        }
    ]);
  },

  down: async (queryInterface, Sequelize) => {
    await queryInterface.bulkDelete('usuarios');
  }
};
