const config = require('../../config');
const providers = config.providers;
const crypto = require('crypto');
const bcrypt = require('bcrypt');
const moment = require('moment');

module.exports = function (sequelize, DataTypes) {
  const notices = sequelize.define(
    'notices',
    {
      id: {
        type: DataTypes.UUID,
        defaultValue: DataTypes.UUIDV4,
        primaryKey: true,
      },

      title: {
        type: DataTypes.TEXT,
      },

      content: {
        type: DataTypes.TEXT,
      },

      sent_date: {
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

  notices.associate = (db) => {
    db.notices.belongsToMany(db.users, {
      as: 'recipients',
      foreignKey: {
        name: 'notices_recipientsId',
      },
      constraints: false,
      through: 'noticesRecipientsUsers',
    });

    db.notices.belongsToMany(db.users, {
      as: 'recipients_filter',
      foreignKey: {
        name: 'notices_recipientsId',
      },
      constraints: false,
      through: 'noticesRecipientsUsers',
    });

    /// loop through entities and it's fields, and if ref === current e[name] and create relation has many on parent entity

    //end loop

    db.notices.belongsTo(db.users, {
      as: 'createdBy',
    });

    db.notices.belongsTo(db.users, {
      as: 'updatedBy',
    });
  };

  return notices;
};
