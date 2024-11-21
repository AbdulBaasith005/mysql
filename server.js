const express = require('express');
const bodyParser = require('body-parser');
const cors = require('cors');
const mysql = require('mysql2');

const app = express();
app.use(cors());
app.use(bodyParser.json());
app.use(express.static('public'));

// MySQL connection
const db = mysql.createConnection({
    host: 'localhost',
    user: 'root', // Replace with your MySQL username
    password: '', // Replace with your MySQL password
    database: 'university',
});

db.connect((err) => {
    if (err) {
        console.error('Error connecting to MySQL:', err.message);
        process.exit(1); // Exit the application if database connection fails
    }
    console.log('Connected to MySQL');
});

// API routes

// Add a new student
app.post('/api/students', (req, res) => {
    const { name, year, course, department, dob } = req.body;

    if (!name || !year || !course || !department || !dob) {
        return res.status(400).send('All fields are required.');
    }

    const query = 'INSERT INTO students (name, year, course, department, dob) VALUES (?, ?, ?, ?, ?)';
    db.query(query, [name, year, course, department, dob], (err, results) => {
        if (err) {
            console.error('Error inserting student:', err.message);
            res.status(500).send('Error inserting student');
        } else {
            res.status(201).send({ id: results.insertId, ...req.body });
        }
    });
});

// Get all students
app.get('/api/students', (req, res) => {
    const query = 'SELECT * FROM students';
    db.query(query, (err, results) => {
        if (err) {
            console.error('Error fetching students:', err.message);
            res.status(500).send('Error fetching students');
        } else {
            res.status(200).send(results);
        }
    });
});

// Start the server
const PORT = 3000;
app.listen(PORT, () => {
    console.log(`Server running on http://localhost:${PORT}`);
});
