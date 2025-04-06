const express = require("express");
const odbc = require("odbc");
require("dotenv").config();

const app = express();
const port = process.env.PORT || 3000;

const connectionString = `Driver={ODBC Driver 18 for SQL Server};Server=tcp:sanchari.database.windows.net,1433;Database=Users;Uid=root1;Pwd=Nbalaji@2004;Encrypt=yes;TrustServerCertificate=no;Connection Timeout=30;`;

app.get("/users", async (req, res) => {
  try {
    const connection = await odbc.connect(connectionString);
    const result = await connection.query("SELECT * FROM users");
    await connection.close();
    res.json(result);
  } catch (err) {
    console.error("Database error:", err);
    res.status(500).send("Something went wrong.");
  }
});

app.get("/",(req,res)=>{
    res.send("Your Website is working fine.")
})

app.listen(port, () => {
  console.log(`Server running at http://localhost:${port}`);
});
