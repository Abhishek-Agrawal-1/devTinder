const express = require('express');
const authRouter = express.Router();
const { validateSignUpData } = require("../utilis/validation");
const bcrypt = require('bcrypt');
const validator = require('validator');
const cookieParser = require('cookie-parser');
const User = require("../models/user");

// user signup - API
authRouter.post("/signup", async (req, res) => {


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
authRouter.post("/login", async (req, res) => {

    try {

        const { emailId, password } = req.body;

        if (!validator.isEmail(emailId)) {
            throw new Error("Email is not valid");
        }

        const user = await User.findOne({ emailId: emailId });

        if (!user) {
            throw new Error("Incorrect Credentials");
        }

        const isPasswordValid = await user.validatePassword(password);

        if (isPasswordValid) {

            const token = await user.getJWT();

            res.cookie("token", token, {
                expires: new Date(Date.now() + 8 * 3600000),
            });


            res.send("Login Succesfully");
        } else {
            throw new Error("Incorrect Credentials");
        }

    } catch (err) {
        res.status(404).send("ERROR : " + err.message);
    }
});


//user Logout - API
authRouter.post("/logout" , async (req, res) => {
    res.cookie("token" , null , {
        expires : new Date(Date.now())
    });

    res.send("Logout Successfully!");
})

module.exports = authRouter;