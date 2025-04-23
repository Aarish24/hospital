# Hospital Management System

A comprehensive hospital management system built with Node.js, Express, and PostgreSQL.

## Features

- Manage patients, employees (doctors, nurses, receptionists), rooms, test reports, and bills
- RESTful API for all entities
- Web interface for data visualization and management
- Advanced database queries including transactions, joins, and CTEs
- Statistics dashboard with real-time data

## Prerequisites

- Node.js (v14 or higher)
- PostgreSQL (v12 or higher)

## Installation

1. Clone the repository:
   ```
   git clone <repository-url>
   cd hospital-management-system
   ```

2. Install dependencies:
   ```
   npm install
   ```

3. Create a PostgreSQL database:
   ```
   psql -U postgres
   CREATE DATABASE hospitaldb;
   \q
   ```

4. Initialize the database with the schema and sample data:
   ```
   psql -U postgres -d hospitaldb -f db_init.sql
   ```

5. Configure environment variables:
   - Create a `.env` file in the root directory
   - Add the following variables:
     ```
     PORT=4770
     DB_USER=postgres
     DB_HOST=localhost
     DB_NAME=hospitaldb
     DB_PASSWORD=your_password
     DB_PORT=5432
     ```

## Running the Application

1. Start the server:
   ```
   npm start
   ```

2. For development with auto-restart:
   ```
   npm run dev
   ```

3. Access the application:
   - Web interface: http://localhost:4770
   - API: http://localhost:4770/api

## Project Structure

```
hospital-management-system/
├── config/
│   └── db.js
├── controllers/
│   ├── patientController.js
│   ├── employeeController.js
│   ├── doctorController.js
│   ├── roomController.js
│   ├── testReportController.js
│   ├── billController.js
│   ├── recordController.js
│   ├── consultController.js
│   ├── assignedController.js
│   └── governsController.js
├── routes/
│   ├── patientRoutes.js
│   ├── employeeRoutes.js
│   ├── doctorRoutes.js
│   ├── roomRoutes.js
│   ├── testReportRoutes.js
│   ├── billRoutes.js
│   ├── recordRoutes.js
│   ├── consultRoutes.js
│   ├── assignedRoutes.js
│   └── governsRoutes.js
├── public/
│   ├── css/
│   ├── js/
│   └── img/
├── views/
│   ├── partials/
│   │   ├── header.ejs
│   │   ├── footer.ejs
│   │   └── navbar.ejs
│   ├── index.ejs
│   ├── error.ejs
│   ├── patients/
│   ├── employees/
│   ├── rooms/
│   └── reports/
├── .env
├── db_init.sql
├── index.js
├── package.json
└── README.md
```
+
+## Database Setup
+
+Connect to PostgreSQL and run the following commands:
+
+```sql
+-- Create database
+CREATE DATABASE hospitaldb;
+
+-- Connect to the database
+\c hospitaldb
+
+-- Table: Patient

-- Table: Patient
CREATE TABLE Patient (
P_ID VARCHAR PRIMARY KEY,
Name VARCHAR,
Gender VARCHAR,
Age INT,
DOB DATE,
Mob_No VARCHAR
);

-- Table: Employee
CREATE TABLE Employee (
E_ID VARCHAR PRIMARY KEY,
Name VARCHAR,
Salary NUMERIC,
Gender VARCHAR,
Mob_No VARCHAR,
Address TEXT,
State VARCHAR,
City VARCHAR,
Pin_No VARCHAR,
Role VARCHAR CHECK (Role IN ('Doctor', 'Nurse', 'Receptionist'))
);

-- Table: Doctor
CREATE TABLE Doctor (
E_ID VARCHAR PRIMARY KEY,
Dept VARCHAR,
Qualification VARCHAR,
FOREIGN KEY (E_ID) REFERENCES Employee(E_ID)
);

-- Table: Rooms
CREATE TABLE Rooms (
R_ID VARCHAR PRIMARY KEY,
Type VARCHAR,
Capacity INT,
Availability BOOLEAN
);

-- Table: Test_Report
CREATE TABLE Test_Report (
Report_ID VARCHAR PRIMARY KEY,
P_ID VARCHAR,
R_ID VARCHAR,
Test_Type VARCHAR,
Result TEXT,
FOREIGN KEY (P_ID) REFERENCES Patient(P_ID),
FOREIGN KEY (R_ID) REFERENCES Rooms(R_ID)
);

-- Table: Bills
CREATE TABLE Bills (
B_ID VARCHAR PRIMARY KEY,
P_ID VARCHAR,
Amount NUMERIC,
FOREIGN KEY (P_ID) REFERENCES Patient(P_ID)
);

-- Table: Records
CREATE TABLE Records (
Record_No VARCHAR PRIMARY KEY,
App_No VARCHAR,
E_ID VARCHAR,
FOREIGN KEY (E_ID) REFERENCES Employee(E_ID)
);

-- Table: Consults
CREATE TABLE Consults (
P_ID VARCHAR,
Doctor_EID VARCHAR,
PRIMARY KEY (P_ID, Doctor_EID),
FOREIGN KEY (P_ID) REFERENCES Patient(P_ID),
FOREIGN KEY (Doctor_EID) REFERENCES Employee(E_ID)
);

-- Table: Assigned
CREATE TABLE Assigned (
P_ID VARCHAR,
R_ID VARCHAR,
PRIMARY KEY (R_ID),
FOREIGN KEY (P_ID) REFERENCES Patient(P_ID),
FOREIGN KEY (R_ID) REFERENCES Rooms(R_ID)
);

-- Table: Governs
CREATE TABLE Governs (
Nurse_EID VARCHAR,
R_ID VARCHAR,
PRIMARY KEY (Nurse_EID, R_ID),
FOREIGN KEY (Nurse_EID) REFERENCES Employee(E_ID),
FOREIGN KEY (R_ID) REFERENCES Rooms(R_ID)
);

-- Sample INSERTS

-- Patients
INSERT INTO Patient VALUES ('P001', 'Rahul Sharma', 'Male', 30, '1994-02-15', '9876543210');
INSERT INTO Patient VALUES ('P002', 'Anjali Mehta', 'Female', 25, '1999-06-20', '9123456780');

-- Employees
INSERT INTO Employee VALUES ('E001', 'Dr. Sameer', 80000, 'Male', '9812345670', '123 MG Road', 'Delhi', 'New Delhi', '110001', 'Doctor');
INSERT INTO Employee VALUES ('E002', 'Nurse Priya', 40000, 'Female', '9988776655', '45 Park Street', 'Delhi', 'New Delhi', '110002', 'Nurse');
INSERT INTO Employee VALUES ('E003', 'Receptionist Raj', 30000, 'Male', '8877665544', '67 Civil Lines', 'Delhi', 'New Delhi', '110003', 'Receptionist');

-- Doctor details
INSERT INTO Doctor VALUES ('E001', 'Cardiology', 'MBBS, MD');

-- Rooms
INSERT INTO Rooms VALUES ('R001', 'ICU', 2, TRUE);
INSERT INTO Rooms VALUES ('R002', 'General', 4, TRUE);

-- Test Reports
INSERT INTO Test_Report VALUES ('T001', 'P001', 'R001', 'Blood Test', 'Normal');
INSERT INTO Test_Report VALUES ('T002', 'P002', 'R002', 'X-Ray', 'Minor fracture');

-- Bills
INSERT INTO Bills VALUES ('B001', 'P001', 2000.00);
INSERT INTO Bills VALUES ('B002', 'P002', 1500.00);

-- Records
INSERT INTO Records VALUES ('REC001', 'APP001', 'E003');
INSERT INTO Records VALUES ('REC002', 'APP002', 'E003');

-- Consults
INSERT INTO Consults VALUES ('P001', 'E001');
INSERT INTO Consults VALUES ('P002', 'E001');

-- Assigned
INSERT INTO Assigned VALUES ('P001', 'R001');
INSERT INTO Assigned VALUES ('P002', 'R002');

-- Governs
INSERT INTO Governs VALUES ('E002', 'R001');
INSERT INTO Governs VALUES ('E002', 'R002');

+
+## Implementation Guide
+
+### 1. Database Connection (config/db.js)
+
+```javascript
+const { Pool } = require('pg');
+require('dotenv').config();
+
+const pool = new Pool({
+  user: process.env.DB_USER,
+  host: process.env.DB_HOST,
+  database: process.env.DB_NAME,
+  password: process.env.DB_PASSWORD,
+  port: process.env.DB_PORT,
   +});
+
+module.exports = {
+  query: (text, params) => pool.query(text, params),
   +};
   +```
+
+### 2. Environment Variables (.env)
+
+```
+PORT=4770
+DB_USER=postgres
+DB_HOST=localhost
+DB_NAME=hospitaldb
+DB_PASSWORD=your_password
+DB_PORT=5432
+```
+
+### 3. Main Server File (index.js)
+
+```javascript
+const express = require('express');
+const cors = require('cors');
+const morgan = require('morgan');
+const path = require('path');
+const bodyParser = require('body-parser');
+require('dotenv').config();
+
+// Import routes
+const patientRoutes = require('./routes/patientRoutes');
+const employeeRoutes = require('./routes/employeeRoutes');
+const doctorRoutes = require('./routes/doctorRoutes');
+const roomRoutes = require('./routes/roomRoutes');
+const testReportRoutes = require('./routes/testReportRoutes');
+const billRoutes = require('./routes/billRoutes');
+const recordRoutes = require('./routes/recordRoutes');
+const consultRoutes = require('./routes/consultRoutes');
+const assignedRoutes = require('./routes/assignedRoutes');
+const governsRoutes = require('./routes/governsRoutes');
+
+const app = express();
+const PORT = process.env.PORT || 4770;
+
+// Middleware
+app.use(cors());
+app.use(morgan('dev'));
+app.use(bodyParser.json());
+app.use(bodyParser.urlencoded({ extended: true }));
+app.use(express.static(path.join(__dirname, 'public')));
+
+// View engine setup
+app.set('views', path.join(__dirname, 'views'));
+app.set('view engine', 'ejs');
+
+// Routes
+app.use('/api/patients', patientRoutes);
+app.use('/api/employees', employeeRoutes);
+app.use('/api/doctors', doctorRoutes);
+app.use('/api/rooms', roomRoutes);
+app.use('/api/test-reports', testReportRoutes);
+app.use('/api/bills', billRoutes);
+app.use('/api/records', recordRoutes);
+app.use('/api/consults', consultRoutes);
+app.use('/api/assigned', assignedRoutes);
+app.use('/api/governs', governsRoutes);
+
+// Home route
+app.get('/', (req, res) => {
+  res.render('index');
   +});
+
+// Health check endpoint
+app.get('/api/health', (req, res) => {
+  res.status(200).json({ status: 'OK', message: 'Server is running' });
   +});
+
+// Statistics endpoint
+app.get('/api/stats', async (req, res) => {
+  try {
+    // Implement statistics gathering logic here
+    res.status(200).json({
+      patientCount: 0,
+      doctorCount: 0,
+      nurseCount: 0,
+      roomsAvailable: 0,
+      // Add more statistics as needed
+    });
+  } catch (error) {
+    res.status(500).json({ error: error.message });
+  }
   +});
+
+// Start server
+app.listen(PORT, () => {
+  console.log(`Server running on port ${PORT}`);
   +});
   +```
+
+### 4. Example Controller (controllers/patientController.js)
+
+```javascript
+const db = require('../config/db');
+const { v4: uuidv4 } = require('uuid');
+
+// Get all patients
+exports.getAllPatients = async (req, res) => {
+  try {
+    const result = await db.query('SELECT * FROM Patient ORDER BY Name');
+    res.status(200).json(result.rows);
+  } catch (error) {
+    res.status(500).json({ error: error.message });
+  }
   +};
+
+// Get patient by ID
+exports.getPatientById = async (req, res) => {
+  try {
+    const { id } = req.params;
+    const result = await db.query('SELECT * FROM Patient WHERE P_ID = $1', [id]);
+
+    if (result.rows.length === 0) {
+      return res.status(404).json({ message: 'Patient not found' });
+    }
+
+    res.status(200).json(result.rows[0]);
+  } catch (error) {
+    res.status(500).json({ error: error.message });
+  }
   +};
+
+// Create new patient
+exports.createPatient = async (req, res) => {
+  try {
+    const { name, gender, age, dob, mobNo } = req.body;
+    const patientId = `P${uuidv4().substring(0, 6)}`;
+
+    const result = await db.query(
+      'INSERT INTO Patient (P_ID, Name, Gender, Age, DOB, Mob_No) VALUES ($1, $2, $3, $4, $5, $6) RETURNING *',
+      [patientId, name, gender, age, dob, mobNo]
+    );
+
+    res.status(201).json(result.rows[0]);
+  } catch (error) {
+    res.status(500).json({ error: error.message });
+  }
   +};
+
+// Update patient
+exports.updatePatient = async (req, res) => {
+  try {
+    const { id } = req.params;
+    const { name, gender, age, dob, mobNo } = req.body;
+
+    const result = await db.query(
+      'UPDATE Patient SET Name = $1, Gender = $2, Age = $3, DOB = $4, Mob_No = $5 WHERE P_ID = $6 RETURNING *',
+      [name, gender, age, dob, mobNo, id]
+    );
+
+    if (result.rows.length === 0) {
+      return res.status(404).json({ message: 'Patient not found' });
+    }
+
+    res.status(200).json(result.rows[0]);
+  } catch (error) {
+    res.status(500).json({ error: error.message });
+  }
   +};
+
+// Delete patient
+exports.deletePatient = async (req, res) => {
+  try {
+    const { id } = req.params;
+
+    // Check if patient exists
+    const checkResult = await db.query('SELECT * FROM Patient WHERE P_ID = $1', [id]);
+    if (checkResult.rows.length === 0) {
+      return res.status(404).json({ message: 'Patient not found' });
+    }
+
+    // Delete patient
+    await db.query('DELETE FROM Patient WHERE P_ID = $1', [id]);
+
+    res.status(200).json({ message: 'Patient deleted successfully' });
+  } catch (error) {
+    res.status(500).json({ error: error.message });
+  }
   +};
   +```
+
+### 5. Example Route (routes/patientRoutes.js)
+
+```javascript
+const express = require('express');
+const router = express.Router();
+const patientController = require('../controllers/patientController');
+
+// GET all patients
+router.get('/', patientController.getAllPatients);
+
+// GET patient by ID
+router.get('/:id', patientController.getPatientById);
+
+// POST create new patient
+router.post('/', patientController.createPatient);
+
+// PUT update patient
+router.put('/:id', patientController.updatePatient);
+
+// DELETE patient
+router.delete('/:id', patientController.deletePatient);
+
+module.exports = router;
+```
+
+### 6. Example View (views/index.ejs)
+
+```html
+<!DOCTYPE html>
+<html lang="en">
+<head>
+    <meta charset="UTF-8">
+    <meta name="viewport" content="width=device-width, initial-scale=1.0">
+    <title>Hospital Management System</title>
+    <link rel="stylesheet" href="https://cdn.jsdelivr.net/npm/bootstrap@5.2.3/dist/css/bootstrap.min.css">
+    <link rel="stylesheet" href="/css/style.css">
+</head>
+<body>
+    <%- include('partials/navbar') %>
+
+    <div class="container mt-4">
+        <div class="jumbotron">
+            <h1 class="display-4">Hospital Management System</h1>
+            <p class="lead">A comprehensive solution for managing hospital operations</p>
+            <hr class="my-4">
+            <p>Access different modules using the navigation menu above</p>
+        </div>
+
+        <div class="row mt-4">
+            <div class="col-md-4">
+                <div class="card">
+                    <div class="card-body">
+                        <h5 class="card-title">Patients</h5>
+                        <p class="card-text">Manage patient information and medical records</p>
+                        <a href="/patients" class="btn btn-primary">Go to Patients</a>
+                    </div>
+                </div>
+            </div>
+
+            <div class="col-md-4">
+                <div class="card">
+                    <div class="card-body">
+                        <h5 class="card-title">Doctors</h5>
+                        <p class="card-text">Manage doctor information and specializations</p>
+                        <a href="/doctors" class="btn btn-primary">Go to Doctors</a>
+                    </div>
+                </div>
+            </div>
+
+            <div class="col-md-4">
+                <div class="card">
+                    <div class="card-body">
+                        <h5 class="card-title">Rooms</h5>
+                        <p class="card-text">Manage hospital rooms and their availability</p>
+                        <a href="/rooms" class="btn btn-primary">Go to Rooms</a>
+                    </div>
+                </div>
+            </div>
+        </div>
+
+        <div class="row mt-4">
+            <div class="col-md-6">
+                <div class="card">
+                    <div class="card-body">
+                        <h5 class="card-title">Test Reports</h5>
+                        <p class="card-text">Manage patient test reports and results</p>
+                        <a href="/test-reports" class="btn btn-primary">Go to Test Reports</a>
+                    </div>
+                </div>
+            </div>
+
+            <div class="col-md-6">
+                <div class="card">
+                    <div class="card-body">
+                        <h5 class="card-title">Billing</h5>
+                        <p class="card-text">Manage patient bills and payments</p>
+                        <a href="/bills" class="btn btn-primary">Go to Billing</a>
+                    </div>
+                </div>
+            </div>
+        </div>
+    </div>
+
+    <%- include('partials/footer') %>
+
+    <script src="https://cdn.jsdelivr.net/npm/bootstrap@5.2.3/dist/js/bootstrap.bundle.min.js"></script>
+    <script src="/js/main.js"></script>
+</body>
+</html>
+```
+
+### 7. Example Navbar Partial (views/partials/navbar.ejs)
+
+```html
+<nav class="navbar navbar-expand-lg navbar-dark bg-primary">
+    <div class="container">
+        <a class="navbar-brand" href="/">Hospital Management System</a>
+        <button class="navbar-toggler" type="button" data-bs-toggle="collapse" data-bs-target="#navbarNav" aria-controls="navbarNav" aria-expanded="false" aria-label="Toggle navigation">
+            <span class="navbar-toggler-icon"></span>
+        </button>
+        <div class="collapse navbar-collapse" id="navbarNav">
+            <ul class="navbar-nav">
+                <li class="nav-item">
+                    <a class="nav-link" href="/">Home</a>
+                </li>
+                <li class="nav-item dropdown">
+                    <a class="nav-link dropdown-toggle" href="#" id="patientsDropdown" role="button" data-bs-toggle="dropdown" aria-expanded="false">
+                        Patients
+                    </a>
+                    <ul class="dropdown-menu" aria-labelledby="patientsDropdown">
+                        <li><a class="dropdown-item" href="/patients">View All</a></li>
+                        <li><a class="dropdown-item" href="/patients/add">Add New</a></li>
+                    </ul>
+                </li>
+                <li class="nav-item dropdown">
+                    <a class="nav-link dropdown-toggle" href="#" id="employeesDropdown" role="button" data-bs-toggle="dropdown" aria-expanded="false">
+                        Staff
+                    </a>
+                    <ul class="dropdown-menu" aria-labelledby="employeesDropdown">
+                        <li><a class="dropdown-item" href="/employees">All Staff</a></li>
+                        <li><a class="dropdown-item" href="/doctors">Doctors</a></li>
+                        <li><a class="dropdown-item" href="/employees/nurses">Nurses</a></li>
+                        <li><a class="dropdown-item" href="/employees/add">Add New</a></li>
+                    </ul>
+                </li>
+                <li class="nav-item dropdown">
+                    <a class="nav-link dropdown-toggle" href="#" id="roomsDropdown" role="button" data-bs-toggle="dropdown" aria-expanded="false">
+                        Rooms
+                    </a>
+                    <ul class="dropdown-menu" aria-labelledby="roomsDropdown">
+                        <li><a class="dropdown-item" href="/rooms">View All</a></li>
+                        <li><a class="dropdown-item" href="/rooms/add">Add New</a></li>
+                    </ul>
+                </li>
+                <li class="nav-item dropdown">
+                    <a class="nav-link dropdown-toggle" href="#" id="reportsDropdown" role="button" data-bs-toggle="dropdown" aria-expanded="false">
+                        Reports
+                    </a>
+                    <ul class="dropdown-menu" aria-labelledby="reportsDropdown">
+                        <li><a class="dropdown-item" href="/test-reports">Test Reports</a></li>
+                        <li><a class="dropdown-item" href="/bills">Bills</a></li>
+                        <li><a class="dropdown-item" href="/records">Records</a></li>
+                    </ul>
+                </li>
+                <li class="nav-item">
+                    <a class="nav-link" href="/stats">Statistics</a>
+                </li>
+            </ul>
+        </div>
+    </div>
+</nav>
+```
+
+### 8. Example Footer Partial (views/partials/footer.ejs)
+
+```html
+<footer class="footer mt-5 py-3 bg-light">
+    <div class="container text-center">
+        <span class="text-muted">Hospital Management System &copy; 2023</span>
+    </div>
+</footer>
+```
+
+## API Endpoints
+
+The system provides the following RESTful API endpoints:
+
+- `/api/patients` - CRUD operations for patients
+- `/api/employees` - CRUD operations for employees
+- `/api/doctors` - CRUD operations for doctors
+- `/api/rooms` - CRUD operations for rooms
+- `/api/test-reports` - CRUD operations for test reports
+- `/api/bills` - CRUD operations for bills
+- `/api/records` - CRUD operations for records
+- `/api/consults` - CRUD operations for patient-doctor consultations
+- `/api/assigned` - CRUD operations for patient-room assignments
+- `/api/governs` - CRUD operations for nurse-room governance
+- `/api/health` - Health check endpoint
+- `/api/stats` - Statistics endpoint
+
+## Running the Application
+
+1. Start the application:
+   ```
+   npm start
+   ```
+
+   Or for development with auto-restart:
+   ```
+   npm run dev
+   ```
+
+2. Access the application:
+   - Web interface: http://localhost:4770
+   - API endpoints: http://localhost:4770/api/...
+
+## Advanced Features to Implement
+
+1. **Authentication and Authorization**
+   - Implement user authentication for staff members
+   - Role-based access control (RBAC) for different user types
+
+2. **Dashboard with Statistics**
+   - Patient admission trends
+   - Room occupancy rates
+   - Doctor workload analysis
+   - Revenue statistics
+
+3. **Appointment Scheduling**
+   - Allow patients to book appointments with doctors
+   - Manage doctor schedules and availability
+
+4. **Prescription Management**
+   - Create and manage patient prescriptions
+   - Track medication history
+
+5. **Inventory Management**
+   - Track medical supplies and equipment
+   - Manage stock levels and reordering
+
+6. **Reporting**
+   - Generate various reports for hospital management
+   - Export data in different formats (PDF, CSV)
+
+## License
+
+This project is licensed under the MIT License.