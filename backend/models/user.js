// models/user.js
import { DataTypes } from 'sequelize';
import sequelize from '../config/database.js';

const User = sequelize.define('User', {
  email: {
    type: DataTypes.STRING,
    unique: true,
    allowNull: false
  },
  password: {
    type: DataTypes.STRING,
    allowNull: false
  },
  first_name: {
    type: DataTypes.STRING,
    allowNull: false
  },
  last_name: {
    type: DataTypes.STRING,
    allowNull: false
  }
}, {
    // Specify where in the Database 
    tableName: 'users',
    // Enable createdAt and updatedAt
    timestamps: true,
    // Automatically map camelCase to snake_case
    underscored: true
});
export default User;