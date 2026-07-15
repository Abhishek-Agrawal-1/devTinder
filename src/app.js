const express = require("express");
const connectDB = require("./config/database");

const app = express();
const User = require("./models/user");

app.use(express.json());// middleware is activated for all the routes


// user signup - API
app.post("/signup", async (req, res) => {

  // creating a new user instance using the User model and the request body data
  const user = new User(req.body);
  // user.runValidators = true;

  try {
    await user.save();
    res.send("User created successfully");
  } catch (err) {
    res.status(500).send("Error creating user : " + err.message);
  }
});


// finding users by email - API
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

// deleting a user - API
app.delete("/user", async (req, res) => {
  const userId = req.body.userId;

  try {
    // const deleteUser = await User.findByIdAndDelete(userId);
    const deleteUser = await User.findByIdAndDelete({ _id: userId });

    res.send("User deleted succesfully");

  } catch (err) {
    res.status(404).send("something went wrong");
  }
});

// updating a user - API
app.patch("/user/:userId", async (req, res) => {
  const userId = req.params?.userId;
  const updateData = req.body;

  try {

    const ALLOWED_UPDATES = ["photoUrl", "about", "skills", "gender", "age", "password"];

    const isUpdateAllowed = Object.keys(updateData).every((k) => ALLOWED_UPDATES.includes(k));

    if (!isUpdateAllowed) {
      throw new Error("Invalid update fields");
    }

    if(updateData?.skills.length > 10){
      throw new Error("Skills cannot be more than 10");
    }

    const user = await User.findByIdAndUpdate({ _id: userId }, updateData, { returnDocument: "before", runValidators: true });
    res.send("User updated successfully");
  } catch (err) {
    res.status(404).send("Update failed : " + err.message);
  }
});


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