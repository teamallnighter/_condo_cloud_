const config = require('../../config');
const providers = config.providers;
const crypto = require('crypto');
const bcrypt = require('bcrypt');
const moment = require('moment');

module.exports = function (sequelize, DataTypes) {
  const maintenance_requests = sequelize.define(
    'maintenance_requests',
    {
      id: {
        type: DataTypes.UUID,
        defaultValue: DataTypes.UUIDV4,
        primaryKey: true,
      },

      description: {
        type: DataTypes.TEXT,
      },

      status: {
        type: DataTypes.ENUM,

        values: ['pending', 'in_progress', 'completed'],
      },

      request_date: {
        type: DataTypes.DATE,
      },

      importHash: {
        type: DataTypes.STRING(255),
        allowNull: true,
        unique: true,
      },
    },
    {
      timestamps: true,
      paranoid: true,
      freezeTableName: true,
    },
  );

  maintenance_requests.associate = (db) => {
    /// loop through entities and it's fields, and if ref === current e[name] and create relation has many on parent entity

    //end loop

    db.maintenance_requests.belongsTo(db.units, {
      as: 'unit',
      foreignKey: {
        name: 'unitId',
      },
      constraints: false,
    });

    db.maintenance_requests.belongsTo(db.users, {
      as: 'createdBy',
    });

    db.maintenance_requests.belongsTo(db.users, {
      as: 'updatedBy',
    });
  };

  return maintenance_requests;
};
