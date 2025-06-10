import { DataTypes } from 'sequelize';
import sequelize from '../config/database.js';
import User from './user.js';
import Project from './project.js';

const TimeEntry = sequelize.define('TimeEntry', {
  id: {
    type: DataTypes.INTEGER,
    primaryKey: true,
    autoIncrement: true
  },
  user_id: {
    type: DataTypes.INTEGER,
    allowNull: false,
    references: {
      model: 'users',
      key: 'id'
    }
  },
  project_id: {
    type: DataTypes.INTEGER,
    allowNull: false,
    references: {
      model: 'projects',
      key: 'id'
    }
  },
  date: {
    type: DataTypes.DATEONLY,
    allowNull: false
  },
  start_time: {
    type: DataTypes.TIME,
    allowNull: false
  },
  end_time: {
    type: DataTypes.TIME,
    allowNull: false
  },
  minutes: {
    type: DataTypes.INTEGER,
    allowNull: false
  },
  notes: {
    type: DataTypes.TEXT,
    allowNull: true
  }
}, {
  tableName: 'time_entries',
  timestamps: false,
  underscored: true
});

// Define relationships
TimeEntry.belongsTo(User, { foreignKey: 'user_id' });
TimeEntry.belongsTo(Project, { foreignKey: 'project_id' });

export { TimeEntry }; 