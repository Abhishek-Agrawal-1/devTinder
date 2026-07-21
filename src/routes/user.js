const express = require('express');
const { userAuth } = require('../middleware/auth');
const userRouter = express.Router();
const ConnectionRequest = require('../models/connectionRequest');

userRouter.get("/user/requests/received", userAuth, async (req, res) => {

    try {

        const loggedInUser = req.user;
        const connectionRequests = await ConnectionRequest.find({
            toUserId : loggedInUser._id,
            status : "interested",
        }).populate("fromUserId", "firstName lastName photoUrl age gender skills about");
        // }).populate("fromUserId", ["firstName" , "lastName"]);


        res.json({
            message : "Data fetched Successfully",
            data : connectionRequests,
        })

    }catch (err) {
        res.status(400).send("ERROR : " + err.message);
    }
})


module.exports = userRouter;