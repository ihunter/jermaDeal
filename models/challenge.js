'use strict';
const {
  Model
} = require('sequelize');
module.exports = (sequelize, DataTypes) => {
  class Challenge extends Model {
    /**
     * Helper method for defining associations.
     * This method is not a part of Sequelize lifecycle.
     * The `models/index` file will call this method automatically.
     */
    static associate(models) {
      // define association here
    }
  };
  Challenge.init({
    userId: DataTypes.STRING,
    title: DataTypes.STRING,
    time: DataTypes.BIGINT,
    description: DataTypes.TEXT,
    worth: DataTypes.DOUBLE,
    type: DataTypes.STRING,
    username: DataTypes.STRING,
    positive: DataTypes.INTEGER,
    negative: DataTypes.INTEGER
  }, {
    sequelize,
    modelName: 'Challenge',
  });
  return Challenge;
};