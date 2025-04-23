const express = require('express');
const router = express.Router();
const consultController = require('../controllers/consultController');

// API Routes
// GET all consultations
router.get('/', consultController.getAllConsultations);

// GET consultations by patient
router.get('/patient/:patientId', consultController.getConsultationsByPatient);

// GET consultations by doctor
router.get('/doctor/:doctorId', consultController.getConsultationsByDoctor);

// GET consultation by patient and doctor IDs
router.get('/:patientId/:doctorId', consultController.getConsultationById);

// POST create new consultation
router.post('/', consultController.createConsultation);

// DELETE consultation
router.delete('/:patientId/:doctorId', consultController.deleteConsultation);

// Web Routes
// GET consultations page
router.get('/view/all', consultController.renderConsultations);

// GET add consultation page
router.get('/view/add', consultController.renderAddConsultation);

module.exports = router;