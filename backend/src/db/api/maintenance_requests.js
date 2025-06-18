const db = require('../models');
const FileDBApi = require('./file');
const crypto = require('crypto');
const Utils = require('../utils');

const Sequelize = db.Sequelize;
const Op = Sequelize.Op;

module.exports = class Maintenance_requestsDBApi {
  static async create(data, options) {
    const currentUser = (options && options.currentUser) || { id: null };
    const transaction = (options && options.transaction) || undefined;

    const maintenance_requests = await db.maintenance_requests.create(
      {
        id: data.id || undefined,

        description: data.description || null,
        status: data.status || null,
        request_date: data.request_date || null,
        importHash: data.importHash || null,
        createdById: currentUser.id,
        updatedById: currentUser.id,
      },
      { transaction },
    );

    await maintenance_requests.setUnit(data.unit || null, {
      transaction,
    });

    return maintenance_requests;
  }

  static async bulkImport(data, options) {
    const currentUser = (options && options.currentUser) || { id: null };
    const transaction = (options && options.transaction) || undefined;

    // Prepare data - wrapping individual data transformations in a map() method
    const maintenance_requestsData = data.map((item, index) => ({
      id: item.id || undefined,

      description: item.description || null,
      status: item.status || null,
      request_date: item.request_date || null,
      importHash: item.importHash || null,
      createdById: currentUser.id,
      updatedById: currentUser.id,
      createdAt: new Date(Date.now() + index * 1000),
    }));

    // Bulk create items
    const maintenance_requests = await db.maintenance_requests.bulkCreate(
      maintenance_requestsData,
      { transaction },
    );

    // For each item created, replace relation files

    return maintenance_requests;
  }

  static async update(id, data, options) {
    const currentUser = (options && options.currentUser) || { id: null };
    const transaction = (options && options.transaction) || undefined;

    const maintenance_requests = await db.maintenance_requests.findByPk(
      id,
      {},
      { transaction },
    );

    const updatePayload = {};

    if (data.description !== undefined)
      updatePayload.description = data.description;

    if (data.status !== undefined) updatePayload.status = data.status;

    if (data.request_date !== undefined)
      updatePayload.request_date = data.request_date;

    updatePayload.updatedById = currentUser.id;

    await maintenance_requests.update(updatePayload, { transaction });

    if (data.unit !== undefined) {
      await maintenance_requests.setUnit(
        data.unit,

        { transaction },
      );
    }

    return maintenance_requests;
  }

  static async deleteByIds(ids, options) {
    const currentUser = (options && options.currentUser) || { id: null };
    const transaction = (options && options.transaction) || undefined;

    const maintenance_requests = await db.maintenance_requests.findAll({
      where: {
        id: {
          [Op.in]: ids,
        },
      },
      transaction,
    });

    await db.sequelize.transaction(async (transaction) => {
      for (const record of maintenance_requests) {
        await record.update({ deletedBy: currentUser.id }, { transaction });
      }
      for (const record of maintenance_requests) {
        await record.destroy({ transaction });
      }
    });

    return maintenance_requests;
  }

  static async remove(id, options) {
    const currentUser = (options && options.currentUser) || { id: null };
    const transaction = (options && options.transaction) || undefined;

    const maintenance_requests = await db.maintenance_requests.findByPk(
      id,
      options,
    );

    await maintenance_requests.update(
      {
        deletedBy: currentUser.id,
      },
      {
        transaction,
      },
    );

    await maintenance_requests.destroy({
      transaction,
    });

    return maintenance_requests;
  }

  static async findBy(where, options) {
    const transaction = (options && options.transaction) || undefined;

    const maintenance_requests = await db.maintenance_requests.findOne(
      { where },
      { transaction },
    );

    if (!maintenance_requests) {
      return maintenance_requests;
    }

    const output = maintenance_requests.get({ plain: true });

    output.unit = await maintenance_requests.getUnit({
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
        model: db.units,
        as: 'unit',

        where: filter.unit
          ? {
              [Op.or]: [
                {
                  id: {
                    [Op.in]: filter.unit
                      .split('|')
                      .map((term) => Utils.uuid(term)),
                  },
                },
                {
                  unit_number: {
                    [Op.or]: filter.unit
                      .split('|')
                      .map((term) => ({ [Op.iLike]: `%${term}%` })),
                  },
                },
              ],
            }
          : {},
      },
    ];

    if (filter) {
      if (filter.id) {
        where = {
          ...where,
          ['id']: Utils.uuid(filter.id),
        };
      }

      if (filter.description) {
        where = {
          ...where,
          [Op.and]: Utils.ilike(
            'maintenance_requests',
            'description',
            filter.description,
          ),
        };
      }

      if (filter.request_dateRange) {
        const [start, end] = filter.request_dateRange;

        if (start !== undefined && start !== null && start !== '') {
          where = {
            ...where,
            request_date: {
              ...where.request_date,
              [Op.gte]: start,
            },
          };
        }

        if (end !== undefined && end !== null && end !== '') {
          where = {
            ...where,
            request_date: {
              ...where.request_date,
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

      if (filter.status) {
        where = {
          ...where,
          status: filter.status,
        };
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
      const { rows, count } = await db.maintenance_requests.findAndCountAll(
        queryOptions,
      );

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
          Utils.ilike('maintenance_requests', 'description', query),
        ],
      };
    }

    const records = await db.maintenance_requests.findAll({
      attributes: ['id', 'description'],
      where,
      limit: limit ? Number(limit) : undefined,
      offset: offset ? Number(offset) : undefined,
      orderBy: [['description', 'ASC']],
    });

    return records.map((record) => ({
      id: record.id,
      label: record.description,
    }));
  }
};
