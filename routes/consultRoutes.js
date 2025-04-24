const express = require('express');
const router = express.Router();
const consultController = require('../controllers/consultController');

// Web Routes - These need to come BEFORE the parameterized routes
// GET consultations page
router.get('/view/all', consultController.renderConsultations);

// GET add consultation page
router.get('/view/add', consultController.renderAddConsultation);

// API Routes
// GET all consultations
router.get('/', consultController.getAllConsultations);

// GET consultations by patient
router.get('/patient/:patientId', consultController.getConsultationsByPatient);

// GET consultations by doctor
router.get('/doctor/:doctorId', consultController.getConsultationsByDoctor);

// POST create new consultation
router.post('/', consultController.createConsultation);

// DELETE consultation
router.delete('/:patientId/:doctorId', consultController.deleteConsultation);

// GET consultation by patient and doctor IDs - This should be last as it's the most generic
router.get('/:patientId/:doctorId', consultController.getConsultationById);

module.exports = router;