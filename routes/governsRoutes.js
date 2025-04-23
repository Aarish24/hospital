const express = require('express');
const router = express.Router();
const governsController = require('../controllers/governsController');

// API Routes
// GET all nurse-room assignments
router.get('/', governsController.getAllGovernAssignments);

// GET nurse-room assignment by IDs
router.get('/:nurseId/:roomId', governsController.getGovernAssignmentById);

// GET assignments by nurse
router.get('/nurse/:nurseId', governsController.getGovernAssignmentsByNurse);

// GET assignments by room
router.get('/room/:roomId', governsController.getGovernAssignmentsByRoom);

// POST create new nurse-room assignment
router.post('/', governsController.createGovernAssignment);

// DELETE nurse-room assignment
router.delete('/:nurseId/:roomId', governsController.deleteGovernAssignment);

// Web Routes
// GET governs assignments page
router.get('/view/all', governsController.renderGovernAssignments);

// GET add governs assignment page
router.get('/view/add', governsController.renderAddGovernAssignment);

module.exports = router;