// server.js
const express = require('express');
const sql = require('mssql');
const cors = require('cors');

const app = express();
const port = process.env.PORT || 3000;

app.use(cors());
app.use(express.json());

app.use('/public',express.static(__dirname+"/public"))
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

// Connect once when server starts
sql.connect(config)
  .then(() => console.log('✅ Connected to Azure SQL Database'))
  .catch(err => console.error('❌ SQL Connection Error:', err));

// ✅ POST API to insert user
app.post("/loginentry", async (req, res) => {
  const { uname, password } = req.body;
  try {
    const result = await sql.query`
      INSERT INTO users (user_id, password) 
      VALUES (${uname}, ${password})`;
      console.log(`Values Update : ${uname}`);

    res.status(201).json({ success: true, message: "User inserted successfully" });
  } catch (err) {
    console.error("❌ Error inserting user:", err);
    res.status(500).json({ success: false, message: "Database error" });
  }
});

app.post("/signup", async (req,res)=>{
  try {
    const {name,uname,pw,cpw}=req.body;
    const signup=await sql.query`INSERT INTO ALLUSERS(Name,Email,Password,CnfPassword) VALUES(${name},${uname},${pw},${cpw})`
    console.log(`Added New User :${name} and ${uname}`)
  } catch (error) {
    console.log("Error Inserting User",error);
  }
  
})

app.get("/nearst",async(req,res)=>{
  const nearst=await sql.query`DECLARE @userLocation GEOGRAPHY = geography::Point(17.389269, 78.500868, 4326);

SELECT SNO ,PLACE_NAME,
       Location.STDistance(@userLocation) AS DistanceInMeters
FROM Places
WHERE Location.STDistance(@userLocation) <= 5000;`
  res.status(200).json({message:"sucess",places:nearst.recordset})
})

app.get("/placesMain",async(req,res)=>{
  const places=await sql.query`SELECT PlaceName,State FROM PlacesMain`
  res.status(200).send(places.recordset)
})

app.get("/home",(req,res)=>{

  res.sendFile(__dirname+"/index.html")
})
// ✅ GET API to check login (static for now)
app.get('/login', async (req, res) => {
  const user_id = "balaji";
  const password = "password";

  if (!user_id || !password) {
    return res.status(400).json({ message: 'Missing user_id or password' });
  }

  try {
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
    console.error('❌ SQL error', err);
    res.status(500).json({ success: false, message: 'Database error' });
  }
});

// Start server
app.listen(port,"0.0.0.0", () => {
  console.log(`✅ Server running on port ${port}`);
});
