/* global require, process, __dirname, Buffer */
const express = require('express');
const cors = require('cors');
const bodyParser = require('body-parser');
const fs = require('fs');
const path = require('path');
require('dotenv').config();

const app = express();
const PORT = process.env.PORT || 5000;
const DATA_FILE = path.join(__dirname, 'expenses.json');
const USERS_FILE = path.join(__dirname, 'users.json');

// Middleware
app.use(cors());
app.use(bodyParser.json());

// Logger Middleware
app.use((req, res, next) => {
    console.log(`[${new Date().toISOString()}] ${req.method} ${req.url}`);
    next();
});

// Helper to read data (generic)
const readRawData = (file) => {
    if (!fs.existsSync(file)) {
        fs.writeFileSync(file, JSON.stringify([]));
        return [];
    }
    const data = fs.readFileSync(file);
    return JSON.parse(data);
};

const readData = () => readRawData(DATA_FILE);
const readUsers = () => readRawData(USERS_FILE);

// Helper to write data (generic)
const writeRawData = (file, data) => {
    fs.writeFileSync(file, JSON.stringify(data, null, 2));
};

const writeData = (data) => writeRawData(DATA_FILE, data);
const writeUsers = (data) => writeRawData(USERS_FILE, data);

// Auth Routes
app.post('/api/auth/register', (req, res) => {
    try {
        const { name, email, password } = req.body;
        const users = readUsers();
        
        if (users.find(u => u.email === email)) {
            return res.status(400).json({ message: 'Professional portfolio already registered' });
        }

        const newUser = {
            id: Date.now().toString(),
            name,
            email,
            password: Buffer.from(password).toString('base64'), // Simple encoding for demo
            createdAt: new Date().toISOString(),
            budget: 30000,
            currency: '₹'
        };

        users.push(newUser);
        writeUsers(users);

        const { password: _, ...safeUser } = newUser;
        res.status(201).json(safeUser);
    } catch {
        res.status(500).json({ message: 'Registration protocol failure' });
    }
});

app.post('/api/auth/login', (req, res) => {
    try {
        const { email, password } = req.body;
        const users = readUsers();
        const encodedPass = Buffer.from(password).toString('base64');
        
        const found = users.find(u => u.email === email && u.password === encodedPass);
        if (!found) {
            console.warn(`[AUTH] Failed login attempt for: ${email}`);
            return res.status(401).json({ message: 'Invalid access credentials' });
        }

        console.log(`[AUTH] Successful login for: ${email}`);
        const { password: _, ...safeUser } = found;
        res.json(safeUser);
    } catch (error) {
        console.error(`[AUTH_ERROR] Login failure: ${error.message}`);
        res.status(500).json({ message: 'Authentication handshake failure' });
    }
});

// Transaction Routes
// 1. Get all expenses
app.get('/api/expenses', (req, res) => {
    try {
        const data = readData();
        res.json(data);
    } catch {
        res.status(500).json({ message: 'Error reading ledger data' });
    }
});

// 2. Add an expense
app.post('/api/expenses', (req, res) => {
    try {
        const data = readData();
        const newExpense = {
            id: Date.now().toString() + Math.random().toString(36).substr(2, 9),
            ...req.body,
            createdAt: new Date().toISOString()
        };
        data.unshift(newExpense);
        writeData(data);
        res.status(201).json(newExpense);
    } catch {
        res.status(500).json({ message: 'Error recording transaction' });
    }
});

// 3. Update an expense
app.put('/api/expenses/:id', (req, res) => {
    try {
        const data = readData();
        const index = data.findIndex(e => e.id === req.params.id);
        if (index === -1) return res.status(404).json({ message: 'Entry not found' });
        
        data[index] = { ...data[index], ...req.body };
        writeData(data);
        res.json(data[index]);
    } catch {
        res.status(500).json({ message: 'Error updating transaction' });
    }
});

// 4. Delete an expense
app.delete('/api/expenses/:id', (req, res) => {
    try {
        const data = readData();
        const filtered = data.filter(e => e.id !== req.params.id);
        writeData(filtered);
        res.json({ message: 'Transaction purged' });
    } catch {
        res.status(500).json({ message: 'Error deleting transaction' });
    }
});

app.listen(PORT, () => {
    console.log(`ExpenseAI Backend Protocol active on port ${PORT}`);
});
