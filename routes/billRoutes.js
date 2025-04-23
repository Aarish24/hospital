const express = require('express');
const router = express.Router();
const billController = require('../controllers/billController');

// API Routes
// GET all bills
router.get('/', billController.getAllBills);

// GET bill by ID
router.get('/:id', billController.getBillById);

// GET bills by patient
router.get('/patient/:patientId', billController.getBillsByPatient);

// GET total bill amount for a patient
router.get('/patient/:patientId/total', billController.getTotalBillByPatient);

// POST create new bill
router.post('/', billController.createBill);

// PUT update bill
router.put('/:id', billController.updateBill);

// DELETE bill
router.delete('/:id', billController.deleteBill);

// Web Routes
// GET bills page
router.get('/view/all', billController.renderBills);

// GET add bill page
router.get('/view/add', billController.renderAddBill);

// GET edit bill page
router.get('/view/edit/:id', billController.renderEditBill);

module.exports = router;