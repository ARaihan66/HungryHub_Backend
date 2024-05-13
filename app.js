const express = require("express");
const app = express();
const { connectionDB } = require("./Connection/DbConnection");
const port = process.env.PORT || 7000;
const userRouter = require("./Routers/UserRouter");
const cartRouter = require("./Routers/CartRouter");
const cors = require("cors");
const cookieParser = require("cookie-parser");

connectionDB();
app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use(cookieParser());
app.use(
  cors({
    origin: ["http://localhost:3000"],
    credentials: true,
  })
);

app.use("/api/user", userRouter);
app.use("/api/cart", cartRouter);

app.listen(port, () => {
  console.log(`The server is running on the port no. ${port}`);
});
