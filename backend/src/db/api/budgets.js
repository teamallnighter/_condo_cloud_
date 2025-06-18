const db = require('../models');
const FileDBApi = require('./file');
const crypto = require('crypto');
const Utils = require('../utils');

const Sequelize = db.Sequelize;
const Op = Sequelize.Op;

module.exports = class BudgetsDBApi {
  static async create(data, options) {
    const currentUser = (options && options.currentUser) || { id: null };
    const transaction = (options && options.transaction) || undefined;

    const budgets = await db.budgets.create(
      {
        id: data.id || undefined,

        year: data.year || null,
        total_budget: data.total_budget || null,
        expenses: data.expenses || null,
        importHash: data.importHash || null,
        createdById: currentUser.id,
        updatedById: currentUser.id,
      },
      { transaction },
    );

    return budgets;
  }

  static async bulkImport(data, options) {
    const currentUser = (options && options.currentUser) || { id: null };
    const transaction = (options && options.transaction) || undefined;

    // Prepare data - wrapping individual data transformations in a map() method
    const budgetsData = data.map((item, index) => ({
      id: item.id || undefined,

      year: item.year || null,
      total_budget: item.total_budget || null,
      expenses: item.expenses || null,
      importHash: item.importHash || null,
      createdById: currentUser.id,
      updatedById: currentUser.id,
      createdAt: new Date(Date.now() + index * 1000),
    }));

    // Bulk create items
    const budgets = await db.budgets.bulkCreate(budgetsData, { transaction });

    // For each item created, replace relation files

    return budgets;
  }

  static async update(id, data, options) {
    const currentUser = (options && options.currentUser) || { id: null };
    const transaction = (options && options.transaction) || undefined;

    const budgets = await db.budgets.findByPk(id, {}, { transaction });

    const updatePayload = {};

    if (data.year !== undefined) updatePayload.year = data.year;

    if (data.total_budget !== undefined)
      updatePayload.total_budget = data.total_budget;

    if (data.expenses !== undefined) updatePayload.expenses = data.expenses;

    updatePayload.updatedById = currentUser.id;

    await budgets.update(updatePayload, { transaction });

    return budgets;
  }

  static async deleteByIds(ids, options) {
    const currentUser = (options && options.currentUser) || { id: null };
    const transaction = (options && options.transaction) || undefined;

    const budgets = await db.budgets.findAll({
      where: {
        id: {
          [Op.in]: ids,
        },
      },
      transaction,
    });

    await db.sequelize.transaction(async (transaction) => {
      for (const record of budgets) {
        await record.update({ deletedBy: currentUser.id }, { transaction });
      }
      for (const record of budgets) {
        await record.destroy({ transaction });
      }
    });

    return budgets;
  }

  static async remove(id, options) {
    const currentUser = (options && options.currentUser) || { id: null };
    const transaction = (options && options.transaction) || undefined;

    const budgets = await db.budgets.findByPk(id, options);

    await budgets.update(
      {
        deletedBy: currentUser.id,
      },
      {
        transaction,
      },
    );

    await budgets.destroy({
      transaction,
    });

    return budgets;
  }

  static async findBy(where, options) {
    const transaction = (options && options.transaction) || undefined;

    const budgets = await db.budgets.findOne({ where }, { transaction });

    if (!budgets) {
      return budgets;
    }

    const output = budgets.get({ plain: true });

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

    let include = [];

    if (filter) {
      if (filter.id) {
        where = {
          ...where,
          ['id']: Utils.uuid(filter.id),
        };
      }

      if (filter.yearRange) {
        const [start, end] = filter.yearRange;

        if (start !== undefined && start !== null && start !== '') {
          where = {
            ...where,
            year: {
              ...where.year,
              [Op.gte]: start,
            },
          };
        }

        if (end !== undefined && end !== null && end !== '') {
          where = {
            ...where,
            year: {
              ...where.year,
              [Op.lte]: end,
            },
          };
        }
      }

      if (filter.total_budgetRange) {
        const [start, end] = filter.total_budgetRange;

        if (start !== undefined && start !== null && start !== '') {
          where = {
            ...where,
            total_budget: {
              ...where.total_budget,
              [Op.gte]: start,
            },
          };
        }

        if (end !== undefined && end !== null && end !== '') {
          where = {
            ...where,
            total_budget: {
              ...where.total_budget,
              [Op.lte]: end,
            },
          };
        }
      }

      if (filter.expensesRange) {
        const [start, end] = filter.expensesRange;

        if (start !== undefined && start !== null && start !== '') {
          where = {
            ...where,
            expenses: {
              ...where.expenses,
              [Op.gte]: start,
            },
          };
        }

        if (end !== undefined && end !== null && end !== '') {
          where = {
            ...where,
            expenses: {
              ...where.expenses,
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
      const { rows, count } = await db.budgets.findAndCountAll(queryOptions);

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
          Utils.ilike('budgets', 'year', query),
        ],
      };
    }

    const records = await db.budgets.findAll({
      attributes: ['id', 'year'],
      where,
      limit: limit ? Number(limit) : undefined,
      offset: offset ? Number(offset) : undefined,
      orderBy: [['year', 'ASC']],
    });

    return records.map((record) => ({
      id: record.id,
      label: record.year,
    }));
  }
};
