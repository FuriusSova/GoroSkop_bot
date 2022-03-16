const { Model, DataTypes } = require("sequelize");
const sequelize = require("../db");

class User extends Model { }

User.init({
    chat_id: { type: DataTypes.INTEGER, unique: true },
    sign: DataTypes.STRING,
    time_hour: DataTypes.INTEGER,
    time_min: DataTypes.INTEGER,
    repeatedPred: { type: DataTypes.BOOLEAN, defaultValue: false },
    zodiacInd: DataTypes.STRING,
    time_hour_str: DataTypes.STRING,
    time_min_str: DataTypes.STRING,
    schduledTaskName: DataTypes.STRING
}, { sequelize, modelName: 'user', timestamps: false });

module.exports = User;