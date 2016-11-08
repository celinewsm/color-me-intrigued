'use strict';
module.exports = function(sequelize, DataTypes) {
  var leaderboard = sequelize.define('leaderboard', {
    name: DataTypes.STRING,
    level: DataTypes.INTEGER
  }, {
    classMethods: {
      associate: function(models) {
        // associations can be defined here
      }
    }
  });
  return leaderboard;
};
