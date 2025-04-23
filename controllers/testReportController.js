const db = require('../config/db');
const { v4: uuidv4 } = require('uuid');

// Get all test reports
exports.getAllTestReports = async (req, res) => {
  try {
    const result = await db.query(`
      SELECT tr.*, p.Name as PatientName, r.Type as RoomType 
      FROM Test_Report tr
      JOIN Patient p ON tr.P_ID = p.P_ID
      JOIN Rooms r ON tr.R_ID = r.R_ID
      ORDER BY tr.Report_ID
    `);
    res.status(200).json(result.rows);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

// Get test report by ID
exports.getTestReportById = async (req, res) => {
  try {
    const { id } = req.params;
    const result = await db.query(`
      SELECT tr.*, p.Name as PatientName, r.Type as RoomType 
      FROM Test_Report tr
      JOIN Patient p ON tr.P_ID = p.P_ID
      JOIN Rooms r ON tr.R_ID = r.R_ID
      WHERE tr.Report_ID = $1
    `, [id]);

    if (result.rows.length === 0) {
      return res.status(404).json({ message: 'Test report not found' });
    }

    res.status(200).json(result.rows[0]);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

// Create new test report
exports.createTestReport = async (req, res) => {
  try {
    const { p_id, r_id, test_type, result } = req.body;
    const reportId = `T${uuidv4().substring(0, 6)}`;

    // Check if patient exists
    const patientCheck = await db.query('SELECT * FROM Patient WHERE P_ID = $1', [p_id]);
    if (patientCheck.rows.length === 0) {
      return res.status(404).json({ message: 'Patient not found' });
    }

    // Check if room exists
    const roomCheck = await db.query('SELECT * FROM Rooms WHERE R_ID = $1', [r_id]);
    if (roomCheck.rows.length === 0) {
      return res.status(404).json({ message: 'Room not found' });
    }

    const insertResult = await db.query(
      'INSERT INTO Test_Report (Report_ID, P_ID, R_ID, Test_Type, Result) VALUES ($1, $2, $3, $4, $5) RETURNING *',
      [reportId, p_id, r_id, test_type, result]
    );

    res.status(201).json(insertResult.rows[0]);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

// Update test report
exports.updateTestReport = async (req, res) => {
  try {
    const { id } = req.params;
    const { p_id, r_id, test_type, result } = req.body;

    // Check if patient exists
    const patientCheck = await db.query('SELECT * FROM Patient WHERE P_ID = $1', [p_id]);
    if (patientCheck.rows.length === 0) {
      return res.status(404).json({ message: 'Patient not found' });
    }

    // Check if room exists
    const roomCheck = await db.query('SELECT * FROM Rooms WHERE R_ID = $1', [r_id]);
    if (roomCheck.rows.length === 0) {
      return res.status(404).json({ message: 'Room not found' });
    }

    const updateResult = await db.query(
      'UPDATE Test_Report SET P_ID = $1, R_ID = $2, Test_Type = $3, Result = $4 WHERE Report_ID = $5 RETURNING *',
      [p_id, r_id, test_type, result, id]
    );

    if (updateResult.rows.length === 0) {
      return res.status(404).json({ message: 'Test report not found' });
    }

    res.status(200).json(updateResult.rows[0]);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

// Delete test report
exports.deleteTestReport = async (req, res) => {
  try {
    const { id } = req.params;

    // Check if test report exists
    const checkResult = await db.query('SELECT * FROM Test_Report WHERE Report_ID = $1', [id]);
    if (checkResult.rows.length === 0) {
      return res.status(404).json({ message: 'Test report not found' });
    }

    // Delete test report
    await db.query('DELETE FROM Test_Report WHERE Report_ID = $1', [id]);

    res.status(200).json({ message: 'Test report deleted successfully' });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

// Get test reports by patient
exports.getTestReportsByPatient = async (req, res) => {
  try {
    const { patientId } = req.params;
    
    // Check if patient exists
    const patientCheck = await db.query('SELECT * FROM Patient WHERE P_ID = $1', [patientId]);
    if (patientCheck.rows.length === 0) {
      return res.status(404).json({ message: 'Patient not found' });
    }
    
    const result = await db.query(`
      SELECT tr.*, p.Name as PatientName, r.Type as RoomType 
      FROM Test_Report tr
      JOIN Patient p ON tr.P_ID = p.P_ID
      JOIN Rooms r ON tr.R_ID = r.R_ID
      WHERE tr.P_ID = $1
      ORDER BY tr.Report_ID
    `, [patientId]);
    
    res.status(200).json(result.rows);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

// Render test report views
exports.renderTestReports = async (req, res) => {
  try {
    const result = await db.query(`
      SELECT tr.*, p.Name as PatientName, r.Type as RoomType 
      FROM Test_Report tr
      JOIN Patient p ON tr.P_ID = p.P_ID
      JOIN Rooms r ON tr.R_ID = r.R_ID
      ORDER BY tr.Report_ID
    `);
    res.render('test-reports/index', { reports: result.rows });
  } catch (error) {
    res.status(500).render('error', { error: error.message });
  }
};

exports.renderAddTestReport = async (req, res) => {
  try {
    const patients = await db.query('SELECT P_ID, Name FROM Patient ORDER BY Name');
    const rooms = await db.query('SELECT R_ID, Type FROM Rooms ORDER BY R_ID');
    
    res.render('test-reports/add', { 
      patients: patients.rows,
      rooms: rooms.rows
    });
  } catch (error) {
    res.status(500).render('error', { error: error.message });
  }
};

exports.renderEditTestReport = async (req, res) => {
  try {
    const { id } = req.params;
    const reportResult = await db.query('SELECT * FROM Test_Report WHERE Report_ID = $1', [id]);
    
    if (reportResult.rows.length === 0) {
      return res.status(404).render('error', { message: 'Test report not found' });
    }
    
    const patients = await db.query('SELECT P_ID, Name FROM Patient ORDER BY Name');
    const rooms = await db.query('SELECT R_ID, Type FROM Rooms ORDER BY R_ID');
    
    res.render('test-reports/edit', { 
      report: reportResult.rows[0],
      patients: patients.rows,
      rooms: rooms.rows
    });
  } catch (error) {
    res.status(500).render('error', { error: error.message });
  }
};