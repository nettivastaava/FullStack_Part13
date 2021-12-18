const { DataTypes } = require('sequelize')

module.exports = {
  up: async (queryInterface) => {
    await queryInterface.createTable('sessions', {
      id: {
        type: DataTypes.INTEGER,
        primaryKey: true,
        autoIncrement: true
      },
      token: {
        type: DataTypes.STRING,
        allowNull: false
      }
    })
    await queryInterface.addColumn('sessions', 'user_id', {
      type: DataTypes.INTEGER,
      allowNull: false,
      references: { model: 'users', key: 'id' },
    })
  },
  down: async (queryInterface) => {
    await queryInterface.dropTable('sessions')
  },
}