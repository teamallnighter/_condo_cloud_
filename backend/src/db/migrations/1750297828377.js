module.exports = {
  /**
   * @param {QueryInterface} queryInterface
   * @param {Sequelize} Sequelize
   * @returns {Promise<void>}
   */
  async up(queryInterface, Sequelize) {
    /**
     * @type {Transaction}
     */
    const transaction = await queryInterface.sequelize.transaction();
    try {
      await queryInterface.addColumn(
        'owners',
        'user_accountId',
        {
          type: Sequelize.DataTypes.UUID,

          references: {
            model: 'users',
            key: 'id',
          },
        },
        { transaction },
      );

      await queryInterface.addColumn(
        'owners',
        'lives_on_site',
        {
          type: Sequelize.DataTypes.BOOLEAN,

          defaultValue: false,
          allowNull: false,
        },
        { transaction },
      );

      await queryInterface.addColumn(
        'owners',
        'emergency_contact',
        {
          type: Sequelize.DataTypes.TEXT,
        },
        { transaction },
      );

      await queryInterface.addColumn(
        'owners',
        'mailing_address',
        {
          type: Sequelize.DataTypes.TEXT,
        },
        { transaction },
      );

      await transaction.commit();
    } catch (err) {
      await transaction.rollback();
      throw err;
    }
  },
  /**
   * @param {QueryInterface} queryInterface
   * @param {Sequelize} Sequelize
   * @returns {Promise<void>}
   */
  async down(queryInterface, Sequelize) {
    /**
     * @type {Transaction}
     */
    const transaction = await queryInterface.sequelize.transaction();
    try {
      await queryInterface.removeColumn('owners', 'mailing_address', {
        transaction,
      });

      await queryInterface.removeColumn('owners', 'emergency_contact', {
        transaction,
      });

      await queryInterface.removeColumn('owners', 'lives_on_site', {
        transaction,
      });

      await queryInterface.removeColumn('owners', 'user_accountId', {
        transaction,
      });

      await transaction.commit();
    } catch (err) {
      await transaction.rollback();
      throw err;
    }
  },
};
