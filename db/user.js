const { Model, DataTypes } = require("sequelize");
const sequelize = require("../db");

class User extends Model { }

User.init({
    chat_id: { type: DataTypes.INTEGER, unique: true },
    sign: DataTypes.STRING,
    repeatedPred: { type: DataTypes.BOOLEAN, defaultValue: false },
    zodiacInd: DataTypes.STRING
}, { sequelize, modelName: 'user', timestamps: false });

module.exports = User;