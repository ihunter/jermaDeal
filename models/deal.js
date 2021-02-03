'use strict';
const {
  Model
} = require('sequelize');
module.exports = (sequelize, DataTypes) => {
  class Deal extends Model {
    /**
     * Helper method for defining associations.
     * This method is not a part of Sequelize lifecycle.
     * The `models/index` file will call this method automatically.
     */
    static associate(models) {
      // define association here
    }
  };
  Deal.init({
    userId: DataTypes.STRING,
    messageId: DataTypes.STRING,
    challenge: DataTypes.STRING,
    time: DataTypes.BIGINT,
    description: DataTypes.TEXT,
    worth: DataTypes.DOUBLE,
    type: DataTypes.STRING,
    username: DataTypes.STRING,
    positive: DataTypes.INTEGER,
    negative: DataTypes.INTEGER
  }, {
    sequelize,
    modelName: 'Deal',
  });
  return Deal;
};