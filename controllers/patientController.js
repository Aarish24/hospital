const db = require('../config/db');
const { v4: uuidv4 } = require('uuid');

// Get all patients
exports.getAllPatients = async (req, res) => {
  try {
    const result = await db.query('SELECT * FROM Patient ORDER BY Name');
    res.status(200).json(result.rows);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

// Get patient by ID
exports.getPatientById = async (req, res) => {
  try {
    const { id } = req.params;
    const result = await db.query('SELECT * FROM Patient WHERE P_ID = $1', [id]);

    if (result.rows.length === 0) {
      return res.status(404).json({ message: 'Patient not found' });
    }

    res.status(200).json(result.rows[0]);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

// Create new patient
exports.createPatient = async (req, res) => {
  try {
    const { name, gender, age, dob, mobNo } = req.body;
    const patientId = `P${uuidv4().substring(0, 6)}`;

    const result = await db.query(
      'INSERT INTO Patient (P_ID, Name, Gender, Age, DOB, Mob_No) VALUES ($1, $2, $3, $4, $5, $6) RETURNING *',
      [patientId, name, gender, age, dob, mobNo]
    );

    res.status(201).json(result.rows[0]);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

// Update patient
exports.updatePatient = async (req, res) => {
  try {
    const { id } = req.params;
    const { name, gender, age, dob, mobNo } = req.body;

    const result = await db.query(
      'UPDATE Patient SET Name = $1, Gender = $2, Age = $3, DOB = $4, Mob_No = $5 WHERE P_ID = $6 RETURNING *',
      [name, gender, age, dob, mobNo, id]
    );

    if (result.rows.length === 0) {
      return res.status(404).json({ message: 'Patient not found' });
    }

    res.status(200).json(result.rows[0]);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

// Delete patient
exports.deletePatient = async (req, res) => {
  try {
    const { id } = req.params;

    // Check if patient exists
    const checkResult = await db.query('SELECT * FROM Patient WHERE P_ID = $1', [id]);
    if (checkResult.rows.length === 0) {
      return res.status(404).json({ message: 'Patient not found' });
    }

    // Delete patient
    await db.query('DELETE FROM Patient WHERE P_ID = $1', [id]);

    res.status(200).json({ message: 'Patient deleted successfully' });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

// Render patient views
exports.renderPatients = async (req, res) => {
  try {
    const result = await db.query('SELECT * FROM Patient ORDER BY Name');
    res.render('patients/index', { patients: result.rows });
  } catch (error) {
    res.status(500).render('error', { error: error.message });
  }
};

exports.renderAddPatient = (req, res) => {
  res.render('patients/add');
};

exports.renderEditPatient = async (req, res) => {
  try {
    const { id } = req.params;
    const result = await db.query('SELECT * FROM Patient WHERE P_ID = $1', [id]);

    if (result.rows.length === 0) {
      return res.status(404).render('error', { message: 'Patient not found' });
    }

    res.render('patients/edit', { patient: result.rows[0] });
  } catch (error) {
    res.status(500).render('error', { error: error.message });
  }
};