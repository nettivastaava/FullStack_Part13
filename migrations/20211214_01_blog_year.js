const { DataTypes } = require('sequelize')

module.exports = {
  up: async (queryInterface) => {
    await queryInterface.addColumn('blogs', 'year', {
      type: DataTypes.INTEGER,
      validate: {
        min: 1991,
        max: new Date().getFullYear()
      }
    })
  },
  down: async (queryInterface) => {
    await queryInterface.removeColumn('blogs', 'year')
  },
}