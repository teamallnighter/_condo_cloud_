const config = require('../../config');
const providers = config.providers;
const crypto = require('crypto');
const bcrypt = require('bcrypt');
const moment = require('moment');

module.exports = function (sequelize, DataTypes) {
  const units = sequelize.define(
    'units',
    {
      id: {
        type: DataTypes.UUID,
        defaultValue: DataTypes.UUIDV4,
        primaryKey: true,
      },

      unit_number: {
        type: DataTypes.TEXT,
      },

      balance: {
        type: DataTypes.DECIMAL,
      },

      unit_factor: {
        type: DataTypes.INTEGER,
      },

      cond_fee: {
        type: DataTypes.DECIMAL,
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

  units.associate = (db) => {
    /// loop through entities and it's fields, and if ref === current e[name] and create relation has many on parent entity

    db.units.hasMany(db.maintenance_requests, {
      as: 'maintenance_requests_unit',
      foreignKey: {
        name: 'unitId',
      },
      constraints: false,
    });

    //end loop

    db.units.belongsTo(db.users, {
      as: 'owner',
      foreignKey: {
        name: 'ownerId',
      },
      constraints: false,
    });

    db.units.belongsTo(db.users, {
      as: 'createdBy',
    });

    db.units.belongsTo(db.users, {
      as: 'updatedBy',
    });
  };

  return units;
};
