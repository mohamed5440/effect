const express = require('express');
const mysql = require('mysql2/promise');
const cors = require('cors');
const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');
const path = require('path');
require('dotenv').config();

const app = express();
app.use(cors());
app.use(express.json());

const dbConfig = {
    host: process.env.DB_HOST,
    user: process.env.DB_USER,
    password: process.env.DB_PASSWORD,
    database: process.env.DB_NAME,
};

// Database connection pool
const pool = mysql.createPool(dbConfig);

// Auth Middleware
const authenticateToken = (req, res, next) => {
    const authHeader = req.headers['authorization'];
    const token = authHeader && authHeader.split(' ')[1];

    if (!token) return res.status(401).json({ message: 'Access denied' });

    jwt.verify(token, process.env.JWT_SECRET, (err, user) => {
        if (err) return res.status(403).json({ message: 'Invalid token' });
        req.user = user;
        next();
    });
};

// --- ROUTES ---

// 1. Submit Application
app.post('/api/applications', async (req, res) => {
    try {
        const data = req.body;
        const query = `
            INSERT INTO applications 
            (full_name, email, phone, location, expertise, experience, portfolio, skills, min_rate, max_rate, bio, status) 
            VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)
        `;
        const values = [
            data.full_name, data.email, data.phone, data.location,
            data.expertise, data.experience, data.portfolio,
            data.skills, data.min_rate, data.max_rate, data.bio,
            data.status || 'pending'
        ];

        const [result] = await pool.execute(query, values);
        res.status(201).json({ id: result.insertId, message: 'Application submitted successfully' });
    } catch (error) {
        console.error(error);
        res.status(500).json({ message: 'Internal server error' });
    }
});

// 2. Submit Contact Form
app.post('/api/contacts', async (req, res) => {
    try {
        const data = req.body;
        const query = `
            INSERT INTO contacts (full_name, email, phone, subject, message) 
            VALUES (?, ?, ?, ?, ?)
        `;
        const values = [data.full_name, data.email, data.phone, data.subject, data.message];

        const [result] = await pool.execute(query, values);
        res.status(201).json({ id: result.insertId, message: 'Message sent successfully' });
    } catch (error) {
        console.error(error);
        res.status(500).json({ message: 'Internal server error' });
    }
});

// 3. Admin Login
app.post('/api/auth/login', async (req, res) => {
    const { email, password } = req.body;
    try {
        const [rows] = await pool.execute('SELECT * FROM users WHERE email = ?', [email]);
        const user = rows[0];

        if (!user || !(await bcrypt.compare(password, user.password))) {
            return res.status(401).json({ message: 'Invalid credentials' });
        }

        const token = jwt.sign({ id: user.id, email: user.email }, process.env.JWT_SECRET, { expiresIn: '1h' });
        res.json({ token, user: { id: user.id, email: user.email } });
    } catch (error) {
        console.error(error);
        res.status(500).json({ message: 'Internal server error' });
    }
});

// 4. Get All Applications (Protected)
app.get('/api/admin/applications', authenticateToken, async (req, res) => {
    try {
        const [rows] = await pool.execute('SELECT * FROM applications ORDER BY created_at DESC');
        res.json(rows);
    } catch (error) {
        console.error(error);
        res.status(500).json({ message: 'Internal server error' });
    }
});

// 5. Get All Contacts (Protected)
app.get('/api/admin/contacts', authenticateToken, async (req, res) => {
    try {
        const [rows] = await pool.execute('SELECT * FROM contacts ORDER BY created_at DESC');
        res.json(rows);
    } catch (error) {
        console.error(error);
        res.status(500).json({ message: 'Internal server error' });
    }
});

// 6. Update Application Status (Protected)
app.put('/api/admin/applications/:id', authenticateToken, async (req, res) => {
    try {
        const { id } = req.params;
        const { status } = req.body;
        await pool.execute('UPDATE applications SET status = ? WHERE id = ?', [status, id]);
        res.json({ message: 'Application updated successfully' });
    } catch (error) {
        console.error(error);
        res.status(500).json({ message: 'Internal server error' });
    }
});

// 7. Delete Application (Protected)
app.delete('/api/admin/applications/:id', authenticateToken, async (req, res) => {
    try {
        const { id } = req.params;
        await pool.execute('DELETE FROM applications WHERE id = ?', [id]);
        res.json({ message: 'Application deleted successfully' });
    } catch (error) {
        console.error(error);
        res.status(500).json({ message: 'Internal server error' });
    }
});

// 8. Delete Contact (Protected)
app.delete('/api/admin/contacts/:id', authenticateToken, async (req, res) => {
    try {
        const { id } = req.params;
        await pool.execute('DELETE FROM contacts WHERE id = ?', [id]);
        res.json({ message: 'Contact deleted successfully' });
    } catch (error) {
        console.error(error);
        res.status(500).json({ message: 'Internal server error' });
    }
});

// Serve React static files in production
app.use(express.static(path.join(__dirname, '../dist')));

// Catch-all route to serve React's index.html for unknown routes (React Router)
app.get('*', (req, res) => {
    res.sendFile(path.join(__dirname, '../dist/index.html'));
});

const PORT = process.env.PORT || 5000;
app.listen(PORT, () => console.log(`Server running on port ${PORT}`));
