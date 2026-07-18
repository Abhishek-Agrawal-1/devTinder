const express = require('express');
const requestRouter = express.Router();

const { userAuth } = require('../middleware/auth.js');

requestRouter.post("/sendConnectionRequest", userAuth, async (req, res) => {

    const user = req.user;

    // sending a connection request
    console.log("Sending a Connection Request");

    res.send(user.firstName + " Sent the Connection Request ");
});


module.exports = requestRouter;