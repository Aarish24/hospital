const db = require('../config/db');
const { v4: uuidv4 } = require('uuid');

// Get all employees
exports.getAllEmployees = async (req, res) => {
  try {
    const result = await db.query('SELECT * FROM Employee ORDER BY Name');
    res.status(200).json(result.rows);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

// Get employee by ID
exports.getEmployeeById = async (req, res) => {
  try {
    const { id } = req.params;
    const result = await db.query('SELECT * FROM Employee WHERE E_ID = $1', [id]);

    if (result.rows.length === 0) {
      return res.status(404).json({ message: 'Employee not found' });
    }

    res.status(200).json(result.rows[0]);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

// Create new employee
exports.createEmployee = async (req, res) => {
  try {
    const { name, salary, gender, mobNo, address, state, city, pinNo, role, dept, qualification } = req.body;
    const employeeId = `E${uuidv4().substring(0, 6)}`;

    // Start transaction
    await db.query('BEGIN');

    // Insert employee
    const result = await db.query(
      'INSERT INTO Employee (E_ID, Name, Salary, Gender, Mob_No, Address, State, City, Pin_No, Role) VALUES ($1, $2, $3, $4, $5, $6, $7, $8, $9, $10) RETURNING *',
      [employeeId, name, salary, gender, mobNo, address, state, city, pinNo, role]
    );

    // If role is Doctor, also insert into Doctor table
    if (role === 'Doctor' && dept && qualification) {
      await db.query(
        'INSERT INTO Doctor (E_ID, Dept, Qualification) VALUES ($1, $2, $3)',
        [employeeId, dept, qualification]
      );
    }

    await db.query('COMMIT');
    res.status(201).json(result.rows[0]);
  } catch (error) {
    await db.query('ROLLBACK');
    res.status(500).json({ error: error.message });
  }
};

// Update employee
exports.updateEmployee = async (req, res) => {
  try {
    const { id } = req.params;
    const { name, salary, gender, mobNo, address, state, city, pinNo, role, dept, qualification } = req.body;

    await db.query('BEGIN');

    // Update employee
    const result = await db.query(
      'UPDATE Employee SET Name = $1, Salary = $2, Gender = $3, Mob_No = $4, Address = $5, State = $6, City = $7, Pin_No = $8, Role = $9 WHERE E_ID = $10 RETURNING *',
      [name, salary, gender, mobNo, address, state, city, pinNo, role, id]
    );

    if (result.rows.length === 0) {
      await db.query('ROLLBACK');
      return res.status(404).json({ message: 'Employee not found' });
    }

    // Handle doctor information
    if (role === 'Doctor' && dept && qualification) {
      // Check if doctor record exists
      const doctorCheck = await db.query('SELECT * FROM Doctor WHERE E_ID = $1', [id]);
      
      if (doctorCheck.rows.length > 0) {
        // Update existing doctor record
        await db.query(
          'UPDATE Doctor SET Dept = $1, Qualification = $2 WHERE E_ID = $3',
          [dept, qualification, id]
        );
      } else {
        // Create new doctor record
        await db.query(
          'INSERT INTO Doctor (E_ID, Dept, Qualification) VALUES ($1, $2, $3)',
          [id, dept, qualification]
        );
      }
    } else if (role !== 'Doctor') {
      // If role changed from Doctor to something else, remove from Doctor table
      await db.query('DELETE FROM Doctor WHERE E_ID = $1', [id]);
    }

    await db.query('COMMIT');
    res.status(200).json(result.rows[0]);
  } catch (error) {
    await db.query('ROLLBACK');
    res.status(500).json({ error: error.message });
  }
};

// Delete employee
exports.deleteEmployee = async (req, res) => {
  try {
    const { id } = req.params;

    // Check if employee exists
    const checkResult = await db.query('SELECT * FROM Employee WHERE E_ID = $1', [id]);
    if (checkResult.rows.length === 0) {
      return res.status(404).json({ message: 'Employee not found' });
    }

    await db.query('BEGIN');

    // If employee is a doctor, delete from Doctor table first
    if (checkResult.rows[0].role === 'Doctor') {
      await db.query('DELETE FROM Doctor WHERE E_ID = $1', [id]);
    }

    // Delete employee
    await db.query('DELETE FROM Employee WHERE E_ID = $1', [id]);

    await db.query('COMMIT');
    res.status(200).json({ message: 'Employee deleted successfully' });
  } catch (error) {
    await db.query('ROLLBACK');
    res.status(500).json({ error: error.message });
  }
};

// Get employees by role
exports.getEmployeesByRole = async (req, res) => {
  try {
    const { role } = req.params;
    const result = await db.query('SELECT * FROM Employee WHERE Role = $1 ORDER BY Name', [role]);
    res.status(200).json(result.rows);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

// Render employee views
exports.renderEmployees = async (req, res) => {
  try {
    const result = await db.query('SELECT * FROM Employee ORDER BY Name');
    res.render('employees/index', { employees: result.rows });
  } catch (error) {
    res.status(500).render('error', { error: error.message });
  }
};

exports.renderAddEmployee = (req, res) => {
  res.render('employees/add');
};

exports.renderEditEmployee = async (req, res) => {
  try {
    const { id } = req.params;
    const result = await db.query('SELECT * FROM Employee WHERE E_ID = $1', [id]);

    if (result.rows.length === 0) {
      return res.status(404).render('error', { message: 'Employee not found' });
    }

    // If employee is a doctor, get doctor details
    let doctorDetails = null;
    if (result.rows[0].role === 'Doctor') {
      const doctorResult = await db.query('SELECT * FROM Doctor WHERE E_ID = $1', [id]);
      if (doctorResult.rows.length > 0) {
        doctorDetails = doctorResult.rows[0];
      }
    }

    res.render('employees/edit', { 
      employee: result.rows[0],
      doctor: doctorDetails
    });
  } catch (error) {
    res.status(500).render('error', { error: error.message });
  }
};