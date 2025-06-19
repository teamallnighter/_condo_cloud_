const config = require('../../config');
const providers = config.providers;
const crypto = require('crypto');
const bcrypt = require('bcrypt');
const moment = require('moment');

module.exports = function (sequelize, DataTypes) {
  const owners = sequelize.define(
    'owners',
    {
      id: {
        type: DataTypes.UUID,
        defaultValue: DataTypes.UUIDV4,
        primaryKey: true,
      },

      lives_on_site: {
        type: DataTypes.BOOLEAN,

        allowNull: false,
        defaultValue: false,
      },

      emergency_contact: {
        type: DataTypes.TEXT,
      },

      mailing_address: {
        type: DataTypes.TEXT,
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

  owners.associate = (db) => {
    db.owners.belongsToMany(db.units, {
      as: 'unit',
      foreignKey: {
        name: 'owners_unitId',
      },
      constraints: false,
      through: 'ownersUnitUnits',
    });

    db.owners.belongsToMany(db.units, {
      as: 'unit_filter',
      foreignKey: {
        name: 'owners_unitId',
      },
      constraints: false,
      through: 'ownersUnitUnits',
    });

    /// loop through entities and it's fields, and if ref === current e[name] and create relation has many on parent entity

    //end loop

    db.owners.belongsTo(db.users, {
      as: 'user_account',
      foreignKey: {
        name: 'user_accountId',
      },
      constraints: false,
    });

    db.owners.belongsTo(db.users, {
      as: 'createdBy',
    });

    db.owners.belongsTo(db.users, {
      as: 'updatedBy',
    });
  };

  return owners;
};
