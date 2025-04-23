const db = require('../config/db');
const { v4: uuidv4 } = require('uuid');

// Get all records
exports.getAllRecords = async (req, res) => {
  try {
    const result = await db.query(`
      SELECT r.*, e.Name as EmployeeName 
      FROM Records r
      JOIN Employee e ON r.E_ID = e.E_ID
      ORDER BY r.Record_No
    `);
    res.status(200).json(result.rows);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

// Get record by ID
exports.getRecordById = async (req, res) => {
  try {
    const { id } = req.params;
    const result = await db.query(`
      SELECT r.*, e.Name as EmployeeName 
      FROM Records r
      JOIN Employee e ON r.E_ID = e.E_ID
      WHERE r.Record_No = $1
    `, [id]);

    if (result.rows.length === 0) {
      return res.status(404).json({ message: 'Record not found' });
    }

    res.status(200).json(result.rows[0]);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

// Create new record
exports.createRecord = async (req, res) => {
  try {
    const { app_no, e_id } = req.body;
    const recordNo = `REC${uuidv4().substring(0, 6)}`;

    // Check if employee exists
    const employeeCheck = await db.query('SELECT * FROM Employee WHERE E_ID = $1', [e_id]);
    if (employeeCheck.rows.length === 0) {
      return res.status(404).json({ message: 'Employee not found' });
    }

    const result = await db.query(
      'INSERT INTO Records (Record_No, App_No, E_ID) VALUES ($1, $2, $3) RETURNING *',
      [recordNo, app_no, e_id]
    );

    res.status(201).json(result.rows[0]);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

// Update record
exports.updateRecord = async (req, res) => {
  try {
    const { id } = req.params;
    const { app_no, e_id } = req.body;

    // Check if employee exists
    const employeeCheck = await db.query('SELECT * FROM Employee WHERE E_ID = $1', [e_id]);
    if (employeeCheck.rows.length === 0) {
      return res.status(404).json({ message: 'Employee not found' });
    }

    const result = await db.query(
      'UPDATE Records SET App_No = $1, E_ID = $2 WHERE Record_No = $3 RETURNING *',
      [app_no, e_id, id]
    );

    if (result.rows.length === 0) {
      return res.status(404).json({ message: 'Record not found' });
    }

    res.status(200).json(result.rows[0]);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

// Delete record
exports.deleteRecord = async (req, res) => {
  try {
    const { id } = req.params;

    // Check if record exists
    const checkResult = await db.query('SELECT * FROM Records WHERE Record_No = $1', [id]);
    if (checkResult.rows.length === 0) {
      return res.status(404).json({ message: 'Record not found' });
    }

    // Delete record
    await db.query('DELETE FROM Records WHERE Record_No = $1', [id]);

    res.status(200).json({ message: 'Record deleted successfully' });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

// Get records by employee
exports.getRecordsByEmployee = async (req, res) => {
  try {
    const { employeeId } = req.params;
    
    // Check if employee exists
    const employeeCheck = await db.query('SELECT * FROM Employee WHERE E_ID = $1', [employeeId]);
    if (employeeCheck.rows.length === 0) {
      return res.status(404).json({ message: 'Employee not found' });
    }
    
    const result = await db.query(`
      SELECT r.*, e.Name as EmployeeName 
      FROM Records r
      JOIN Employee e ON r.E_ID = e.E_ID
      WHERE r.E_ID = $1
      ORDER BY r.Record_No
    `, [employeeId]);
    
    res.status(200).json(result.rows);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

// Render record views
exports.renderRecords = async (req, res) => {
  try {
    const result = await db.query(`
      SELECT r.*, e.Name as EmployeeName 
      FROM Records r
      JOIN Employee e ON r.E_ID = e.E_ID
      ORDER BY r.Record_No
    `);
    res.render('records/index', { records: result.rows });
  } catch (error) {
    res.status(500).render('error', { error: error.message });
  }
};

exports.renderAddRecord = async (req, res) => {
  try {
    const employees = await db.query('SELECT E_ID, Name FROM Employee ORDER BY Name');
    res.render('records/add', { employees: employees.rows });
  } catch (error) {
    res.status(500).render('error', { error: error.message });
  }
};

exports.renderEditRecord = async (req, res) => {
  try {
    const { id } = req.params;
    const recordResult = await db.query('SELECT * FROM Records WHERE Record_No = $1', [id]);
    
    if (recordResult.rows.length === 0) {
      return res.status(404).render('error', { message: 'Record not found' });
    }
    
    const employees = await db.query('SELECT E_ID, Name FROM Employee ORDER BY Name');
    
    res.render('records/edit', { 
      record: recordResult.rows[0],
      employees: employees.rows
    });
  } catch (error) {
    res.status(500).render('error', { error: error.message });
  }
};