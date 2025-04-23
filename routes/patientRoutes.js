const express = require('express');
const router = express.Router();
const patientController = require('../controllers/patientController');

// API Routes
// GET all patients
router.get('/', patientController.getAllPatients);

// GET patient by ID
router.get('/:id', patientController.getPatientById);

// POST create new patient
router.post('/', patientController.createPatient);

// PUT update patient
router.put('/:id', patientController.updatePatient);

// DELETE patient
router.delete('/:id', patientController.deletePatient);

// Web Routes
// GET patients page
router.get('/view/all', patientController.renderPatients);

// GET add patient page
router.get('/view/add', patientController.renderAddPatient);

// GET edit patient page
router.get('/view/edit/:id', patientController.renderEditPatient);

module.exports = router;