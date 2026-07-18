const express = require('express');
const profileRouter = express.Router();
const { validateEditProfileData } = require('../utilis/validation.js');
const { userAuth } = require('../middleware/auth.js');
const { validate } = require('../models/user.js');
const validator = require('validator');

profileRouter.get("/profile/view", userAuth, async (req, res) => {
    try {

        const user = req.user;

        res.send(user);
    } catch (err) {
        res.status(404).send("ERROR : " + err.message);
    }
});


profileRouter.patch("/profile/edit", userAuth, async (req, res) => {
    try {
        if (!validateEditProfileData(req)) {
            throw new Error("Invalid edit request");
        }

        const updateField = req.body;

        if (updateField?.skills?.length > 10) {
            throw new Error("Cannot add more than 10 skills");
        }

        const loggedInUser = req.user;

        Object.keys(req.body).forEach((key) => (loggedInUser[key] = req.body[key]));

        await loggedInUser.save();


        res.json({
            message: `${loggedInUser.firstName}, your profile updated Successfully`,
            data: loggedInUser,
        });


    } catch (err) {
        res.status(400).send("ERROR : " + err.message);
    }
});


module.exports = profileRouter;