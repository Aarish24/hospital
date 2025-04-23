const express = require('express');
const router = express.Router();
const recordController = require('../controllers/recordController');

// API Routes
// GET all records
router.get('/', recordController.getAllRecords);

// GET record by ID
router.get('/:id', recordController.getRecordById);

// GET records by employee
router.get('/employee/:employeeId', recordController.getRecordsByEmployee);

// POST create new record
router.post('/', recordController.createRecord);

// PUT update record
router.put('/:id', recordController.updateRecord);

// DELETE record
router.delete('/:id', recordController.deleteRecord);

// Web Routes
// GET records page
router.get('/view/all', recordController.renderRecords);

// GET add record page
router.get('/view/add', recordController.renderAddRecord);

// GET edit record page
router.get('/view/edit/:id', recordController.renderEditRecord);

module.exports = router;