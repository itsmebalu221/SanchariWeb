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
    encrypt: true,
    trustServerCertificate: false,
  },
};


app.post("/loginentry",async(req,res)=>{
    const {uname,password}=req.body;
    const update=await sql.query`INSERT INTO users(email,database) VALUES(${uname},${password})`;
})


// Route for login check using dynamic data
app.get('/login', async (req, res) => {
  const user_id="balaji"
  const password = "password";

  if (!user_id || !password) {
    return res.status(400).json({ message: 'Missing user_id or password' });
  }

  try {
    await sql.connect(config);
    const result = await sql.query`
      SELECT * FROM users 
      WHERE user_id = ${user_id} AND password = ${password}
    `;

    if (result.recordset.length > 0) {
      res.status(200).json({ success: true, user: result.recordset[0] });
    } else {
      res.status(401).json({ success: false, message: 'Invalid credentials' });
    }
  } catch (err) {
    console.error('SQL error', err);
    res.status(500).json({ success: false, message: 'Database error' });
  }
});

// Server listener
app.listen(port, () => {
  console.log(`✅ Server running on port ${port}`);
});
