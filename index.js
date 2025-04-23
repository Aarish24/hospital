const express = require('express');
const cors = require('cors');
const morgan = require('morgan');
const path = require('path');
const bodyParser = require('body-parser');
require('dotenv').config();

// Import routes
const patientRoutes = require('./routes/patientRoutes');
const employeeRoutes = require('./routes/employeeRoutes');
const doctorRoutes = require('./routes/doctorRoutes');
const roomRoutes = require('./routes/roomRoutes');
const testReportRoutes = require('./routes/testReportRoutes');
const billRoutes = require('./routes/billRoutes');
const recordRoutes = require('./routes/recordRoutes');
const consultRoutes = require('./routes/consultRoutes');
const assignedRoutes = require('./routes/assignedRoutes');
const governsRoutes = require('./routes/governsRoutes');

const app = express();
const PORT = process.env.PORT || 4770;

// Middleware
app.use(cors());
app.use(morgan('dev'));
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: true }));
app.use(express.static(path.join(__dirname, 'public')));

// View engine setup
app.set('views', path.join(__dirname, 'views'));
app.set('view engine', 'ejs');

// Routes
app.use('/api/patients', patientRoutes);
app.use('/api/employees', employeeRoutes);
app.use('/api/rooms', roomRoutes);
app.use('/api/test-reports', testReportRoutes);
app.use('/api/bills', billRoutes);
app.use('/api/records', recordRoutes);
app.use('/api/consults', consultRoutes);
app.use('/api/assigned', assignedRoutes);
// Remove doctor routes since we've integrated them with employees
// app.use('/api/doctors', doctorRoutes);
// Remove governs routes since we've simplified room assignments
// app.use('/api/governs', governsRoutes);

// Home route
app.get('/', (req, res) => {
  res.render('index');
});

// Health check endpoint
app.get('/api/health', (req, res) => {
  res.status(200).json({ status: 'OK', message: 'Server is running' });
});

// Statistics endpoint
app.get('/api/stats', async (req, res) => {
  try {
    const db = require('./config/db');
    
    // Get patient count
    const patientResult = await db.query('SELECT COUNT(*) as count FROM Patient');
    const patientCount = parseInt(patientResult.rows[0].count);
    
    // Get doctor count
    const doctorResult = await db.query('SELECT COUNT(*) as count FROM Doctor');
    const doctorCount = parseInt(doctorResult.rows[0].count);
    
    // Get nurse count
    const nurseResult = await db.query('SELECT COUNT(*) as count FROM Employee WHERE Role = $1', ['Nurse']);
    const nurseCount = parseInt(nurseResult.rows[0].count);
    
    // Get available rooms count
    const roomsResult = await db.query('SELECT COUNT(*) as count FROM Rooms WHERE Availability = TRUE');
    const roomsAvailable = parseInt(roomsResult.rows[0].count);
    
    res.status(200).json({
      patientCount,
      doctorCount,
      nurseCount,
      roomsAvailable,
      // Add more statistics as needed
    });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

// Start server
app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
});