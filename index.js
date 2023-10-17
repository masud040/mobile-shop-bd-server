const express = require("express");
require("dotenv").config();
const cors = require("cors");
const app = express();

const port = process.env.PORT || 5000;

app.use(cors());
app.use(express.json());

app.get("/", (req, res) => {
  res.send("Technology and Electronics management server is running");
});
app.listen(port, (req, res) => {
  console.log(`Your Server is running on port: ${port}`);
});
