const express = require("express");
const connectDB = require("./config/database");
const app = express();
const User = require("./models/user");
const { validateSignUpData } = require("./utilis/validation");
const bcrypt = require('bcrypt');
const validator = require('validator');
const cookieParser = require('cookie-parser');
const jwt = require('jsonwebtoken');

app.use(express.json());// middleware is activated for all the routes
app.use(cookieParser());


// user signup - API
app.post("/signup", async (req, res) => {


  try {

    // validation od data
    validateSignUpData(req);

    //Encrypt the password
    const { firstName, lastName, emailId, password } = req.body;

    const passwordHash = await bcrypt.hash(password, 10);
    console.log(passwordHash);


    // creating a new user instance using the User model and the request body data
    const user = new User({
      firstName,
      lastName,
      emailId,
      password: passwordHash,
    });


    await user.save();
    res.send("User created successfully");
  } catch (err) {
    res.status(500).send("ERROR : " + err.message);
  }
});


//user Login - API
app.post("/login", async (req, res) => {

  try {

    const { emailId, password } = req.body;

    if (!validator.isEmail(emailId)) {
      throw new Error("Email is not valid");
    }

    const user = await User.findOne({ emailId: emailId });

    if (!user) {
      throw new Error("Incorrect Credentials");
    }

    const isPasswordValid = await bcrypt.compare(password, user.password);

    if (isPasswordValid) {

      //creating a JWT token
      const token = await jwt.sign({ _id: user._id }, "Abhishek@123$3");

      //Add the token to cookie and send response back to the user
      res.cookie("token", token);


      res.send("Login Succesfully");
    } else {
      throw new Error("Incorrect Credentials");
    }

  } catch (err) {
    res.status(404).send("ERROR : " + err.message);
  }
});


app.get("/profile", async (req, res) => {
  try {
    const cookies = req.cookies;

    const { token } = cookies;
    // validate my token

    if(!token) {
      throw new Error("Login your Account");
    }

    const decodedMessage = await jwt.verify(token, "Abhishek@123$3");

    const { _id } = decodedMessage;

    const user = await User.findById(_id);
    if(!user) {
      throw new Error("Login or SignUp your Account");
    }

    res.send(user);
  } catch (err) {
    res.status(404).send("ERROR : " + err.message);
  }
})


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

    const ALLOWED_UPDATES = ["photoUrl", "about", "skills", "gender", "age"];

    const isUpdateAllowed = Object.keys(updateData).every((k) => ALLOWED_UPDATES.includes(k));

    if (!isUpdateAllowed) {
      throw new Error("Invalid update fields");
    }

    if (updateData?.skills?.length > 10) {
      throw new Error("Skills cannot be more than 10");
    }

    // user.runValidators = true;
    const user = await User.findByIdAndUpdate(userId, updateData, { new: true, runValidators: true });
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

