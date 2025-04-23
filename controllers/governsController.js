const db = require('../config/db');

// Get all nurse-room assignments
exports.getAllGovernAssignments = async (req, res) => {
  try {
    const result = await db.query(`
      SELECT g.*, e.Name as NurseName, r.Type as RoomType 
      FROM Governs g
      JOIN Employee e ON g.Nurse_EID = e.E_ID
      JOIN Rooms r ON g.R_ID = r.R_ID
      ORDER BY e.Name, r.R_ID
    `);
    res.status(200).json(result.rows);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

// Get nurse-room assignment by IDs
exports.getGovernAssignmentById = async (req, res) => {
  try {
    const { nurseId, roomId } = req.params;
    const result = await db.query(`
      SELECT g.*, e.Name as NurseName, r.Type as RoomType 
      FROM Governs g
      JOIN Employee e ON g.Nurse_EID = e.E_ID
      JOIN Rooms r ON g.R_ID = r.R_ID
      WHERE g.Nurse_EID = $1 AND g.R_ID = $2
    `, [nurseId, roomId]);

    if (result.rows.length === 0) {
      return res.status(404).json({ message: 'Nurse-room assignment not found' });
    }

    res.status(200).json(result.rows[0]);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

// Create new nurse-room assignment
exports.createGovernAssignment = async (req, res) => {
  try {
    const { nurse_eid, r_id } = req.body;

    // Check if nurse exists
    const nurseCheck = await db.query('SELECT * FROM Employee WHERE E_ID = $1 AND Role = $2', [nurse_eid, 'Nurse']);
    if (nurseCheck.rows.length === 0) {
      return res.status(404).json({ message: 'Nurse not found' });
    }

    // Check if room exists
    const roomCheck = await db.query('SELECT * FROM Rooms WHERE R_ID = $1', [r_id]);
    if (roomCheck.rows.length === 0) {
      return res.status(404).json({ message: 'Room not found' });
    }

    // Check if assignment already exists
    const governCheck = await db.query(
      'SELECT * FROM Governs WHERE Nurse_EID = $1 AND R_ID = $2',
      [nurse_eid, r_id]
    );
    
    if (governCheck.rows.length > 0) {
      return res.status(400).json({ message: 'Nurse-room assignment already exists' });
    }

    const result = await db.query(
      'INSERT INTO Governs (Nurse_EID, R_ID) VALUES ($1, $2) RETURNING *',
      [nurse_eid, r_id]
    );

    res.status(201).json(result.rows[0]);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

// Delete nurse-room assignment
exports.deleteGovernAssignment = async (req, res) => {
  try {
    const { nurseId, roomId } = req.params;

    // Check if assignment exists
    const checkResult = await db.query(
      'SELECT * FROM Governs WHERE Nurse_EID = $1 AND R_ID = $2',
      [nurseId, roomId]
    );
    
    if (checkResult.rows.length === 0) {
      return res.status(404).json({ message: 'Nurse-room assignment not found' });
    }

    // Delete assignment
    await db.query(
      'DELETE FROM Governs WHERE Nurse_EID = $1 AND R_ID = $2',
      [nurseId, roomId]
    );

    res.status(200).json({ message: 'Nurse-room assignment deleted successfully' });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

// Get assignments by nurse
exports.getGovernAssignmentsByNurse = async (req, res) => {
  try {
    const { nurseId } = req.params;
    
    // Check if nurse exists
    const nurseCheck = await db.query('SELECT * FROM Employee WHERE E_ID = $1 AND Role = $2', [nurseId, 'Nurse']);
    if (nurseCheck.rows.length === 0) {
      return res.status(404).json({ message: 'Nurse not found' });
    }
    
    const result = await db.query(`
      SELECT g.*, e.Name as NurseName, r.Type as RoomType 
      FROM Governs g
      JOIN Employee e ON g.Nurse_EID = e.E_ID
      JOIN Rooms r ON g.R_ID = r.R_ID
      WHERE g.Nurse_EID = $1
      ORDER BY r.R_ID
    `, [nurseId]);
    
    res.status(200).json(result.rows);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

// Get assignments by room
exports.getGovernAssignmentsByRoom = async (req, res) => {
  try {
    const { roomId } = req.params;
    
    // Check if room exists
    const roomCheck = await db.query('SELECT * FROM Rooms WHERE R_ID = $1', [roomId]);
    if (roomCheck.rows.length === 0) {
      return res.status(404).json({ message: 'Room not found' });
    }
    
    const result = await db.query(`
      SELECT g.*, e.Name as NurseName, r.Type as RoomType 
      FROM Governs g
      JOIN Employee e ON g.Nurse_EID = e.E_ID
      JOIN Rooms r ON g.R_ID = r.R_ID
      WHERE g.R_ID = $1
      ORDER BY e.Name
    `, [roomId]);
    
    res.status(200).json(result.rows);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

// Render governs views
exports.renderGovernAssignments = async (req, res) => {
  try {
    const result = await db.query(`
      SELECT g.*, e.Name as NurseName, r.Type as RoomType 
      FROM Governs g
      JOIN Employee e ON g.Nurse_EID = e.E_ID
      JOIN Rooms r ON g.R_ID = r.R_ID
      ORDER BY e.Name, r.R_ID
    `);
    res.render('governs/index', { assignments: result.rows });
  } catch (error) {
    res.status(500).render('error', { error: error.message });
  }
};

exports.renderAddGovernAssignment = async (req, res) => {
  try {
    const nurses = await db.query('SELECT E_ID, Name FROM Employee WHERE Role = $1 ORDER BY Name', ['Nurse']);
    const rooms = await db.query('SELECT R_ID, Type FROM Rooms ORDER BY R_ID');
    
    res.render('governs/add', { 
      nurses: nurses.rows,
      rooms: rooms.rows
    });
  } catch (error) {
    res.status(500).render('error', { error: error.message });
  }
};