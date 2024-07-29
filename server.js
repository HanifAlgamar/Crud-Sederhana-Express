const express = require('express');
const bodyParser = require('body-parser');
const mysql = require('mysql2');
const path = require('path');
const cors = require('cors'); // Tambahkan ini

const app = express();
const port = 3000;

app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: true }));
app.use(cors()); // Tambahkan ini

// Middleware untuk melayani file statis
app.use(express.static(path.join(__dirname, 'public')));

const db = mysql.createConnection({
    host: 'localhost',
    user: 'root',
    password: '',
    database: 'db_laporan'
});

db.connect(err => {
    if (err) throw err;
    console.log('Connected to database');
});

// Create
app.post('/records', (req, res) => {
    const { tanggal, alamat, perihal } = req.body;
    console.log('Creating record:', { tanggal, alamat, perihal });

    const query = 'INSERT INTO records (tanggal, alamat, perihal) VALUES (?, ?, ?)';
    db.query(query, [tanggal, alamat, perihal], (err, result) => {
        if (err) {
            console.error('Error executing query:', err);
            return res.status(500).send('Error creating record');
        }
        console.log('Record created:', result);
        res.send('Record created');
    });
});

// Read
app.get('/records', (req, res) => {
    const query = 'SELECT * FROM records';
    db.query(query, (err, results) => {
        if (err) {
            console.error('Error executing query:', err);
            return res.status(500).send('Error retrieving records');
        }
        console.log('Records retrieved:', results);
        res.json(results);
    });
});

// Update
app.put('/records/:id', (req, res) => {
    const { id } = req.params;
    const { tanggal, alamat, perihal } = req.body;
    console.log('Updating record:', { id, tanggal, alamat, perihal });

    const query = 'UPDATE records SET tanggal = ?, alamat = ?, perihal = ? WHERE id = ?';
    db.query(query, [tanggal, alamat, perihal, id], (err, result) => {
        if (err) {
            console.error('Error executing query:', err);
            return res.status(500).send('Error updating record');
        }
        console.log('Record updated:', result);
        res.send('Record updated');
    });
});

// Delete
app.delete('/records/:id', (req, res) => {
    const { id } = req.params;
    console.log('Deleting record:', { id });

    const query = 'DELETE FROM records WHERE id = ?';
    db.query(query, [id], (err, result) => {
        if (err) {
            console.error('Error executing query:', err);
            return res.status(500).send('Error deleting record');
        }
        console.log('Record deleted:', result);
        res.send('Record deleted');
    });
});

app.listen(port, () => {
    console.log(`Server running at http://localhost:${port}`);
});
