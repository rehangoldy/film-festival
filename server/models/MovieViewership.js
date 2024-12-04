const { DataTypes } = require('sequelize');
const sequelize = require('../config/database');

const MovieViewership = sequelize.define('MovieViewership', {
  id: {
    type: DataTypes.INTEGER,
    primaryKey: true,
    autoIncrement: true
  },
  UserId: {
    type: DataTypes.INTEGER,
    allowNull: false,
    references: {
      model: 'Users',
      key: 'id'
    }
  },
  MovieId: {
    type: DataTypes.INTEGER,
    allowNull: false,
    references: {
      model: 'Movies',
      key: 'id'
    }
  },
  duration_watched: {
    type: DataTypes.INTEGER,
    defaultValue: 0,
    allowNull: false
  },
  last_position: {
    type: DataTypes.INTEGER,
    defaultValue: 0,
    allowNull: false
  },
  last_watched_at: {
    type: DataTypes.DATE,
    allowNull: true
  }
}, {
  timestamps: true,
  createdAt: 'created_at',
  updatedAt: 'updated_at',
  tableName: 'MovieViewerships',
  indexes: [
    {
      unique: true,
      fields: ['UserId', 'MovieId']
    }
  ]
});

module.exports = MovieViewership;
