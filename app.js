const express = require("express");
const app = express();
const { connectionDB } = require("./Connection/DbConnection");
const port = process.env.PORT || 7000;
const userRouter = require("./Routers/UserRouter");

connectionDB();
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

app.use("/api/user", userRouter);

app.listen(port, () => {
  console.log(`The server is running on the port no. ${port}`);
});
