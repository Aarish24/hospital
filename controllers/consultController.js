const db = require('../config/db');

// Get all consultations
exports.getAllConsultations = async (req, res) => {
  try {
    console.log('Getting all consultations');
    const result = await db.query(`
      SELECT c.*, p.Name as PatientName, e.Name as DoctorName 
      FROM Consults c
      JOIN Patient p ON c.P_ID = p.P_ID
      JOIN Employee e ON c.Doctor_EID = e.E_ID
      ORDER BY p.Name
    `);
    console.log('Found consultations:', result.rows.length);
    res.status(200).json(result.rows);
  } catch (error) {
    console.error('Error getting all consultations:', error);
    res.status(500).json({ error: error.message });
  }
};

// Get consultation by patient and doctor IDs
exports.getConsultationById = async (req, res) => {
  try {
    console.log('Getting consultation by IDs:', req.params);
    const { patientId, doctorId } = req.params;
    const result = await db.query(`
      SELECT c.*, p.Name as PatientName, e.Name as DoctorName 
      FROM Consults c
      JOIN Patient p ON c.P_ID = p.P_ID
      JOIN Employee e ON c.Doctor_EID = e.E_ID
      WHERE c.P_ID = $1 AND c.Doctor_EID = $2
    `, [patientId, doctorId]);

    if (result.rows.length === 0) {
      console.log('Consultation not found for IDs:', patientId, doctorId);
      return res.status(404).json({ message: 'Consultation not found' });
    }

    console.log('Found consultation:', result.rows[0]);
    res.status(200).json(result.rows[0]);
  } catch (error) {
    console.error('Error getting consultation by ID:', error);
    res.status(500).json({ error: error.message });
  }
};

// Create new consultation
exports.createConsultation = async (req, res) => {
  try {
    console.log('Creating consultation with data:', req.body);
    const { p_id, doctor_eid } = req.body;

    // Check if patient exists
    const patientCheck = await db.query('SELECT * FROM Patient WHERE P_ID = $1', [p_id]);
    if (patientCheck.rows.length === 0) {
      console.log('Patient not found:', p_id);
      return res.status(404).json({ message: 'Patient not found' });
    }

    // Check if doctor exists
    const doctorCheck = await db.query(`
      SELECT e.* FROM Employee e
      JOIN Doctor d ON e.E_ID = d.E_ID
      WHERE e.E_ID = $1 AND e.Role = 'Doctor'
    `, [doctor_eid]);
    
    if (doctorCheck.rows.length === 0) {
      console.log('Doctor not found:', doctor_eid);
      return res.status(404).json({ message: 'Doctor not found' });
    }

    // Check if consultation already exists
    const consultCheck = await db.query(
      'SELECT * FROM Consults WHERE P_ID = $1 AND Doctor_EID = $2',
      [p_id, doctor_eid]
    );
    
    if (consultCheck.rows.length > 0) {
      console.log('Consultation already exists');
      return res.status(400).json({ message: 'Consultation already exists' });
    }

    const result = await db.query(
      'INSERT INTO Consults (P_ID, Doctor_EID) VALUES ($1, $2) RETURNING *',
      [p_id, doctor_eid]
    );

    console.log('Consultation created:', result.rows[0]);
    res.status(201).json(result.rows[0]);
  } catch (error) {
    console.error('Error creating consultation:', error);
    res.status(500).json({ error: error.message });
  }
};

// Delete consultation
exports.deleteConsultation = async (req, res) => {
  try {
    console.log('Deleting consultation with params:', req.params);
    const { patientId, doctorId } = req.params;

    // Check if consultation exists
    const checkResult = await db.query(
      'SELECT * FROM Consults WHERE P_ID = $1 AND Doctor_EID = $2',
      [patientId, doctorId]
    );
    
    if (checkResult.rows.length === 0) {
      console.log('Consultation not found for deletion');
      return res.status(404).json({ message: 'Consultation not found' });
    }

    // Delete consultation
    await db.query(
      'DELETE FROM Consults WHERE P_ID = $1 AND Doctor_EID = $2',
      [patientId, doctorId]
    );

    console.log('Consultation deleted successfully');
    res.status(200).json({ message: 'Consultation deleted successfully' });
  } catch (error) {
    console.error('Error deleting consultation:', error);
    res.status(500).json({ error: error.message });
  }
};

// Get consultations by patient
exports.getConsultationsByPatient = async (req, res) => {
  try {
    console.log('Getting consultations for patient:', req.params.patientId);
    const { patientId } = req.params;
    
    // Check if patient exists
    const patientCheck = await db.query('SELECT * FROM Patient WHERE P_ID = $1', [patientId]);
    if (patientCheck.rows.length === 0) {
      console.log('Patient not found:', patientId);
      return res.status(404).json({ message: 'Patient not found' });
    }
    
    const result = await db.query(`
      SELECT c.*, p.Name as PatientName, e.Name as DoctorName, d.Dept as Department, d.Qualification
      FROM Consults c
      JOIN Patient p ON c.P_ID = p.P_ID
      JOIN Employee e ON c.Doctor_EID = e.E_ID
      JOIN Doctor d ON e.E_ID = d.E_ID
      WHERE c.P_ID = $1
      ORDER BY e.Name
    `, [patientId]);
    
    console.log('Found consultations:', result.rows.length);
    res.status(200).json(result.rows);
  } catch (error) {
    console.error('Error getting consultations by patient:', error);
    res.status(500).json({ error: error.message });
  }
};

// Get consultations by doctor
exports.getConsultationsByDoctor = async (req, res) => {
  try {
    console.log('Getting consultations for doctor:', req.params.doctorId);
    const { doctorId } = req.params;
    
    // Check if doctor exists
    const doctorCheck = await db.query(`
      SELECT e.* FROM Employee e
      JOIN Doctor d ON e.E_ID = d.E_ID
      WHERE e.E_ID = $1 AND e.Role = 'Doctor'
    `, [doctorId]);
    
    if (doctorCheck.rows.length === 0) {
      console.log('Doctor not found:', doctorId);
      return res.status(404).json({ message: 'Doctor not found' });
    }
    
    const result = await db.query(`
      SELECT c.*, p.Name as PatientName, e.Name as DoctorName
      FROM Consults c
      JOIN Patient p ON c.P_ID = p.P_ID
      JOIN Employee e ON c.Doctor_EID = e.E_ID
      WHERE c.Doctor_EID = $1
      ORDER BY p.Name
    `, [doctorId]);
    
    console.log('Found consultations:', result.rows.length);
    res.status(200).json(result.rows);
  } catch (error) {
    console.error('Error getting consultations by doctor:', error);
    res.status(500).json({ error: error.message });
  }
};

// Render consultation views
exports.renderConsultations = async (req, res) => {
  try {
    console.log('Rendering consultations page');
    const result = await db.query(`
      SELECT c.P_ID, c.Doctor_EID, p.Name as PatientName, e.Name as DoctorName 
      FROM Consults c
      JOIN Patient p ON c.P_ID = p.P_ID
      JOIN Employee e ON c.Doctor_EID = e.E_ID
      ORDER BY p.Name
    `);
    
    if (result.rows.length > 0) {
      console.log('Sample consultation row:', result.rows[0]);
      console.log('Column names:', Object.keys(result.rows[0]));
    }
    
    res.render('consults/index', { consults: result.rows });
  } catch (error) {
    console.error('Error rendering consultations:', error);
    res.status(500).render('error', { error: error.message });
  }
};

exports.renderAddConsultation = async (req, res) => {
  try {
    console.log('Rendering add consultation page');
    const patients = await db.query('SELECT P_ID, Name FROM Patient ORDER BY Name');
    console.log('Patients:', patients.rows);
    
    const doctors = await db.query(`
      SELECT e.E_ID, e.Name, d.Dept 
      FROM Employee e
      JOIN Doctor d ON e.E_ID = d.E_ID
      WHERE e.Role = 'Doctor'
      ORDER BY e.Name
    `);
    console.log('Doctors:', doctors.rows);
    
    res.render('consults/add', { 
      patients: patients.rows,
      doctors: doctors.rows
    });
  } catch (error) {
    console.error('Error rendering add consultation:', error);
    res.status(500).render('error', { error: error.message });
  }
};