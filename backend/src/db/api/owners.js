const db = require('../models');
const FileDBApi = require('./file');
const crypto = require('crypto');
const Utils = require('../utils');

const Sequelize = db.Sequelize;
const Op = Sequelize.Op;

module.exports = class OwnersDBApi {
  static async create(data, options) {
    const currentUser = (options && options.currentUser) || { id: null };
    const transaction = (options && options.transaction) || undefined;

    const owners = await db.owners.create(
      {
        id: data.id || undefined,

        lives_on_site: data.lives_on_site || false,

        emergency_contact: data.emergency_contact || null,
        mailing_address: data.mailing_address || null,
        importHash: data.importHash || null,
        createdById: currentUser.id,
        updatedById: currentUser.id,
      },
      { transaction },
    );

    await owners.setUser_account(data.user_account || null, {
      transaction,
    });

    await owners.setUnit(data.unit || [], {
      transaction,
    });

    return owners;
  }

  static async bulkImport(data, options) {
    const currentUser = (options && options.currentUser) || { id: null };
    const transaction = (options && options.transaction) || undefined;

    // Prepare data - wrapping individual data transformations in a map() method
    const ownersData = data.map((item, index) => ({
      id: item.id || undefined,

      lives_on_site: item.lives_on_site || false,

      emergency_contact: item.emergency_contact || null,
      mailing_address: item.mailing_address || null,
      importHash: item.importHash || null,
      createdById: currentUser.id,
      updatedById: currentUser.id,
      createdAt: new Date(Date.now() + index * 1000),
    }));

    // Bulk create items
    const owners = await db.owners.bulkCreate(ownersData, { transaction });

    // For each item created, replace relation files

    return owners;
  }

  static async update(id, data, options) {
    const currentUser = (options && options.currentUser) || { id: null };
    const transaction = (options && options.transaction) || undefined;

    const owners = await db.owners.findByPk(id, {}, { transaction });

    const updatePayload = {};

    if (data.lives_on_site !== undefined)
      updatePayload.lives_on_site = data.lives_on_site;

    if (data.emergency_contact !== undefined)
      updatePayload.emergency_contact = data.emergency_contact;

    if (data.mailing_address !== undefined)
      updatePayload.mailing_address = data.mailing_address;

    updatePayload.updatedById = currentUser.id;

    await owners.update(updatePayload, { transaction });

    if (data.user_account !== undefined) {
      await owners.setUser_account(
        data.user_account,

        { transaction },
      );
    }

    if (data.unit !== undefined) {
      await owners.setUnit(data.unit, { transaction });
    }

    return owners;
  }

  static async deleteByIds(ids, options) {
    const currentUser = (options && options.currentUser) || { id: null };
    const transaction = (options && options.transaction) || undefined;

    const owners = await db.owners.findAll({
      where: {
        id: {
          [Op.in]: ids,
        },
      },
      transaction,
    });

    await db.sequelize.transaction(async (transaction) => {
      for (const record of owners) {
        await record.update({ deletedBy: currentUser.id }, { transaction });
      }
      for (const record of owners) {
        await record.destroy({ transaction });
      }
    });

    return owners;
  }

  static async remove(id, options) {
    const currentUser = (options && options.currentUser) || { id: null };
    const transaction = (options && options.transaction) || undefined;

    const owners = await db.owners.findByPk(id, options);

    await owners.update(
      {
        deletedBy: currentUser.id,
      },
      {
        transaction,
      },
    );

    await owners.destroy({
      transaction,
    });

    return owners;
  }

  static async findBy(where, options) {
    const transaction = (options && options.transaction) || undefined;

    const owners = await db.owners.findOne({ where }, { transaction });

    if (!owners) {
      return owners;
    }

    const output = owners.get({ plain: true });

    output.user_account = await owners.getUser_account({
      transaction,
    });

    output.unit = await owners.getUnit({
      transaction,
    });

    return output;
  }

  static async findAll(filter, options) {
    const limit = filter.limit || 0;
    let offset = 0;
    let where = {};
    const currentPage = +filter.page;

    offset = currentPage * limit;

    const orderBy = null;

    const transaction = (options && options.transaction) || undefined;

    let include = [
      {
        model: db.users,
        as: 'user_account',

        where: filter.user_account
          ? {
              [Op.or]: [
                {
                  id: {
                    [Op.in]: filter.user_account
                      .split('|')
                      .map((term) => Utils.uuid(term)),
                  },
                },
                {
                  firstName: {
                    [Op.or]: filter.user_account
                      .split('|')
                      .map((term) => ({ [Op.iLike]: `%${term}%` })),
                  },
                },
              ],
            }
          : {},
      },

      {
        model: db.units,
        as: 'unit',
        required: false,
      },
    ];

    if (filter) {
      if (filter.id) {
        where = {
          ...where,
          ['id']: Utils.uuid(filter.id),
        };
      }

      if (filter.emergency_contact) {
        where = {
          ...where,
          [Op.and]: Utils.ilike(
            'owners',
            'emergency_contact',
            filter.emergency_contact,
          ),
        };
      }

      if (filter.mailing_address) {
        where = {
          ...where,
          [Op.and]: Utils.ilike(
            'owners',
            'mailing_address',
            filter.mailing_address,
          ),
        };
      }

      if (filter.active !== undefined) {
        where = {
          ...where,
          active: filter.active === true || filter.active === 'true',
        };
      }

      if (filter.lives_on_site) {
        where = {
          ...where,
          lives_on_site: filter.lives_on_site,
        };
      }

      if (filter.unit) {
        const searchTerms = filter.unit.split('|');

        include = [
          {
            model: db.units,
            as: 'unit_filter',
            required: searchTerms.length > 0,
            where:
              searchTerms.length > 0
                ? {
                    [Op.or]: [
                      {
                        id: {
                          [Op.in]: searchTerms.map((term) => Utils.uuid(term)),
                        },
                      },
                      {
                        unit_number: {
                          [Op.or]: searchTerms.map((term) => ({
                            [Op.iLike]: `%${term}%`,
                          })),
                        },
                      },
                    ],
                  }
                : undefined,
          },
          ...include,
        ];
      }

      if (filter.createdAtRange) {
        const [start, end] = filter.createdAtRange;

        if (start !== undefined && start !== null && start !== '') {
          where = {
            ...where,
            ['createdAt']: {
              ...where.createdAt,
              [Op.gte]: start,
            },
          };
        }

        if (end !== undefined && end !== null && end !== '') {
          where = {
            ...where,
            ['createdAt']: {
              ...where.createdAt,
              [Op.lte]: end,
            },
          };
        }
      }
    }

    const queryOptions = {
      where,
      include,
      distinct: true,
      order:
        filter.field && filter.sort
          ? [[filter.field, filter.sort]]
          : [['createdAt', 'desc']],
      transaction: options?.transaction,
      logging: console.log,
    };

    if (!options?.countOnly) {
      queryOptions.limit = limit ? Number(limit) : undefined;
      queryOptions.offset = offset ? Number(offset) : undefined;
    }

    try {
      const { rows, count } = await db.owners.findAndCountAll(queryOptions);

      return {
        rows: options?.countOnly ? [] : rows,
        count: count,
      };
    } catch (error) {
      console.error('Error executing query:', error);
      throw error;
    }
  }

  static async findAllAutocomplete(query, limit, offset) {
    let where = {};

    if (query) {
      where = {
        [Op.or]: [
          { ['id']: Utils.uuid(query) },
          Utils.ilike('owners', 'id', query),
        ],
      };
    }

    const records = await db.owners.findAll({
      attributes: ['id', 'id'],
      where,
      limit: limit ? Number(limit) : undefined,
      offset: offset ? Number(offset) : undefined,
      orderBy: [['id', 'ASC']],
    });

    return records.map((record) => ({
      id: record.id,
      label: record.id,
    }));
  }
};
