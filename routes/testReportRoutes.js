const express = require('express');
const router = express.Router();
const testReportController = require('../controllers/testReportController');

// API Routes
// GET all test reports
router.get('/', testReportController.getAllTestReports);

// GET test report by ID
router.get('/:id', testReportController.getTestReportById);

// GET test reports by patient
router.get('/patient/:patientId', testReportController.getTestReportsByPatient);

// POST create new test report
router.post('/', testReportController.createTestReport);

// PUT update test report
router.put('/:id', testReportController.updateTestReport);

// DELETE test report
router.delete('/:id', testReportController.deleteTestReport);

// Web Routes
// GET test reports page
router.get('/view/all', testReportController.renderTestReports);

// GET add test report page
router.get('/view/add', testReportController.renderAddTestReport);

// GET edit test report page
router.get('/view/edit/:id', testReportController.renderEditTestReport);

module.exports = router;