const db = require('../config/db');

// Get all room assignments
exports.getAllAssignments = async (req, res) => {
  try {
    const result = await db.query(`
      SELECT a.*, p.Name as PatientName, r.Type as RoomType 
      FROM Assigned a
      JOIN Patient p ON a.P_ID = p.P_ID
      JOIN Rooms r ON a.R_ID = r.R_ID
      ORDER BY r.R_ID
    `);
    res.status(200).json(result.rows);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

// Get assignment by room ID
exports.getAssignmentByRoomId = async (req, res) => {
  try {
    const { roomId } = req.params;
    const result = await db.query(`
      SELECT a.*, p.Name as PatientName, r.Type as RoomType 
      FROM Assigned a
      JOIN Patient p ON a.P_ID = p.P_ID
      JOIN Rooms r ON a.R_ID = r.R_ID
      WHERE a.R_ID = $1
    `, [roomId]);

    if (result.rows.length === 0) {
      return res.status(404).json({ message: 'Room assignment not found' });
    }

    res.status(200).json(result.rows[0]);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

// Create new room assignment (simplified)
exports.createAssignment = async (req, res) => {
  try {
    const { p_id, r_id } = req.body;

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

    // Check if room is available
    if (!roomCheck.rows[0].availability) {
      return res.status(400).json({ message: 'Room is not available' });
    }

    // Create assignment and update room availability in a single transaction
    await db.query('BEGIN');
    
    // If there's an existing assignment for this room, delete it
    await db.query('DELETE FROM Assigned WHERE R_ID = $1', [r_id]);
    
    // Create new assignment
    const result = await db.query(
      'INSERT INTO Assigned (P_ID, R_ID) VALUES ($1, $2) RETURNING *',
      [p_id, r_id]
    );

    // Update room availability
    await db.query(
      'UPDATE Rooms SET Availability = FALSE WHERE R_ID = $1',
      [r_id]
    );

    await db.query('COMMIT');

    res.status(201).json(result.rows[0]);
  } catch (error) {
    await db.query('ROLLBACK');
    res.status(500).json({ error: error.message });
  }
};

// Update room assignment (simplified)
exports.updateAssignment = async (req, res) => {
  try {
    const { roomId } = req.params;
    const { p_id } = req.body;

    // Check if patient exists
    const patientCheck = await db.query('SELECT * FROM Patient WHERE P_ID = $1', [p_id]);
    if (patientCheck.rows.length === 0) {
      return res.status(404).json({ message: 'Patient not found' });
    }

    // Check if room exists
    const roomCheck = await db.query('SELECT * FROM Rooms WHERE R_ID = $1', [roomId]);
    if (roomCheck.rows.length === 0) {
      return res.status(404).json({ message: 'Room not found' });
    }

    // Simply update the assignment
    const result = await db.query(
      'UPDATE Assigned SET P_ID = $1 WHERE R_ID = $2 RETURNING *',
      [p_id, roomId]
    );

    if (result.rows.length === 0) {
      return res.status(404).json({ message: 'Room assignment not found' });
    }

    res.status(200).json(result.rows[0]);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

// Delete room assignment
exports.deleteAssignment = async (req, res) => {
  try {
    const { roomId } = req.params;

    // Check if assignment exists
    const assignmentCheck = await db.query('SELECT * FROM Assigned WHERE R_ID = $1', [roomId]);
    if (assignmentCheck.rows.length === 0) {
      return res.status(404).json({ message: 'Room assignment not found' });
    }

    // Delete assignment and update room availability
    await db.query('BEGIN');
    
    await db.query('DELETE FROM Assigned WHERE R_ID = $1', [roomId]);

    await db.query(
      'UPDATE Rooms SET Availability = TRUE WHERE R_ID = $1',
      [roomId]
    );

    await db.query('COMMIT');

    res.status(200).json({ message: 'Room assignment deleted successfully' });
  } catch (error) {
    await db.query('ROLLBACK');
    res.status(500).json({ error: error.message });
  }
};

// Get assignments by patient
exports.getAssignmentsByPatient = async (req, res) => {
  try {
    const { patientId } = req.params;
    
    // Check if patient exists
    const patientCheck = await db.query('SELECT * FROM Patient WHERE P_ID = $1', [patientId]);
    if (patientCheck.rows.length === 0) {
      return res.status(404).json({ message: 'Patient not found' });
    }
    
    const result = await db.query(`
      SELECT a.*, p.Name as PatientName, r.Type as RoomType 
      FROM Assigned a
      JOIN Patient p ON a.P_ID = p.P_ID
      JOIN Rooms r ON a.R_ID = r.R_ID
      WHERE a.P_ID = $1
      ORDER BY r.R_ID
    `, [patientId]);
    
    res.status(200).json(result.rows);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

// Render assignment views
exports.renderAssignments = async (req, res) => {
  try {
    const result = await db.query(`
      SELECT a.*, p.Name as PatientName, r.Type as RoomType 
      FROM Assigned a
      JOIN Patient p ON a.P_ID = p.P_ID
      JOIN Rooms r ON a.R_ID = r.R_ID
      ORDER BY r.R_ID
    `);
    res.render('assigned/index', { assignments: result.rows });
  } catch (error) {
    res.status(500).render('error', { error: error.message });
  }
};

exports.renderAddAssignment = async (req, res) => {
  try {
    const patients = await db.query('SELECT P_ID, Name FROM Patient ORDER BY Name');
    const rooms = await db.query('SELECT R_ID, Type FROM Rooms WHERE Availability = TRUE ORDER BY R_ID');
    
    res.render('assigned/add', { 
      patients: patients.rows,
      rooms: rooms.rows
    });
  } catch (error) {
    res.status(500).render('error', { error: error.message });
  }
};

exports.renderEditAssignment = async (req, res) => {
  try {
    const { roomId } = req.params;
    const assignmentResult = await db.query('SELECT * FROM Assigned WHERE R_ID = $1', [roomId]);
    
    if (assignmentResult.rows.length === 0) {
      return res.status(404).render('error', { message: 'Room assignment not found' });
    }
    
    const patients = await db.query('SELECT P_ID, Name FROM Patient ORDER BY Name');
    const room = await db.query('SELECT R_ID, Type FROM Rooms WHERE R_ID = $1', [roomId]);
    
    res.render('assigned/edit', { 
      assignment: assignmentResult.rows[0],
      patients: patients.rows,
      room: room.rows[0]
    });
  } catch (error) {
    res.status(500).render('error', { error: error.message });
  }
};