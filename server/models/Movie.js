const { DataTypes } = require('sequelize');
const sequelize = require('../config/database');

const Movie = sequelize.define('Movie', {
  id: {
    type: DataTypes.INTEGER,
    primaryKey: true,
    autoIncrement: true
  },
  title: {
    type: DataTypes.STRING(255),
    allowNull: false
  },
  description: {
    type: DataTypes.TEXT,
    allowNull: true
  },
  duration: {
    type: DataTypes.INTEGER,
    allowNull: false,
    validate: {
      min: 0
    }
  },
  artists: {
    type: DataTypes.JSON,
    allowNull: true,
    get() {
      const rawValue = this.getDataValue('artists');
      if (!rawValue) return [];
      if (Array.isArray(rawValue)) return rawValue;
      try {
        return JSON.parse(rawValue);
      } catch (e) {
        return Array.isArray(rawValue) ? rawValue : [rawValue];
      }
    },
    set(value) {
      if (!value) {
        this.setDataValue('artists', []);
        return;
      }
      if (typeof value === 'string') {
        try {
          const parsed = JSON.parse(value);
          this.setDataValue('artists', Array.isArray(parsed) ? parsed : [parsed]);
        } catch (e) {
          this.setDataValue('artists', [value]);
        }
      } else {
        this.setDataValue('artists', Array.isArray(value) ? value : [value]);
      }
    }
  },
  watch_url: {
    type: DataTypes.STRING(255),
    allowNull: true
  },
  file_path: {
    type: DataTypes.STRING(255),
    allowNull: true
  },
  thumbnail_path: {
    type: DataTypes.STRING(255),
    allowNull: true
  },
  status: {
    type: DataTypes.ENUM('active', 'inactive'),
    defaultValue: 'active'
  },
  view_count: {
    type: DataTypes.INTEGER,
    defaultValue: 0
  },
  vote_count: {
    type: DataTypes.INTEGER,
    defaultValue: 0
  }
}, {
  timestamps: true,
  createdAt: 'created_at',
  updatedAt: 'updated_at',
  tableName: 'Movies'
});

module.exports = Movie;
