const express = require('express');
const router = express.Router();
const doctorController = require('../controllers/doctorController');

// API Routes
// GET all doctors
router.get('/', doctorController.getAllDoctors);

// GET doctor by ID
router.get('/:id', doctorController.getDoctorById);

// GET doctors by department
router.get('/department/:dept', doctorController.getDoctorsByDepartment);

// POST create new doctor
router.post('/', doctorController.createDoctor);

// PUT update doctor
router.put('/:id', doctorController.updateDoctor);

// DELETE doctor
router.delete('/:id', doctorController.deleteDoctor);

// Web Routes
// GET doctors page
router.get('/view/all', doctorController.renderDoctors);

// GET add doctor page
router.get('/view/add', doctorController.renderAddDoctor);

// GET edit doctor page
router.get('/view/edit/:id', doctorController.renderEditDoctor);

module.exports = router;