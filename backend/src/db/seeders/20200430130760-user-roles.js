const { v4: uuid } = require('uuid');

module.exports = {
  /**
   * @param{import("sequelize").QueryInterface} queryInterface
   * @return {Promise<void>}
   */
  async up(queryInterface) {
    const createdAt = new Date();
    const updatedAt = new Date();

    /** @type {Map<string, string>} */
    const idMap = new Map();

    /**
     * @param {string} key
     * @return {string}
     */
    function getId(key) {
      if (idMap.has(key)) {
        return idMap.get(key);
      }
      const id = uuid();
      idMap.set(key, id);
      return id;
    }

    await queryInterface.bulkInsert('roles', [
      {
        id: getId('Administrator'),
        name: 'Administrator',
        createdAt,
        updatedAt,
      },

      {
        id: getId('CondoManager'),
        name: 'Condo Manager',
        createdAt,
        updatedAt,
      },

      {
        id: getId('BoardPresident'),
        name: 'Board President',
        createdAt,
        updatedAt,
      },

      { id: getId('BoardMember'), name: 'Board Member', createdAt, updatedAt },

      { id: getId('Owner'), name: 'Owner', createdAt, updatedAt },

      { id: getId('Guest'), name: 'Guest', createdAt, updatedAt },

      { id: getId('Public'), name: 'Public', createdAt, updatedAt },
    ]);

    /**
     * @param {string} name
     */
    function createPermissions(name) {
      return [
        {
          id: getId(`CREATE_${name.toUpperCase()}`),
          createdAt,
          updatedAt,
          name: `CREATE_${name.toUpperCase()}`,
        },
        {
          id: getId(`READ_${name.toUpperCase()}`),
          createdAt,
          updatedAt,
          name: `READ_${name.toUpperCase()}`,
        },
        {
          id: getId(`UPDATE_${name.toUpperCase()}`),
          createdAt,
          updatedAt,
          name: `UPDATE_${name.toUpperCase()}`,
        },
        {
          id: getId(`DELETE_${name.toUpperCase()}`),
          createdAt,
          updatedAt,
          name: `DELETE_${name.toUpperCase()}`,
        },
      ];
    }

    const entities = [
      'users',
      'budgets',
      'documents',
      'maintenance_requests',
      'notices',
      'units',
      'roles',
      'permissions',
      'owners',
      ,
    ];
    await queryInterface.bulkInsert(
      'permissions',
      entities.flatMap(createPermissions),
    );
    await queryInterface.bulkInsert('permissions', [
      {
        id: getId(`READ_API_DOCS`),
        createdAt,
        updatedAt,
        name: `READ_API_DOCS`,
      },
    ]);
    await queryInterface.bulkInsert('permissions', [
      {
        id: getId(`CREATE_SEARCH`),
        createdAt,
        updatedAt,
        name: `CREATE_SEARCH`,
      },
    ]);

    await queryInterface.sequelize
      .query(`create table "rolesPermissionsPermissions"
(
"createdAt"           timestamp with time zone not null,
"updatedAt"           timestamp with time zone not null,
"roles_permissionsId" uuid                     not null,
"permissionId"        uuid                     not null,
primary key ("roles_permissionsId", "permissionId")
);`);

    await queryInterface.bulkInsert('rolesPermissionsPermissions', [
      {
        createdAt,
        updatedAt,
        roles_permissionsId: getId('CondoManager'),
        permissionId: getId('CREATE_USERS'),
      },

      {
        createdAt,
        updatedAt,
        roles_permissionsId: getId('CondoManager'),
        permissionId: getId('READ_USERS'),
      },

      {
        createdAt,
        updatedAt,
        roles_permissionsId: getId('CondoManager'),
        permissionId: getId('UPDATE_USERS'),
      },

      {
        createdAt,
        updatedAt,
        roles_permissionsId: getId('CondoManager'),
        permissionId: getId('DELETE_USERS'),
      },

      {
        createdAt,
        updatedAt,
        roles_permissionsId: getId('BoardPresident'),
        permissionId: getId('READ_USERS'),
      },

      {
        createdAt,
        updatedAt,
        roles_permissionsId: getId('BoardPresident'),
        permissionId: getId('UPDATE_USERS'),
      },

      {
        createdAt,
        updatedAt,
        roles_permissionsId: getId('BoardPresident'),
        permissionId: getId('DELETE_USERS'),
      },

      {
        createdAt,
        updatedAt,
        roles_permissionsId: getId('BoardMember'),
        permissionId: getId('READ_USERS'),
      },

      {
        createdAt,
        updatedAt,
        roles_permissionsId: getId('BoardMember'),
        permissionId: getId('UPDATE_USERS'),
      },

      {
        createdAt,
        updatedAt,
        roles_permissionsId: getId('Owner'),
        permissionId: getId('READ_USERS'),
      },

      {
        createdAt,
        updatedAt,
        roles_permissionsId: getId('CondoManager'),
        permissionId: getId('CREATE_BUDGETS'),
      },

      {
        createdAt,
        updatedAt,
        roles_permissionsId: getId('CondoManager'),
        permissionId: getId('READ_BUDGETS'),
      },

      {
        createdAt,
        updatedAt,
        roles_permissionsId: getId('CondoManager'),
        permissionId: getId('UPDATE_BUDGETS'),
      },

      {
        createdAt,
        updatedAt,
        roles_permissionsId: getId('CondoManager'),
        permissionId: getId('DELETE_BUDGETS'),
      },

      {
        createdAt,
        updatedAt,
        roles_permissionsId: getId('BoardPresident'),
        permissionId: getId('CREATE_BUDGETS'),
      },

      {
        createdAt,
        updatedAt,
        roles_permissionsId: getId('BoardPresident'),
        permissionId: getId('READ_BUDGETS'),
      },

      {
        createdAt,
        updatedAt,
        roles_permissionsId: getId('BoardPresident'),
        permissionId: getId('UPDATE_BUDGETS'),
      },

      {
        createdAt,
        updatedAt,
        roles_permissionsId: getId('BoardPresident'),
        permissionId: getId('DELETE_BUDGETS'),
      },

      {
        createdAt,
        updatedAt,
        roles_permissionsId: getId('BoardMember'),
        permissionId: getId('CREATE_BUDGETS'),
      },

      {
        createdAt,
        updatedAt,
        roles_permissionsId: getId('BoardMember'),
        permissionId: getId('READ_BUDGETS'),
      },

      {
        createdAt,
        updatedAt,
        roles_permissionsId: getId('BoardMember'),
        permissionId: getId('UPDATE_BUDGETS'),
      },

      {
        createdAt,
        updatedAt,
        roles_permissionsId: getId('Owner'),
        permissionId: getId('READ_BUDGETS'),
      },

      {
        createdAt,
        updatedAt,
        roles_permissionsId: getId('CondoManager'),
        permissionId: getId('CREATE_DOCUMENTS'),
      },

      {
        createdAt,
        updatedAt,
        roles_permissionsId: getId('CondoManager'),
        permissionId: getId('READ_DOCUMENTS'),
      },

      {
        createdAt,
        updatedAt,
        roles_permissionsId: getId('CondoManager'),
        permissionId: getId('UPDATE_DOCUMENTS'),
      },

      {
        createdAt,
        updatedAt,
        roles_permissionsId: getId('CondoManager'),
        permissionId: getId('DELETE_DOCUMENTS'),
      },

      {
        createdAt,
        updatedAt,
        roles_permissionsId: getId('BoardPresident'),
        permissionId: getId('CREATE_DOCUMENTS'),
      },

      {
        createdAt,
        updatedAt,
        roles_permissionsId: getId('BoardPresident'),
        permissionId: getId('READ_DOCUMENTS'),
      },

      {
        createdAt,
        updatedAt,
        roles_permissionsId: getId('BoardPresident'),
        permissionId: getId('UPDATE_DOCUMENTS'),
      },

      {
        createdAt,
        updatedAt,
        roles_permissionsId: getId('BoardPresident'),
        permissionId: getId('DELETE_DOCUMENTS'),
      },

      {
        createdAt,
        updatedAt,
        roles_permissionsId: getId('BoardMember'),
        permissionId: getId('CREATE_DOCUMENTS'),
      },

      {
        createdAt,
        updatedAt,
        roles_permissionsId: getId('BoardMember'),
        permissionId: getId('READ_DOCUMENTS'),
      },

      {
        createdAt,
        updatedAt,
        roles_permissionsId: getId('BoardMember'),
        permissionId: getId('UPDATE_DOCUMENTS'),
      },

      {
        createdAt,
        updatedAt,
        roles_permissionsId: getId('Owner'),
        permissionId: getId('READ_DOCUMENTS'),
      },

      {
        createdAt,
        updatedAt,
        roles_permissionsId: getId('CondoManager'),
        permissionId: getId('CREATE_MAINTENANCE_REQUESTS'),
      },

      {
        createdAt,
        updatedAt,
        roles_permissionsId: getId('CondoManager'),
        permissionId: getId('READ_MAINTENANCE_REQUESTS'),
      },

      {
        createdAt,
        updatedAt,
        roles_permissionsId: getId('CondoManager'),
        permissionId: getId('UPDATE_MAINTENANCE_REQUESTS'),
      },

      {
        createdAt,
        updatedAt,
        roles_permissionsId: getId('CondoManager'),
        permissionId: getId('DELETE_MAINTENANCE_REQUESTS'),
      },

      {
        createdAt,
        updatedAt,
        roles_permissionsId: getId('BoardPresident'),
        permissionId: getId('CREATE_MAINTENANCE_REQUESTS'),
      },

      {
        createdAt,
        updatedAt,
        roles_permissionsId: getId('BoardPresident'),
        permissionId: getId('READ_MAINTENANCE_REQUESTS'),
      },

      {
        createdAt,
        updatedAt,
        roles_permissionsId: getId('BoardPresident'),
        permissionId: getId('UPDATE_MAINTENANCE_REQUESTS'),
      },

      {
        createdAt,
        updatedAt,
        roles_permissionsId: getId('BoardPresident'),
        permissionId: getId('DELETE_MAINTENANCE_REQUESTS'),
      },

      {
        createdAt,
        updatedAt,
        roles_permissionsId: getId('BoardMember'),
        permissionId: getId('CREATE_MAINTENANCE_REQUESTS'),
      },

      {
        createdAt,
        updatedAt,
        roles_permissionsId: getId('BoardMember'),
        permissionId: getId('READ_MAINTENANCE_REQUESTS'),
      },

      {
        createdAt,
        updatedAt,
        roles_permissionsId: getId('BoardMember'),
        permissionId: getId('UPDATE_MAINTENANCE_REQUESTS'),
      },

      {
        createdAt,
        updatedAt,
        roles_permissionsId: getId('Owner'),
        permissionId: getId('CREATE_MAINTENANCE_REQUESTS'),
      },

      {
        createdAt,
        updatedAt,
        roles_permissionsId: getId('Owner'),
        permissionId: getId('READ_MAINTENANCE_REQUESTS'),
      },

      {
        createdAt,
        updatedAt,
        roles_permissionsId: getId('CondoManager'),
        permissionId: getId('CREATE_NOTICES'),
      },

      {
        createdAt,
        updatedAt,
        roles_permissionsId: getId('CondoManager'),
        permissionId: getId('READ_NOTICES'),
      },

      {
        createdAt,
        updatedAt,
        roles_permissionsId: getId('CondoManager'),
        permissionId: getId('UPDATE_NOTICES'),
      },

      {
        createdAt,
        updatedAt,
        roles_permissionsId: getId('CondoManager'),
        permissionId: getId('DELETE_NOTICES'),
      },

      {
        createdAt,
        updatedAt,
        roles_permissionsId: getId('BoardPresident'),
        permissionId: getId('CREATE_NOTICES'),
      },

      {
        createdAt,
        updatedAt,
        roles_permissionsId: getId('BoardPresident'),
        permissionId: getId('READ_NOTICES'),
      },

      {
        createdAt,
        updatedAt,
        roles_permissionsId: getId('BoardPresident'),
        permissionId: getId('UPDATE_NOTICES'),
      },

      {
        createdAt,
        updatedAt,
        roles_permissionsId: getId('BoardPresident'),
        permissionId: getId('DELETE_NOTICES'),
      },

      {
        createdAt,
        updatedAt,
        roles_permissionsId: getId('BoardMember'),
        permissionId: getId('CREATE_NOTICES'),
      },

      {
        createdAt,
        updatedAt,
        roles_permissionsId: getId('BoardMember'),
        permissionId: getId('READ_NOTICES'),
      },

      {
        createdAt,
        updatedAt,
        roles_permissionsId: getId('BoardMember'),
        permissionId: getId('UPDATE_NOTICES'),
      },

      {
        createdAt,
        updatedAt,
        roles_permissionsId: getId('Owner'),
        permissionId: getId('READ_NOTICES'),
      },

      {
        createdAt,
        updatedAt,
        roles_permissionsId: getId('CondoManager'),
        permissionId: getId('CREATE_UNITS'),
      },

      {
        createdAt,
        updatedAt,
        roles_permissionsId: getId('CondoManager'),
        permissionId: getId('READ_UNITS'),
      },

      {
        createdAt,
        updatedAt,
        roles_permissionsId: getId('CondoManager'),
        permissionId: getId('UPDATE_UNITS'),
      },

      {
        createdAt,
        updatedAt,
        roles_permissionsId: getId('CondoManager'),
        permissionId: getId('DELETE_UNITS'),
      },

      {
        createdAt,
        updatedAt,
        roles_permissionsId: getId('BoardPresident'),
        permissionId: getId('READ_UNITS'),
      },

      {
        createdAt,
        updatedAt,
        roles_permissionsId: getId('BoardPresident'),
        permissionId: getId('UPDATE_UNITS'),
      },

      {
        createdAt,
        updatedAt,
        roles_permissionsId: getId('BoardPresident'),
        permissionId: getId('DELETE_UNITS'),
      },

      {
        createdAt,
        updatedAt,
        roles_permissionsId: getId('BoardMember'),
        permissionId: getId('READ_UNITS'),
      },

      {
        createdAt,
        updatedAt,
        roles_permissionsId: getId('BoardMember'),
        permissionId: getId('UPDATE_UNITS'),
      },

      {
        createdAt,
        updatedAt,
        roles_permissionsId: getId('Owner'),
        permissionId: getId('READ_UNITS'),
      },

      {
        createdAt,
        updatedAt,
        roles_permissionsId: getId('CondoManager'),
        permissionId: getId('CREATE_SEARCH'),
      },

      {
        createdAt,
        updatedAt,
        roles_permissionsId: getId('BoardPresident'),
        permissionId: getId('CREATE_SEARCH'),
      },

      {
        createdAt,
        updatedAt,
        roles_permissionsId: getId('BoardMember'),
        permissionId: getId('CREATE_SEARCH'),
      },

      {
        createdAt,
        updatedAt,
        roles_permissionsId: getId('Owner'),
        permissionId: getId('CREATE_SEARCH'),
      },

      {
        createdAt,
        updatedAt,
        roles_permissionsId: getId('Guest'),
        permissionId: getId('CREATE_SEARCH'),
      },

      {
        createdAt,
        updatedAt,
        roles_permissionsId: getId('Administrator'),
        permissionId: getId('CREATE_USERS'),
      },
      {
        createdAt,
        updatedAt,
        roles_permissionsId: getId('Administrator'),
        permissionId: getId('READ_USERS'),
      },
      {
        createdAt,
        updatedAt,
        roles_permissionsId: getId('Administrator'),
        permissionId: getId('UPDATE_USERS'),
      },
      {
        createdAt,
        updatedAt,
        roles_permissionsId: getId('Administrator'),
        permissionId: getId('DELETE_USERS'),
      },

      {
        createdAt,
        updatedAt,
        roles_permissionsId: getId('Administrator'),
        permissionId: getId('CREATE_BUDGETS'),
      },
      {
        createdAt,
        updatedAt,
        roles_permissionsId: getId('Administrator'),
        permissionId: getId('READ_BUDGETS'),
      },
      {
        createdAt,
        updatedAt,
        roles_permissionsId: getId('Administrator'),
        permissionId: getId('UPDATE_BUDGETS'),
      },
      {
        createdAt,
        updatedAt,
        roles_permissionsId: getId('Administrator'),
        permissionId: getId('DELETE_BUDGETS'),
      },

      {
        createdAt,
        updatedAt,
        roles_permissionsId: getId('Administrator'),
        permissionId: getId('CREATE_DOCUMENTS'),
      },
      {
        createdAt,
        updatedAt,
        roles_permissionsId: getId('Administrator'),
        permissionId: getId('READ_DOCUMENTS'),
      },
      {
        createdAt,
        updatedAt,
        roles_permissionsId: getId('Administrator'),
        permissionId: getId('UPDATE_DOCUMENTS'),
      },
      {
        createdAt,
        updatedAt,
        roles_permissionsId: getId('Administrator'),
        permissionId: getId('DELETE_DOCUMENTS'),
      },

      {
        createdAt,
        updatedAt,
        roles_permissionsId: getId('Administrator'),
        permissionId: getId('CREATE_MAINTENANCE_REQUESTS'),
      },
      {
        createdAt,
        updatedAt,
        roles_permissionsId: getId('Administrator'),
        permissionId: getId('READ_MAINTENANCE_REQUESTS'),
      },
      {
        createdAt,
        updatedAt,
        roles_permissionsId: getId('Administrator'),
        permissionId: getId('UPDATE_MAINTENANCE_REQUESTS'),
      },
      {
        createdAt,
        updatedAt,
        roles_permissionsId: getId('Administrator'),
        permissionId: getId('DELETE_MAINTENANCE_REQUESTS'),
      },

      {
        createdAt,
        updatedAt,
        roles_permissionsId: getId('Administrator'),
        permissionId: getId('CREATE_NOTICES'),
      },
      {
        createdAt,
        updatedAt,
        roles_permissionsId: getId('Administrator'),
        permissionId: getId('READ_NOTICES'),
      },
      {
        createdAt,
        updatedAt,
        roles_permissionsId: getId('Administrator'),
        permissionId: getId('UPDATE_NOTICES'),
      },
      {
        createdAt,
        updatedAt,
        roles_permissionsId: getId('Administrator'),
        permissionId: getId('DELETE_NOTICES'),
      },

      {
        createdAt,
        updatedAt,
        roles_permissionsId: getId('Administrator'),
        permissionId: getId('CREATE_UNITS'),
      },
      {
        createdAt,
        updatedAt,
        roles_permissionsId: getId('Administrator'),
        permissionId: getId('READ_UNITS'),
      },
      {
        createdAt,
        updatedAt,
        roles_permissionsId: getId('Administrator'),
        permissionId: getId('UPDATE_UNITS'),
      },
      {
        createdAt,
        updatedAt,
        roles_permissionsId: getId('Administrator'),
        permissionId: getId('DELETE_UNITS'),
      },

      {
        createdAt,
        updatedAt,
        roles_permissionsId: getId('Administrator'),
        permissionId: getId('CREATE_ROLES'),
      },
      {
        createdAt,
        updatedAt,
        roles_permissionsId: getId('Administrator'),
        permissionId: getId('READ_ROLES'),
      },
      {
        createdAt,
        updatedAt,
        roles_permissionsId: getId('Administrator'),
        permissionId: getId('UPDATE_ROLES'),
      },
      {
        createdAt,
        updatedAt,
        roles_permissionsId: getId('Administrator'),
        permissionId: getId('DELETE_ROLES'),
      },

      {
        createdAt,
        updatedAt,
        roles_permissionsId: getId('Administrator'),
        permissionId: getId('CREATE_PERMISSIONS'),
      },
      {
        createdAt,
        updatedAt,
        roles_permissionsId: getId('Administrator'),
        permissionId: getId('READ_PERMISSIONS'),
      },
      {
        createdAt,
        updatedAt,
        roles_permissionsId: getId('Administrator'),
        permissionId: getId('UPDATE_PERMISSIONS'),
      },
      {
        createdAt,
        updatedAt,
        roles_permissionsId: getId('Administrator'),
        permissionId: getId('DELETE_PERMISSIONS'),
      },

      {
        createdAt,
        updatedAt,
        roles_permissionsId: getId('Administrator'),
        permissionId: getId('CREATE_OWNERS'),
      },
      {
        createdAt,
        updatedAt,
        roles_permissionsId: getId('Administrator'),
        permissionId: getId('READ_OWNERS'),
      },
      {
        createdAt,
        updatedAt,
        roles_permissionsId: getId('Administrator'),
        permissionId: getId('UPDATE_OWNERS'),
      },
      {
        createdAt,
        updatedAt,
        roles_permissionsId: getId('Administrator'),
        permissionId: getId('DELETE_OWNERS'),
      },

      {
        createdAt,
        updatedAt,
        roles_permissionsId: getId('Administrator'),
        permissionId: getId('READ_API_DOCS'),
      },
      {
        createdAt,
        updatedAt,
        roles_permissionsId: getId('Administrator'),
        permissionId: getId('CREATE_SEARCH'),
      },
    ]);

    await queryInterface.sequelize.query(
      `UPDATE "users" SET "app_roleId"='${getId(
        'SuperAdmin',
      )}' WHERE "email"='super_admin@flatlogic.com'`,
    );
    await queryInterface.sequelize.query(
      `UPDATE "users" SET "app_roleId"='${getId(
        'Administrator',
      )}' WHERE "email"='admin@flatlogic.com'`,
    );

    await queryInterface.sequelize.query(
      `UPDATE "users" SET "app_roleId"='${getId(
        'CondoManager',
      )}' WHERE "email"='client@hello.com'`,
    );
    await queryInterface.sequelize.query(
      `UPDATE "users" SET "app_roleId"='${getId(
        'BoardPresident',
      )}' WHERE "email"='john@doe.com'`,
    );
  },
};
