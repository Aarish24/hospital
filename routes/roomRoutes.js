const express = require('express');
const router = express.Router();
const roomController = require('../controllers/roomController');

// API Routes
// GET all rooms
router.get('/', roomController.getAllRooms);

// GET room by ID
router.get('/:id', roomController.getRoomById);

// GET available rooms
router.get('/status/available', roomController.getAvailableRooms);

// GET rooms by type
router.get('/type/:type', roomController.getRoomsByType);

// POST create new room
router.post('/', roomController.createRoom);

// PUT update room
router.put('/:id', roomController.updateRoom);

// DELETE room
router.delete('/:id', roomController.deleteRoom);

// Web Routes
// GET rooms page
router.get('/view/all', roomController.renderRooms);

// GET add room page
router.get('/view/add', roomController.renderAddRoom);

// GET edit room page
router.get('/view/edit/:id', roomController.renderEditRoom);

module.exports = router;