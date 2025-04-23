const db = require('../config/db');
const { v4: uuidv4 } = require('uuid');

// Get all rooms
exports.getAllRooms = async (req, res) => {
  try {
    const result = await db.query('SELECT * FROM Rooms ORDER BY R_ID');
    res.status(200).json(result.rows);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

// Get room by ID
exports.getRoomById = async (req, res) => {
  try {
    const { id } = req.params;
    const result = await db.query('SELECT * FROM Rooms WHERE R_ID = $1', [id]);

    if (result.rows.length === 0) {
      return res.status(404).json({ message: 'Room not found' });
    }

    res.status(200).json(result.rows[0]);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

// Create new room
exports.createRoom = async (req, res) => {
  try {
    const { type, capacity, availability } = req.body;
    const roomId = `R${uuidv4().substring(0, 6)}`;

    const result = await db.query(
      'INSERT INTO Rooms (R_ID, Type, Capacity, Availability) VALUES ($1, $2, $3, $4) RETURNING *',
      [roomId, type, capacity, availability]
    );

    res.status(201).json(result.rows[0]);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

// Update room
exports.updateRoom = async (req, res) => {
  try {
    const { id } = req.params;
    const { type, capacity, availability } = req.body;

    const result = await db.query(
      'UPDATE Rooms SET Type = $1, Capacity = $2, Availability = $3 WHERE R_ID = $4 RETURNING *',
      [type, capacity, availability, id]
    );

    if (result.rows.length === 0) {
      return res.status(404).json({ message: 'Room not found' });
    }

    res.status(200).json(result.rows[0]);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

// Delete room
exports.deleteRoom = async (req, res) => {
  try {
    const { id } = req.params;

    // Check if room exists
    const checkResult = await db.query('SELECT * FROM Rooms WHERE R_ID = $1', [id]);
    if (checkResult.rows.length === 0) {
      return res.status(404).json({ message: 'Room not found' });
    }

    // Delete room
    await db.query('DELETE FROM Rooms WHERE R_ID = $1', [id]);

    res.status(200).json({ message: 'Room deleted successfully' });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

// Get available rooms
exports.getAvailableRooms = async (req, res) => {
  try {
    const result = await db.query('SELECT * FROM Rooms WHERE Availability = TRUE ORDER BY R_ID');
    res.status(200).json(result.rows);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

// Get rooms by type
exports.getRoomsByType = async (req, res) => {
  try {
    const { type } = req.params;
    const result = await db.query('SELECT * FROM Rooms WHERE Type = $1 ORDER BY R_ID', [type]);
    res.status(200).json(result.rows);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

// Render room views
exports.renderRooms = async (req, res) => {
  try {
    const result = await db.query('SELECT * FROM Rooms ORDER BY R_ID');
    res.render('rooms/index', { rooms: result.rows });
  } catch (error) {
    res.status(500).render('error', { error: error.message });
  }
};

exports.renderAddRoom = (req, res) => {
  res.render('rooms/add');
};

exports.renderEditRoom = async (req, res) => {
  try {
    const { id } = req.params;
    const result = await db.query('SELECT * FROM Rooms WHERE R_ID = $1', [id]);

    if (result.rows.length === 0) {
      return res.status(404).render('error', { message: 'Room not found' });
    }

    res.render('rooms/edit', { room: result.rows[0] });
  } catch (error) {
    res.status(500).render('error', { error: error.message });
  }
};