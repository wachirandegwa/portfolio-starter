const express = require('express');
const { Pool } = require('pg');
const app = express();

// PostgreSQL connection
const pool = new Pool({
  user: 'postgres',
  host: 'localhost',
  database: 'portfolio_db',
  password: 'your_password',
  port: 5432,
});

// Middleware
app.use(express.json());

// Login endpoint
app.post('/login', async (req, res) => {
  const { email, password } = req.body;
  
  try {
    const user = await pool.query(
      'SELECT * FROM users WHERE email = $1', 
      [email]
    );
    
    if (user.rows.length === 0) {
      return res.status(400).json({ message: "User not found" });
    }
    
    // In real apps, use bcrypt to compare hashed passwords!
    if (password !== user.rows[0].password) {
      return res.status(400).json({ message: "Invalid password" });
    }
    
    res.json({ message: "Login successful!" });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

// Start server
app.listen(5000, () => {
  console.log("Server running on http://localhost:5000");
});
