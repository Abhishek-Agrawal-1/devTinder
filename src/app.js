const express = require("express");
const connectDB = require("./config/database");
const app = express();
const User = require("./models/user");
const { validateSignUpData } = require("./utilis/validation");
const bcrypt = require('bcrypt');
const validator = require('validator');
const cookieParser = require('cookie-parser');
const jwt = require('jsonwebtoken');
const { userAuth } = require('./middleware/auth.js');

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
      const token = await jwt.sign({ _id: user._id }, "Abhishek@123$3", { 
        expiresIn : "1d", 
      });

      //Add the token to cookie and send response back to the user
      res.cookie("token", token , {
        expires : new Date(Date.now() + 8 * 3600000),
      });


      res.send("Login Succesfully");
    } else {
      throw new Error("Incorrect Credentials");
    }

  } catch (err) {
    res.status(404).send("ERROR : " + err.message);
  }
});


app.get("/profile", userAuth , async (req, res) => {
  try {

    const user = req.user;

    res.send(user);
  } catch (err) {
    res.status(404).send("ERROR : " + err.message);
  }
});


app.post("/sendConnectionRequest" , userAuth, async (req, res) => {

  const user = req.user;

  // sending a connection request
  console.log("Sending a Connection Request");

  res.send(user.firstName + " Sent the Connection Request ");
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

