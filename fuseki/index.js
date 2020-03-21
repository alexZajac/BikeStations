const express = require("express");
const app = express();
const axios = require("axios");
const port = process.env.port || 5000;

app.get("/", (req, res) => res.send("Hello World!"));
app.get("/bikes", async (req, res) => {
  res.send("bikes");
});

app.listen(port, () => console.log(`Example app listening on port ${port}!`));
