const db = require('../config/db');

// Get all doctors with employee details
exports.getAllDoctors = async (req, res) => {
  try {
    const result = await db.query(
      'SELECT d.*, e.Name, e.Gender, e.Mob_No, e.Salary FROM Doctor d JOIN Employee e ON d.E_ID = e.E_ID ORDER BY e.Name'
    );
    res.status(200).json(result.rows);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

// Get doctor by ID
exports.getDoctorById = async (req, res) => {
  try {
    const { id } = req.params;
    const result = await db.query(
      'SELECT d.*, e.Name, e.Gender, e.Mob_No, e.Salary FROM Doctor d JOIN Employee e ON d.E_ID = e.E_ID WHERE d.E_ID = $1',
      [id]
    );

    if (result.rows.length === 0) {
      return res.status(404).json({ message: 'Doctor not found' });
    }

    res.status(200).json(result.rows[0]);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

// Create new doctor (after creating employee)
exports.createDoctor = async (req, res) => {
  try {
    const { e_id, dept, qualification } = req.body;

    // Check if employee exists and is a doctor
    const employeeCheck = await db.query('SELECT * FROM Employee WHERE E_ID = $1 AND Role = $2', [e_id, 'Doctor']);
    if (employeeCheck.rows.length === 0) {
      return res.status(404).json({ message: 'Employee not found or not a doctor' });
    }

    // Check if doctor already exists
    const doctorCheck = await db.query('SELECT * FROM Doctor WHERE E_ID = $1', [e_id]);
    if (doctorCheck.rows.length > 0) {
      return res.status(400).json({ message: 'Doctor already exists' });
    }

    const result = await db.query(
      'INSERT INTO Doctor (E_ID, Dept, Qualification) VALUES ($1, $2, $3) RETURNING *',
      [e_id, dept, qualification]
    );

    res.status(201).json(result.rows[0]);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

// Update doctor
exports.updateDoctor = async (req, res) => {
  try {
    const { id } = req.params;
    const { dept, qualification } = req.body;

    const result = await db.query(
      'UPDATE Doctor SET Dept = $1, Qualification = $2 WHERE E_ID = $3 RETURNING *',
      [dept, qualification, id]
    );

    if (result.rows.length === 0) {
      return res.status(404).json({ message: 'Doctor not found' });
    }

    res.status(200).json(result.rows[0]);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

// Delete doctor
exports.deleteDoctor = async (req, res) => {
  try {
    const { id } = req.params;

    // Check if doctor exists
    const checkResult = await db.query('SELECT * FROM Doctor WHERE E_ID = $1', [id]);
    if (checkResult.rows.length === 0) {
      return res.status(404).json({ message: 'Doctor not found' });
    }

    // Delete doctor
    await db.query('DELETE FROM Doctor WHERE E_ID = $1', [id]);

    res.status(200).json({ message: 'Doctor deleted successfully' });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

// Get doctors by department
exports.getDoctorsByDepartment = async (req, res) => {
  try {
    const { dept } = req.params;
    const result = await db.query(
      'SELECT d.*, e.Name, e.Gender, e.Mob_No, e.Salary FROM Doctor d JOIN Employee e ON d.E_ID = e.E_ID WHERE d.Dept = $1 ORDER BY e.Name',
      [dept]
    );
    res.status(200).json(result.rows);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

// Render doctor views
exports.renderDoctors = async (req, res) => {
  try {
    const result = await db.query(
      'SELECT d.*, e.Name, e.Gender, e.Mob_No, e.Salary FROM Doctor d JOIN Employee e ON d.E_ID = e.E_ID ORDER BY e.Name'
    );
    res.render('doctors/index', { doctors: result.rows });
  } catch (error) {
    res.status(500).render('error', { error: error.message });
  }
};

exports.renderAddDoctor = async (req, res) => {
  try {
    // Get all employees with role 'Doctor' who are not yet in the Doctor table
    const result = await db.query(
      'SELECT e.* FROM Employee e LEFT JOIN Doctor d ON e.E_ID = d.E_ID WHERE e.Role = $1 AND d.E_ID IS NULL',
      ['Doctor']
    );
    res.render('doctors/add', { employees: result.rows });
  } catch (error) {
    res.status(500).render('error', { error: error.message });
  }
};

exports.renderEditDoctor = async (req, res) => {
  try {
    const { id } = req.params;
    const result = await db.query(
      'SELECT d.*, e.Name FROM Doctor d JOIN Employee e ON d.E_ID = e.E_ID WHERE d.E_ID = $1',
      [id]
    );

    if (result.rows.length === 0) {
      return res.status(404).render('error', { message: 'Doctor not found' });
    }

    res.render('doctors/edit', { doctor: result.rows[0] });
  } catch (error) {
    res.status(500).render('error', { error: error.message });
  }
};