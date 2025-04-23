-- Database Initialization Script for Hospital Management System

-- Create database
CREATE DATABASE hospitaldb;

-- Connect to the database
\c hospitaldb

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
INSERT INTO Patient VALUES ('P003', 'Vikram Singh', 'Male', 45, '1979-11-05', '9898989898');
INSERT INTO Patient VALUES ('P004', 'Priya Patel', 'Female', 32, '1992-04-12', '8787878787');
INSERT INTO Patient VALUES ('P005', 'Amit Kumar', 'Male', 28, '1996-08-30', '7676767676');

-- Employees
INSERT INTO Employee VALUES ('E001', 'Dr. Sameer', 80000, 'Male', '9812345670', '123 MG Road', 'Delhi', 'New Delhi', '110001', 'Doctor');
INSERT INTO Employee VALUES ('E002', 'Nurse Priya', 40000, 'Female', '9988776655', '45 Park Street', 'Delhi', 'New Delhi', '110002', 'Nurse');
INSERT INTO Employee VALUES ('E003', 'Receptionist Raj', 30000, 'Male', '8877665544', '67 Civil Lines', 'Delhi', 'New Delhi', '110003', 'Receptionist');
INSERT INTO Employee VALUES ('E004', 'Dr. Neha', 85000, 'Female', '9876543210', '22 Ring Road', 'Delhi', 'New Delhi', '110004', 'Doctor');
INSERT INTO Employee VALUES ('E005', 'Nurse Rahul', 42000, 'Male', '9876123450', '78 Model Town', 'Delhi', 'New Delhi', '110005', 'Nurse');
INSERT INTO Employee VALUES ('E006', 'Dr. Rajesh', 90000, 'Male', '9871234560', '56 Rajouri Garden', 'Delhi', 'New Delhi', '110006', 'Doctor');

-- Doctor details
INSERT INTO Doctor VALUES ('E001', 'Cardiology', 'MBBS, MD');
INSERT INTO Doctor VALUES ('E004', 'Pediatrics', 'MBBS, MD');
INSERT INTO Doctor VALUES ('E006', 'Orthopedics', 'MBBS, MS');

-- Rooms
INSERT INTO Rooms VALUES ('R001', 'ICU', 2, TRUE);
INSERT INTO Rooms VALUES ('R002', 'General', 4, TRUE);
INSERT INTO Rooms VALUES ('R003', 'Private', 1, TRUE);
INSERT INTO Rooms VALUES ('R004', 'Semi-Private', 2, TRUE);
INSERT INTO Rooms VALUES ('R005', 'Emergency', 6, TRUE);

-- Test Reports
INSERT INTO Test_Report VALUES ('T001', 'P001', 'R001', 'Blood Test', 'Normal');
INSERT INTO Test_Report VALUES ('T002', 'P002', 'R002', 'X-Ray', 'Minor fracture');
INSERT INTO Test_Report VALUES ('T003', 'P003', 'R003', 'MRI', 'Spinal disc herniation');
INSERT INTO Test_Report VALUES ('T004', 'P004', 'R004', 'CT Scan', 'Normal');
INSERT INTO Test_Report VALUES ('T005', 'P005', 'R005', 'ECG', 'Irregular heartbeat');

-- Bills
INSERT INTO Bills VALUES ('B001', 'P001', 2000.00);
INSERT INTO Bills VALUES ('B002', 'P002', 1500.00);
INSERT INTO Bills VALUES ('B003', 'P003', 5000.00);
INSERT INTO Bills VALUES ('B004', 'P004', 3500.00);
INSERT INTO Bills VALUES ('B005', 'P005', 2500.00);

-- Records
INSERT INTO Records VALUES ('REC001', 'APP001', 'E003');
INSERT INTO Records VALUES ('REC002', 'APP002', 'E003');
INSERT INTO Records VALUES ('REC003', 'APP003', 'E003');
INSERT INTO Records VALUES ('REC004', 'APP004', 'E003');
INSERT INTO Records VALUES ('REC005', 'APP005', 'E003');

-- Consults
INSERT INTO Consults VALUES ('P001', 'E001');
INSERT INTO Consults VALUES ('P002', 'E001');
INSERT INTO Consults VALUES ('P003', 'E006');
INSERT INTO Consults VALUES ('P004', 'E004');
INSERT INTO Consults VALUES ('P005', 'E001');

-- Assigned
INSERT INTO Assigned VALUES ('P001', 'R001');
INSERT INTO Assigned VALUES ('P002', 'R002');
INSERT INTO Assigned VALUES ('P003', 'R003');
INSERT INTO Assigned VALUES ('P004', 'R004');
INSERT INTO Assigned VALUES ('P005', 'R005');

-- Governs
INSERT INTO Governs VALUES ('E002', 'R001');
INSERT INTO Governs VALUES ('E002', 'R002');
INSERT INTO Governs VALUES ('E005', 'R003');
INSERT INTO Governs VALUES ('E005', 'R004');
INSERT INTO Governs VALUES ('E002', 'R005');