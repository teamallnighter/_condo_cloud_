const db = require('../models');
const Users = db.users;

const Budgets = db.budgets;

const Documents = db.documents;

const MaintenanceRequests = db.maintenance_requests;

const Notices = db.notices;

const Units = db.units;

const BudgetsData = [
  {
    year: 2023,

    total_budget: 50000,

    expenses: 20000,
  },

  {
    year: 2022,

    total_budget: 48000,

    expenses: 22000,
  },

  {
    year: 2021,

    total_budget: 47000,

    expenses: 21000,
  },

  {
    year: 2020,

    total_budget: 46000,

    expenses: 23000,
  },
];

const DocumentsData = [
  {
    name: 'Bylaws',

    // type code here for "files" field

    // type code here for "relation_many" field
  },

  {
    name: 'Annual Report',

    // type code here for "files" field

    // type code here for "relation_many" field
  },

  {
    name: 'Meeting Minutes',

    // type code here for "files" field

    // type code here for "relation_many" field
  },

  {
    name: 'Budget Plan',

    // type code here for "files" field

    // type code here for "relation_many" field
  },
];

const MaintenanceRequestsData = [
  {
    // type code here for "relation_one" field

    description: 'Leaking faucet in kitchen',

    status: 'completed',

    request_date: new Date('2023-10-01T10:00:00Z'),
  },

  {
    // type code here for "relation_one" field

    description: 'Broken window in living room',

    status: 'in_progress',

    request_date: new Date('2023-09-25T14:30:00Z'),
  },

  {
    // type code here for "relation_one" field

    description: 'Heating not working',

    status: 'pending',

    request_date: new Date('2023-09-20T09:00:00Z'),
  },

  {
    // type code here for "relation_one" field

    description: 'Elevator malfunction',

    status: 'in_progress',

    request_date: new Date('2023-10-02T11:15:00Z'),
  },
];

const NoticesData = [
  {
    // type code here for "relation_many" field

    title: 'Annual Meeting',

    content: 'The annual meeting will be held on October 15th.',

    sent_date: new Date('2023-09-30T08:00:00Z'),
  },

  {
    // type code here for "relation_many" field

    title: 'Maintenance Update',

    content: 'Elevator maintenance scheduled for October 5th.',

    sent_date: new Date('2023-09-29T09:30:00Z'),
  },

  {
    // type code here for "relation_many" field

    title: 'New Bylaws',

    content: 'Please review the updated bylaws attached.',

    sent_date: new Date('2023-09-27T10:00:00Z'),
  },

  {
    // type code here for "relation_many" field

    title: 'Special Assessment',

    content: 'A special assessment will be applied next month.',

    sent_date: new Date('2023-09-26T11:00:00Z'),
  },
];

const UnitsData = [
  {
    unit_number: '101',

    // type code here for "relation_one" field

    balance: 250,

    unit_factor: 3,
  },

  {
    unit_number: '102',

    // type code here for "relation_one" field

    balance: 0,

    unit_factor: 7,
  },

  {
    unit_number: '103',

    // type code here for "relation_one" field

    balance: 150,

    unit_factor: 8,
  },

  {
    unit_number: '104',

    // type code here for "relation_one" field

    balance: 0,

    unit_factor: 6,
  },
];

// Similar logic for "relation_many"

// Similar logic for "relation_many"

async function associateMaintenanceRequestWithUnit() {
  const relatedUnit0 = await Units.findOne({
    offset: Math.floor(Math.random() * (await Units.count())),
  });
  const MaintenanceRequest0 = await MaintenanceRequests.findOne({
    order: [['id', 'ASC']],
    offset: 0,
  });
  if (MaintenanceRequest0?.setUnit) {
    await MaintenanceRequest0.setUnit(relatedUnit0);
  }

  const relatedUnit1 = await Units.findOne({
    offset: Math.floor(Math.random() * (await Units.count())),
  });
  const MaintenanceRequest1 = await MaintenanceRequests.findOne({
    order: [['id', 'ASC']],
    offset: 1,
  });
  if (MaintenanceRequest1?.setUnit) {
    await MaintenanceRequest1.setUnit(relatedUnit1);
  }

  const relatedUnit2 = await Units.findOne({
    offset: Math.floor(Math.random() * (await Units.count())),
  });
  const MaintenanceRequest2 = await MaintenanceRequests.findOne({
    order: [['id', 'ASC']],
    offset: 2,
  });
  if (MaintenanceRequest2?.setUnit) {
    await MaintenanceRequest2.setUnit(relatedUnit2);
  }

  const relatedUnit3 = await Units.findOne({
    offset: Math.floor(Math.random() * (await Units.count())),
  });
  const MaintenanceRequest3 = await MaintenanceRequests.findOne({
    order: [['id', 'ASC']],
    offset: 3,
  });
  if (MaintenanceRequest3?.setUnit) {
    await MaintenanceRequest3.setUnit(relatedUnit3);
  }
}

// Similar logic for "relation_many"

async function associateUnitWithOwner() {
  const relatedOwner0 = await Users.findOne({
    offset: Math.floor(Math.random() * (await Users.count())),
  });
  const Unit0 = await Units.findOne({
    order: [['id', 'ASC']],
    offset: 0,
  });
  if (Unit0?.setOwner) {
    await Unit0.setOwner(relatedOwner0);
  }

  const relatedOwner1 = await Users.findOne({
    offset: Math.floor(Math.random() * (await Users.count())),
  });
  const Unit1 = await Units.findOne({
    order: [['id', 'ASC']],
    offset: 1,
  });
  if (Unit1?.setOwner) {
    await Unit1.setOwner(relatedOwner1);
  }

  const relatedOwner2 = await Users.findOne({
    offset: Math.floor(Math.random() * (await Users.count())),
  });
  const Unit2 = await Units.findOne({
    order: [['id', 'ASC']],
    offset: 2,
  });
  if (Unit2?.setOwner) {
    await Unit2.setOwner(relatedOwner2);
  }

  const relatedOwner3 = await Users.findOne({
    offset: Math.floor(Math.random() * (await Users.count())),
  });
  const Unit3 = await Units.findOne({
    order: [['id', 'ASC']],
    offset: 3,
  });
  if (Unit3?.setOwner) {
    await Unit3.setOwner(relatedOwner3);
  }
}

module.exports = {
  up: async (queryInterface, Sequelize) => {
    await Budgets.bulkCreate(BudgetsData);

    await Documents.bulkCreate(DocumentsData);

    await MaintenanceRequests.bulkCreate(MaintenanceRequestsData);

    await Notices.bulkCreate(NoticesData);

    await Units.bulkCreate(UnitsData);

    await Promise.all([
      // Similar logic for "relation_many"

      // Similar logic for "relation_many"

      await associateMaintenanceRequestWithUnit(),

      // Similar logic for "relation_many"

      await associateUnitWithOwner(),
    ]);
  },

  down: async (queryInterface, Sequelize) => {
    await queryInterface.bulkDelete('budgets', null, {});

    await queryInterface.bulkDelete('documents', null, {});

    await queryInterface.bulkDelete('maintenance_requests', null, {});

    await queryInterface.bulkDelete('notices', null, {});

    await queryInterface.bulkDelete('units', null, {});
  },
};
