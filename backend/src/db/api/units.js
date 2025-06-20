const db = require('../models');
const FileDBApi = require('./file');
const crypto = require('crypto');
const Utils = require('../utils');

const Sequelize = db.Sequelize;
const Op = Sequelize.Op;

module.exports = class UnitsDBApi {
  static async create(data, options) {
    const currentUser = (options && options.currentUser) || { id: null };
    const transaction = (options && options.transaction) || undefined;

    const units = await db.units.create(
      {
        id: data.id || undefined,

        unit_number: data.unit_number || null,
        balance: data.balance || null,
        unit_factor: data.unit_factor || null,
        cond_fee: data.cond_fee || null,
        parking_stall: data.parking_stall || null,
        importHash: data.importHash || null,
        createdById: currentUser.id,
        updatedById: currentUser.id,
      },
      { transaction },
    );

    await units.setOwner(data.owner || null, {
      transaction,
    });

    await units.setOwners(data.owners || [], {
      transaction,
    });

    return units;
  }

  static async bulkImport(data, options) {
    const currentUser = (options && options.currentUser) || { id: null };
    const transaction = (options && options.transaction) || undefined;

    // Prepare data - wrapping individual data transformations in a map() method
    const unitsData = data.map((item, index) => ({
      id: item.id || undefined,

      unit_number: item.unit_number || null,
      balance: item.balance || null,
      unit_factor: item.unit_factor || null,
      cond_fee: item.cond_fee || null,
      parking_stall: item.parking_stall || null,
      importHash: item.importHash || null,
      createdById: currentUser.id,
      updatedById: currentUser.id,
      createdAt: new Date(Date.now() + index * 1000),
    }));

    // Bulk create items
    const units = await db.units.bulkCreate(unitsData, { transaction });

    // For each item created, replace relation files

    return units;
  }

  static async update(id, data, options) {
    const currentUser = (options && options.currentUser) || { id: null };
    const transaction = (options && options.transaction) || undefined;

    const units = await db.units.findByPk(id, {}, { transaction });

    const updatePayload = {};

    if (data.unit_number !== undefined)
      updatePayload.unit_number = data.unit_number;

    if (data.balance !== undefined) updatePayload.balance = data.balance;

    if (data.unit_factor !== undefined)
      updatePayload.unit_factor = data.unit_factor;

    if (data.cond_fee !== undefined) updatePayload.cond_fee = data.cond_fee;

    if (data.parking_stall !== undefined)
      updatePayload.parking_stall = data.parking_stall;

    updatePayload.updatedById = currentUser.id;

    await units.update(updatePayload, { transaction });

    if (data.owner !== undefined) {
      await units.setOwner(
        data.owner,

        { transaction },
      );
    }

    if (data.owners !== undefined) {
      await units.setOwners(data.owners, { transaction });
    }

    return units;
  }

  static async deleteByIds(ids, options) {
    const currentUser = (options && options.currentUser) || { id: null };
    const transaction = (options && options.transaction) || undefined;

    const units = await db.units.findAll({
      where: {
        id: {
          [Op.in]: ids,
        },
      },
      transaction,
    });

    await db.sequelize.transaction(async (transaction) => {
      for (const record of units) {
        await record.update({ deletedBy: currentUser.id }, { transaction });
      }
      for (const record of units) {
        await record.destroy({ transaction });
      }
    });

    return units;
  }

  static async remove(id, options) {
    const currentUser = (options && options.currentUser) || { id: null };
    const transaction = (options && options.transaction) || undefined;

    const units = await db.units.findByPk(id, options);

    await units.update(
      {
        deletedBy: currentUser.id,
      },
      {
        transaction,
      },
    );

    await units.destroy({
      transaction,
    });

    return units;
  }

  static async findBy(where, options) {
    const transaction = (options && options.transaction) || undefined;

    const units = await db.units.findOne({ where }, { transaction });

    if (!units) {
      return units;
    }

    const output = units.get({ plain: true });

    output.users_unit = await units.getUsers_unit({
      transaction,
    });

    output.maintenance_requests_unit = await units.getMaintenance_requests_unit(
      {
        transaction,
      },
    );

    output.owner = await units.getOwner({
      transaction,
    });

    output.owners = await units.getOwners({
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
        as: 'owner',

        where: filter.owner
          ? {
              [Op.or]: [
                {
                  id: {
                    [Op.in]: filter.owner
                      .split('|')
                      .map((term) => Utils.uuid(term)),
                  },
                },
                {
                  firstName: {
                    [Op.or]: filter.owner
                      .split('|')
                      .map((term) => ({ [Op.iLike]: `%${term}%` })),
                  },
                },
              ],
            }
          : {},
      },

      {
        model: db.owners,
        as: 'owners',
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

      if (filter.unit_number) {
        where = {
          ...where,
          [Op.and]: Utils.ilike('units', 'unit_number', filter.unit_number),
        };
      }

      if (filter.balanceRange) {
        const [start, end] = filter.balanceRange;

        if (start !== undefined && start !== null && start !== '') {
          where = {
            ...where,
            balance: {
              ...where.balance,
              [Op.gte]: start,
            },
          };
        }

        if (end !== undefined && end !== null && end !== '') {
          where = {
            ...where,
            balance: {
              ...where.balance,
              [Op.lte]: end,
            },
          };
        }
      }

      if (filter.unit_factorRange) {
        const [start, end] = filter.unit_factorRange;

        if (start !== undefined && start !== null && start !== '') {
          where = {
            ...where,
            unit_factor: {
              ...where.unit_factor,
              [Op.gte]: start,
            },
          };
        }

        if (end !== undefined && end !== null && end !== '') {
          where = {
            ...where,
            unit_factor: {
              ...where.unit_factor,
              [Op.lte]: end,
            },
          };
        }
      }

      if (filter.cond_feeRange) {
        const [start, end] = filter.cond_feeRange;

        if (start !== undefined && start !== null && start !== '') {
          where = {
            ...where,
            cond_fee: {
              ...where.cond_fee,
              [Op.gte]: start,
            },
          };
        }

        if (end !== undefined && end !== null && end !== '') {
          where = {
            ...where,
            cond_fee: {
              ...where.cond_fee,
              [Op.lte]: end,
            },
          };
        }
      }

      if (filter.parking_stallRange) {
        const [start, end] = filter.parking_stallRange;

        if (start !== undefined && start !== null && start !== '') {
          where = {
            ...where,
            parking_stall: {
              ...where.parking_stall,
              [Op.gte]: start,
            },
          };
        }

        if (end !== undefined && end !== null && end !== '') {
          where = {
            ...where,
            parking_stall: {
              ...where.parking_stall,
              [Op.lte]: end,
            },
          };
        }
      }

      if (filter.active !== undefined) {
        where = {
          ...where,
          active: filter.active === true || filter.active === 'true',
        };
      }

      if (filter.owners) {
        const searchTerms = filter.owners.split('|');

        include = [
          {
            model: db.owners,
            as: 'owners_filter',
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
                        id: {
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
      const { rows, count } = await db.units.findAndCountAll(queryOptions);

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
          Utils.ilike('units', 'unit_number', query),
        ],
      };
    }

    const records = await db.units.findAll({
      attributes: ['id', 'unit_number'],
      where,
      limit: limit ? Number(limit) : undefined,
      offset: offset ? Number(offset) : undefined,
      orderBy: [['unit_number', 'ASC']],
    });

    return records.map((record) => ({
      id: record.id,
      label: record.unit_number,
    }));
  }
};
