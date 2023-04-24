const express = require("express");
const app = express();
const mongoose = require("mongoose");
const cors = require("cors");

// mongoose.connect("mongodb://127.0.0.1:27017/test", () => {
//   console.log("Connected to mongoDB");
// });

mongoose.connect("mongodb+srv://amiko123:amiko757@test.op2cxix.mongodb.net/test", () => {
  console.log("Connected to mongoDB");
});

require("./models/user.js");
app.use(cors());
app.use(express.json());
app.use(require("./routes/AuthContext.js"));

app.listen(5000, () => {
  console.log("Server is running on port 5000");
});
