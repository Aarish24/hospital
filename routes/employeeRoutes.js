const express = require('express');
const router = express.Router();
const employeeController = require('../controllers/employeeController');

// API Routes
// GET all employees
router.get('/', employeeController.getAllEmployees);

// GET employee by ID
router.get('/:id', employeeController.getEmployeeById);

// GET employees by role
router.get('/role/:role', employeeController.getEmployeesByRole);

// POST create new employee
router.post('/', employeeController.createEmployee);

// PUT update employee
router.put('/:id', employeeController.updateEmployee);

// DELETE employee
router.delete('/:id', employeeController.deleteEmployee);

// Web Routes
// GET employees page
router.get('/view/all', employeeController.renderEmployees);

// GET add employee page
router.get('/view/add', employeeController.renderAddEmployee);

// GET edit employee page
router.get('/view/edit/:id', employeeController.renderEditEmployee);

module.exports = router;