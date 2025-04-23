const db = require('../config/db');
const { v4: uuidv4 } = require('uuid');

// Get all bills
exports.getAllBills = async (req, res) => {
  try {
    const result = await db.query(`
      SELECT b.*, p.Name as PatientName 
      FROM Bills b
      JOIN Patient p ON b.P_ID = p.P_ID
      ORDER BY b.B_ID
    `);
    res.status(200).json(result.rows);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

// Get bill by ID
exports.getBillById = async (req, res) => {
  try {
    const { id } = req.params;
    const result = await db.query(`
      SELECT b.*, p.Name as PatientName 
      FROM Bills b
      JOIN Patient p ON b.P_ID = p.P_ID
      WHERE b.B_ID = $1
    `, [id]);

    if (result.rows.length === 0) {
      return res.status(404).json({ message: 'Bill not found' });
    }

    res.status(200).json(result.rows[0]);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

// Create new bill
exports.createBill = async (req, res) => {
  try {
    const { p_id, amount } = req.body;
    const billId = `B${uuidv4().substring(0, 6)}`;

    // Check if patient exists
    const patientCheck = await db.query('SELECT * FROM Patient WHERE P_ID = $1', [p_id]);
    if (patientCheck.rows.length === 0) {
      return res.status(404).json({ message: 'Patient not found' });
    }

    const result = await db.query(
      'INSERT INTO Bills (B_ID, P_ID, Amount) VALUES ($1, $2, $3) RETURNING *',
      [billId, p_id, amount]
    );

    res.status(201).json(result.rows[0]);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

// Update bill
exports.updateBill = async (req, res) => {
  try {
    const { id } = req.params;
    const { p_id, amount } = req.body;

    // Check if patient exists
    const patientCheck = await db.query('SELECT * FROM Patient WHERE P_ID = $1', [p_id]);
    if (patientCheck.rows.length === 0) {
      return res.status(404).json({ message: 'Patient not found' });
    }

    const result = await db.query(
      'UPDATE Bills SET P_ID = $1, Amount = $2 WHERE B_ID = $3 RETURNING *',
      [p_id, amount, id]
    );

    if (result.rows.length === 0) {
      return res.status(404).json({ message: 'Bill not found' });
    }

    res.status(200).json(result.rows[0]);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

// Delete bill
exports.deleteBill = async (req, res) => {
  try {
    const { id } = req.params;

    // Check if bill exists
    const checkResult = await db.query('SELECT * FROM Bills WHERE B_ID = $1', [id]);
    if (checkResult.rows.length === 0) {
      return res.status(404).json({ message: 'Bill not found' });
    }

    // Delete bill
    await db.query('DELETE FROM Bills WHERE B_ID = $1', [id]);

    res.status(200).json({ message: 'Bill deleted successfully' });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

// Get bills by patient
exports.getBillsByPatient = async (req, res) => {
  try {
    const { patientId } = req.params;
    
    // Check if patient exists
    const patientCheck = await db.query('SELECT * FROM Patient WHERE P_ID = $1', [patientId]);
    if (patientCheck.rows.length === 0) {
      return res.status(404).json({ message: 'Patient not found' });
    }
    
    const result = await db.query(`
      SELECT b.*, p.Name as PatientName 
      FROM Bills b
      JOIN Patient p ON b.P_ID = p.P_ID
      WHERE b.P_ID = $1
      ORDER BY b.B_ID
    `, [patientId]);
    
    res.status(200).json(result.rows);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

// Get total bill amount for a patient
exports.getTotalBillByPatient = async (req, res) => {
  try {
    const { patientId } = req.params;
    
    // Check if patient exists
    const patientCheck = await db.query('SELECT * FROM Patient WHERE P_ID = $1', [patientId]);
    if (patientCheck.rows.length === 0) {
      return res.status(404).json({ message: 'Patient not found' });
    }
    
    const result = await db.query(
      'SELECT SUM(Amount) as TotalAmount FROM Bills WHERE P_ID = $1',
      [patientId]
    );
    
    res.status(200).json({ 
      patientId,
      patientName: patientCheck.rows[0].name,
      totalAmount: parseFloat(result.rows[0].totalamount) || 0 
    });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

// Render bill views
exports.renderBills = async (req, res) => {
  try {
    const result = await db.query(`
      SELECT b.*, p.Name as PatientName 
      FROM Bills b
      JOIN Patient p ON b.P_ID = p.P_ID
      ORDER BY b.B_ID
    `);
    res.render('bills/index', { bills: result.rows });
  } catch (error) {
    res.status(500).render('error', { error: error.message });
  }
};

exports.renderAddBill = async (req, res) => {
  try {
    const patients = await db.query('SELECT P_ID, Name FROM Patient ORDER BY Name');
    res.render('bills/add', { patients: patients.rows });
  } catch (error) {
    res.status(500).render('error', { error: error.message });
  }
};

exports.renderEditBill = async (req, res) => {
  try {
    const { id } = req.params;
    const billResult = await db.query('SELECT * FROM Bills WHERE B_ID = $1', [id]);
    
    if (billResult.rows.length === 0) {
      return res.status(404).render('error', { message: 'Bill not found' });
    }
    
    const patients = await db.query('SELECT P_ID, Name FROM Patient ORDER BY Name');
    
    res.render('bills/edit', { 
      bill: billResult.rows[0],
      patients: patients.rows
    });
  } catch (error) {
    res.status(500).render('error', { error: error.message });
  }
};