const express = require('express');
const Database = require('better-sqlite3');
const path = require('path');

const app = express();
const PORT = process.env.PORT || 3000;

// Middleware
app.use(express.json());
app.use(express.static('public'));

// Initialize SQLite database
const db = new Database('contacts.db');
console.log('Connected to SQLite database');

// Create contacts table
const createTable = () => {
  const sql = `
    CREATE TABLE IF NOT EXISTS contacts (
      id INTEGER PRIMARY KEY AUTOINCREMENT,
      name TEXT NOT NULL,
      email TEXT NOT NULL,
      phone TEXT NOT NULL,
      created_at DATETIME DEFAULT CURRENT_TIMESTAMP
    )
  `;
  
  db.exec(sql);
  console.log('Contacts table ready');
};

createTable();

// API Routes

// Get all contacts
app.get('/api/contacts', (req, res) => {
  try {
    const stmt = db.prepare('SELECT * FROM contacts ORDER BY created_at DESC');
    const contacts = stmt.all();
    res.json({ contacts });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

// Add new contact
app.post('/api/contacts', (req, res) => {
  const { name, email, phone } = req.body;

  if (!name || !email || !phone) {
    res.status(400).json({ error: 'Name, email, and phone are required' });
    return;
  }

  try {
    const stmt = db.prepare('INSERT INTO contacts (name, email, phone) VALUES (?, ?, ?)');
    const result = stmt.run(name, email, phone);
    
    res.json({
      message: 'Contact added successfully',
      contact: {
        id: result.lastInsertRowid,
        name,
        email,
        phone
      }
    });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

// Start server
app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
});

// Graceful shutdown
process.on('SIGINT', () => {
  db.close();
  console.log('Database connection closed');
  process.exit(0);
});
