const express = require("express");
const connectDB = require("./config/database");

const app = express();
const User = require("./models/user");

app.use(express.json());// middleware is activated for all the routes

app.post("/signup", async (req, res) => {

  // creating a new user instance using the User model and the request body data
  const user = new User(req.body);

  try {
    await user.save();
    res.send("User created successfully");
  } catch (err) {
    res.status(500).send("Error creating user : " + err.message);
  }
});


app.get("/users", async (req, res) => {
  const userEmail = req.body.emailId;

  try {
    const users = await User.find({ "emailId": userEmail });
    if (users.length === 0) {
      res.status(404).send("User not found");
    } else {
      res.send(users);
    }
  } catch (err) {
    res.status(404).send("Something went wrong");
  }
})


// Feed API - GET / Feed - get all users from the database
app.get("/feed", async (req, res) => {
  try {
    const users = await User.find({});
    res.send(users);
  } catch (err) {
    res.send("Something went wrong");
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