// server.js
const express = require('express');
const sql = require('mssql');
const cors = require('cors');

const app = express();
const port = process.env.PORT || 3000;

app.use(cors());
app.use(express.json());

// Azure SQL config
const config = {
  user: 'root1',
  password: 'Nbalaji@2004',
  server: 'sanchari.database.windows.net',
  database: 'Users',
  options: {
    encrypt: true, // Required for Azure
    trustServerCertificate: false,
  },
};

// Route to test database connection
app.get('/users', async (req, res) => {
  try {
    await sql.connect(config);
    const result = await sql.query`SELECT * FROM users WHERE user_id="balaji" AND password="password"`; 
    if(result!==null){
      res.json(result.recordset);
    }else{
      res.json("No record Found")
    }
    
  } catch (err) {
    console.error('SQL error', err);
    res.status(500).send('Database error');
  }
});

app.listen(port, () => {
  console.log(`✅ Server running on port ${port}`);
});
