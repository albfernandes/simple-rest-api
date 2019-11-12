const mainRoute = require('express').Router();
const crudController = require('../controllers/crudController');

mainRoute.post('/rules', crudController.addRule);

mainRoute.get('/rules', crudController.listRules);

mainRoute.delete('/rules', crudController.removeRule);

mainRoute.post('/schedules', crudController.listSchedules);

module.exports = mainRoute;