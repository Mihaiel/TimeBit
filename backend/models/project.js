import { DataTypes } from 'sequelize';
import sequelize from '../config/database.js';
import User from './user.js';

const Project = sequelize.define('Project', {
    id: {
        type: DataTypes.INTEGER,
        primaryKey: true,
        autoIncrement: true
    },
    title: {
        type: DataTypes.STRING,
        allowNull: false
    },
    category: {
        type: DataTypes.STRING,
        allowNull: false
    },
    description: {
        type: DataTypes.TEXT,
        allowNull: true
    },
    weekly_hours: {
        type: DataTypes.INTEGER,
        allowNull: false
    },
    start_date: {
        type: DataTypes.DATE,
        allowNull: false
    },
    end_date: {
        type: DataTypes.DATE,
        allowNull: true
    },
    background_image_url: {
        type: DataTypes.STRING,
        allowNull: true
    },
    notify: {
        type: DataTypes.BOOLEAN,
        defaultValue: false
    },
    status: {
        type: DataTypes.ENUM('ongoing', 'finished'),
        defaultValue: 'ongoing'
    }
}, {
    timestamps: true
});

// Define the relationship with User
Project.belongsTo(User, { foreignKey: 'user_id' });
User.hasMany(Project, { foreignKey: 'user_id' });

export default Project; 