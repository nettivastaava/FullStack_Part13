const { DataTypes } = require('sequelize')

module.exports = {
  up: async (queryInterface) => {
    await queryInterface.createTable('blogs', {
      id: {
        type: DataTypes.INTEGER,
        primaryKey: true,
        autoIncrement: true
      },
      title: {
        type: DataTypes.TEXT,
        allowNull: false
      },
      author: {
        type: DataTypes.TEXT
      },
      url: {
        type: DataTypes.TEXT,
        allowNull: false
      },
      likes: {
          type: DataTypes.INTEGER,
          default: 0
      },
      created_at: {
        type: DataTypes.DATE
      },
      updated_at: {
        type: DataTypes.DATE
      }
    })
    await queryInterface.createTable('users', {
      id: {
        type: DataTypes.INTEGER,
        primaryKey: true,
        autoIncrement: true
      },
      username: {
        type: DataTypes.STRING,
        unique: true,
        allowNull: false,
        validate: {
            isEmail: true
        }
      },
      name: {
        type: DataTypes.STRING,
        allowNull: false
      },
      created_at: {
        type: DataTypes.DATE
      },
      updated_at: {
        type: DataTypes.DATE
      }
    })
    await queryInterface.addColumn('blogs', 'user_id', {
      type: DataTypes.INTEGER,
      allowNull: false,
      references: { model: 'users', key: 'id' },
    })
  },
  down: async (queryInterface) => {
    await queryInterface.dropTable('blogs')
    await queryInterface.dropTable('users')
  },
}