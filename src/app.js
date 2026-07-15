const express = require("express");
const connectDB = require("./config/database");

const app = express();
const User = require("./models/user");

app.post("/signup", async (req, res) => {

  const user = new User({
    firstName: "Abhishek",
    lastName: "Agrawal",
    emailId: "test@gmail.com",
    password: "123456",
    gender: "Male",
    age: 22,
  });

  try {
    await user.save();
    res.send("User created successfully");
  } catch (err) {
    res.status(500).send("Error creating user : " + err.message);
  }
})

connectDB()
  .then(() => {
    console.log("MongoDB connected");
    app.listen(3000, () => {
      console.log("Server running on port 3000");
    });
  })
  .catch((err) => {
    console.error("DB Error:", err);
  });