const express = require("express");
const app = express();
const { connectionDB } = require("./Connection/DbConnection");
const port = process.env.PORT || 7000;

connectionDB();

app.listen(port, () => {
  console.log(`The server is running on the port no. ${port}`);
});
