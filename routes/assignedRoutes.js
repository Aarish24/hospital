const express = require('express');
const router = express.Router();
const assignedController = require('../controllers/assignedController');

// API Routes
// GET all room assignments
router.get('/', assignedController.getAllAssignments);

// GET assignment by room ID
router.get('/:roomId', assignedController.getAssignmentByRoomId);

// GET assignments by patient
router.get('/patient/:patientId', assignedController.getAssignmentsByPatient);

// POST create new room assignment
router.post('/', assignedController.createAssignment);

// PUT update room assignment
router.put('/:roomId', assignedController.updateAssignment);

// DELETE room assignment
router.delete('/:roomId', assignedController.deleteAssignment);

// Web Routes
// GET assignments page
router.get('/view/all', assignedController.renderAssignments);

// GET add assignment page
router.get('/view/add', assignedController.renderAddAssignment);

// GET edit assignment page
router.get('/view/edit/:roomId', assignedController.renderEditAssignment);

module.exports = router;